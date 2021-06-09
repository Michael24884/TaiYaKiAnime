import 'package:fish_redux/fish_redux.dart';

import 'action.dart';
import 'state.dart';

Reducer<QueueState> buildReducer() {
  return asReducer(
    <Object, Reducer<QueueState>>{
      QueueAction.action: _onAction,
    },
  );
}

QueueState _onAction(QueueState state, Action action) {
  final QueueState newState = state.clone();
  return newState;
}
