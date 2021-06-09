import 'package:fish_redux/fish_redux.dart';

//TODO replace with your own action
enum SearchCellsAction { action }

class SearchCellsActionCreator {
  static Action onAction() {
    return const Action(SearchCellsAction.action);
  }
}
