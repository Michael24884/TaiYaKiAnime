import 'package:fish_redux/fish_redux.dart';

import 'action.dart';
import 'state.dart';

Reducer<HistoryCellsState> buildReducer() {
  return asReducer(
    <Object, Reducer<HistoryCellsState>>{
      HistoryCellsAction.action: _onAction,
    },
  );
}

HistoryCellsState _onAction(HistoryCellsState state, Action action) {
  final HistoryCellsState newState = state.clone();
  return newState;
}
