import 'package:fish_redux/fish_redux.dart';

import 'action.dart';
import 'state.dart';

Effect<SyncState> buildEffect() {
  return combineEffects(<Object, Effect<SyncState>>{
    SyncAction.action: _onAction,
  });
}

void _onAction(Action action, Context<SyncState> ctx) {}
