import {LoginConfigModel} from '../taiyaki';

export function randomCodeChallenge(): string {
  const MAX_LENGTH = 88;
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
  clientId: 'bf9c4651d0a0bd9d18c967dc29658f4f',
  redirectUri: 'taiyaki://myanimelist/redirect',
  authUrl:
    'https://myanimelist.net/v1/oauth2/authorize?response_type=code&client_id=bf9c4651d0a0bd9d18c967dc29658f4f&redirect_uri=taiyaki://myanimelist/redirect&code_challenge_method=plain&code_challenge=' +
    randomCode,
  tokenUrl: 'https://myanimelist.net/v1/oauth2/token',
  randomCode,
};
