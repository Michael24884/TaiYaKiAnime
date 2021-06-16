import 'package:fish_redux/fish_redux.dart';
import 'package:taiyaki/Views/Pages/onboarding_page/state.dart';

class OnboardingPage4State implements Cloneable<OnboardingPage4State> {
  @override
  OnboardingPage4State clone() {
    return OnboardingPage4State();
  }
}

class OnboardingPage4Connector
    extends ConnOp<OnboardingState, OnboardingPage4State> {
  @override
  OnboardingPage4State get(OnboardingState state) {
    final subState = OnboardingPage4State().clone();

    return subState;
  }
}
