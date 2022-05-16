# Tecnologie-Applicazioni-Web

## actually using node v.16.15.0, latest LTS available

## Code Styling Guide

A mostly reasonable approach to TypeScript based off of [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
[Code Styling Guide](https://github.com/excelmicro/typescript#excel-micro-typescript-style-guide)

### Setup of prettier and eslint for Typescript and Airbnb coding style

Sources:

- [ESLint and Prettier setup in Typescript](https://blog.logrocket.com/linting-typescript-using-eslint-and-prettier/)
- [eslint-config-airbnb-typescript](https://www.npmjs.com/package/eslint-config-airbnb-typescript)
- [ESLint Airbnb Typescript Config](https://stackoverflow.com/questions/61963749/how-to-use-eslint-typescript-airbnb-configuration)

## Structured Commit Messages Guide

We use structured commit messages to help generate changelogs and determine version numbers.

The first line of these messages is in the following format: `<type>(<scope>): <summary>`

The `(<scope>)` is optional and is often a class name. The `<summary>` should be in the present tense. </br>
The type should be one of the following:

- **feat**: A new feature from the user point of view, not a new feature for the build.
- **fix**: A bug fix from the user point of view, not a fix to the build.
- **docs**: Changes to the user documentation, or to code comments.
- **style**: Formatting, semicolons, brackets, indentation, line breaks. No change to program logic.
- **refactor**: Changes to code which do not change behavior, e.g. renaming a variable.
- **test**: Adding tests, refactoring tests. No changes to user code.
- **build**: Updating build process, scripts, etc. No changes to user code.
- **devops**: Changes to code that only affect deployment, logging, etc. No changes to user code.
- **chore**: Any other changes causing no changes to user code.

The body of the commit message (if any) should begin after one blank line. If the commit meets the definition of a major version change according to semantic versioning (e.g. a change in API visible to an external module), the commit message body should begin with `BREAKING CHANGE: <description>`.

Presence of a `fix` commit in a release should increment the number in the third (PATCH) position.
Presence of a `feat` commit in a release should increment the number in the second (MINOR) position.
Presence of a `BREAKING CHANGE` commit in a release should increment the number in the first (MAJOR) position.

This is based on <https://www.conventionalcommits.org> 
and the [Conveyal R5 Structured Commit Messages Guide](https://github.com/conveyal/r5#structured-commit-messages).
