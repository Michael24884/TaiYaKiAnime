import 'package:fish_redux/fish_redux.dart';
import 'package:taiyaki/Models/Taiyaki/Sync.dart';

class AnimeListCellState implements Cloneable<AnimeListCellState> {
  List<AnimeListModel> data = [];

  AnimeListCellState({this.data = const []});

  @override
  AnimeListCellState clone() {
    return AnimeListCellState()..data = data;
  }
}
