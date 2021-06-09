import 'package:fish_redux/fish_redux.dart';

//TODO replace with your own action
enum HistoryCellsAction { action }

class HistoryCellsActionCreator {
  static Action onAction() {
    return const Action(HistoryCellsAction.action);
  }
}
