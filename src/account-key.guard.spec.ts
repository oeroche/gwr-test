import { AccountKeyGuard } from './account-key.guard';

describe('AccountKeyGuard', () => {
  it('should not allow requests without an account key', () => {
    expect(async () => {
      await new AccountKeyGuard().canActivate();
    }).rejects.toThrowError();
  });
});
