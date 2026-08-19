# Component Tree — M1 + in-progress feature scaffolding

```
App                              (owns board state via useBoards hook)
├── BoardSwitcher                [STUB — create/switch/filter boards]
├── TaskFilterBar                [STUB — filter cards]
├── Board                        (presentational — renders the active board)
│   ├── Column  × n
│   │   ├── ColumnMenu           [STUB — rename/delete this list]
│   │   ├── TaskCard  × n
│   │   │   └── LabelBadge       [STUB — label pills]
│   │   └── add-card form        (already built, local to Column)
│   └── AddColumnForm            [STUB — add a new list]
├── TaskDetailModal              [STUB — shown when a task is clicked; due date + description]
└── ShareBoardModal              [STUB — shown when "Share" is clicked]
```

`[STUB]` = file exists, is wired into its parent, and renders a visible
placeholder, but the real feature isn't built yet — see `TEAM_TASKS.md`
for who owns what and what to build.

## Who owns what state

| Component | State it owns | Where its data comes from |
|---|---|---|
| `App` | `selectedTaskId`, `isShareOpen`, `filterFn` | `useBoards()` hook |
| `useBoards` (hook) | `boards`, `activeBoardId` | seeded from `src/data/mockBoards.js` |
| `Board` | none — presentational | props from `App` |
| `Column` | `isOver`, `draftTitle`, `isAdding` | props from `Board` |
| `TaskCard` | none — presentational | props from `Column` |

**Why state moved to a hook for this round:** M1 had `Board` own a single
`tasks` array directly. Supporting multiple boards meant that state
needed to live above any one board's view — `useBoards` is the "future
API cache" now; `Board`, `Column`, and `TaskCard` don't hold their own
copies of data, they render what they're given and call back upward
(`onDrop`, `onDeleteTask`, `onAddTask`, `onOpenTask`, ...) when something
needs to change. Same one-way-data-flow principle as M1, just with the
source of truth one level higher.

## Data flow for a drag-and-drop move (unchanged from M1)

```
TaskCard (dragstart) → dataTransfer holds task id
        ↓
Column (dragover / drop) → reads task id, calls onDrop(id, columnId)
        ↓
App → useBoards().moveTask(id, columnId) → re-render with new columnId
```

## Data flow for a new feature (example: rename a list)

```
ColumnMenu (built by its owner) → calls onRename(newTitle)
        ↓
Column → onRenameColumn(column.id, newTitle)   (already wired)
        ↓
App → useBoards().renameColumn(...)             (already wired)
        ↓
useBoards hook updates state → re-renders everything downstream
```

Every stub component in the tree above already has this chain wired in
both directions — the owner only needs to build what's *inside* their
own component and call the prop functions they're given.
