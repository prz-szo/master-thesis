const API_HOST_NAME = 'https://dummyjson.com';

export type FetcherOptions<T> = {
  url: string;
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body: T;
};

type FetcherResponse<T> = [T, null] | [null, Error];

const get = async <T>({
  url,
}: Pick<FetcherOptions<T>, 'url'>): Promise<FetcherResponse<T>> => {
  const res = await fetch(`${API_HOST_NAME}${url}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    return [
      null,
      new Error(`Api GET request error: ${res.status} ${res.statusText}`),
    ];
  }

  return [await res.json(), null];
};

const mutate = async <TPayload, TData>({
  url,
  body,
  method,
}: FetcherOptions<TPayload>): Promise<FetcherResponse<TData>> => {
  const res = await fetch(`${API_HOST_NAME}${url}`, {
    method,
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    return [
      null,
      new Error(`Api ${method} request error: ${res.status} ${res.statusText}`),
    ];
  }

  const data = await res.json();
  return [data, null];
};

export const fetcher = {
  get,
  mutate,
};

export default fetcher;
