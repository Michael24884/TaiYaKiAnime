import 'package:fish_redux/fish_redux.dart';

import 'action.dart';
import 'state.dart';

Reducer<CustomizationSettingState> buildReducer() {
  return asReducer(
    <Object, Reducer<CustomizationSettingState>>{
      CustomizationSettingAction.action: _onAction,
    },
  );
}

CustomizationSettingState _onAction(
    CustomizationSettingState state, Action action) {
  final CustomizationSettingState newState = state.clone();
  return newState;
}
