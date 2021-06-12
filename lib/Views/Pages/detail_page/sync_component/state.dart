import 'package:fish_redux/fish_redux.dart';
import 'package:taiyaki/Models/Anilist/models.dart';
import 'package:taiyaki/Models/MyAnimeList/models.dart';
import 'package:taiyaki/Models/Taiyaki/Sync.dart';
import 'package:taiyaki/Models/Taiyaki/Trackers.dart';
import 'package:taiyaki/Services/API/SIMKL+API.dart';
import 'package:taiyaki/Store/GlobalUserStore/GlobalUserStore.dart';
import 'package:taiyaki/Views/Pages/detail_page/state.dart';

class SyncState implements Cloneable<SyncState> {
  SyncModel? anilistSync;
  SyncModel? malSync;
  SyncModel? simklSync;

  ThirdPartyBundleIds ids = ThirdPartyBundleIds(anilist: 0, myanimelist: 0);

  @override
  SyncState clone() {
    return SyncState()
      ..anilistSync = anilistSync
      ..malSync = malSync
      ..simklSync = simklSync
      ..ids = ids;
  }
}

class SyncConnector extends ConnOp<DetailState, SyncState> {
  @override
  SyncState get(DetailState state) {
    final _globalState = GlobalUserStore.store.getState();
    final subState = SyncState().clone();

    // subState.ids = ThirdPartyBundleIds(
    //     anilist: state.detailDatabaseModel state.anilistData!.id, myanimelist: state.anilistData!.idMal);

    subState.ids = state.detailDatabaseModel?.ids ??
        ThirdPartyBundleIds(
            anilist: state.anilistData?.id ?? 0,
            myanimelist: state.anilistData?.idMal ?? 0);

    if (_globalState.anilistUser != null) {
      final _data = state.anilistData?.mediaListEntryModel;

      subState.anilistSync = SyncModel(
          progress: _data?.progress ?? 0,
          status: _data?.status,
          score: _data?.score,
          episodes: state.anilistData?.episodes);
    }

    if (_globalState.myanimelistUser != null) {
      final _list = state.malEntryData;
      subState.malSync = SyncModel(
        progress: _list?.num_watched_episodes,
        score: _list?.score,
        status: _list?.status,
        episodes: state.anilistData?.episodes,
      );
    }

    if (_globalState.simklUser != null) {
      final _match = SimklAPI.findMatch(
          id: state.detailDatabaseModel?.ids.simkl ?? 0,
          malID: state.anilistData?.idMal);
      if (_match != null) {
        subState.simklSync = SyncModel(
          progress: _match.progress,
          episodes: _match.totalEpisodes,
          score: _match.score.toInt(),
          status: _match.status,
        );
      } else
        subState.simklSync = SyncModel(
          progress: 0,
          status: 'Not in List',
          score: 0,
          episodes: state.anilistData?.episodes,
        );
    }

    return subState;
  }

  @override
  void set(DetailState state, SyncState subState) {
    final anilist = subState.anilistSync;
    final mal = subState.malSync;

    if (anilist != null) {
      state.anilistData!.mediaListEntryModel = MediaListEntryModel(
          status: anilist.status,
          score: anilist.score,
          progress: anilist.progress);
    }

    if (mal != null) {
      state.malEntryData = MyAnimeListEntryModel(
          score: mal.score,
          status: mal.status,
          num_watched_episodes: mal.progress ?? 0);
    }
  }
}
