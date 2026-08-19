# Team Tasks — new features

Short answer to "where do they create files and do they need to import
it somewhere": **nobody needs to create files or add imports.** Every
file below already exists in this zip, is already imported into the
right parent component, and already receives the props it needs. Each
person opens *only* their own file(s) and fills in the `TODO`. This is
deliberate — it's the thing that keeps 6–7 people working in the same
repo at once from stepping on each other's code.

## How to actually start (per person)

```bash
git pull                                   # get this scaffold onto main first
git checkout -b <yourname>/<feature-name>  # e.g. sam/board-switcher
npm install
npm run dev
```
Open your file(s) from the table below, replace the placeholder with
real UI, commit, push, open a PR into `main`. See `GIT_WORKFLOW.md` for
the full branch/PR pattern your group already agreed on.

## Feature → files → owner

| Feature | File(s) to edit | Suggested branch |
|---|---|---|
| Creating another board & filtering boards | `src/components/BoardSwitcher.jsx` + `.css` | `<name>/board-switcher` |
| Filter the cards | `src/components/TaskFilterBar.jsx` + `.css` | `<name>/task-filter` |
| Adding lists | `src/components/AddColumnForm.jsx` + `.css` | `<name>/add-list` |
| Rename a list & delete a list | `src/components/ColumnMenu.jsx` + `.css` | `<name>/column-menu` |
| Due dates & description (after clicking) | `src/components/TaskDetailModal.jsx` + `.css` | `<name>/task-detail` |
| Adding labels | `src/components/LabelBadge.jsx` + `.css` | `<name>/labels` |
| Share the board | `src/components/ShareBoardModal.jsx` + `.css` | `<name>/share-board` |

That's 7 features for however many people are on your team — double up
branches per person if you have fewer than 7, or split "rename" and
"delete" across two people inside `ColumnMenu.jsx` if you have more (that
one file can hold two people's work in different functions, just
coordinate who touches it when).

## What's already done vs. what's each person's job

**Already done (don't touch unless you know why):**
- `App.jsx`, `Board.jsx`, `Column.jsx`, `TaskCard.jsx` — all wired to
  pass the right props to every stub component.
- `src/hooks/useBoards.js` — all the state logic (create/rename/delete
  lists, create/update/move/delete tasks, create/switch boards)
  already works. Your component just needs to *call* the functions it's
  given as props (e.g. `onDelete()`, `onRename(title)`) — you don't
  write any state-management logic yourself.
- `src/data/mockData.js` / `mockBoards.js` — already has `dueDate` and
  `labels` fields on every task, and a second demo board, so there's
  real data to build against.

**Each person's job:** open your file(s), read the comment block at the
top (every stub has one — it lists your exact props and a short "what
to build" list), delete the placeholder `<span>`, build the real thing.

## If your feature genuinely needs something from a shared file

Ask in the group chat first. Two people editing `App.jsx` or
`useBoards.js` on different branches at the same time is the most
likely source of a messy merge conflict — better to agree on the change
and have one person make it, or add the small addition on your branch
and flag it clearly in your PR description so whoever reviews knows to
look there.

## Suggested order to merge PRs in

Doesn't matter much technically — every stub is independent — but
merging `ColumnMenu` and `AddColumnForm` first means everyone testing
their own feature afterward has a board that's easier to reshape while
they work. Not a hard rule, just a nice-to-have.
