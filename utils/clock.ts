/**
 * The clock every publication surface reads. Pages call it once per render and pass the result
 * down, so one render never mixes two instants; tests pass their own `Date` instead.
 */
export const currentTime = (): Date => new Date();
