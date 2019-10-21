# React-TypeScript

Minimal boilerplate for a single-page app using MobX, React and TypeScript with TSX.

Initial run:

* `yarn`
* `yarn start`

## Running Storybook

Storybook is used for frontend testing. We will use stories as:

* Unit tests to ensure functionality at a component level
* Integration tests to ensure 'scenes' can be assembled successfully
* Tests of basic business logic

Use `yarn storybook` to start the development server. Tests should be placed in the `src/test` folder and be named `xx-[Compoent Name].stories.tsx`.
