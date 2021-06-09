import 'package:fish_redux/fish_redux.dart';

//TODO replace with your own action
enum BadeCellsAction { action }

class BadeCellsActionCreator {
  static Action onAction() {
    return const Action(BadeCellsAction.action);
  }
}
