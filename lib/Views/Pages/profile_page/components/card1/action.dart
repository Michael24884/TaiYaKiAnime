import 'package:fish_redux/fish_redux.dart';

//TODO replace with your own action
enum Card1Action { action }

class Card1ActionCreator {
  static Action onAction() {
    return const Action(Card1Action.action);
  }
}
