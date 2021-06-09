import 'package:fish_redux/fish_redux.dart';

//TODO replace with your own action
enum QueueCellAction { action }

class QueueCellActionCreator {
  static Action onAction() {
    return const Action(QueueCellAction.action);
  }
}
