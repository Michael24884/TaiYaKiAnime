import 'package:fish_redux/fish_redux.dart';

//TODO replace with your own action
enum Card3Action { action }

class Card3ActionCreator {
  static Action onAction() {
    return const Action(Card3Action.action);
  }
}
