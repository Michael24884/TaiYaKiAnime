import 'package:fish_redux/fish_redux.dart';

import 'action.dart';
import 'state.dart';

Reducer<OverviewState> buildReducer() {
  return asReducer(
    <Object, Reducer<OverviewState>>{
      OverviewAction.expandSynopsis: _onExpandSynopsis,
    },
  );
}

OverviewState _onExpandSynopsis(OverviewState state, Action action) {
  final OverviewState newState = state.clone();
  newState.synopsisExpanded = !newState.synopsisExpanded;
  return newState;
}
