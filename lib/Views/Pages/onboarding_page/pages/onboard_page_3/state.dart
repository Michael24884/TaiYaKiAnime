import 'package:fish_redux/fish_redux.dart';
import 'package:taiyaki/Views/Pages/onboarding_page/state.dart';

class OnboardPage3State implements Cloneable<OnboardPage3State> {
  @override
  OnboardPage3State clone() {
    return OnboardPage3State();
  }
}

class OnboardPage3Connector extends ConnOp<OnboardingState, OnboardPage3State> {
  @override
  OnboardPage3State get(OnboardingState state) {
    final subState = OnboardPage3State().clone();
    return subState;
  }
}
