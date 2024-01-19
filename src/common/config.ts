export const authConfig = {
  jwt: {
    secret: process.env.JWT_SECRET || 'secret',
    signOptions: { expiresIn: '1d' },
  },
};

export const postgresConfig = {
  connection:
    process.env.DATABASE_URL ||
    'postgres://user:password@localhost:5432/ody-test',
};
