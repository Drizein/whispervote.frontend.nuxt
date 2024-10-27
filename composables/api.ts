import type { UseFetchOptions } from '#app';

export const useApiService = (options: ApiOptions) => {
  const authToken = useAuthToken();
  const runtimeConfig = useRuntimeConfig();
  const baseUrl = runtimeConfig.public.apis[options.api];

  const getFetch = <T>() => {
    if (options.authed) {
      const expired = authToken.getTokenExpired();
      if (expired) {
        navigateTo('/account/login');
      }
      return $fetch.create<T>({
        baseURL: baseUrl,
        headers: {
          Accept: 'application/json',
        },
        params: {
          jwt: authToken.getAuthToken()!.token,
        },
      });
    }
    return $fetch.create<T>({
      baseURL: baseUrl,
      headers: {
        Accept: 'application/json',
      },
    });
  };

  const getFetchComposable = <T>(url: string | (() => string), opts: UseFetchOptions<T> = {}) => {
    if (options.authed) {
      const expired = authToken.getTokenExpired();
      if (expired) {
        throw new Error('Token expired');
      }
      const defaultOpts: UseFetchOptions<T> = {
        headers: {
          Accept: 'application/json',
        },
        params: {
          jwt: authToken.getAuthToken()!.token,
        },
      };
      const mergedOpts: UseFetchOptions<T> = { ...defaultOpts, ...opts };
      return useFetch(`${baseUrl}${url}`, { ...mergedOpts });
    }
    return useFetch(`${baseUrl}${url}`, {
      ...opts,
      headers: {
        Accept: 'application/json',
        ...opts.headers,
      },
    });
  };

  return { getFetch, getFetchComposable };
};

export interface ApiOptions {
  authed: boolean;
  api: 'auth' | 'signature' | 'vote';
}
