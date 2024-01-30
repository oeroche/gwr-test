import { User } from '../entities/User.entity';
import { UserRepo } from '../interfaces/repositories/User.repo';
import { UseCase } from './base.usecase';

export class LoginUserUseCase extends UseCase<
  { userRepo: UserRepo },
  Promise<User>
> {
  async execute({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<User> {
    const user = await this.deps.userRepo.findOne(email);
    if (!user) {
      throw new Error('User not found');
    }
    if (user.password !== password) {
      throw new Error('Wrong password');
    }
    return user;
  }
}
