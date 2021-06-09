import 'package:fish_redux/fish_redux.dart';

import 'action.dart';
import 'state.dart';

Reducer<OnboardPage5State> buildReducer() {
  return asReducer(
    <Object, Reducer<OnboardPage5State>>{
      OnboardPage5Action.action: _onAction,
    },
  );
}

OnboardPage5State _onAction(OnboardPage5State state, Action action) {
  final OnboardPage5State newState = state.clone();
  return newState;
}
