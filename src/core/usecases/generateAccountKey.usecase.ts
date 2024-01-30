import { PartnerAccountRepo } from '../interfaces/repositories/PartnerAccountRepo';
import { UserRepo } from '../interfaces/repositories/User.repo';
import { AccountKeyRepo } from '../interfaces/repositories/accountKey.repo';
import { UseCase } from './base.usecase';

export class GenerateAccountKeyAndSignSecretUseCase extends UseCase<
  {
    accountKeyRepo: AccountKeyRepo;
    partnerAccountRepo: PartnerAccountRepo;
    userRepo: UserRepo;
    generateKey: () => string | Promise<string>;
    generateSecret: () => string | Promise<string>;
    encryption: (value: string) => Promise<string>;
  },
  Promise<{ accountKey: string; signSecret: string }>
> {
  async execute({
    userId,
  }: {
    userId: string;
  }): Promise<{ accountKey: string; signSecret: string }> {
    const user = await this.deps.userRepo.findOne(userId);
    if (!user) {
      throw new Error('User not found');
    }
    const partner = await this.deps.partnerAccountRepo.findOne(
      user.partnerAccountId,
    );
    if (!partner) {
      throw new Error('Partner not found');
    }
    const key = await this.deps.generateKey();
    const signSecret = await this.deps.generateSecret();
    const encryptedKey = await this.deps.encryption(key);
    if (key === encryptedKey) {
      throw new Error('Key and encrypted key are the same');
    }
    const { id } = await this.deps.accountKeyRepo.create({
      encryptedKey: encryptedKey, // we record the encrypted key, the underlying key will not be recuparable for security reason, the provider must re-issue a new key if lost
      PartnerAccountId: partner.id,
      signSecret,
    });
    return { accountKey: `${id}_${key}`, signSecret };
  }
}
