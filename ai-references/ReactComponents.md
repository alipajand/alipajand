# React Components

- Follow code standards in `/ai-references/CodeStandards.md`
- Reusable components goes in `/components/`
- Domain related feature components goes in `/features/` and all components that are only used for this feature
- Have most of the component built for SSR and have the most minimal components to have "use client" to improve the performances
- Image should go be rendered with `next/image`
- Don't do default exports aside if it's for a Next.js page directly in `/app/` folder.
- Most logic of a component should be extracted in a custom hook. Take `/ai-references/ReactHooks.md` as reference for that. If there's only one useMemo or handler for the component's logic, it can stay in the component.
- Do dynamic imports with `next/dynamic` when it's possible to reduce chunks and load time.
- Use `import { PropsWithChildren } from 'react'` to extends the type for props for components that have `children`
- Use this for base template for components, replace `name` by the name of the component in PascalCase.

```
import { PropsWithChildren } from 'react'

interface nameProps {
  propName: string
}

export const name = ({ propName, children }: PropsWithChildren<nameProps>) => {
  return <div>{children}</div>
}
```

- In a feature domain related folder, the components should all begin with the folder's name. File structure should look like this:

```
- MyFeature
  - __tests__
    - MyFeature.spec.tsx
    - MyFeatureSubComponent.spec.tsx
  - hooks
    - __tests__
      - useMyFeature.spec.tsx
    - useMyFeature.tsx
  - MyFeature.tsx
  - MyFeatureSubComponent.tsx
```
