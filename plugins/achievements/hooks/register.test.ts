import { expect, mock, test } from 'claude-code/testing'

test('composer.json lesen schaltet Composer-Tränen frei', async ($, on) => {
  const toasts: string[] = []
  mock.clock(on, { now: 1_700_000_000_000 })
  mock.store(on)
  on('ui.toast', (_$, e) => {
    toasts.push(JSON.stringify(e))
    return {}
  })
  on('tool.call', () => ({ result: { text: 'ok' } }))

  await $.tool.call({ tool: 'Read', file_path: '/app/composer.json' })

  expect(toasts.join()).toContain('Composer-Tränen')
})

test('fünftes fehlgeschlagenes Bash schaltet "Rot" frei', async ($, on) => {
  const toasts: string[] = []
  mock.clock(on)
  mock.store(on, { stats: { bashFails: 4 } })
  on('ui.toast', (_$, e) => {
    toasts.push(JSON.stringify(e))
    return {}
  })
  on('tool.call', () => ({ result: 'boom', text: 'boom', isError: true }))

  await $.tool.call({ tool: 'Bash', command: 'false' })

  expect(toasts.join()).toContain('Rot ist auch eine Farbe')
})

test('derselbe Bash-Befehl scheitert 3-mal: Fehlerschleife', async ($, on) => {
  const toasts: string[] = []
  mock.clock(on)
  mock.store(on)
  on('ui.toast', (_$, e) => {
    toasts.push(JSON.stringify(e))
    return {}
  })
  on('tool.call', () => ({ result: 'boom', text: 'boom', isError: true }))

  for (let i = 0; i < 3; i += 1) {
    await $.tool.call({ tool: 'Bash', command: 'make build' })
  }

  expect(toasts.join()).toContain('Fehlerschleife')
})
