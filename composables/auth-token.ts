import { jwtDecode } from 'jwt-decode';

export const useAuthToken = () => {
  const setAuthToken = (token: string) => {
    const decodedToken = getTokenPayload(token);
    const expiresAt = decodedToken.exp * 1000;
    const userRole = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    useTokenStore().token = { token, expiresAt, userRole };
  };

  const getAuthToken = (): AuthToken | undefined => {
    if (useTokenStore().token === undefined) {
      return undefined;
    }
    return useTokenStore().token;
  };

  const getTokenPayload = (token: string): any => {
    return jwtDecode(token);
  };

  const getUserRole = () => {
    const token = getAuthToken();
    if (token === undefined) {
      return undefined;
    }
    return token.userRole;
  };

  const getTokenExpired = () => {
    const token = getAuthToken();
    if (!token) {
      return true;
    }
    return Date.now() >= token.expiresAt;
  };

  const removeAuthToken = () => {
    useTokenStore().token = undefined;
  };

  return { setAuthToken, getAuthToken, getTokenPayload, getTokenExpired, removeAuthToken, getUserRole };
};

export const useTokenStore = defineStore('tokenStore', () => {
  const token: Ref<AuthToken | undefined> = ref(undefined);

  return { token };
}, { persist: true });

export interface AuthToken {
  token: string;
  expiresAt: number;
  userRole: string;
}
