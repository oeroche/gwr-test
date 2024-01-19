import { User } from '../entities/User.entity';
import { UserRepo } from '../interfaces/repositories/User.repo';
import { UseCase } from './base.usecase';

export const loginUserUseCase: UseCase<
  { userRepo: UserRepo },
  { email: string; password: string },
  User
> =
  ({ userRepo }) =>
  async ({ email, password }) => {
    const user = await userRepo.findOne(email);
    if (!user) {
      throw new Error('User not found');
    }
    if (user.password !== password) {
      throw new Error('Wrong password');
    }
    return user;
  };
