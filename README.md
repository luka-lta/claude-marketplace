# luka-mods

Private Claude-Code-Mods von Luka Liebenthal.

## Plugins

| Plugin | Beschreibung |
|--------|--------------|
| `spinner-sprueche` | Ersetzt „Thinking…“ im Spinner durch passende Sprüche je nach Tool-Aufruf |
| `achievements` | Achievements für Claude Code: Toast beim Freischalten, `/achievements` zeigt die Sammlung |

## Marketplace einbinden

Lokal (Entwicklung):

```bash
claude plugin marketplace add /Users/lliebenthal/projects/claude-marketplace
```

Über GitHub:

```bash
claude plugin marketplace add luka-lta/claude-marketplace
```

## Plugin installieren

```bash
claude plugin install spinner-sprueche@luka-mods
claude plugin install achievements@luka-mods
```

## Entwicklung

```bash
# Marketplace und Plugins prüfen
claude plugin validate .
claude plugin validate plugins/spinner-sprueche
claude plugin validate plugins/achievements
```

Neues Plugin: Ordner unter `plugins/<name>/` mit `.claude-plugin/plugin.json` anlegen
und Eintrag in `.claude-plugin/marketplace.json` ergänzen.
