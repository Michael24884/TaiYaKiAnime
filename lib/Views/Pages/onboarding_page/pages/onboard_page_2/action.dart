import 'package:fish_redux/fish_redux.dart';

//TODO replace with your own action
enum OnboardingPage2Action { action }

class OnboardingPage2ActionCreator {
  static Action onAction(String accent) {
    return Action(OnboardingPage2Action.action, payload: accent);
  }
}
