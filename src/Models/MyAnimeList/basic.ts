import {LoginConfigModel} from '../taiyaki';

import {MYANIMELIST_CLIENT_ID} from '@env';

export function randomCodeChallenge(maxLength?: number): string {
  const MAX_LENGTH = maxLength ?? 88;
  let code = '';
  const codes =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const randomPicker = (): number => {
    return Math.floor(Math.random() * codes.length);
  };
  for (let index = 0; index < MAX_LENGTH; index++) {
    code += codes.charAt(randomPicker());
  }
  return code;
}

const randomCode = randomCodeChallenge();
export const MyAnimeListLoginModel: LoginConfigModel = {
  clientId: MYANIMELIST_CLIENT_ID,
  redirectUri: 'taiyaki://myanimelist/redirect',
  authUrl:
    `https://myanimelist.net/v1/oauth2/authorize?response_type=code&client_id=${MYANIMELIST_CLIENT_ID}&redirect_uri=taiyaki://myanimelist/redirect&code_challenge_method=plain&code_challenge='`+
    randomCode,
  tokenUrl: 'https://myanimelist.net/v1/oauth2/token',
  randomCode,
};
