# Tecnologie-Applicazioni-Web

## actually using node v.16.15.0, latest LTS available

## Structured Commit Messages

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

This is based on <https://www.conventionalcommits.org> and the [Conveyal R5 Structured Commit Guide](https://github.com/conveyal/r5#structured-commit-messages).
