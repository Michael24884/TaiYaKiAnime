import {
  TaiyakiUserListModel,
  TaiyakiUserModel,
  WatchingStatus,
} from '../../Models';
import {
  SIMKLLoginConfigModel,
  SimklUserListModel,
  SimklUserModel,
} from '../../Models/SIMKL';
import {useSimklStore, useUserProfiles} from '../../Stores';
import {
  MapAnilistSeasonsToString,
  MapWatchingStatusToNative,
  MapWatchingStatusToSimkl,
  simklThumbnails,
} from '../../Util';
import {StatusInfo} from '../../Views/Components';
import {TrackerBase} from './Trackers';

export class SIMKL implements TrackerBase {
  private simklConfigs = SIMKLLoginConfigModel;
  private baseURL = 'https://api.simkl.com';

  private headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'simkl-api-key': this.simklConfigs.clientId,
  };

  private profile = useUserProfiles
    .getState()
    .profiles.find((i) => i.source === 'SIMKL');

  async tradeCodeForBearer(code: string): Promise<string> {
    const body = JSON.stringify({
      code,
      client_id: this.simklConfigs.clientId,
      client_secret: this.simklConfigs.clientSecret,
      redirect_uri: this.simklConfigs.redirectUri,
      grant_type: 'authorization_code',
    });
    const headers = {
      'Content-Type': 'application/json',
      'simkl-api-key': this.simklConfigs.clientId,
    };
    const response = await fetch(this.simklConfigs.tokenUrl!, {
      body,
      headers,
      method: 'POST',
    });
    return ((await response.json()) as {access_token: string}).access_token;
  }

  getData(): Promise<TaiyakiUserModel> {
    throw new Error('Method not implemented.');
  }
  async fetchProfile(userProfile?: TaiyakiUserModel, init: boolean = false): Promise<void> {
    if (!userProfile) return;
    const headers = {
      'Content-Type': 'application/json',
      'simkl-api-key': this.simklConfigs.clientId,
      Authorization: 'Bearer ' + userProfile.bearerToken,
    };
    const response = await fetch('https://api.simkl.com/users/settings', {
      headers,
      method: 'POST',
    });
    const json = (await response.json()) as SimklUserModel;
    const {account, user} = json;
    const newprofile: TaiyakiUserModel = {
      ...userProfile,
      profile: {
        id: account.id,
        image: 'https:' + user.avatar,
        username: user.name,
      },
    };
    useUserProfiles
      .getState()
      .removeProfile('SIMKL')
      .then(() => useUserProfiles.getState().addToProfile(newprofile!));
    
    if (init) useUserProfiles
    .getState().init();
  }

  async initList(): Promise<TaiyakiUserListModel[]> {
    if (!this.profile) return [];
    const header = this.headers;
    header.Authorization = 'Bearer ' + this.profile.bearerToken;

    const response = await fetch(this.baseURL + '/sync/all-items/anime', {
      headers: header,
    });
    const json = (await response.json()) as SimklUserListModel;
    const {anime} = json;
    return anime.map((i) => ({
      coverImage: simklThumbnails(i.show.poster, 'poster')!,
      ids: {mal: i.show.ids.mal},
      progress: i.watched_episodes_count,
      status: MapWatchingStatusToNative.get(i.status) ?? 'Add to List',
      title: i.show.title,
      score: i.user_rating,
      totalEpisodes: i.total_episodes_count,
    }));
  }

  async updateStatus(
    id: number,
    episodesWatched: number,
    status: WatchingStatus,
    score?: number,
    startedAt?: Date,
    completedAt?: Date,
  ): Promise<void | StatusInfo> {
    if (!this.profile) return;
    const header = this.headers;
    header.Authorization = 'Bearer ' + this.profile.bearerToken;
    const simklStatus = MapWatchingStatusToSimkl.get(status)!;
    const body = JSON.stringify({
      shows: [
        {
          to: simklStatus,
          ids: {
            mal: id,
          },
        },
      ],
    });
    if (episodesWatched) {
      const progressURL = 'https://api.simkl.com/sync/history';
      const _episodeArray = (): {number: number}[] => {
        return [...Array(episodesWatched).keys()].map((i) => ({number: i + 1}));
      };
      const _addProgress = JSON.stringify({
        shows: [
          {
            ids: {mal: id},
            episodes: _episodeArray(),
          },
        ],
      });
      await fetch(progressURL, {
        headers: header,
        body: _addProgress,
        method: 'POST',
      });
    }

    if (score) {
      const formatScore = score > 10 ? Math.ceil(score / 10).toFixed(0) : score;
      const ratingURL = this.baseURL + '/sync/ratings';
      let body = JSON.stringify({
        shows: [
          {
            rating: formatScore,
            ids: {
              mal: id,
            },
          },
        ],
      });
      await fetch(ratingURL, {
        headers: header,
        method: 'POST',
        body,
      });
    }

    const response = await fetch(this.baseURL + '/sync/add-to-list', {
      headers: header,
      body,
      method: 'POST',
    });
    if (response.ok) {
      /**
       * WARNING: PLACEHOLDER FOR NOW. INCONVENIENT AND EXPECTED TO USE THE FETCH RECENT API
       * https://simkl.docs.apiary.io/reference/sync/last-activities/get-last-activity
       */
      useSimklStore.getState().initList();
    }
  }
}
