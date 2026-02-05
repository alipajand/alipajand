# Factory functions

Factory functions takes an input and reformat the data. Factory function files should contain the input type (or `any` if available) and should mandatory have the output type of the function.

- Factory files goes in `/utils/factories`
- Each function should do one thing and have 100% tests coverage following `/ai-references/JestTests.md`
- All properties should be in camelCase for the output.
- Can do loops to format data that are arrays
- Can have multiple function in the same file that are all related.

```
type RawInputType = {
  id: number
  name: string
  entries: any[]
  min_score: number
  max_score: number
}

type RawItemType = {
  id: string
  my_value: string
}

export type OutputType = {
  id: number
  name: string
  minScore: number
  maxScore: number
}

export type OutputItemType = {
  id: number
  name: string
}

export const functionNameItemFactory: (item: RawItemType) => OutputItemType = item => {
  const itemName = item.my_value.replaceAll("_", " ")

  return {
    id: data.id,
    name: itemName,
  }
}

export const functionNameFactory: (data: RawInputType) => OutputType = data => {
  return {
    id: data.id,
    name: data.name,
    items: data.entries.map(entry => functionNameItemFactory(entry))
    minScore: data.min_score,
    maxScore: data.max_score,
  }
}
```
