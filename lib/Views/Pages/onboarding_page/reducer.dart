import 'package:fish_redux/fish_redux.dart';

import 'action.dart';
import 'state.dart';

Reducer<OnboardingState> buildReducer() {
  return asReducer(
    <Object, Reducer<OnboardingState>>{
      OnboardingAction.action: _onAction,
    },
  );
}

OnboardingState _onAction(OnboardingState state, Action action) {
  final OnboardingState newState = state.clone();
  return newState;
}
