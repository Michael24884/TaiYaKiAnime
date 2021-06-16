import 'package:fish_redux/fish_redux.dart';
import 'package:taiyaki/Models/Taiyaki/Sync.dart';
import 'package:taiyaki/Models/Taiyaki/Trackers.dart';

class ListCellState implements Cloneable<ListCellState> {
  AnimeListModel? model;

  ListCellState({
    this.model,
  });

  @override
  ListCellState clone() {
    return ListCellState()..model = model;
  }
}
