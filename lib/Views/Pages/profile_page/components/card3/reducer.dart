import 'package:fish_redux/fish_redux.dart';

import 'action.dart';
import 'state.dart';

Reducer<Card3State> buildReducer() {
  return asReducer(
    <Object, Reducer<Card3State>>{
      Card3Action.action: _onAction,
    },
  );
}

Card3State _onAction(Card3State state, Action action) {
  final Card3State newState = state.clone();
  return newState;
}
