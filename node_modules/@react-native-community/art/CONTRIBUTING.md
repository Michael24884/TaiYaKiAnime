# Contributing to React Native ART

## Development Process

All work on React Native ART happens directly on GitHub. Contributors send pull requests which go through review process.

> **Working on your first pull request?** You can learn how from this _free_ series: [How to Contribute to an Open Source Project on GitHub](https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github).

1. Fork the repo and create your branch from `master` (a guide on [how to fork a repository](https://help.github.com/articles/fork-a-repo/)).
2. Run `yarn` or `npm install` to install all required dependencies.
3. Now you are ready to do the changes.

## Testing your changes

You can test your changes by installing `example` app on a simulator or device:

Installing on iOS:

- Run `yarn ios`

or

- Open `example/ios/example.xcodeproj`
- Click `run` in the top left corner of `Xcode`.

Installing on Android:

- Connect Android Device or open Android Emulator
- Run `yarn android`

## Typechecking, linting and testing

Currently we use flow for typechecking, eslint with prettier for linting and formatting the code and jest for testing.

- `yarn flow`: run flow
- `yarn lint`: run eslint and prettier
- `yarn test`: run unit tests

## Sending Pull Request

When you're sending a pull request:

- Prefer small pull requests focused on one change.
- Verify that flow, eslint and all tests are passing.
- Preview the documentation to make sure it looks good.
- Follow the pull request template when opening a pull request.

## Reporting issues

You can report issues on our [bug tracker](https://github.com/react-native-community/art/issues). Please follow the issue template when opening an issue.

## License

By contributing to React Native ART, you agree that your contributions will be licensed under its **MIT** license.
