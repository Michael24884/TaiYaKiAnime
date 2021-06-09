import 'package:fish_redux/fish_redux.dart';

//TODO replace with your own action
enum RowsAction { action }

class RowsActionCreator {
  static Action onAction() {
    return const Action(RowsAction.action);
  }
}
