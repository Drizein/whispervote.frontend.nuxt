import type { FetchError } from 'ofetch';
import type { LoginPostDto } from '~/composables/dtos/login.post.dto';
import type { RegisterPostDto } from '~/composables/dtos/register.post.dto';
import { useApiService } from '~/composables/api';
import type { RequestRoleChangePostDTO } from '~/composables/dtos/RequestRoleChangePostDTO';
import type { CloseRequestPostDTO } from '~/composables/dtos/CloseRequestPostDTO';
import { ChangeRoleRequestGetResponseDto } from '~/composables/dtos/ChangeRoleRequestGetResponseDto';

export const useUserService = () => {
  const api = useApiService({ authed: false, api: 'auth' });
  const votingApi = useApiService({ authed: true, api: 'vote' });
  const showSnackbar = useSnackbar().show;

  const login = async (payload: LoginPostDto): Promise<string> => {
    const fetchInstance = api.getFetch();
    let res: string = '';
    await fetchInstance<string>('/Login/Login', {
      method: 'POST',
      body: payload,
    }).then((response) => {
      res = response;
    })
      .catch((e: FetchError) => {
        if (e.status === 401) {
          useAuthToken().removeAuthToken();
          navigateTo('/account/login');
        }
        if (typeof e.data !== 'string') {
          showSnackbar({
            message: 'Ein unbekannter Fehler ist aufgetreten.',
            mode: 'error',
          });
          throw e;
        }
        showSnackbar({
          message: e.data,
          mode: 'error',
        });
        throw e;
      });
    return res;
  };

  const register = async (payload: RegisterPostDto) => {
    const fetchInstance = api.getFetch();
    let res: string = '';
    await fetchInstance<string>('/Register/Register', {
      method: 'POST',
      body: payload,
    }).then((response) => {
      res = response;
    }).catch((e: FetchError) => {
      if (e.status === 401) {
        useAuthToken().removeAuthToken();
        navigateTo('/account/login');
      }
      if (typeof e.data !== 'string') {
        showSnackbar({
          message: 'Ein unbekannter Fehler ist aufgetreten.',
          mode: 'error',
        });
        throw e;
      }
      showSnackbar({
        message: e.data,
        mode: 'error',
      });
      throw e;
    });
    showSnackbar({
      message: res,
      mode: 'success',
    });
    return res;
  };

  const getAllOpenRoleChangeRequests = async (): Promise<ChangeRoleRequestGetResponseDto[]> => {
    const fetchInstance = votingApi.getFetch();
    let res: string = '[]';
    await fetchInstance<string>('/User/GetAllOpenRequests')
      .then((response) => {
        res = response;
      })
      .catch((e: FetchError) => {
        if (e.status === 401) {
          useAuthToken().removeAuthToken();
          navigateTo('/account/login');
        }
        if (typeof e.data !== 'string') {
          showSnackbar({
            message: 'Ein unbekannter Fehler ist aufgetreten.',
            mode: 'error',
          });
          return;
        }
        showSnackbar({
          message: e.data,
          mode: 'error',
        });
        return;
      });
    const plain = JSON.parse(res);
    const pti = plain.map((x: any) => new ChangeRoleRequestGetResponseDto(x));
    if (!Array.isArray(pti)) {
      return [pti];
    }
    else {
      return pti;
    }
  };

  const requestRoleChange = async (payload: RequestRoleChangePostDTO) => {
    const fetchInstance = votingApi.getFetch();
    let res: string = '';
    await fetchInstance<string>('/User/RequestRoleChange', {
      method: 'POST',
      params: {
        role: payload.role,
        reason: payload.reason,
      },
    })
      .then((response) => {
        res = response;
      })
      .catch((e: FetchError) => {
        if (e.status === 401) {
          useAuthToken().removeAuthToken();
          navigateTo('/account/login');
        }
        if (typeof e.data !== 'string') {
          showSnackbar({
            message: 'Ein unbekannter Fehler ist aufgetreten.',
            mode: 'error',
          });
          throw e;
        }
        showSnackbar({
          message: e.data,
          mode: 'error',
        });
        throw e;
      });
    showSnackbar({
      message: res,
      mode: 'success',
    });
    return res;
  };

  const closeRoleChangeRequest = async (payload: CloseRequestPostDTO) => {
    const fetchInstance = votingApi.getFetch();
    let res: string = '';
    await fetchInstance<string>('/User/CloseRequest', {
      method: 'POST',
      params: {
        requestUserId: payload.requestUserId,
        isAccepted: payload.isAccepted,
      },
    }).then((response) => {
      res = response;
    }).catch((e: FetchError) => {
      if (e.status === 401) {
        useAuthToken().removeAuthToken();
        navigateTo('/account/login');
      }
      if (typeof e.data !== 'string') {
        showSnackbar({
          message: 'Ein unbekannter Fehler ist aufgetreten.',
          mode: 'error',
        });
        throw e;
      }
      showSnackbar({
        message: e.data,
        mode: 'error',
      });
      throw e;
    });
    showSnackbar({
      message: res,
      mode: 'success',
    });
    return res;
  };

  return { login, register, getAllOpenRoleChangeRequests, requestRoleChange, closeRoleChangeRequest };
};
