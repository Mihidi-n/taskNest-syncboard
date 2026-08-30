// mockBoards.js — the multi-board layer on top of mockData.js.
//
// Feeds the "creating another board & filtering the boards" feature
// (see src/components/BoardSwitcher.jsx) via the useBoards hook.
// Board 1 reuses the existing columns/tasks from mockData.js
// untouched; board 2 is just enough data to prove switching boards
// actually shows different content.

import { columns as defaultColumns, initialTasks } from './mockData'

export const initialBoards = [
  {
    id: 'board-1',
    name: 'CollabBoard Launch',
    columns: defaultColumns,
    tasks: initialTasks,
  },
  {
    id: 'board-2',
    name: 'Marketing Sprint',
    columns: [
      { id: 'col-todo', title: 'To Do' },
      { id: 'col-doing', title: 'Doing' },
      { id: 'col-done', title: 'Done' },
    ],
    tasks: [
      {
        id: 'MK-001',
        columnId: 'col-todo',
        title: 'Draft launch announcement post',
        description: 'Short teaser for socials, links to the waitlist form.',
        tag: 'design',
        labels: ['design'],
        dueDate: '2026-08-20',
        assignee: 'Alex',
      },
      {
        id: 'MK-002',
        columnId: 'col-doing',
        title: 'Collect teammate quotes for the README',
        description: '',
        tag: 'docs',
        labels: ['docs'],
        dueDate: null,
        assignee: 'Priya',
      },
    ],
  },
]
