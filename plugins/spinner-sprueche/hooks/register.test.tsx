import { expect, test } from 'claude-code/testing'

test('Spinner bekommt einen Spruch statt des Standardworts', async ($, on) => {
  // stellt die Engine dar: zeichnet die (umgeschriebene) message
  on('ui.render', { component: 'Spinner' }, ($, e) => {
    const { Text } = $.ui.resolve(e)

    return <Text key="msg">{e.props.message ?? e.props.word}</Text>
  })

  const ui = await $.ui.mount({
    plugin: 'spinner-sprueche',
    surface: 'terminal',
    component: 'Spinner',
    requestId: 'main',
    props: { word: 'Sauteing', message: null, suffix: '…', mode: 'thinking' },
  })

  expect(await ui.find({ type: 'Text', text: /…$/ })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: 'Sauteing' })).toBeUndefined()
  await ui.unmount()
})
