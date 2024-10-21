import axios, { AxiosInstance } from 'axios';
import { throttledGetDataFromApi } from './index';

const relativePath = '/posts';

jest.mock('lodash', () => ({
  ...jest.requireActual('lodash'),
  throttle: jest.fn((fn) => fn),
}));

describe('throttledGetDataFromApi', () => {
  test('should create instance with provided base url', async () => {
    const axiosCreateSpy = jest.spyOn(axios, 'create').mockReturnValue({
      get: jest.fn().mockResolvedValue({ data: {} }),
    } as Partial<AxiosInstance> as AxiosInstance);

    await throttledGetDataFromApi(relativePath);
    expect(axiosCreateSpy).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });

    axiosCreateSpy.mockRestore();
  });

  test('should perform request to correct provided url', async () => {
    const axiosClient = {
      get: jest.fn().mockResolvedValue({ data: {} }),
    } as Partial<AxiosInstance> as AxiosInstance;
    jest.spyOn(axios, 'create').mockReturnValue(axiosClient);

    await throttledGetDataFromApi(relativePath);
    expect(axiosClient.get).toHaveBeenCalledWith(relativePath);
  });

  test('should return response data', async () => {
    const responseData = { id: 1, title: 'Test post' };
    const axiosClient = {
      get: jest.fn().mockResolvedValue({ data: responseData }),
    } as Partial<AxiosInstance> as AxiosInstance;
    jest.spyOn(axios, 'create').mockReturnValue(axiosClient);

    const result = await throttledGetDataFromApi(relativePath);
    expect(result).toEqual(responseData);
  });
});
