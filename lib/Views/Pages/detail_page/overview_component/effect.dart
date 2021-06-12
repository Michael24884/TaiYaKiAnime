import 'package:fish_redux/fish_redux.dart';

import 'action.dart';
import 'state.dart';

Effect<OverviewState> buildEffect() {
  return combineEffects(<Object, Effect<OverviewState>>{
    OverviewAction.action: _onAction,
  });
}

void _onAction(Action action, Context<OverviewState> ctx) {}
