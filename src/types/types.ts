import { Request } from 'express';

export type RequestWithBody<T> = Request<{}, {}, T>;
export type RequestWithQuery<T> = Request<{}, {}, {}, T>;
export type RequestWithParams<T> = Request<T>;

export type RequestWithParamsBody<P, T> = Request<P, {}, T>;
export type RequestWithQueryParamsAndParams<T, Q> = Request<T, {}, {}, Q>;
