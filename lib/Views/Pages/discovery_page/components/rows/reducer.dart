import 'package:fish_redux/fish_redux.dart';

import 'action.dart';
import 'state.dart';

Reducer<RowsState> buildReducer() {
  return asReducer(
    <Object, Reducer<RowsState>>{
      RowsAction.action: _onAction,
    },
  );
}

RowsState _onAction(RowsState state, Action action) {
  final RowsState newState = state.clone();
  return newState;
}
