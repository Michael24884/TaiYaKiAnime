import 'package:fish_redux/fish_redux.dart';

import 'action.dart';
import 'state.dart';

Reducer<Card1State> buildReducer() {
  return asReducer(
    <Object, Reducer<Card1State>>{
      Card1Action.action: _onAction,
    },
  );
}

Card1State _onAction(Card1State state, Action action) {
  final Card1State newState = state.clone();
  return newState;
}
