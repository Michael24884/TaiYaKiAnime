import 'package:fish_redux/fish_redux.dart';

import 'action.dart';
import 'state.dart';

Effect<FilterSheetState> buildEffect() {
  return combineEffects(<Object, Effect<FilterSheetState>>{
    FilterSheetAction.action: _onAction,
  });
}

void _onAction(Action action, Context<FilterSheetState> ctx) {}
