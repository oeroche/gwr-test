export type UseCase<D extends Record<string, any>, A, R> = (
  Deps: D,
) => (args: A) => R | Promise<R>;

export type useCaseFn<U extends UseCase<any, any, any>> = ReturnType<U>;
