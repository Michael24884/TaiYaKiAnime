import 'package:fish_redux/fish_redux.dart';
import 'package:taiyaki/Models/SIMKL/models.dart';
import 'package:taiyaki/Views/Pages/video_page/components/queue_cell/state.dart';
import 'package:taiyaki/Views/Pages/video_page/state.dart';

class QueueState extends ImmutableSource implements Cloneable<QueueState> {
  List<SimklEpisodeModel> queueList = const [];
  int? currentEpisode;

  @override
  QueueState clone() {
    return QueueState()
      ..queueList = queueList
      ..currentEpisode = currentEpisode;
  }

  @override
  Object getItemData(int index) {
    final _isPlaying = currentEpisode == queueList[index].episode;
    return QueueCellState(
        simklEpisodeModel: queueList[index], isPlaying: _isPlaying);
  }

  @override
  String getItemType(int index) {
    return 'queue_list_cell';
  }

  @override
  int get itemCount => queueList.length;

  @override
  ImmutableSource setItemData(int index, Object data) {
    throw UnimplementedError();
  }
}

class QueueListConnector extends ConnOp<VideoState, QueueState> {
  @override
  QueueState get(VideoState state) {
    final subState = QueueState().clone();
    subState.queueList = state.playlist;
    subState.currentEpisode = state.episode?.episode ?? 1;
    return subState;
  }
}
