import 'package:fish_redux/fish_redux.dart';

import 'action.dart';
import 'state.dart';

Reducer<OnboardPage3State> buildReducer() {
  return asReducer(
    <Object, Reducer<OnboardPage3State>>{
      OnboardPage3Action.action: _onAction,
    },
  );
}

OnboardPage3State _onAction(OnboardPage3State state, Action action) {
  final OnboardPage3State newState = state.clone();
  return newState;
}
