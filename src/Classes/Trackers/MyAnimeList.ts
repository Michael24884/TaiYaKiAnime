import AsyncStorage from '@react-native-async-storage/async-storage';
import {MyAnimeListLoginModel} from '../../Models/MyAnimeList/basic';
import {
  TaiyakiUserModel,
  UserModel,
  WatchingStatus,
} from '../../Models/taiyaki';
import {TrackerBase} from './Trackers';
import qs from 'qs';
import {MALListStatus, MALUserModel} from '../../Models/MyAnimeList';
import {useUserProfiles} from '../../Stores';
import {MapWatchingStatusToMAL} from '../../Util';

type TokenResponse = {
  token_type: 'Bearer';
  expires_in: number;
  access_token: string;
  refresh_token: string;
};

export class MyAnimeList implements TrackerBase {
  async updateStatus(
    id: number,
    episodesWatched: number,
    status: WatchingStatus,
    score?: number,
    startedAt?: Date,
    completedAt?: Date,
  ): Promise<void> {
    //NOTE: MyAnimeList currently does not let users update start/end date through the api
    const token = (await this.getData()).bearerToken;
    const query: Record<string, string | number> = {
      status: MapWatchingStatusToMAL.get(status) ?? 'plan_to_watch',
      num_watched_episodes: episodesWatched,
    };

    //Convert 75 -> 7.5, 82 -> 8.2, 100 -> 10, etc...
    if (score) query.score = score * 0.1;
    if (startedAt) {
      if (isNaN(startedAt.getTime())) return;
      const dateString = startedAt.toLocaleDateString([], {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      });
      const day = new Date(dateString).toLocaleDateString([], {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
      const splits = day.split('/');
      const formattedDate = splits[2] + '-' + splits[0] + '-' + splits[1];
      query.start_date = formattedDate.toString();
    }
    if (completedAt) {
      if (isNaN(completedAt.getTime())) return;
      const dateString = completedAt.toLocaleDateString([], {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      });
      const day = dateString.split('/');
      const formattedDate = day[2] + '-' + day[0] + '-' + day[1];
      query.end_date = formattedDate;
    }

    const headers = {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    await fetch(`https://api.myanimelist.net/v2/anime/${id}/my_list_status`, {
      method: 'PUT',
      headers,
      body: qs.stringify(query),
    });
  }
  async getData(): Promise<TaiyakiUserModel> {
    const file = await AsyncStorage.getItem('auth');
    if (file) {
      const json = JSON.parse(file) as TaiyakiUserModel[];
      const user = json.find((i) => i.source === 'MyAnimeList');
      const tokenWatch = await this.tokenWatch();
      user!.bearerToken = tokenWatch;
      return user!;
    } else
      throw new Error(
        'Not possible to fetch user data, something might be corrupted',
      );
  }
  async fetchProfile(): Promise<void> {
    const token = (await this.getData()).bearerToken;
    const headers = {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json',
    };
    const response = await fetch('https://api.myanimelist.net/v2/users/@me', {
      headers,
    });
    const model = (await response.json()) as MALUserModel;
    const profileStore = useUserProfiles
      .getState()
      .profiles.find((i) => i.source === 'MyAnimeList');
    const {name, id, picture} = model;
    profileStore!.profile = {username: name, id, image: picture};
    useUserProfiles
      .getState()
      .removeProfile('MyAnimeList')
      .then(() => useUserProfiles.getState().addToProfile(profileStore!));
  }

  async tradeCodeForBearer(
    code: string,
    challenge: string,
  ): Promise<TokenResponse> {
    const authInfo = MyAnimeListLoginModel;
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    const body = {
      client_id: authInfo.clientId,
      grant_type: 'authorization_code',
      code,
      redirect_uri: authInfo.redirectUri,
      code_verifier: challenge,
    };
    const response = await fetch(authInfo.tokenUrl!, {
      headers,
      method: 'POST',
      body: qs.stringify(body),
    });
    if (response.ok) {
      return (await response.json()) as TokenResponse;
    }
    console.log(await response.json());
    throw 'The response was not ok, can not continue';
  }

  async tokenWatch(): Promise<string> {
    const file = await AsyncStorage.getItem('auth');
    if (!file) throw 'User is not signed in and reached a prohibited area';
    const model = (JSON.parse(file) as TaiyakiUserModel[]).find(
      (i) => i.source === 'MyAnimeList',
    );
    if (!model) throw 'MyAnimeList profile not found in storage';
    const date = new Date(Date.now());
    if (model.expiresIn! < date) {
      console.log('expired token');
      //Token has expired
      return await this.revalidateToken(model.refreshToken!, model.profile);
    } else return model.bearerToken;
  }

  private async revalidateToken(
    refreshToken: string,
    profile: Partial<UserModel>,
  ): Promise<string> {
    const url = 'https://myanimelist.net/v1/oauth2/token';
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    const body = {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    };
    const response = await fetch(url, {
      headers,
      method: 'POST',
      body: qs.stringify(body),
    });
    if (!response.ok)
      throw 'The refresh endpoint did not pass with a successful status code';
    const auth = (await response.json()) as TokenResponse;
    const authModel: TaiyakiUserModel = {
      bearerToken: auth.access_token,
      refreshToken: auth.refresh_token,
      expiresIn: new Date(Date.now() + auth.expires_in),
      profile,
      class: new MyAnimeList(),
      source: 'MyAnimeList',
    };
    await AsyncStorage.mergeItem('auth', JSON.stringify(authModel));
    return auth.access_token;
  }
}
