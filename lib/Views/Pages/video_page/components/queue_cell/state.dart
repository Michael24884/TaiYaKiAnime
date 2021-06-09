import 'package:fish_redux/fish_redux.dart';
import 'package:taiyaki/Models/SIMKL/models.dart';

class QueueCellState implements Cloneable<QueueCellState> {
  SimklEpisodeModel? simklEpisodeModel;
  bool isPlaying;

  QueueCellState({this.simklEpisodeModel, this.isPlaying = false});

  @override
  QueueCellState clone() {
    return QueueCellState()
      ..simklEpisodeModel = simklEpisodeModel
      ..isPlaying = isPlaying;
  }
}
