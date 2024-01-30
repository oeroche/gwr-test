export abstract class UseCase<I, O> {
  constructor(protected readonly deps: I) {}

  abstract execute(args: any): O;
}
