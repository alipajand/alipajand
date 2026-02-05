# Request functions

- Requests should be made with `fetch`. `args` should be an object with `signal` in it.
- All requests function should have a factory function to format the data in a specific way to make sure the frontend won't have errors from unplanned backend data changes. Follow `/ai-references/FactoryFunctions.md` file.

```
export type FunctionNameArgs = {
  id: string
  signal: AbortSignal
}

export async function functionName({ id, signal }: FunctionNameArgs): Promise<FactoryOutputType> {
  try {
    const response = await fetch(`${url}/${id}`, {
      next: {
        revalidate: 1000, // time in ms
      },
      signal,
    });

    if (!response.ok) {
      // Handle HTTP errors
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return myOutputFactory(data);
  } catch (error) {
    // Handle network errors or JSON parsing errors
    console.error('Fetch error:', error);
    throw error; // Re-throw the error after logging it
  }
}
```
