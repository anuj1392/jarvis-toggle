import { atom, read, update } from 'claude-code'
import type { Register } from 'claude-code'

const isOn = atom({ plugin: 'jarvis-toggle', key: 'isOn' } as const, true)

// Arc reactor: glowing cyan when on, dark grey when off.
const reactor = (on: boolean) => {
  const c = on ? '#7df9ff' : '#555a60'
  const core = on ? '#e6ffff' : '#3a3d42'
  const glow = on
    ? '<filter id="g" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>'
    : '<filter id="g"><feGaussianBlur stdDeviation="0"/></filter>'
  const ticks = Array.from({ length: 10 }, (_, i) => {
    const a = (i * 36 * Math.PI) / 180
    const x1 = 32 + Math.cos(a) * 19
    const y1 = 32 + Math.sin(a) * 19
    const x2 = 32 + Math.cos(a) * 26
    const y2 = 32 + Math.sin(a) * 26
    return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"/>`
  }).join('')
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="56" height="56">${glow}<g filter="url(#g)" stroke="${c}" fill="none" stroke-width="2.4" stroke-linecap="round"><circle cx="32" cy="32" r="28"/><circle cx="32" cy="32" r="17"/>${ticks}<path d="M32 21 L42 38 H22 Z" stroke-width="2.6" stroke-linejoin="round" fill="${core}" fill-opacity="${on ? 0.35 : 0.12}"/></g></svg>`
}

const clean = (text: string) =>
  text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[*_#>|~]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

// Shortest run of whole sentences longer than 12 characters, so a short opener
// such as "Done, sir." is spoken together with the sentence after it. A sentence
// counts only once whitespace follows it, so "3." in a streaming "3.1" is not an end.
const firstLine = (buffer: string) => {
  const ends = /[.!?](?=\s)/g
  for (let m = ends.exec(buffer); m; m = ends.exec(buffer)) {
    if (m.index + 1 > 12) return buffer.slice(0, m.index + 1)
  }
  return ''
}

let isSpeaking = false

function speak($: any, text: string) {
  const line = clean(text).slice(0, 160)
  if (!line || isSpeaking) return
  isSpeaking = true
  void $.process
    .run(['/bin/zsh', '-c', 'exec "$HOME/piper-voice/speak.sh" "$1"', '_', line], { timeoutMs: 60000 })
    .catch(() => undefined)
    .finally(() => {
      isSpeaking = false
    })
}

export const register: Register = on => {
  let hasSpoken = false

  on('turn.start', async ($, e, next) => {
    if (!e.agentId) hasSpoken = false
    return next(e)
  })

  // On: speak the first sentence the moment it streams in, not after the turn ends.
  on('turn.step', async function* ($, e, next) {
    let buffer = ''
    for await (const chunk of next(e)) {
      yield chunk
      if (e.agentId || hasSpoken || chunk.kind !== 'text') continue
      buffer += chunk.text
      const line = firstLine(buffer)
      if (line && (await read($, isOn))) {
        hasSpoken = true
        speak($, line)
      }
    }
    // The step ended without a long enough sentence ("Done, sir."): speak what there is.
    if (!e.agentId && !hasSpoken && /[a-z]{2}/i.test(buffer) && (await read($, isOn))) {
      hasSpoken = true
      speak($, buffer)
    }
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (e.props.hasSurvey) return next(e)
    const ui = $.ui.resolve(e)
    const { Box, Button, Text } = ui
    const Svg = (ui as any).Svg
    const lit = await read($, isOn)
    return (
      <Box flexDirection="row" alignItems="center">
        {Svg ? (
          <Svg source={reactor(lit)} alt={lit ? 'Jarvis voice on' : 'Jarvis voice off'} width={32} height={32} />
        ) : null}
        <Button
          key="toggle"
          variant={lit ? 'primary' : undefined}
          onPress={async () => {
            const turnedOn = !(await read($, isOn))
            await update($, isOn, () => turnedOn)
            if (!turnedOn) void $.process.run(['/usr/bin/pkill', 'afplay']).catch(() => undefined)
          }}
        >
          <Text>{lit ? '◉ Jarvis ON' : '○ Jarvis OFF'}</Text>
        </Button>
      </Box>
    )
  })
}
