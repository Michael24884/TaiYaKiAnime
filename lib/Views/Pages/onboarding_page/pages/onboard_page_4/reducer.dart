import 'package:fish_redux/fish_redux.dart';

import 'action.dart';
import 'state.dart';

Reducer<OnboardingPage4State> buildReducer() {
  return asReducer(
    <Object, Reducer<OnboardingPage4State>>{
      OnboardingPage4Action.action: _onAction,
    },
  );
}

OnboardingPage4State _onAction(OnboardingPage4State state, Action action) {
  final OnboardingPage4State newState = state.clone();
  return newState;
}
