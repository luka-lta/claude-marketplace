import type { EngineInterface, Register } from 'claude-code'

type Stats = {
  prompts: number
  reads: number
  writes: number
  searches: number
  agents: number
  bashFails: number
  composerReads: number
  tests: number
  lints: number
  polite: number
  shouts: number
  nightPrompts: number
  danger: number
  longestTurnSeconds: number
  earlyPrompts: number
  weekendPrompts: number
  lunchPrompts: number
  streak: number
  lastDay: string
  maxDayCalls: number
  dayCalls: number
  dayCallsDay: string
  oneWord: number
  novels: number
  burst: number
  burstMax: number
  lastPromptAt: number
  questionFloods: number
  sorries: number
  clears: number
  tunnels: number
  failLoops: number
  aborts: number
  busyTurns: number
  commits: number
  dockerRuns: number
  listViews: number
}

type Achievement = {
  id: string
  name: string
  desc: string
  // n: Anzahl bereits freigeschalteter Achievements (für die Meta-Achievements)
  isDone: (s: Stats, n: number) => boolean
}

const EMPTY: Stats = {
  prompts: 0, reads: 0, writes: 0, searches: 0, agents: 0, bashFails: 0,
  composerReads: 0, tests: 0, lints: 0, polite: 0, shouts: 0, nightPrompts: 0,
  danger: 0, longestTurnSeconds: 0, earlyPrompts: 0, weekendPrompts: 0,
  lunchPrompts: 0, streak: 0, lastDay: '', maxDayCalls: 0, dayCalls: 0,
  dayCallsDay: '', oneWord: 0, novels: 0, burst: 0, burstMax: 0, lastPromptAt: 0,
  questionFloods: 0, sorries: 0, clears: 0, tunnels: 0, failLoops: 0, aborts: 0,
  busyTurns: 0, commits: 0, dockerRuns: 0, listViews: 0,
}

const ACHIEVEMENTS: Achievement[] = [
  { id: 'hallo', name: 'Hallo Welt', desc: 'Ersten Prompt abgeschickt', isDone: s => s.prompts >= 1 },
  { id: 'stamm', name: 'Stammkunde', desc: '10 Prompts', isDone: s => s.prompts >= 10 },
  { id: 'sucht', name: 'Abhängig', desc: '100 Prompts', isDone: s => s.prompts >= 100 },
  { id: 'composer', name: 'Composer-Tränen', desc: 'composer.json gelesen und leise geweint', isDone: s => s.composerReads >= 1 },
  { id: 'rot', name: 'Rot ist auch eine Farbe', desc: '5 fehlgeschlagene Bash-Befehle', isDone: s => s.bashFails >= 5 },
  { id: 'murphy', name: 'Murphys Gesetz', desc: '25 fehlgeschlagene Bash-Befehle', isDone: s => s.bashFails >= 25 },
  { id: 'nacht', name: 'Nachteule', desc: 'Prompt zwischen 0 und 5 Uhr', isDone: s => s.nightPrompts >= 1 },
  { id: 'hoeflich', name: 'Gute Kinderstube', desc: '„bitte“ oder „danke“ gesagt', isDone: s => s.polite >= 1 },
  { id: 'schreihals', name: 'Schreihals', desc: 'Einen Prompt komplett in GROSSBUCHSTABEN', isDone: s => s.shouts >= 1 },
  { id: 'kaffee', name: 'Kaffeepause', desc: 'Ein Turn dauerte über 5 Minuten', isDone: s => s.longestTurnSeconds >= 300 },
  { id: 'marathon', name: 'Marathonläufer', desc: 'Ein Turn dauerte über 30 Minuten', isDone: s => s.longestTurnSeconds >= 1800 },
  { id: 'lese', name: 'Leseratte', desc: '50 Dateien gelesen', isDone: s => s.reads >= 50 },
  { id: 'schreib', name: 'Vielschreiber', desc: '25 Dateien geschrieben oder bearbeitet', isDone: s => s.writes >= 25 },
  { id: 'detektiv', name: 'Detektiv', desc: '25 Suchen mit Grep oder Glob', isDone: s => s.searches >= 25 },
  { id: 'delegator', name: 'Delegator', desc: 'Einen Subagenten losgeschickt', isDone: s => s.agents >= 1 },
  { id: 'test', name: 'Testfreund', desc: '5 Testläufe gestartet', isDone: s => s.tests >= 5 },
  { id: 'lint', name: 'Lint-Diplomat', desc: '3 Linter-Läufe, ohne zu verhandeln', isDone: s => s.lints >= 3 },
  { id: 'danger', name: 'Lebensmüde', desc: '`rm -rf` oder `git push --force` ausgeführt', isDone: s => s.danger >= 1 },
  // Gewohnheiten und Tageszeit
  { id: 'frueh', name: 'Frühaufsteher', desc: 'Prompt zwischen 5 und 7 Uhr', isDone: s => s.earlyPrompts >= 1 },
  { id: 'wochenende', name: 'Wochenendkrieger', desc: 'Prompt am Samstag oder Sonntag', isDone: s => s.weekendPrompts >= 1 },
  { id: 'mittag', name: 'Mittagspause fällt aus', desc: 'Prompt zwischen 12 und 13 Uhr', isDone: s => s.lunchPrompts >= 1 },
  { id: 'streak3', name: 'Dranbleiber', desc: '3 Tage in Folge aktiv', isDone: s => s.streak >= 3 },
  { id: 'streak7', name: 'Wochenrhythmus', desc: '7 Tage in Folge aktiv', isDone: s => s.streak >= 7 },
  { id: 'streak30', name: 'Monatsabo', desc: '30 Tage in Folge aktiv', isDone: s => s.streak >= 30 },
  { id: 'tausend', name: 'Ein Tag, tausend Calls', desc: '1000 Tool-Calls an einem Tag', isDone: s => s.maxDayCalls >= 1000 },
  // Prompt-Verhalten
  { id: 'einsilbig', name: 'Einsilbig', desc: 'Prompt mit nur einem Wort', isDone: s => s.oneWord >= 1 },
  { id: 'roman', name: 'Romanautor', desc: 'Prompt mit über 2000 Zeichen', isDone: s => s.novels >= 1 },
  { id: 'ungeduld', name: 'Ungeduld', desc: '3 Prompts innerhalb von 30 Sekunden', isDone: s => s.burstMax >= 2 },
  { id: 'fragezeichen', name: 'Fragezeichen-Flut', desc: 'Prompt mit „???“', isDone: s => s.questionFloods >= 1 },
  { id: 'sorry', name: 'Entschuldigung angenommen', desc: '„sorry“ oder „mein Fehler“ im Prompt', isDone: s => s.sorries >= 1 },
  { id: 'neu', name: 'Neustart', desc: '`/clear` benutzt', isDone: s => s.clears >= 1 },
  // Tool-Verhalten
  { id: 'tunnel', name: 'Tunnelblick', desc: '10 Reads derselben Datei in einer Session', isDone: s => s.tunnels >= 1 },
  { id: 'schleife', name: 'Fehlerschleife', desc: 'Derselbe Bash-Befehl scheitert 3-mal hintereinander', isDone: s => s.failLoops >= 1 },
  { id: 'abbruch', name: 'Notbremse', desc: 'Einen laufenden Turn abgebrochen', isDone: s => s.aborts >= 1 },
  { id: 'schweigsam', name: 'Schweigsamer Held', desc: 'Ein Turn mit über 20 Tool-Calls', isDone: s => s.busyTurns >= 1 },
  { id: 'git', name: 'Git-Profi', desc: '10 Commits über Claude', isDone: s => s.commits >= 10 },
  { id: 'docker', name: 'Docker-Kapitän', desc: '`docker` ausgeführt', isDone: s => s.dockerRuns >= 1 },
  // Meta
  { id: 'neugierig', name: 'Neugierig', desc: '`/achievements` 5-mal aufgerufen', isDone: s => s.listViews >= 5 },
  { id: 'sammler10', name: 'Sammler', desc: '10 Achievements freigeschaltet', isDone: (_s, n) => n >= 10 },
  { id: 'sammler20', name: 'Fleißiger Sammler', desc: '20 Achievements freigeschaltet', isDone: (_s, n) => n >= 20 },
  { id: 'sammler30', name: 'Großsammler', desc: '30 Achievements freigeschaltet', isDone: (_s, n) => n >= 30 },
  { id: 'platin', name: 'Platin', desc: 'Alle anderen Achievements freigeschaltet', isDone: (_s, n) => n >= 41 },
]

const dayOf = (ms: number): string => {
  const d = new Date(ms)

  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}

// serialisiert die Store-Zugriffe, damit parallele Tool-Calls keine Zähler überschreiben
let queue: Promise<unknown> = Promise.resolve()

function bump($: EngineInterface, change: (s: Stats) => Stats): Promise<void> {
  const job = queue.then(async () => {
    const saved = ((await $.store.get('stats')) ?? {}) as Partial<Stats>
    const unlocked = ((await $.store.get('unlocked')) ?? {}) as Record<string, string>
    const stats = change({ ...EMPTY, ...saved })
    const now = new Date(await $.clock.now()).toISOString()
    let isGrowing = true
    let isChanged = false

    // Meta-Achievements hängen an der Anzahl, daher wiederholen bis nichts Neues kommt
    while (isGrowing) {
      const fresh = ACHIEVEMENTS.filter(
        a => unlocked[a.id] === undefined && a.isDone(stats, Object.keys(unlocked).length),
      )
      isGrowing = fresh.length > 0

      for (const a of fresh) {
        unlocked[a.id] = now
        isChanged = true
        $.ui.toast(`🏆 Achievement: ${a.name} – ${a.desc}`)
      }
    }

    await $.store.set('stats', stats)
    if (isChanged) await $.store.set('unlocked', unlocked)
  })
  queue = job.catch(() => undefined)

  return job
}

export const register: Register = on => {
  let startedAt = 0
  let turnTools = 0
  let lastFailCmd = ''
  let failStreak = 0
  const readsPerFile: Record<string, number> = {}

  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'achievements',
      description: 'Zeigt deine freigeschalteten Achievements',
    })

    return next(e)
  }).catch(($, e, next) => next(e))

  on('command.run', async ($, e, next) => {
    if (e.command !== 'achievements') return next(e)

    await bump($, s => ({ ...s, listViews: s.listViews + 1 }))
    const unlocked = ((await $.store.get('unlocked')) ?? {}) as Record<string, string>
    const lines = ACHIEVEMENTS.map(a => {
      const at = unlocked[a.id]

      return at === undefined
        ? `🔒 ???  – ${a.desc}`
        : `🏆 ${a.name} – ${a.desc} (${at.slice(0, 10)})`
    })
    const count = Object.keys(unlocked).length

    return { text: `Achievements: ${count}/${ACHIEVEMENTS.length}\n\n${lines.join('\n')}` }
  }).catch(($, e, next) => next(e))

  on('session.end', async ($, e, next) => {
    if (e.reason === 'clear') {
      await bump($, s => ({ ...s, clears: s.clears + 1 }))
    }

    return next(e)
  }).catch(($, e, next) => next(e))

  on('prompt.submit', async ($, e, next) => {
    startedAt = await $.clock.now()
    turnTools = 0
    const text = (e as { text?: string }).text ?? ''
    const trimmed = text.trim()
    const date = new Date(startedAt)
    const hour = date.getHours()
    const weekday = date.getDay()
    const today = dayOf(startedAt)
    const yesterday = dayOf(startedAt - 86_400_000)
    const letters = text.replace(/[^A-Za-zÄÖÜäöüß]/g, '')
    const isShout = letters.length >= 10 && letters === letters.toUpperCase()
    const isOneWord = trimmed.length > 0 && !/\s/.test(trimmed) && !trimmed.startsWith('/')

    await bump($, s => {
      const isQuick = s.lastPromptAt > 0 && startedAt - s.lastPromptAt < 30_000
      const burst = isQuick ? s.burst + 1 : 0
      const streak = s.lastDay === today ? s.streak : s.lastDay === yesterday ? s.streak + 1 : 1

      return {
        ...s,
        prompts: s.prompts + 1,
        polite: s.polite + (/\b(bitte|danke)\b/i.test(text) ? 1 : 0),
        shouts: s.shouts + (isShout ? 1 : 0),
        nightPrompts: s.nightPrompts + (hour < 5 ? 1 : 0),
        earlyPrompts: s.earlyPrompts + (hour >= 5 && hour < 7 ? 1 : 0),
        lunchPrompts: s.lunchPrompts + (hour === 12 ? 1 : 0),
        weekendPrompts: s.weekendPrompts + (weekday === 0 || weekday === 6 ? 1 : 0),
        oneWord: s.oneWord + (isOneWord ? 1 : 0),
        novels: s.novels + (text.length > 2000 ? 1 : 0),
        questionFloods: s.questionFloods + (/\?\?\?/.test(text) ? 1 : 0),
        sorries: s.sorries + (/\b(sorry|mein fehler|entschuldigung)\b/i.test(text) ? 1 : 0),
        burst,
        burstMax: Math.max(s.burstMax, burst),
        lastPromptAt: startedAt,
        lastDay: today,
        streak,
      }
    })

    return next(e)
  }).catch(($, e, next) => next(e))

  on('tool.call', async ($, e, next) => {
    const input = e as { command?: string; file_path?: string }
    const cmd = input.command ?? ''
    const file = input.file_path ?? ''
    const now = await $.clock.now()
    const today = dayOf(now)
    const ran = await next(e)
    const isBash = e.tool === 'Bash'
    const hasFailed = isBash && ran.deny === undefined && ran.isError === true

    turnTools += 1
    let isTunnel = false
    if (e.tool === 'Read') {
      readsPerFile[file] = (readsPerFile[file] ?? 0) + 1
      isTunnel = readsPerFile[file] === 10
    }

    let isLoop = false
    if (isBash && hasFailed) {
      failStreak = cmd === lastFailCmd ? failStreak + 1 : 1
      lastFailCmd = cmd
      isLoop = failStreak === 3
    } else if (isBash) {
      failStreak = 0
      lastFailCmd = ''
    }

    const isCommit = isBash && !hasFailed && /\bgit\s+commit\b/.test(cmd)

    await bump($, s => {
      const dayCalls = s.dayCallsDay === today ? s.dayCalls + 1 : 1

      return {
        ...s,
        reads: s.reads + (e.tool === 'Read' ? 1 : 0),
        writes: s.writes + (e.tool === 'Edit' || e.tool === 'Write' ? 1 : 0),
        searches: s.searches + (e.tool === 'Grep' || e.tool === 'Glob' ? 1 : 0),
        agents: s.agents + (e.tool === 'Agent' || e.tool === 'Task' ? 1 : 0),
        composerReads: s.composerReads + (e.tool === 'Read' && /composer\.json$/.test(file) ? 1 : 0),
        bashFails: s.bashFails + (hasFailed ? 1 : 0),
        tests: s.tests + (isBash && /phpunit|pest|jest|vitest|pytest|\btest\b/.test(cmd) ? 1 : 0),
        lints: s.lints + (isBash && /phpstan|phpcs|eslint|psalm|rector|prettier|\blint\b/.test(cmd) ? 1 : 0),
        danger: s.danger + (isBash && /rm\s+-\w*r\w*f|push\s+.*(--force|-f\b)/.test(cmd) ? 1 : 0),
        dockerRuns: s.dockerRuns + (isBash && /\bdocker\b/.test(cmd) ? 1 : 0),
        commits: s.commits + (isCommit ? 1 : 0),
        tunnels: s.tunnels + (isTunnel ? 1 : 0),
        failLoops: s.failLoops + (isLoop ? 1 : 0),
        busyTurns: s.busyTurns + (turnTools === 21 ? 1 : 0),
        dayCalls,
        dayCallsDay: today,
        maxDayCalls: Math.max(s.maxDayCalls, dayCalls),
      }
    })

    return ran
  }).catch(($, e, next) => next(e))

  on('turn.complete', async ($, e, next) => {
    const seconds = startedAt === 0 ? 0 : Math.round(((await $.clock.now()) - startedAt) / 1000)
    const isAborted = e.reason === 'aborted'

    await bump($, s => ({
      ...s,
      longestTurnSeconds: Math.max(s.longestTurnSeconds, seconds),
      aborts: s.aborts + (isAborted ? 1 : 0),
    }))

    return next(e)
  }).catch(($, e, next) => next(e))
}
