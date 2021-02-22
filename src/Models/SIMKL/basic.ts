import {LoginConfigModel} from '../taiyaki';
import {SIMKL_CLIENT_SECRET, SIMKL_CLIENT_ID} from '@env';

export const SIMKLLoginConfigModel: LoginConfigModel = {
  authUrl:
    'https://simkl.com/oauth/authorize?response_type=code&client_id=b3392816b2f405397aa0721dc2af589e2ed6f71d333abd6200ae19a56d9bc685&redirect_uri=taiyaki://simkl/redirect',
  clientId: SIMKL_CLIENT_ID,
  clientSecret: SIMKL_CLIENT_SECRET,
  redirectUri: 'taiyaki://simkl/redirect',
  tokenUrl: 'https://api.simkl.com/oauth/token',
};
