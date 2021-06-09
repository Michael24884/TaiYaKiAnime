import 'package:fish_redux/fish_redux.dart';

import 'action.dart';
import 'state.dart';

Reducer<OnboardingPage2State> buildReducer() {
  return asReducer(
    <Object, Reducer<OnboardingPage2State>>{
      OnboardingPage2Action.action: _onAction,
    },
  );
}

OnboardingPage2State _onAction(OnboardingPage2State state, Action action) {
  final OnboardingPage2State newState = state.clone();
  final String accent = action.payload;
  newState.appSettingsModel = state.appSettingsModel!..accent = accent;
  return newState;
}
