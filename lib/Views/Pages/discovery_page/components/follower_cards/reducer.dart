import 'package:fish_redux/fish_redux.dart';

import 'action.dart';
import 'state.dart';

Reducer<FollowerCardsState> buildReducer() {
  return asReducer(
    <Object, Reducer<FollowerCardsState>>{
      FollowerCardsAction.action: _onAction,
    },
  );
}

FollowerCardsState _onAction(FollowerCardsState state, Action action) {
  final FollowerCardsState newState = state.clone();
  return newState;
}
