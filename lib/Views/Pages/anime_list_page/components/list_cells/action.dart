import 'package:fish_redux/fish_redux.dart';

//TODO replace with your own action
enum ListCellAction { action }

class ListCellActionCreator {
  static Action onAction() {
    return const Action(ListCellAction.action);
  }
}
