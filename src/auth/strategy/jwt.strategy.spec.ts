import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(() => {
    strategy = new JwtStrategy();
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('should validate payload and return user info', async () => {
    const payload = { sub: 'user-123', email: 'test@example.com' };
    const result = await strategy.validate(payload);

    expect(result).toEqual({
      userId: 'user-123',
      email: 'test@example.com',
    });
  });
});
