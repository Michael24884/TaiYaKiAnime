import 'package:fish_redux/fish_redux.dart';

import 'action.dart';
import 'state.dart';

Reducer<QueueCellState> buildReducer() {
  return asReducer(
    <Object, Reducer<QueueCellState>>{
      QueueCellAction.action: _onAction,
    },
  );
}

QueueCellState _onAction(QueueCellState state, Action action) {
  final QueueCellState newState = state.clone();
  return newState;
}
