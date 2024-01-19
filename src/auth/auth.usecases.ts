import { useCaseFn } from '@/domain/usecases/base.usecase';
import { generateAccountKey } from '@/domain/usecases/generateAccountKey.usecase';

export type AuthUseCases = {
  generateApiKey: useCaseFn<typeof generateAccountKey>;
};

export const AuthUseCases = Symbol('AuthUseCases');
