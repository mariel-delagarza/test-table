# Russian Nuclear Threats Table | CSIS

### Quick Start Instructions

This repo uses `node v16.9.1 (npm v8.4.1)`

@TODO: Update with final link to data: 
Data coming from `https://docs.google.com/spreadsheets/d/e/update-id-here/pub?output=csv`

Clone & Install the dependencies...

```bash
git clone git@github.com:CSIS-iLab/poni-timeline.git
cd poni-timeline
npm install
```

...then start [Rollup](https://rollupjs.org):

```bash
npm run dev
```

Navigate to [localhost:8080](http://localhost:8080). You should see your app running. Edit a component file in `src`, save it, and reload the page to see your changes.

---

### Building and running in production mode

To create an optimised version of the app:

```bash
npm run build
```

You can run the newly built app with `npm run start`. This uses [sirv](https://github.com/lukeed/sirv), which is included in your package.json's `dependencies` so that the app will work when you deploy to platforms like [Heroku](https://heroku.com).

---

### Branching

When modifying the code base, always make a new branch. Unless it's necessary to do otherwise, all branches should be created off of `main`.

Branches should use the following naming conventions:

| Branch type               | Name                                                      | Example                     |
| ------------------------- | --------------------------------------------------------- | --------------------------- |
| New Feature               | `feature/<short description of feature>`                  | `feature/header-navigation` |
| Bug Fixes                 | `bug/<short description of bug>`                          | `bug/mobile-navigation`     |
| Configuration             | `dev/<short description of config>`                       | `dev/add-npm-package`       |
| Documentation             | `docs/<short description of documentation being updated>` | `docs/readme`               |
| Code clean-up/refactoring | `refactor/<short description>`                            | `refactor/apply-linting`    |
| Content Updates           | `content/<short description of content>`                  | `content/add-new-posts`     |

When ready to merge, submit a Pull Request into `main`. All code will be reviewed by the lead developer on the project before being merged into `main`.

Once a Pull Request is approved, squash and merge it to `main` and delete the branch.

### Commit Messages

Write clear and concise commit messages describing the changes you are making and why. If there are any issues associated with the commit, include the issue # in the commit title.

### CSS Styles

This project uses the [BEM](http://getbem.com/introduction/) naming convention.

### Formatting

This project uses [Prettier](https://prettier.io/) and the [Prettier plugin for Svelte](https://github.com/sveltejs/prettier-plugin-svelte) for consistent formatting.

### Copyright / License

Copyright © 2022 CSIS iDeas Lab under the [License](LICENSE).
