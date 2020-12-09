import {TaiyakiUserModel, WatchingStatus} from '../../Models/taiyaki';
import {TrackerBase} from './Trackers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AnilistMediaListEntry,
  AnilistUpdateMediaGraph,
  AnilistViewerGraph,
  AnilistViewerModel,
} from '../../Models/Anilist';
import {useUserProfiles} from '../../Stores';
import {
  dateNumToString,
  MapWatchingStatusToAnilist,
  MapWatchingStatusToNative,
} from '../../Util';
import {StatusInfo} from '../../Views/Components';

export class AnilistBase implements TrackerBase {
  private baseUrl: string = 'https://graphql.anilist.co';

  async getData(): Promise<TaiyakiUserModel> {
    const file = await AsyncStorage.getItem('auth');
    if (file) {
      const json = JSON.parse(file) as TaiyakiUserModel[];
      const user = json.find((i) => i.source === 'Anilist');
      return user!;
    } else
      throw new Error(
        'Not possible to fetch user data, something might be corrupted',
      );
  }

  async fetchProfile(): Promise<void> {
    const userData = await this.getData();
    const headers = {
      Authorization: 'Bearer ' + userData.bearerToken,
      'Content-Type': 'application/json',
    };
    const request = await fetch(this.baseUrl, {
      headers,
      method: 'POST',
      body: JSON.stringify({query: AnilistViewerGraph}),
    });
    const json = (await request.json()) as AnilistViewerModel;
    const profileStore = useUserProfiles
      .getState()
      .profiles.find((i) => i.source === 'Anilist');
    const {name, id, avatar} = json.data.Viewer;
    profileStore!.profile = {username: name, id, image: avatar.large};
    useUserProfiles
      .getState()
      .removeProfile('Anilist')
      .then(() => useUserProfiles.getState().addToProfile(profileStore!));
  }

  async updateStatus(
    id: number,
    episodesWatched: number,
    status: WatchingStatus,
    score?: number,
    startedAt?: Date,
    completedAt?: Date,
  ): Promise<undefined | StatusInfo> {
    const aniAuth = useUserProfiles
      .getState()
      .profiles.find((i) => i.source === 'Anilist');
    if (!aniAuth) return;
    const statusToAni = MapWatchingStatusToAnilist.get(status) ?? 'PLANNING';
    const dateToFuzzy = (time: Date): string => {
      const date = time
        .toLocaleDateString([], {
          day: 'numeric',
          month: 'numeric',
          year: 'numeric',
        })
        .split('/');

      return JSON.stringify({
        month: Number(date[0]),
        day: Number(date[1]),
        year: Number(date[2]),
      }).replace(/"([^"]+)":/g, '$1:');
    };
    const mediaGraph = AnilistUpdateMediaGraph(
      id,
      episodesWatched,
      statusToAni,
      score,
      startedAt ? dateToFuzzy(startedAt) : undefined,
      completedAt ? dateToFuzzy(completedAt) : undefined,
    );

    const headers = {
      Authorization: 'Bearer ' + aniAuth.bearerToken,
      'Content-Type': 'application/json',
    };
    const response = await fetch(this.baseUrl, {
      headers,
      body: JSON.stringify({query: mediaGraph}),
      method: 'POST',
    });
    const json = (await response.json()) as {
      data: {SaveMediaListEntry: AnilistMediaListEntry};
    };
    const statusInfo: StatusInfo = {
      progress: json.data.SaveMediaListEntry.progress,
      ended: dateNumToString(json.data.SaveMediaListEntry.completedAt),
      score: json.data.SaveMediaListEntry.score * 10,
      started: dateNumToString(json.data.SaveMediaListEntry.startedAt),
      status: MapWatchingStatusToNative.get(
        json.data.SaveMediaListEntry.status,
      ),
    };
    return statusInfo;
  }
}
