import 'package:fish_redux/fish_redux.dart';

//TODO replace with your own action
enum QueueAction { action }

class QueueActionCreator {
  static Action onAction() {
    return const Action(QueueAction.action);
  }
}
