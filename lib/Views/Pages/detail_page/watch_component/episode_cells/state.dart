import 'package:fish_redux/fish_redux.dart';
import 'package:taiyaki/Models/SIMKL/models.dart';

class EpisodeCellState implements Cloneable<EpisodeCellState> {
  SimklEpisodeModel? episode;
  double? progress;
  bool? isBlurred;

  EpisodeCellState({this.episode, this.progress, this.isBlurred});

  @override
  EpisodeCellState clone() {
    return EpisodeCellState()
      ..episode = episode
      ..progress = progress
      ..isBlurred = isBlurred;
  }
}
