import fs from 'fs';
import path from 'path';
import fsPromises from 'fs/promises';
import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const callback = jest.fn();
    const timeout = 1000;
    const setTimeoutSpy = jest.spyOn(global, 'setTimeout');

    doStuffByTimeout(callback, timeout);
    expect(setTimeoutSpy).toHaveBeenCalledWith(callback, timeout);

    setTimeoutSpy.mockRestore();
  });

  test('should call callback only after timeout', () => {
    const callback = jest.fn();
    const timeout = 1000;

    doStuffByTimeout(callback, timeout);
    jest.advanceTimersByTime(timeout);
    expect(callback).toHaveBeenCalled();
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const callback = jest.fn();
    const interval = 1000;
    const setIntervalSpy = jest.spyOn(global, 'setInterval');

    doStuffByInterval(callback, interval);
    expect(setIntervalSpy).toHaveBeenCalledWith(callback, interval);

    setIntervalSpy.mockRestore();
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callback = jest.fn();
    const interval = 1000;

    doStuffByInterval(callback, interval);
    expect(callback).not.toHaveBeenCalled();
    jest.advanceTimersByTime(interval);
    expect(callback).toHaveBeenCalledTimes(1);
    jest.advanceTimersByTime(interval);
    expect(callback).toHaveBeenCalledTimes(2);
    jest.advanceTimersByTime(interval * 2);
    expect(callback).toHaveBeenCalledTimes(4);
  });
});

describe('readFileAsynchronously', () => {
  test('should call join with pathToFile', async () => {
    const pathToFile = 'pathToFile';
    const joinSpy = jest.spyOn(path, 'join').mockReturnValue(pathToFile);

    await readFileAsynchronously(pathToFile);
    expect(joinSpy).toHaveBeenCalledWith(__dirname, pathToFile);

    joinSpy.mockRestore();
  });

  test('should return null if file does not exist', async () => {
    const pathToFile = 'pathToFile';
    const existsSyncSpy = jest.spyOn(fs, 'existsSync').mockReturnValue(false);

    const result = await readFileAsynchronously(pathToFile);
    expect(result).toBeNull();

    existsSyncSpy.mockRestore();
  });

  test('should return file content if file exists', async () => {
    const pathToFile = 'pathToFile';
    const fileContent = 'file content';
    const existsSyncSpy = jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    const readFileSpy = jest.spyOn(fsPromises, 'readFile').mockResolvedValue(Buffer.from(fileContent));

    const result = await readFileAsynchronously(pathToFile);
    expect(result).toBe(fileContent);

    existsSyncSpy.mockRestore();
    readFileSpy.mockRestore();
  });
});
