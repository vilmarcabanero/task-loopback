# Developer's Guide

We use [Visual Studio Code] (https://code.visualstudio.com/download) for developing [LoopBack] (https://loopback.io/) and recommend the same to you.

## VSCode setup

Install the following extensions:

 - [eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
 - [prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
 - [tslint](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-tslint-plugin)
 - [sonarlint](https://marketplace.visualstudio.com/items?itemName=SonarSource.sonarlint-vscode)
 - [remote - ssh](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-ssh)

## Development workflow

### Checking out the starter
1. Use the following git command to get a shallow clone of the starter

    `git clone --depth 1 -b develop https://ITG-EADBSVRDEV/MBS30/starter/loopback-starter.git ./PROJECTNAME`

2. Remove the starter `.git` folder (so you can use your project's own git repository)

    `cd ./PROJECTNAME && rm -fr .git`

3. Edit the `package.json` file and replace the:
   * name - your project shortname
   * version - the current version of your code (refer to the VERSIONING.md file)
   * description - a short description of the project

4. Start coding.

### Visual Studio Code

1. Start the build task (Cmd+Shift+B) to run TypeScript compiler in the
   background, watching and recompiling files as you change them. Compilation
   errors will be shown in the VSCode's "PROBLEMS" window.

2. Execute "Run Rest Task" from the Command Palette (Cmd+Shift+P) to re-run the
   test suite and lint the code for both programming and style errors. Linting
   errors will be shown in VSCode's "PROBLEMS" window. Failed tests are printed
   to terminal output only.

### Other editors/IDEs

1. Open a new terminal window/tab and start the continous build process via
   `npm run build:watch`. It will run TypeScript compiler in watch mode,
   recompiling files as you change them. Any compilation errors will be printed
   to the terminal.

2. In your main terminal window/tab, run `npm run test:dev` to re-run the test
   suite and lint the code for both programming and style errors. You should run
   this command manually whenever you have new changes to test. Test failures
   and linter errors will be printed to the terminal.
   
   
### Installing or updating npm packages

1. After installing or updating npm packages, run `npm shrinkwrap --dev` to update the `npm-shrinkwrap.json` file.
2. **DO NOT FORGET TO COMMIT THE CHANGES TO THIS FILE**.
3. This is to guarantee that everyone who installs gets exactly the same version of all dependencies across all environments

### Commit Message Guidelines

Use the following format:

```
<JIRA Issue ID>
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

Sample:

```
XX-111
fix(release): need to depend on latest rxjs and zone.js

The version in our package.json gets copied to the one we publish, and users need the latest of these.
```

#### Jira Issue ID
This is the Jira entry that requires this commit. This is normally of type *Story*, *Development* or *Development Task*.

#### Type
Must be one of the following:

* **build**: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
* **ci**: Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)
* **docs**: Documentation only changes
* **feat**: A new feature
* **fix**: A bug fix
* **perf**: A code change that improves performance
* **refactor**: A code change that neither fixes a bug nor adds a feature
* **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
* **test**: Adding missing tests or correcting existing tests

#### Scope
A scope may be provided to a commit’s type, to provide additional contextual information and is contained within parenthesis, e.g., *feat(parser): add ability to parse arrays*.

#### Subject
The subject contains a succinct description of the change:

* use the imperative, present tense: "change" not "changed" nor "changes"
* don't capitalize the first letter
* no dot (.) at the end

#### Body
Just as in the subject, use the imperative, present tense: "change" not "changed" nor "changes". The body should include the motivation for the change and contrast this with previous behavior.

#### Footer
The footer should contain any information about **Breaking Changes** and is also the place to reference issues that this commit **Closes**.

**Breaking Changes** should start with the word `BREAKING CHANGE: ` with a space or two newlines. The rest of the commit message is then used for this.

