# Git Workflow — Team Working Agreement

The brief's grading rubric checks **commit history**, not just the final
snapshot ("even contribution visible in git history"). Copying this folder
and emailing code around won't produce that — every commit would end up
authored by whoever does the copy-pasting. Use one shared GitHub repo
instead. It's less work than manual copies, and it's the thing the rubric
is actually looking for.

## One-time setup (whoever sets up the repo)

```bash
cd collabboard
git init
git add .
git commit -m "M1: static front-end skeleton with mock data"
```

Create an empty repository on GitHub (no README/license — you already have
files), then:

```bash
git remote add origin https://github.com/<your-org-or-user>/collabboard.git
git branch -M main
git push -u origin main
```

On GitHub: **Settings → Collaborators** → add each teammate by username, or
create a repo under a shared GitHub organization if your group has one.

## What every teammate does (including whoever set it up)

```bash
git clone https://github.com/<your-org-or-user>/collabboard.git
cd collabboard
npm install
git checkout -b <yourname>/<short-feature-name>   # e.g. sam/mongoose-schemas
```

Work normally, commit as you go — several small commits beat one giant one,
and it's what gives you real history to show:

```bash
git add .
git commit -m "Add Task schema with embedded comments"
git push -u origin <yourname>/<short-feature-name>
```

Then open a Pull Request into `main` on GitHub and have a teammate review
it before merging. This is also what the brief means by "Agree on a branch
strategy in Session 1 and keep to it."

## Suggested branch pattern per person/session

```
main
 ├── priya/express-skeleton
 ├── sam/mongoose-schemas
 ├── alex/board-column-taskcard   ← this M1 skeleton
 └── you/readme-component-tree
```

Small, frequent PRs (a few times a week) keep `main` always in a working
state and keep everyone's individual contribution visible and attributable
— which is exactly what "commit history intact, no squashed/rewritten
history" in the Final Submission Checklist is asking for.

## If someone genuinely can't use GitHub collaborators

(e.g. a teammate is new to git and you want them to practice on their own
copy first) — still don't hand-edit a "codeless" folder. Instead:

1. Push the real repo to GitHub as above.
2. Have them `git clone` it — they get the full working code AND full
   history automatically; there's no need to strip files out.
3. They branch, commit, push, and open a PR like everyone else.

Cloning already gives each person a complete, independent working copy —
that's the whole point of git, so there's no separate "empty version" to
prepare.
