import 'package:fish_redux/fish_redux.dart';
import 'package:taiyaki/Models/SIMKL/models.dart';
import 'package:taiyaki/Models/Taiyaki/DetailDatabase.dart';
import 'package:taiyaki/Store/GlobalSettingsStore/GlobalSettingsStore.dart';
import 'package:taiyaki/Views/Pages/detail_page/state.dart';
import 'package:taiyaki/Views/Pages/detail_page/watch_component/episode_cells/state.dart';

class WatchState extends ImmutableSource implements Cloneable<WatchState> {
  DetailDatabaseModel? databaseModel;
  String title = '';
  List<SimklEpisodeModel> episodes = [];

  @override
  WatchState clone() {
    return WatchState()
      ..databaseModel = databaseModel
      ..title = title
      ..episodes = episodes;
  }

  @override
  Object getItemData(int index) {
    final _item = episodes[index];
    final _progress = databaseModel?.episodeProgress?[_item.episode];
    int _lastEpisode = 0;
    if (databaseModel?.episodeProgress!.keys.length != 1)
      _lastEpisode = (databaseModel!.episodeProgress!)
          .keys
          .lastWhere((element) => element > 0);
    ;
    bool _isBlurred = (_item.episode <= ((_lastEpisode) + 1));
    if (!GlobalSettingsStore.store.getState().appSettings.blurSpoilers)
      _isBlurred = true;
    return EpisodeCellState(
        episode: _item, progress: _progress, isBlurred: !_isBlurred);
  }

  @override
  String getItemType(int index) {
    return 'episode_cells';
  }

  @override
  int get itemCount => episodes.length;

  @override
  ImmutableSource setItemData(int index, Object data) {
    throw UnimplementedError();
  }
}

class WatchTabConnector extends ConnOp<DetailState, WatchState> {
  @override
  WatchState get(DetailState state) {
    final subState = WatchState().clone();
    subState.databaseModel = state.detailDatabaseModel;
    subState.title = state.anilistData!.title;
    subState.episodes = state.episodes;
    return subState;
  }

  @override
  void set(DetailState state, WatchState subState) {
    state.setDetailDatabaseModel = subState.databaseModel;
  }
}
