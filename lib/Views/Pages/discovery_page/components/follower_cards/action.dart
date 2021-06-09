import 'package:fish_redux/fish_redux.dart';

//TODO replace with your own action
enum FollowerCardsAction { action }

class FollowerCardsActionCreator {
  static Action onAction() {
    return const Action(FollowerCardsAction.action);
  }
}
