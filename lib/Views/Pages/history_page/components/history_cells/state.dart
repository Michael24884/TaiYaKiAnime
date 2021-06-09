import 'package:fish_redux/fish_redux.dart';
import 'package:taiyaki/Models/Taiyaki/DetailDatabase.dart';

class HistoryCellsState implements Cloneable<HistoryCellsState> {
  HistoryModel? historyModel;

  HistoryCellsState({this.historyModel});

  @override
  HistoryCellsState clone() {
    return HistoryCellsState()..historyModel = historyModel;
  }
}
