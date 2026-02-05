# Code standards

- Should use camelCase names everywhere aside in the input of factories functions
- Order the imports by having the npm packages at the top and have local files below that
- Let typescript infer the types as most as possible, but have react components props and hooks returns always defined
- React Components logic should be contained in a hook
- Put space between types of code, in hooks, defined the state in the upper section of the hook. Between states, handler functions, useEffects and `return`, put line breaks.
- For React Components, create components tests with Jest and @testing-library/react, have 100% test coverage
- For Hooks, create hook tests with Jest and @testing-library/react, have 100% test coverage
- Reusable hooks that are not linked to a specific part of a feature or a request, like `useDebouncedValue` should be in `/utils/hooks/`.
- For resuable functions that are not linked to a specific part of a feature or a request, like `getColorByRarity` should be in `/utils/` and follow `/ai-references/UtilsFunctions.md`.
- Reusables components goes in `/components/` folder and domain related feature component goes in `/features/` with everything that is only used in the feature.
- When a function needs more than one argument, have them all in an object.
- Prioritize the use of `@tanstack/react-query` and React's Context API over Zustand store.
- Use most of the components from `@alwaysgeeky-games/shared-ui-components`
- Use Tailwind CSS for styling
- Remove all dumb comments like `// on click handler`
