// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyFn = (...args: any[]) => any;

/**
 * Wrapper factory called once per method. Returns the function that replaces it.
 * @param original  The original function.
 * @param moduleName  The name of the module (e.g. "openai").
 * @param methodName  The method being patched (e.g. "createCompletion").
 */
export type MethodWrapper = (
  original: AnyFn,
  moduleName: string,
  methodName: string,
) => AnyFn;