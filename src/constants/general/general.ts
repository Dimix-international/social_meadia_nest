export const dateTimeFormat =
  /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?(([+-]\d\d:\d\d)|Z)?$/i;
export const urlFormat =
  /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;
export const emailFormat = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

export enum Roles {
  ADMIN = 'admin',
}

export const EXPIRES_TIME_ACCESS_TOKEN = '9900'; //9900 or 600000

export const EXPIRES_TIME_REFRESH_TOKEN = '19900'; //19900 or 2400000000

export const HASH_SALT_ROUNDS = 7;

export const PASSWORD_ADMIN = 'qwerty';

export enum HTTP_STATUSES {
  OK_200 = 200,
  CREATED_201 = 201,
  NO_CONTENT_204 = 204,
  BAD_REQUEST_400 = 400,
  NOT_FOUND_404 = 404,
  UNAUTHORIZED_401 = 401,
  FORBIDDEN_403 = 403,
}
