import { PartnerAccountRepo } from '../interfaces/repositories/PartnerAccountRepo';
import { UserRepo } from '../interfaces/repositories/User.repo';
import { AccountKeyRepo } from '../interfaces/repositories/accountKey.repo';
import { UseCase } from './base.usecase';

export const generateAccountKey: UseCase<
  {
    accountKeyRepo: AccountKeyRepo;
    partnerAccountRepo: PartnerAccountRepo;
    userRepo: UserRepo;
    generateKey: () => string | Promise<string>;
    encryption: (value: string) => Promise<string>;
  },
  {
    userId: string;
  },
  string
> =
  ({ accountKeyRepo, partnerAccountRepo, userRepo, generateKey, encryption }) =>
  async ({ userId }) => {
    const user = await userRepo.findOne(userId);
    if (!user) {
      throw new Error('User not found');
    }
    const partner = await partnerAccountRepo.findOne(user.partnerAccountId);
    if (!partner) {
      throw new Error('Partner not found');
    }
    const key = await generateKey();
    const encryptedKey = await encryption(key);
    if (key === encryptedKey) {
      throw new Error('Key and encrypted key are the same');
    }
    const { id } = await accountKeyRepo.create({
      encryptedKey: encryptedKey, // we record the encrypted key, the underlying key will not be recuparable for security reason, the provider must re-issue a new key if lost
      PartnerAccountId: partner.id,
    });
    return `${id}_${key}`;
  };
