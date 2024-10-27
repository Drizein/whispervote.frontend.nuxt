import type { FetchError } from 'ofetch';
import { ReportGetDto } from '~/composables/dtos/Report.get.dto';
import type { ReportSurveyPostDto } from '~/composables/dtos/ReportSurvey.post.dto';
import type { CloseReportPostDto } from '~/composables/dtos/CloseReport.post.dto';

export const useReportService = () => {
  const fetch = useApiService({ authed: true, api: 'vote' }).getFetch();
  const showSnackbar = useSnackbar().show;

  const getAllOpenReports = async (): Promise<ReportGetDto[]> => {
    let res: string = '[]';
    await fetch<string>('/Report/GetAllOpenReports')
      .then((response) => {
        res = response;
      })
      .catch((e: FetchError) => {
        console.error(e);
        useAuthToken().removeAuthToken();
        if (e.status === 401) navigateTo('/account/login');
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
    const pti = plain.map((x: any) => new ReportGetDto(x));
    if (!Array.isArray(pti)) {
      return [pti];
    }
    else {
      return pti;
    }
  };

  const reportSurvey = async (payload: ReportSurveyPostDto): Promise<string> => {
    let res: string = '';
    await fetch<string>('/Report/ReportSurvey', {
      method: 'POST',
      body: JSON.stringify(payload),
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

  const closeReport = async (payload: CloseReportPostDto): Promise<string> => {
    let res: string = '';
    await fetch<string>('/Report/CloseReport', {
      method: 'POST',
      body: JSON.stringify(payload),
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

  return { getAllOpenReports, reportSurvey, closeReport };
};
