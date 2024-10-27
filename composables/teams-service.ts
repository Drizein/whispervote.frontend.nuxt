import type { FetchError } from 'ofetch';
import type { RoleEnum } from '~/composables/dtos/teamMember.dto';
import { TeamMemberDto } from '~/composables/dtos/teamMember.dto';

export function useTeamsService() {
  const api = useApiService({
    api: 'auth',
    authed: true,
  }).getFetch();
  const showSnackbar = useSnackbar().show;

  async function getTeams(): Promise<TeamMemberDto[]> {
    let res: string = '[]';
    await api<string>('/User/getTeamMembers', {
      headers: {
        Authorization: `Bearer ${useAuthToken().getAuthToken()?.token}`,
      },
    }).then((response) => {
      res = response;
    }).catch((error: FetchError) => {
      if (error.status === 401) {
        useAuthToken().removeAuthToken();
        navigateTo('/account/login');
        throw error;
      }
      if (typeof error.data !== 'string') {
        showSnackbar({
          message: 'Ein unbekannter Fehler ist aufgetreten.',
          mode: 'error',
        });
        throw error;
      }
      showSnackbar({
        message: error.data,
        mode: 'error',
      });
      throw error;
    });
    const json: any[] = JSON.parse(res);
    return json.map((item) => {
      return new TeamMemberDto(item);
    });
  }

  async function changeRoleForTeamMember(id: string, role: RoleEnum): Promise<void> {
    let res: string = '';
    await api<string>('/User/changeRoleForUser', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${useAuthToken().getAuthToken()?.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: id,
        role: role,
      }),
    }).then((response) => {
      res = response;
    }).catch((error: FetchError) => {
      if (error.status === 401) {
        useAuthToken().removeAuthToken();
        navigateTo('/account/login');
        throw error;
      }
      if (typeof error.data !== 'string') {
        showSnackbar({
          message: 'Ein unbekannter Fehler ist aufgetreten.',
          mode: 'error',
        });
        throw error;
      }
      showSnackbar({
        message: error.data,
        mode: 'error',
      });
      throw error;
    });
    showSnackbar({
      message: res,
      mode: 'success',
    });
  }

  return {
    getTeams, changeRoleForTeamMember,
  };
}
