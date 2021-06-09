import 'package:fish_redux/fish_redux.dart';

//TODO replace with your own action
enum OnboardPage1Action { action, updateTheme }

class OnboardPage1ActionCreator {
  static Action onAction() {
    return const Action(OnboardPage1Action.action);
  }

  static Action updateTheme(String name) {
    return Action(OnboardPage1Action.updateTheme, payload: name);
  }
}
