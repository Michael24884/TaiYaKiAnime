import 'package:fish_redux/fish_redux.dart';

import 'action.dart';
import 'state.dart';

Reducer<GeneralComponentState> buildReducer() {
  return asReducer(
    <Object, Reducer<GeneralComponentState>>{
      GeneralComponentAction.action: _onAction,
    },
  );
}

GeneralComponentState _onAction(GeneralComponentState state, Action action) {
  final GeneralComponentState newState = state.clone();
  return newState;
}
