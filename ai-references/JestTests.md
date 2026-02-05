# Jest Tests

- Isolate the tests to keep them fast and reliable
- Use mock data and dependency injection to avoid running unnecessary code and to ensure each test remains focused on what it’s meant to verify.
- Use @testing-library/react for Rendering Components
- Mock External Dependencies and API Calls
- Use screen for Querying Elements and fireEvent to trigger events
- Only do snapshot testing for constants and things that are not dynamic
- Test react hooks with @testing-library/react-hooks
- For react hooks and react components, the first test suite inside the file's describe is for testing default values. All initial behaviors and states when it mounts.
- Each file should have one describe to contain all the tests.
- Tests should be written in a human readable way, example: "should have the correct data". The sentence should begin with "should"
- Always have proper cleanup and teardown to ensure there is no state or DOM leakage across tests.
- Mock Timers and Async Utilities for Complex State
- Write tests that cover the component’s primary behavior and user paths. Include tests for edge cases, like empty data or invalid inputs, to ensure robustness.
- Group all rendering tests, user interaction tests, and state tests in separate blocks.
