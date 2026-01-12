---
name: deploy-check
description: Build, verify, commit, and push code after completing a feature. Automatically commits all changes with proper commit message format. Use when a feature is complete and ready for deployment.
allowed-tools: Bash, Read, AskUserQuestion, Grep
---

# Deploy Check Skill

This skill performs a complete deployment readiness check for the frontend learning guide project. It automatically commits all changes and optionally pushes to remote. **Only use after completing a feature.**

## Workflow

### 1. Pre-commit Safety Check

Before committing, check for sensitive files that should not be committed:

```bash
git status --porcelain
```

**Check for these patterns:**
- `.env` files (should be in .gitignore)
- Files containing API keys, tokens, passwords
- `**/credentials.json`, `**/secrets.*`, `**/*.key`, `**/*.pem`
- Any files with `apikey`, `secret`, `token` in the name

If sensitive files are detected:
1. Warn the user immediately
2. Show the file names
3. Ask if they want to continue or abort
4. Suggest adding to .gitignore if needed

Use Grep to scan staged files for common secret patterns:
```bash
git diff --cached | grep -iE "(api[_-]?key|secret|password|token|private[_-]?key)" || true
```

If matches found, warn the user about potential secrets in code.

### 2. Type Check

Verify TypeScript compilation:
```bash
pnpm check
```

If type errors are found, **STOP** and report them. Do not proceed until fixed.

### 3. Build Project

Build both client and server:
```bash
pnpm build
```

Check for build errors or warnings. Report any issues found.

### 4. Start Production Server

Start the production server in the background:
```bash
NODE_ENV=production node dist/index.js &
```

Wait 3-5 seconds for the server to start.

### 5. Verify Server Response

Check if the server is responding:
```bash
curl -I http://localhost:3000
```

Verify you get a 200 OK response. If not, check logs and report the issue.

### 6. Report Status

Provide a summary:
- Type check: ✓ Passed / ✗ Failed
- Build: ✓ Success / ✗ Failed
- Server: ✓ Running on http://localhost:3000 / ✗ Not responding
- Any warnings or issues found

### 7. Git Commit

If all checks pass, automatically commit all changes.

**Step 7.1: Check Git Status**
```bash
git status --porcelain
```

If there are no changes (both staged and unstaged), inform the user and skip to push step.

**Step 7.2: Stage All Changes**
```bash
git add -A
```

**Step 7.3: Analyze Changes for Commit Message**

Run these commands to understand the changes:
```bash
git diff --cached --stat
git diff --cached --name-only
```

Analyze the changes to determine:
- **Type**: feat, fix, docs, style, refactor, perf, test, chore, build, ci
- **Scope**: The affected module/component (optional)
- **Subject**: Brief description (max 50 chars)
- **Body**: Detailed explanation if needed (wrap at 72 chars)

**Step 7.4: Generate Commit Message**

Follow the Conventional Commits specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Type definitions:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style changes (formatting, semicolons, etc)
- `refactor`: Code refactoring (no feature change or bug fix)
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks, dependency updates
- `build`: Build system or external dependencies
- `ci`: CI/CD configuration changes

**Examples:**
```
feat(course): add Day 8 content on React hooks

- Add comprehensive React hooks tutorial
- Include useState, useEffect, and custom hooks examples
- Add interactive code examples

feat: add dark mode toggle to navigation

fix(build): resolve TypeScript compilation errors in DayContent component

docs: update CLAUDE.md with deployment instructions

chore(deps): upgrade React to v19.2.1

refactor(components): extract MarkdownRenderer logic into separate hooks
```

**Step 7.5: Create Commit**

Use a heredoc to properly format the commit message:
```bash
git commit -m "$(cat <<'EOF'
<type>(<scope>): <subject>

<body if needed>

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
EOF
)"
```

**Step 7.6: Verify Commit**
```bash
git log -1 --oneline
```

Show the commit hash and message to the user.

### 8. Ask About Git Push

Ask the user if they want to push to remote:

Use AskUserQuestion with:
- Question: "Changes committed successfully! Would you like to push to the remote repository?"
- Options:
  1. "Yes, push now" - Proceed with git push
  2. "No, keep local" - Skip push and finish
  3. "Review commits first" - Show commits to be pushed before deciding

### 9. Git Push (if requested)

If user chooses to push:

**Step 9.1: Show Commits to Push**
```bash
git log origin/$(git branch --show-current)..HEAD --oneline
```

**Step 9.2: Push to Remote**

Use the following command to ensure proper SSH handling:
```bash
GIT_SSH_COMMAND="ssh -o BatchMode=yes -o StrictHostKeyChecking=accept-new" git push origin $(git branch --show-current)
```

**Why this works:**
- `BatchMode=yes`: Prevents interactive prompts that can hang in non-interactive environments
- `StrictHostKeyChecking=accept-new`: Automatically accepts new host keys (safe for known hosts like GitHub)
- Explicitly specify branch: `origin $(git branch --show-current)` instead of just `git push`

**Alternative if above fails:**
```bash
git push --porcelain origin $(git branch --show-current) 2>&1
```

The `--porcelain` flag provides machine-readable output that's easier to parse for errors.

**Step 9.3: Verify Push Success**

Check the exit code and output. If successful, show:
- Branch pushed
- Commit count
- Remote URL

If failed, show the error and suggest:
1. Check SSH key: `ssh -T git@github.com`
2. Check remote URL: `git remote -v`
3. Try manual push: `git push`

### 10. Cleanup Reminder

Remind the user that the production server is still running on port 3000.

To stop it:
```bash
pkill -f "node dist/index.js"
```

Or:
```bash
lsof -ti:3000 | xargs kill -9
```

## Important Notes

- **Automatic commit**: This skill commits ALL changes (staged and unstaged)
- **Safety first**: Always checks for sensitive files before committing
- **Conventional Commits**: Follows standard commit message format
- **SSH handling**: Uses proper SSH configuration to avoid hanging
- **Only use after feature completion**: Not for active development
- **Server cleanup**: Remember to stop the production server after testing

## Error Handling

If any step fails:
1. Stop immediately
2. Report the specific error
3. Provide actionable suggestions
4. Do not proceed to next steps
5. Clean up any background processes

## Commit Message Quality

The commit message should:
- Use imperative mood ("add" not "added" or "adds")
- Be concise but descriptive
- Include scope when changes are localized
- Add body for complex changes
- Reference issues when applicable (e.g., "Closes #123")
- Follow the 50/72 rule (50 char subject, 72 char body wrap)
