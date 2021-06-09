import 'package:fish_redux/fish_redux.dart';

//TODO replace with your own action
enum ContinueWatchingRowAction { action }

class ContinueWatchingRowActionCreator {
  static Action onAction() {
    return const Action(ContinueWatchingRowAction.action);
  }
}
