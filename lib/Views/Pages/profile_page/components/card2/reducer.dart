import 'package:fish_redux/fish_redux.dart';

import 'action.dart';
import 'state.dart';

Reducer<Card2State> buildReducer() {
  return asReducer(
    <Object, Reducer<Card2State>>{
      Card2Action.action: _onAction,
    },
  );
}

Card2State _onAction(Card2State state, Action action) {
  final Card2State newState = state.clone();
  return newState;
}
