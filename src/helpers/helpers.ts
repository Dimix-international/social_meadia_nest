import { Request } from 'express';
import { atob, btoa } from 'buffer';
import { EXPIRES_TIME_REFRESH_TOKEN } from '../constants/general/general';

export const isInt = (value: number) => {
  return (
    !isNaN(+value) &&
    parseInt(String(value)) === value &&
    !isNaN(parseInt(String(value), 10))
  );
};

export const getSkip = (pageNumber: number, pageSize: number): number => {
  return (pageNumber - 1) * pageSize;
};
export const getPagesCount = (count: number, pageSize: number): number => {
  return Math.ceil(count / pageSize);
};

export const transformInNumber = (num: string, defaultValue: number) => {
  const value = parseInt(num);
  return isNaN(value) ? defaultValue : +num;
};

export const compareWithCurrentDate = (date: string): boolean => {
  return +new Date() < +new Date(date) + +EXPIRES_TIME_REFRESH_TOKEN;
};

export const parseIp = (req: Request) => {
  const reqXForwardedHeader = req.headers['x-forwarded-for'];

  if (reqXForwardedHeader) {
    if (Array.isArray(reqXForwardedHeader)) {
      return reqXForwardedHeader[0].split(',').shift();
    }
    return reqXForwardedHeader.split(',').shift();
  }

  return req.socket?.remoteAddress;
};

export const encodedBase64 = (output: string) => btoa(output);
export const decodedBase64 = (output: string) => atob(output);
