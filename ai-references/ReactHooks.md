# React Hooks

For React hooks, take this code as the boilerplate and replace `{hook name}` by the hook name in PascalCase without "use" at the beginning. Actions are for calling functions and selectors are the values.

```typescript
export interface {hook name}Selectors {}

export interface {hook name}Actions {}

export interface {hook name}Hook {
  selectors: {hook name}Selectors
  actions: {hook name}Actions
}

export function use{hook name}(): {hook name}Hook {
  return {
    selectors: {},
    actions: {},
  }
}
```

- Follow code standards in `/ai-references/CodeStandards.md`
- For requests, create a request function and use it in the hooks with @tanstack/react-query.
- Selectors should have name like `isLoading` instead of `loading` for states or `hasError` for a boolean instead of just `error`. For data, the selectors can have any name but they have to be meaningful.
- Actions must have a verb in the names like `handleCurrentPageChange`, `refetch`, `invalidateRequest`, etc...
- If there's no actions or selectors needed for a hook, you can omit the types.
- All component's logic should be in a custom hook and have 100% test coverage. Take `/ai-references/ReactComponents.md` as reference for writing components
