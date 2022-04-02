# <span style="color: rgb(235, 85, 69); font-weight: 900">Contributing to Honey Finance

This document is intended for developers interested in making contributions to the Honey Finance Front-end and to document our internal with respect to processes and standards regarding e.g. releasing a new version.

## <span style="color: rgb(235, 85, 69); font-weight: 900">Getting Started

These steps will help you to set up your development environment. That includes all dependencies we use to build the Honey Finance Front-end (and developer tooling like git commit hooks).

Before completing the below stated steps [please see the requirements]() in order to run the project successfully.

1. Clone the git repository: 
```bash
git clone git@github.com:honey-labs/honey-frontend.git
```
2. Navigate into the cloned folder: 
```bash 
cd honey-frontend/
```
3. Install all dependencies: 
```bash 
yarn install 
```
4. Spin up the local environment:
```bash
yarn dev
```

## <span style="color: rgb(235, 85, 69); font-weight: 900">The Repo Structure
This repository contains the structure of the Honey Finance Front-end. Please note that this documentation is still a WIP. The Honey Finance Front-end can be divided into two stacks, the <b style="color: rgb(235, 85, 69); font-weight: 900">main-stack</b> and the <b style="color: rgb(235, 85, 69); font-weight: 900">sub-stack</b>. The main-stack consists of the following technologies:
- <a href="https://nextjs.org/" target="_blank">Next.JS</a>
- <a href="https://create-react-app.dev/">Create-react-app</a>
- <a href="https://www.typescriptlang.org/" target="_blank">Typescript</a>


#### <span style="color: rgb(235, 85, 69); font-weight: 900">Main stack structure</span>
The main-stack uses Next.JS underneath the hood which is the main wrapper of the whole application. Next.JS has a file system based router built on the concept of pages. Whenever a new file is added to the `pages` directory it automatically becomes available as a route. To find a more detailed overview of routing within Next.JS please visit the following <a href="https://nextjs.org/docs/routing/introduction" target="_blank">link</a>

The root of the project is listed in `pages/app.tsx`. This file contains the logic of importing and wrapping the application with respect to packages / SDKs and other third party services. The file which is then being served as main (index) of the project is called; index.tsx `pages/index.tsx`. Next.JS automatically serves this page as the root of the project. This page renders out the home page of Honey Finance. Apart from the `index.tsx` file you can find a folder which is named `pages`. Each page inside this folder makes uses of a styles component which lives inside the `~/styles` folder. These styling components figure as the core stylers for the overall page layout. However, when components are being imported there are custom stylecomponents being written to style them separately. 

#### <span style="color: rgb(235, 85, 69); font-weight: 900">Sub stack structure</span>
- Degen
- Vanilla
- Other tooling which is being used

## <span style="color: rgb(235, 85, 69); font-weight: 900">Coding Standards
- Structure of components
- Declaration of constants and variables
- 
## <span style="color: rgb(235, 85, 69); font-weight: 900">Creating a branch
## <span style="color: rgb(235, 85, 69); font-weight: 900">How to create an issue
## <span style="color: rgb(235, 85, 69); font-weight: 900">Tests
The Honey Finance Front-end makes use of two frameworks regarding testing: 
- Jest
- React Testing Library

<b>Jest</b> a framework that will actually run our test. Jest runs in a headless mode which means it doenst actually opens a browser. It uses JSDOM under the hood to render out the components. So we dont have access to the window object. 
<b>React Testing Library takes each of our react components and gives us the 'end' result as in how the user will see it. So this is more regarding the UI part, as we can also interact with all the components.
</b>

`jest.setup.js`: 

****
as well as ... (EXAMPLE: several addons like the debugging package). This is reflected in the directory structure of this repository. Each package has a `src/` folder where the source code can be found, a `test` folder for all sorts of tests that check if the code in `src/` is correct, and a `dist/` folder where you can find the bundled artifacts. Note that the `dist/` folder may not be present initially. It will be created as soon as you run any of the build scripts inside `package.json`. 

A quick overview of our repository (or ideally how it should become):

```bash
# The repo root (folder where you cloned the repo into)
/
  src/  # Source code of our core
  test/ # Unit tests for core
  dist/ # Build artifacts for publishing on npm (may not be present)

  # Sub-package, can be imported via `preact/compat` by users.
  # Compat stands for react-compatibility layer which tries to mirror the
  # react API as close as possible (mostly legacy APIs)
  compat/
  	src/  # Source code of the compat addon
  	test/ # Tests related to the compat addon
  	dist/ # Build artifacts for publishing on npm (may not be present)
  
  # Sub-package, can be imported via `preact/hooks` by users.
  # The hooks API is an effect based API to deal with component lifcycles.
  # It's similar to hooks in React
  hooks/
  	src/  # Source code of the hooks addon
  	test/ # Tests related to the hooks addon
  	dist/ # Build artifacts for publishing on npm (may not be present)
  
  # Sub-package, can be imported via `preact/debug` by users.
  # Includes debugging warnings and error messages for common mistakes found
  # in Preact application. Also hosts the devtools bridge
  debug/
  	src/  # Source code of the debug addon
  	test/ # Tests related to the debug addon
  	dist/ # Build artifacts for publishing on npm (may not be present)
  
  # Sub-package, can be imported via `preact/test-utils` by users.
  # Provides helpers to make testing Preact applications easier
  test-utils/
  	src/  # Source code of the test-utils addon
  	test/ # Tests related to the test-utils addon
  	dist/ # Build artifacts for publishing on npm (may not be present)
  
  # A demo application that we use to debug tricky errors and play with new
  # features.
  demo/
  
  # Contains build scripts and dependencies for development
  package.json
```
## Example explainers: -- core devs should fill this in

### What does `XYZ.json` do?

It's a special file that can be used to ... Because each sub-package has it's own distribution files we need to ensure that the variable names stay consistent across bundles.

## What does `XYZ.js` do?

...

## Important Branches and examples of branch management

We merge every PR into the `development` branch. Once changes are final and tested we merge the `development` branch with the `main` branch to update the site. 

We prefer to have branches structured as:
/feature/lending-page-layout/fetching-nfts
/enhancement/farm-page/adding-cache
/type/page/xyz

TODO:
## Creating your first Pull-Request

We try to make it as easy as possible to contribute to Honey Finance by... 

Once a PR or a Draft PR has been created our community and devs will be given time to join the discussion about the proposed change. 
Sometimes that includes ideas for test cases or even different ways to go about implementing a feature. Often this also includes ideas on how to make the code smaller/more efficient. 

When everything is good to go someone will approve the PR and the changes will be merged into the `development` branch and we usually merge with `main` a week or two later.

_The big takeaway for you here is, that we will guide you along the way. We're here to help to make a PR ready for approval!_

The short summary is:

1. Make changes and submit a PR
2. Modify change according to feedback (if there is any)
3. PR will be merged into `development`
4. A new release will be merged with `main` (every 2-3 weeks).

TODO: share tips
## Tips for getting to know the code base

- XYZ 
- XYZ

TODO: change examples
## FAQ -- change examples!

### Why does the JSDoc use TypeScript syntax to specify types?

Several members of the team are very fond of TypeScript and we wanted to leverage as many of its advantages, like improved autocompletion, for Preact. We even attempted to port Preact to TypeScript a few times, but we ran into many issues with the DOM typings. Those would force us to fill our codebase with many `any` castings, making our code very noisy.

Luckily TypeScript has a mode where it can somewhat reliably typecheck JavaScript code by reusing the types defined in JSDoc blocks. It's not perfect and it often has trouble inferring the correct types the further one strays away from the function arguments, but it's good enough that it helps us a lot with autocompletion. Another plus is that we can make sure that our TypeScript definitons are correct at the same time.

Check out the [official TypeScript documentation](https://www.typescriptlang.org/docs/handbook/type-checking-javascript-files.html) for more information.

_Note that we have separate tests for our TypeScript definition files. We only use `ts-check` for local development and don't check it anywhere else like on the CI._

### Why does the code base often use `let` instead of `const`?

There is no real reason for that other a historical one. Back before auto-formatting via prettier was a thing and minifiers weren't as advanced as they are today we used a pretty terse code-style. The code-style deliberately was aimed at making code look as concise and short as possible. The `let` keyword is a bit shorter than `const` to write, so we only used that. This was done only for stylistic reasons.

This helped our minds to not lose sight of focusing on size, but made it difficult for newcomers to start contributing to Preact. For that reason alone we switched to `prettier` and loosened our rule regarding usage of `let` or `const`. Today we use both, but you can still find many existing places where `let` is still in use.

In the end there is no effect on size regardless if you use `const`, `let` or use both. Our code is downtranspiled to `ES5` for npm so both will be replaced with `var` anyways. Therefore it doesn't really matter at all which one is used in our codebase.

This will only become important once shipping modern JavaScript code on npm becomes a thing and bundlers follow suit.

TODO: give tips for bug reports
## How to create a good bug report

To be able to fix issues we need to see them on our machine. This is only possible when we can reproduce the error. The easiest way to do that is narrow down the problem to specific components or combination of them. This can be done by removing as much unrelated code as possible.

The perfect way to do that is to make a [codesandbox](https://codesandbox.io/). That way you can easily share the problematic code and ensure that others can see the same issue you are seeing.

TODO: add email and discord
## I have more questions on how to contribute to Honey Finance. How can I reach you?

We closely watch our issues and have a pretty active [Discord](XYZ). Nearly all our communication happens via these two forms of communication.

TODO: create release notes
## Writing release notes -- example

The release notes have become a sort of tiny blog post about what's
happening in preact-land. The title usually has this format:

```txt
Version Name
```

Example:

```txt
10.0.0-beta.1 Los Compresseros
```

The name is optional, we just have fun finding creative names :wink:

To keep them interesting we try to be as
concise as possible and to just reflect where we are. There are some
rules we follow while writing them:

- Be nice, use a positive tone. Avoid negative words
- Show, don't just tell.
- Be honest.
- Don't write too much, keep it simple and short.
- Avoid making promises and don't overpromise. That leads to unhappy users
- Avoid framework comparisons if possible
- Highlight awesome community contributions (or great issue reports)
- If in doubt, praise the users.

After this section we typically follow with a changelog part that's
divided into 4 groups in order of importance for the user:

- Features
- Bug Fixes
- Typings
- Maintenance

We generate it via this handy cli program: [changelogged](https://github.com/marvinhagemeister/changelogged). It will collect and format
the descriptions of all PRs that have been merged between two tags.
The usual command is `changelogged 10.0.0-rc.2..HEAD` similar to how
you'd diff two points in time with git. This will get you 90% there,
but you still need to divide it into groups. It's also a good idea
to unify the formatting of the descriptions, so that they're easier
to read and don't look like a mess.