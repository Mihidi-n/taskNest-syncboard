// Mock data — stands in for the REST API responses that land in M2 (Working REST API).
// Shape is deliberately close to what a Mongoose schema + Express endpoint would return,
// so swapping this out for a real `fetch('/api/tasks')` later is a small change, not a rewrite.

export const columns = [
  { id: 'col-todo', title: 'To Do' },
  { id: 'col-doing', title: 'Doing' },
  { id: 'col-done', title: 'Done' },
]

// Tags double as a stand-in for "who touched which layer" — handy once your group
// rotates roles per the Team Working Agreement.
export const tags = {
  frontend: { label: 'Front End', color: 'var(--tag-frontend)' },
  backend: { label: 'Back End', color: 'var(--tag-backend)' },
  design: { label: 'Design', color: 'var(--tag-design)' },
  docs: { label: 'Docs', color: 'var(--tag-docs)' },
  bug: { label: 'Bug', color: 'var(--tag-bug)' },
}

export const initialTasks = [
  {
    id: 'TB-001',
    columnId: 'col-todo',
    title: 'Set up Express app skeleton',
    description: 'routes/controllers/models folders, health-check endpoint.',
    tag: 'backend',
    labels: ['backend'],
    dueDate: '2026-08-16',
    assignee: 'Priya',
  },
  {
    id: 'TB-002',
    columnId: 'col-todo',
    title: 'Draft Mongoose schemas',
    description: 'Board, Column, Task — decide embed vs reference.',
    tag: 'backend',
    labels: ['backend'],
    dueDate: '2026-08-16',
    assignee: 'Sam',
  },
  {
    id: 'TB-003',
    columnId: 'col-todo',
    title: 'Wireframe board + card modal',
    description: 'Low-fidelity pass before building components.',
    tag: 'design',
    labels: ['design'],
    dueDate: null,
    assignee: 'Alex',
  },
  {
    id: 'TB-004',
    columnId: 'col-doing',
    title: 'Build Board / Column / TaskCard components',
    description: 'Static skeleton with mock data — this milestone.',
    tag: 'frontend',
    labels: ['frontend'],
    dueDate: null,
    assignee: 'You',
  },
  {
    id: 'TB-005',
    columnId: 'col-doing',
    title: 'Write component tree + README',
    description: 'Due alongside the M1 skeleton.',
    tag: 'docs',
    labels: ['docs'],
    dueDate: null,
    assignee: 'You',
  },
  {
    id: 'TB-006',
    columnId: 'col-done',
    title: 'Repo created + branch strategy agreed',
    description: 'feature branches, PRs into main, per Team Working Agreement.',
    tag: 'docs',
    labels: ['docs'],
    dueDate: null,
    assignee: 'Team',
  },
  {
    id: 'TB-007',
    columnId: 'col-done',
    title: 'Confirm project scope with facilitator',
    description: 'Sticking with CollabBoard (Kanban) as the default project.',
    tag: 'design',
    labels: ['design'],
    dueDate: null,
    assignee: 'Team',
  },
]
