import 'package:fish_redux/fish_redux.dart';

//TODO replace with your own action
enum OnboardingAction {
  action,
  moveToPage,
  updateTheme,
  openDiscord,
  dismissOnboarding
}

class OnboardingActionCreator {
  static Action onAction() {
    return const Action(OnboardingAction.action);
  }

  static Action dismissOnboarding() {
    return const Action(OnboardingAction.dismissOnboarding);
  }

  static Action openDiscord() {
    return const Action(OnboardingAction.openDiscord);
  }

  static Action updatTheme(String name) {
    return Action(OnboardingAction.updateTheme, payload: name);
  }

  static Action moveToPage(int? index) {
    return Action(OnboardingAction.moveToPage, payload: index);
  }
}
