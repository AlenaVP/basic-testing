import {
  getBankAccount,
  InsufficientFundsError,
  TransferFailedError,
  SynchronizationFailedError,
} from './index';
import { random } from 'lodash';

jest.mock('lodash', () => ({
  random: jest.fn(),
}));

const mockedRandom = random as jest.MockedFunction<typeof random>;

describe('BankAccount', () => {
  let account: ReturnType<typeof getBankAccount>;
  let accountFrom: ReturnType<typeof getBankAccount>;
  let accountTo: ReturnType<typeof getBankAccount>;

  beforeEach(() => {
    jest.clearAllMocks();
    account = getBankAccount(1000);
    accountFrom = getBankAccount(1000);
    accountTo = getBankAccount(500);
  });

  test('should create account with initial balance', () => {
    expect(account.getBalance()).toBe(1000);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    expect(() => account.withdraw(2000)).toThrow(InsufficientFundsError);
    expect(() => account.withdraw(2000)).toThrow(
      `Insufficient funds: cannot withdraw more than ${account.getBalance()}`,
    );
  });

  test('should throw error when transferring more than balance', () => {
    expect(() => accountFrom.transfer(2000, accountTo)).toThrow(
      InsufficientFundsError,
    );
    expect(() => accountFrom.transfer(2000, accountTo)).toThrow(
      `Insufficient funds: cannot withdraw more than ${accountFrom.getBalance()}`,
    );
  });

  test('should throw error when transferring to the same account', () => {
    expect(() => account.transfer(800, account)).toThrow(TransferFailedError);
    expect(() => account.transfer(800, account)).toThrow('Transfer failed');
  });

  test('should deposit money', () => {
    account.deposit(700);
    expect(account.getBalance()).toBe(1700);
  });

  test('should withdraw money', () => {
    account.withdraw(700);
    expect(account.getBalance()).toBe(300);
  });

  test('should transfer money', () => {
    accountFrom.transfer(700, accountTo);
    expect(accountFrom.getBalance()).toBe(300);
    expect(accountTo.getBalance()).toBe(1200);
  });

  test('fetchBalance should return number in case if request did not fail', async () => {
    mockedRandom.mockReturnValueOnce(50).mockReturnValueOnce(1);
    const balance = await account.fetchBalance();
    expect(balance).toBe(50);
  });

  test('should set new balance if fetchBalance returned number', async () => {
    mockedRandom.mockReturnValueOnce(50).mockReturnValueOnce(1);
    await account.synchronizeBalance();
    expect(account.getBalance()).toBe(50);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    mockedRandom.mockReturnValueOnce(50).mockReturnValueOnce(0);

    let error: unknown;
    try {
      await account.synchronizeBalance();
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(SynchronizationFailedError);

    if (error instanceof SynchronizationFailedError) {
      expect((error as SynchronizationFailedError).message).toBe(
        'Synchronization failed',
      );
    } else {
      throw new Error('Unexpected error type');
    }
  });
});
