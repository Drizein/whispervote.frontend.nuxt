import * as forge from 'node-forge';
import { plainToInstance } from 'class-transformer';
import type { FetchError } from 'ofetch';
import type { SurveyPostDto } from '~/composables/dtos/survey.post.dto';
import { SurveyGetResponseDto } from '~/composables/dtos/surveyGetResponseDto';
import type { VotePostDto } from '~/composables/dtos/vote.post.dto';

export const useVotingService = () => {
  const apiServiceVote = useApiService({ authed: true, api: 'vote' });
  const apiServiceVoteNoAuth = useApiService({ authed: false, api: 'vote' });
  const apiServiceSignature = useApiService({ authed: true, api: 'signature' });
  const showSnackbar = useSnackbar().show;

  const createSurvey = async (payload: SurveyPostDto): Promise<string> => {
    const fetchInstance = apiServiceVote.getFetch();
    let res: string = '';
    await fetchInstance<string>('/Survey/CreateSurvey', {
      method: 'POST',
      body: JSON.stringify(payload),
    }).then((response) => {
      res = response;
    }).catch((e) => {
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

  const getAllTags = async (): Promise<string[]> => {
    const fetchInstance = apiServiceVote.getFetch();
    console.log('params', fetchInstance);
    try {
      const res: string = await fetchInstance('/Survey/GetAllTags');
      return JSON.parse(res);
    }
    catch (e) {
      console.error(e);
      throw e;
    }
  };

  const getAllSurveys = async (): Promise<SurveyGetResponseDto[]> => {
    const fetchInstance = apiServiceVoteNoAuth.getFetch();
    try {
      const res: string = await fetchInstance('/Survey/GetAllSurveysSFW');
      const plain = JSON.parse(res);
      const pti = plainToInstance(SurveyGetResponseDto, plain);
      // check if pti is an array
      if (Array.isArray(pti)) {
        return pti;
      }
      else {
        return [pti];
      }
    }
    catch (e) {
      console.error(e);
      throw e;
    }
  };

  const getAllSurveysExcludedByTags = async (tags: string[]): Promise<SurveyGetResponseDto[]> => {
    const fetchInstance = apiServiceVote.getFetch();

    const res: string = await fetchInstance('/Survey/GetAllSurveysExcludedByTags', {
      params: {
        tags: tags,
      },
    });
    const plain = JSON.parse(res);
    const pti = plainToInstance(SurveyGetResponseDto, plain);
    // check if pti is an array
    if (Array.isArray(pti)) {
      return pti;
    }
    else {
      return [pti];
    }
  };

  const generateSignatureKey = async (): Promise<string> => {
    const fetchInstance = apiServiceSignature.getFetch();
    return fetchInstance<string>('/Key/GenerateKey', {
      method: 'POST',
    });
  };

  function encrypt(publicKey: string, data: string): string {
    // Convert the PEM-formatted public key to a forge public key object
    const publicKeyObj = forge.pki.publicKeyFromPem(
      `-----BEGIN PUBLIC KEY-----
${publicKey}
-----END PUBLIC KEY-----`);

    // Encrypt the data
    const encrypted = publicKeyObj.encrypt(data, 'RSA-OAEP');

    // Encode the encrypted data as base64
    return forge.util.encode64(encrypted);
  }

  const vote = async (
    surveyKey: string,
    surveyId: string,
    optionId: string,
  ) => {
    const token = useAuthToken();
    const fetchInstance = apiServiceSignature.getFetch();
    const payload: VotePostDto = {
      message: encrypt(surveyKey, optionId),
      surveyId,
    };
    const generatedKey = await generateSignatureKey();
    const tokenPayload: string = token.getTokenPayload(token.getAuthToken()!.token!);
    const userId = (tokenPayload as any)['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
    const finalPayload = {
      message: encrypt(generatedKey, JSON.stringify(payload)),
      userId: userId,
    };
    let res: string = '';
    await fetchInstance<string>('/Message/ProcessMessage', {
      method: 'POST',
      body: finalPayload,
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

  async function addTagsToSurvey(surveyId: string, tags: string[]) {
    const fetchInstance = apiServiceVote.getFetch();
    return await fetchInstance<string>('/Survey/AddNewTagsToSurvey', {
      method: 'PATCH',
      body: JSON.stringify({
        surveyId,
        tags,
      }),
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
  }

  return { createSurvey, getAllSurveys, getAllSurveysExcludedByTags, generateSignatureKey, vote, getAllTags, addTagsToSurvey };
};
