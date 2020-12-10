import {TaiyakiUserModel, WatchingStatus} from '../../Models/taiyaki';
import {StatusInfo} from '../../Views/Components';

export abstract class TrackerBase {
  abstract getData(): Promise<TaiyakiUserModel>;
  abstract fetchProfile(userProfile?: TaiyakiUserModel): Promise<void>;
  abstract updateStatus(
    id: number,
    episodesWatched: number,
    status: WatchingStatus,
    score?: number,
    startedAt?: Date,
    completedAt?: Date,
  ): Promise<void | StatusInfo>;
}
