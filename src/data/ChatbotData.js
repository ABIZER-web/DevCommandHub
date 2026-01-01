// src/data/chatbotData.js

export const chatData = [
  // --- ADMIN & WEBSITE USAGE (Updated Answer) ---
  {
    keywords: ["add command", "create command", "new command", "admin login", "login", "signin", "how to add"],
    answer: "If you are admin (abizer) so enter credentials otherwise mail the owner click on the question icon side of the admin login"
  },
  {
    keywords: ["delete command", "remove command", "delete"],
    answer: "Only the Admin can delete commands. Log in, then click the red 'Trash' icon on the command card."
  },
  {
    keywords: ["copy", "clipboard", "how to copy", "copy code"],
    answer: "Simply click the 'Copy' button (or the clipboard icon) on any command card to copy the code instantly."
  },
  {
    keywords: ["search", "find", "looking for", "hindi", "."],
    answer: "Use the search bar at the top. You can type in English, Hindi, or . keywords to find commands."
  },
  {
    keywords: ["voice", "speak", "mic", "microphone"],
    answer: "Click the Microphone icon in the search bar and speak your query. The app will automatically type what you say."
  },
  {
    keywords: ["feedback", "suggestion", "contact", "mail", "email"],
    answer: "Click the 'Help/Guide' icon (Question Mark) in the navbar to open the feedback form and send a message to Abizer."
  },
  {
    keywords: ["dark mode", "theme", "colors"],
    answer: "The website uses a dark theme by default to reduce eye strain for developers."
  },

  // --- GIT: SETUP & CONFIG ---
  {
    keywords: ["init", "start git", "initialize", "new repo"],
    answer: "Use `git init` to start a new Git repository in your current folder."
  },
  {
    keywords: ["clone", "download repo", "get repo", "copy repo"],
    answer: "Use `git clone [url]` to download a repository from GitHub to your computer."
  },
  {
    keywords: ["config name", "set name", "username"],
    answer: "Use `git config --global user.name 'Your Name'` to set your username for commits."
  },
  {
    keywords: ["config email", "set email", "user email"],
    answer: "Use `git config --global user.email 'you@example.com'` to set your email."
  },
  {
    keywords: ["status", "check files", "what changed"],
    answer: "Use `git status` to see which files have been modified or staged."
  },
  {
    keywords: ["ignore", "gitignore", "exclude files"],
    answer: "Create a `.gitignore` file and add filenames (like `node_modules`) to stop Git from tracking them."
  },

  // --- GIT: BASICS ---
  {
    keywords: ["add file", "stage file", "add ."],
    answer: "Use `git add [filename]` for one file, or `git add .` to stage all changed files."
  },
  {
    keywords: ["commit", "save changes", "save code"],
    answer: "Use `git commit -m 'your message'` to save your staged changes permanently."
  },
  {
    keywords: ["amend", "fix commit", "change message"],
    answer: "Use `git commit --amend -m 'new message'` to fix the last commit message."
  },
  {
    keywords: ["push", "upload", "send to github"],
    answer: "Use `git push origin [branch-name]` (usually 'main' or 'master') to upload commits."
  },
  {
    keywords: ["pull", "download changes", "update local"],
    answer: "Use `git pull` to download and merge changes from the remote repository."
  },
  {
    keywords: ["fetch", "get updates"],
    answer: "Use `git fetch` to download changes from the remote without merging them into your code."
  },

  // --- GIT: BRANCHING ---
  {
    keywords: ["branch", "create branch", "new branch"],
    answer: "Use `git branch [name]` to create a branch, or `git branch` to list them."
  },
  {
    keywords: ["checkout", "switch branch", "change branch"],
    answer: "Use `git checkout [branch-name]` to switch between branches."
  },
  {
    keywords: ["create and switch", "checkout -b"],
    answer: "Use `git checkout -b [new-branch-name]` to create a new branch and switch to it immediately."
  },
  {
    keywords: ["delete branch", "remove branch"],
    answer: "Use `git branch -d [branch-name]` to delete a local branch."
  },
  {
    keywords: ["merge", "combine", "join branch"],
    answer: "Use `git merge [branch-name]` to combine changes from another branch into your current one."
  },

  // --- GIT: ADVANCED / UNDO ---
  {
    keywords: ["undo commit", "reset soft"],
    answer: "Use `git reset --soft HEAD~1` to undo the last commit but keep changes in your files."
  },
  {
    keywords: ["discard changes", "reset hard", "delete changes"],
    answer: "Use `git reset --hard` to delete all local changes and revert to the last commit. (Warning: Data loss!)"
  },
  {
    keywords: ["revert", "undo public commit"],
    answer: "Use `git revert [commit-id]` to create a new commit that reverses the effects of a previous one."
  },
  {
    keywords: ["log", "history", "commits list"],
    answer: "Use `git log` to see a list of all past commits. Press 'q' to exit the list."
  },
  {
    keywords: ["log oneline", "short history"],
    answer: "Use `git log --oneline` to see a cleaner, shorter version of your commit history."
  },
  {
    keywords: ["blame", "who wrote this", "line history"],
    answer: "Use `git blame [filename]` to see who modified each line of a file and when."
  },
  {
    keywords: ["remote", "connect github", "add origin"],
    answer: "Use `git remote add origin [url]` to connect your folder to a GitHub repository."
  },
  {
    keywords: ["diff", "differences", "compare"],
    answer: "Use `git diff` to see exactly what lines of code changed before you stage them."
  },
  {
    keywords: ["stash", "save temp", "hide changes"],
    answer: "Use `git stash` to temporarily save changes without committing, useful when switching branches."
  },
  {
    keywords: ["pop", "apply stash", "restore stash"],
    answer: "Use `git stash pop` to apply your last stashed changes and remove them from the list."
  },
  {
    keywords: ["cherry pick", "pick commit"],
    answer: "Use `git cherry-pick [commit-id]` to copy a specific commit from another branch to your current branch."
  },
  {
    keywords: ["tag", "release", "version"],
    answer: "Use `git tag [v1.0]` to mark a specific point in history as important (like a release)."
  },

  // --- VS CODE SHORTCUTS ---
  {
    keywords: ["open vs code", "start code", "launch"],
    answer: "Type `code .` in your terminal to open the current folder in VS Code."
  },
  {
    keywords: ["terminal shortcut", "open terminal vs"],
    answer: "In VS Code, press `Ctrl + ~` (tilde) to toggle the integrated terminal."
  },
  {
    keywords: ["command palette", "search command"],
    answer: "Press `Ctrl + Shift + P` (or Cmd+Shift+P) to open the Command Palette."
  },
  {
    keywords: ["find file", "search file"],
    answer: "Press `Ctrl + P` to quickly find and open a file by name."
  },
  {
    keywords: ["format", "prettier", "clean code"],
    answer: "Press `Shift + Alt + F` to format your document code."
  },
  {
    keywords: ["duplicate line", "copy line down"],
    answer: "Press `Shift + Alt + Down Arrow` to duplicate the current line."
  },
  {
    keywords: ["move line", "move code up"],
    answer: "Press `Alt + Up/Down Arrow` to move the selected line up or down."
  },
  {
    keywords: ["multi cursor", "multiple edit"],
    answer: "Hold `Alt` and click in multiple places to add multiple cursors."
  },
  {
    keywords: ["comment", "uncomment"],
    answer: "Press `Ctrl + /` to toggle comments on the selected line."
  },
  {
    keywords: ["sidebar", "explorer", "toggle side"],
    answer: "Press `Ctrl + B` to show or hide the sidebar explorer."
  },
  {
    keywords: ["search project", "find in files"],
    answer: "Press `Ctrl + Shift + F` to search for text across your entire project."
  },
  {
    keywords: ["replace", "find replace"],
    answer: "Press `Ctrl + H` to find and replace text in the current file."
  },
  {
    keywords: ["zen mode", "full screen"],
    answer: "Press `Ctrl + K` then `Z` to toggle Zen Mode (distraction-free coding)."
  },
  {
    keywords: ["split screen", "split editor"],
    answer: "Press `Ctrl + \\` to split the editor into two screens."
  },

  // --- CMD / TERMINAL COMMANDS ---
  {
    keywords: ["clear", "cls", "clean screen"],
    answer: "Use `cls` (Windows) or `clear` (Mac/Linux) to clear the terminal screen."
  },
  {
    keywords: ["ls", "dir", "list files"],
    answer: "Use `dir` (Windows) or `ls` (Mac/Linux) to list files in the current folder."
  },
  {
    keywords: ["cd", "change directory", "go to folder"],
    answer: "Use `cd [folder-name]` to go into a folder, or `cd ..` to go back one level."
  },
  {
    keywords: ["mkdir", "make folder", "create directory"],
    answer: "Use `mkdir [folder-name]` to create a new folder."
  },
  {
    keywords: ["rm", "delete file", "remove"],
    answer: "Use `del [file]` (Windows) or `rm [file]` (Mac/Linux) to delete a file."
  },
  {
    keywords: ["ip", "ip address", "network"],
    answer: "Use `ipconfig` (Windows) or `ifconfig` (Mac/Linux) to see your IP address."
  },
  {
    keywords: ["ping", "test connection", "check site"],
    answer: "Use `ping [website.com]` to test your internet connection to a specific site."
  },
  {
    keywords: ["whoami", "current user"],
    answer: "Type `whoami` to see the current logged-in username."
  },
  {
    keywords: ["exit", "close cmd"],
    answer: "Type `exit` to close the terminal window."
  },
  {
    keywords: ["system info", "pc specs"],
    answer: "Type `systeminfo` (Windows) to see detailed information about your computer."
  },
  {
    keywords: ["tasklist", "running processes"],
    answer: "Type `tasklist` (Windows) or `top` (Mac/Linux) to see all running programs."
  },

  // --- GENERAL / CHIT-CHAT ---
  {
    keywords: ["hello", "hi", "hey", "hola"],
    answer: "Hello! I am the DevHelper Bot. Ask me about Git, VS Code, or CMD commands."
  },
  {
    keywords: ["who are you", "what are you"],
    answer: "I am a custom chatbot built to help you navigate this command library."
  },
  {
    keywords: ["help", "guide", "support"],
    answer: "You can search for commands using the top bar, or check the 'User Guide' by clicking the Help icon."
  },
  {
    keywords: ["thank you", "thanks"],
    answer: "You're welcome! Happy coding! 🚀"
  },
  {
    keywords: ["bye", "goodbye"],
    answer: "Goodbye! See you next time."
  },
  {
    keywords: ["upload website", "push to github", "host on github", "upload code", "deploy", "how to push"],
    answer: "**Note:** These commands are often available directly on your GitHub dashboard after creating a new repository. Copying them from there is easier and faster.\n\nTo upload your website to GitHub, follow these steps in order:\n\n1. Initialize Git:\n`git init`\n\n2. Add all files:\n`git add .`\n\n3. Save changes:\n`git commit -m \"First commit\"`\n\n4. Rename branch to main:\n`git branch -M main`\n\n5. Connect to GitHub (replace URL with your repo link):\n`git remote add origin https://github.com/username/repo-name.git`\n\n6. Upload:\n`git push -u origin main`"
  },
];