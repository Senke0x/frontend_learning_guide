---
name: deploy-check
description: Build, verify, and optionally push code after completing a feature. Use when a feature is complete and ready for deployment verification.
allowed-tools: Bash, Read, AskUserQuestion
---

# Deploy Check Skill

This skill performs a complete deployment readiness check for the frontend learning guide project. It should only be used after completing a feature or significant code change.

## Workflow

### 1. Type Check
First, verify TypeScript compilation:
```bash
pnpm check
```

If type errors are found, stop and report them to the user. Do not proceed until fixed.

### 2. Build Project
Build both client and server:
```bash
pnpm build
```

Check for build errors or warnings. Report any issues found.

### 3. Start Production Server
Start the production server in the background:
```bash
NODE_ENV=production node dist/index.js
```

Wait 3-5 seconds for the server to start, then verify it's running.

### 4. Verify Server Response
Check if the server is responding:
```bash
curl -I http://localhost:3000
```

Verify you get a 200 OK response. If the server isn't responding, check the logs and report the issue.

### 5. Report Status
Provide a summary to the user:
- Type check: ✓ Passed / ✗ Failed
- Build: ✓ Success / ✗ Failed
- Server: ✓ Running on http://localhost:3000 / ✗ Not responding
- Any warnings or issues found

### 6. Ask About Git Push
If all checks pass, ask the user if they want to push to remote:

Use the AskUserQuestion tool with:
- Question: "All checks passed! Would you like to push your changes to the remote repository?"
- Options:
  1. "Yes, push to remote" - Proceed with git push
  2. "No, keep local only" - Skip push and finish
  3. "Review changes first" - Show git status and diff before deciding

### 7. Git Push (if requested)
If user chooses to push:

1. Show current git status:
```bash
git status
```

2. Show what will be pushed:
```bash
git log origin/$(git branch --show-current)..HEAD --oneline
```

3. Push to remote:
```bash
git push
```

4. Confirm push was successful and show the result.

## Important Notes

- **Only use this skill after completing a feature** - not during active development
- The production server will keep running after this skill completes - remind the user to stop it when done testing
- If any step fails, stop immediately and report the issue
- Always clean up background processes if something goes wrong

## Cleanup

To stop the production server after testing:
```bash
pkill -f "node dist/index.js"
```

Or find and kill the process:
```bash
lsof -ti:3000 | xargs kill -9
```
