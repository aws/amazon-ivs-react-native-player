# Contributing Guidelines

Thank you for your interest in contributing to our project. Whether it's a bug report, new feature, correction, or additional
documentation, we greatly value feedback and contributions from our community.

Please read through this document before submitting any issues or pull requests to ensure we have all the necessary
information to effectively respond to your bug report or contribution.

## Reporting bugs/feature requests

We welcome you to use the GitHub issue tracker to report bugs or suggest features.

When filing an issue, please check existing open, or recently closed, issues to make sure somebody else hasn't already
reported the issue. Please try to include as much information as you can. Details like these are incredibly useful:

- A reproducible test case or series of steps
- The version of our code being used
- Any modifications you've made relevant to the bug
- Anything unusual about your environment or deployment

## Development workflow

To get started with the project, run `yarn` in the root directory to install the required dependencies for each package:

```sh
yarn
```

While developing, you can run the [example app](/example/) to test your changes.

To start the packager:

```sh
yarn example start
```

To run the example app on Android:

```sh
yarn example android
```

To run the example app on iOS:

```sh
yarn example ios
```

Make sure your code passes TypeScript and ESLint. Run the following to verify:

```sh
yarn typescript
yarn lint
```

To fix formatting errors, run the following:

```sh
yarn lint --fix
```

Remember to add tests for your change if possible. Run the unit tests by:

```sh
yarn test
```

When updating/changing Typescript types, please remember to also update their Flow equivalents.

To edit the Swift files, open `example/ios/AmazonIvsExample.xcworkspace` in XCode and find the source files at `Pods > Development Pods > amazon-ivs-react-native-player`.

To edit the Kotlin files, open `example/android` in Android studio and find the source files at `amazonivsreactnativeplayer` under `Android`.

### Commit message convention

We follow the [conventional commits specification](https://www.conventionalcommits.org/en) for our commit messages:

- `fix`: bug fixes, e.g. fix crash due to deprecated method.
- `feat`: new features, e.g. add new method to the module.
- `refactor`: code refactor, e.g. migrate from class components to hooks.
- `docs`: changes into documentation, e.g. add usage example for the module..
- `test`: adding or updating tests, e.g. add integration tests using detox.
- `chore`: tooling changes, e.g. change CI config.

Our pre-commit hooks verify that your commit message matches this format when committing.

### Linting and tests

[ESLint](https://eslint.org/), [Prettier](https://prettier.io/), [TypeScript](https://www.typescriptlang.org/)

We use [TypeScript](https://www.typescriptlang.org/) for type checking, [ESLint](https://eslint.org/) with [Prettier](https://prettier.io/) for linting and formatting the code, and [Jest](https://jestjs.io/) for testing.

Our pre-commit hooks verify that the linter and tests pass when committing.

### e2e testing

The package includes e2e Detox tests for iOS and Android.

To run tests locally on Android:

- First, you need to install detox on your machine - https://github.com/wix/Detox
- Trigger `yarn e2e:build:android` to build the app. To test app in release mode use `yarn e2e:build:android:release` script
- Make sure you have opened Android emulator. Your emulator name should be the same as in `.detoxrc.json` configuration file - `devices > emulator` section for development and `devices > emulator` for release
- If you test the app in debug mode run the packager - `yarn start` in `/example`
- Run `yarn e2e:test:android` or `yarn e2e:test:android:release` to trigger tests

To run tests locally on iOS:

- First, you need to install detox on your machine - https://github.com/wix/Detox
- Trigger `yarn e2e:build:ios` to build the app. To test app in release mode use `yarn e2e:build:ios:release` script
- Make sure you have opened ios simulator
- If you test the app in debug mode run the packager - `yarn start` in `/example`
- Run `yarn e2e:test:ios` or `yarn e2e:test:ios:release` to trigger tests

In order to modify existing tests or create new ones open `e2e` directory. There is a separate `*.e2e.js` file for each test suite.

### Scripts

The `package.json` file contains various scripts for common tasks:

- `yarn bootstrap`: setup project by installing all dependencies and pods.
- `yarn typescript`: type-check files with TypeScript.
- `yarn lint`: lint files with ESLint.
- `yarn test`: run unit tests with Jest.
- `yarn example start`: start the Metro server for the example app.
- `yarn example android`: run the example app on Android.
- `yarn example ios`: run the example app on iOS.
- `e2e:build:android`: build android for e2e detox tests - debug mode
- `e2e:build:ios`: build ios for e2e detox tests - debug mode
- `e2e:test:android`: run Android e2e tests in Detox - debug mode
- `e2e:test:ios`: run ios e2e tests in Detox - debug mode
- `e2e:build:android:release`: build android for e2e detox tests - release mode
- `e2e:build:ios:release`: build ios for e2e detox tests - release mode
- `e2e:test:android:release`: run Android e2e tests in Detox - release mode
- `e2e:test:ios:release`: run ios e2e tests in Detox - release mode

### Sending a pull request

When you're sending a pull request:

- Prefer small pull requests focused on one change.
- Verify that linters and tests are passing.
- Review the documentation to make sure it looks good.
- Follow the pull request template when opening a pull request.
- For pull requests that change the API or implementation, discuss with maintainers first by opening an issue.

## Code of Conduct

This project has adopted the [Amazon Open Source Code of Conduct](https://aws.github.io/code-of-conduct).
For more information see the [Code of Conduct FAQ](https://aws.github.io/code-of-conduct-faq) or contact
opensource-codeofconduct@amazon.com with any additional questions or comments.

## Security issue notifications

If you discover a potential security issue in this project we ask that you notify AWS/Amazon Security via our [vulnerability reporting page](http://aws.amazon.com/security/vulnerability-reporting/). Please do **not** create a public GitHub issue.

## Licensing

See the [LICENSE](LICENSE) file for our project's licensing. We will ask you to confirm the licensing of your contribution.
