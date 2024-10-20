import { getBankAccount, InsufficientFundsError, TransferFailedError, SynchronizationFailedError } from './index';
import { random } from 'lodash';

jest.mock('lodash', () => ({
  random: jest.fn(),
}));

const mockedRandom = random as jest.MockedFunction<typeof random>;

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    const account = getBankAccount(1000);
    expect(account.getBalance()).toBe(1000);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const account = getBankAccount(1000);
    expect(() => account.withdraw(2000)).toThrow(InsufficientFundsError);
    expect(() => account.withdraw(2000)).toThrow(`Insufficient funds: cannot withdraw more than ${account.getBalance()}`);
  });

  test('should throw error when transferring more than balance', () => {
    const accountFrom = getBankAccount(1000);
    const accountTo = getBankAccount(500);
    expect(() => accountFrom.transfer(2000, accountTo)).toThrow(InsufficientFundsError);
    expect(() => accountFrom.transfer(2000, accountTo)).toThrow(`Insufficient funds: cannot withdraw more than ${accountFrom.getBalance()}`);
  });

  test('should throw error when transferring to the same account', () => {
    const account = getBankAccount(1000);
    expect(() => account.transfer(800, account)).toThrow(TransferFailedError);
    expect(() => account.transfer(800, account)).toThrow('Transfer failed');
  });

  test('should deposit money', () => {
    const account = getBankAccount(1000);
    account.deposit(700);
    expect(account.getBalance()).toBe(1700);
  });

  test('should withdraw money', () => {
    const account = getBankAccount(1000);
    account.withdraw(700);
    expect(account.getBalance()).toBe(300);
  });

  test('should transfer money', () => {
    const accountFrom = getBankAccount(1000);
    const accountTo = getBankAccount(500);
    accountFrom.transfer(700, accountTo);
    expect(accountFrom.getBalance()).toBe(300);
    expect(accountTo.getBalance()).toBe(1200);
  });

  test('fetchBalance should return number in case if request did not fail', async () => {
    mockedRandom.mockReturnValueOnce(50).mockReturnValueOnce(1);
    const account = getBankAccount(1000);
    const balance = await account.fetchBalance();
    expect(balance).toBe(50);
  });

  test('should set new balance if fetchBalance returned number', async () => {
    mockedRandom.mockReturnValueOnce(50).mockReturnValueOnce(1);
    const account = getBankAccount(1000);
    await account.synchronizeBalance();
    expect(account.getBalance()).toBe(50);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    mockedRandom.mockReturnValueOnce(50).mockReturnValueOnce(0);
    const account = getBankAccount(1000);

    let error;
    try {
      await account.synchronizeBalance();
    } catch (e: any) {
      error = e;
    }

    expect(error).toBeInstanceOf(SynchronizationFailedError);
    expect(error.message).toBe('Synchronization failed');
  });
});
