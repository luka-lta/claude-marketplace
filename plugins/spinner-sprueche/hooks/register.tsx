import type { Register } from 'claude-code'

type Category = 'thinking' | 'composer' | 'read' | 'write' | 'lint' | 'test' | 'git' | 'install' | 'bash' | 'search' | 'agent' | 'web'

const QUOTES: Record<Category, string[]> = {
  thinking: [
    'Grübele und frage mich, warum ich das tue…',
    'Sortiere Gedanken alphabetisch…',
    'Befrage die Gummiente…',
    'Denke nach, bis der Lüfter laut wird…',
  ],
  composer: [
    'Lese composer.json und weine leise…',
    'Zähle Abhängigkeiten und verliere den Mut…',
    'Frage mich, wer dieses Paket eingeladen hat…',
  ],
  read: [
    'Lese Code und tue so, als würde ich ihn verstehen…',
    'Entziffere Kommentare aus dem Jahr 2014…',
    'Überfliege Code und nicke wissend…',
  ],
  write: [
    'Schreibe Code, der morgen noch funktioniert (hoffentlich)…',
    'Tippe mit stiller Zuversicht…',
    'Ändere nur eine Zeile (ganz bestimmt)…',
  ],
  lint: [
    'Verhandle mit dem Linter…',
    'Bestehe vor dem Linter auf meine Meinung…',
    'Bitte den Linter um Gnade…',
  ],
  test: [
    'Drücke den Tests die Daumen…',
    'Warte auf Rot und hoffe auf Grün…',
    'Wecke die Tests auf…',
  ],
  git: [
    'Befrage git blame, ohne Namen zu nennen…',
    'Lausche der Geschichte des Repos…',
    'Sortiere Commits und meide Merge-Konflikte…',
  ],
  install: [
    'Warte auf node_modules und verliere Lebenszeit…',
    'Lade die halbe Welt herunter…',
    'Löse Abhängigkeiten auf, so gut es geht…',
  ],
  bash: [
    'Tippe geheimnisvolle Befehle ins Terminal…',
    'Beschwöre die Shell…',
    'Drücke Enter und halte den Atem an…',
  ],
  search: [
    'Suche die Nadel im Code-Heuhaufen…',
    'Durchwühle das Repo nach Spuren…',
    'Folge den Brotkrumen durch den Code…',
  ],
  agent: [
    'Delegiere an jemanden mit mehr Geduld…',
    'Schicke einen Subagenten los und warte…',
  ],
  web: [
    'Frage das Internet und bete um eine Antwort…',
    'Scrolle durch Stack Overflow…',
  ],
}

const categorize = (tool: string, input: { command?: string; file_path?: string }): Category => {
  if (tool === 'Read') {
    return /composer\.(json|lock)$/.test(input.file_path ?? '') ? 'composer' : 'read'
  }
  if (tool === 'Edit' || tool === 'Write' || tool === 'NotebookEdit') return 'write'
  if (tool === 'Grep' || tool === 'Glob') return 'search'
  if (tool === 'Agent' || tool === 'Task') return 'agent'
  if (tool === 'WebFetch' || tool === 'WebSearch') return 'web'
  if (tool === 'Bash') {
    const cmd = input.command ?? ''
    if (/composer/.test(cmd)) return 'composer'
    if (/phpstan|phpcs|eslint|lint|psalm|rector|prettier|tsc\b/.test(cmd)) return 'lint'
    if (/phpunit|pest|jest|vitest|pytest|\btest\b/.test(cmd)) return 'test'
    if (/\bgit\b/.test(cmd)) return 'git'
    if (/(npm|yarn|pnpm|bun)\s+(i|install|add|ci)\b/.test(cmd)) return 'install'
    return 'bash'
  }
  return 'bash'
}

export const register: Register = on => {
  let category: Category = 'thinking'
  let counter = 0

  const pick = (cat: Category): string => {
    const list = QUOTES[cat]
    counter += 1
    return list[counter % list.length]
  }

  let current = pick('thinking')

  on('prompt.submit', ($, e, next) => {
    category = 'thinking'
    current = pick(category)

    return next(e)
  }).catch(($, e, next) => next(e))

  on('tool.call', ($, e, next) => {
    const input = e as { command?: string; file_path?: string }
    category = categorize(e.tool, input)
    current = pick(category)
    $.ui.invalidate('ui.render')

    return next(e)
  }).catch(($, e, next) => next(e))

  on('ui.render', { component: 'Spinner' }, ($, e, next) => {
    // nur überschreiben, wenn der Engine-Text das Standardwort ist
    if (e.props.message !== null) {
      return next(e)
    }

    return next({ ...e, props: { ...e.props, message: current, suffix: '' } })
  })
}
