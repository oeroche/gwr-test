export abstract class BaseRepo<T, Filters> {
  abstract findOne(id: string): Promise<T | null>;
  abstract findAll(filter: Filters): Promise<T[] | null>;
  abstract create(entity: Omit<T, 'id'>): Promise<T>;
  abstract update(id: string, entity: T): Promise<T>;
  abstract delete(id: string): Promise<T>;
}
