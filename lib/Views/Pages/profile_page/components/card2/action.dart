import 'package:fish_redux/fish_redux.dart';

//TODO replace with your own action
enum Card2Action { action }

class Card2ActionCreator {
  static Action onAction() {
    return const Action(Card2Action.action);
  }
}
