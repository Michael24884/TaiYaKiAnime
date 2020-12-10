import {LoginConfigModel} from '../taiyaki';

export const SIMKLLoginConfigModel: LoginConfigModel = {
  authUrl:
    'https://simkl.com/oauth/authorize?response_type=code&client_id=b3392816b2f405397aa0721dc2af589e2ed6f71d333abd6200ae19a56d9bc685&redirect_uri=taiyaki://simkl/redirect',
  clientId: 'b3392816b2f405397aa0721dc2af589e2ed6f71d333abd6200ae19a56d9bc685',
  clientSecret:
    '6b1a8afab34b47966f5a4406868c103d9685c0ab133b9ac7cd1579978e349e40',
  redirectUri: 'taiyaki://simkl/redirect',
  tokenUrl: 'https://api.simkl.com/oauth/token',
};
