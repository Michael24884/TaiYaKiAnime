import 'package:fish_redux/fish_redux.dart';
import 'package:taiyaki/Store/GlobalUserStore/GlobalUserStore.dart';

import 'action.dart';
import 'state.dart';

Effect<SettingsTrackersState> buildEffect() {
  return combineEffects(<Object, Effect<SettingsTrackersState>>{
    SettingsTrackersAction.action: _onAction,
    Lifecycle.initState: _onInit,
    Lifecycle.dispose: _onDispose,
  });
}

void _onAction(Action action, Context<SettingsTrackersState> ctx) {}

void _onInit(Action action, Context<SettingsTrackersState> ctx) {
  ctx.addObservable(GlobalUserStore.store.subscribe);
}

void _onDispose(Action action, Context<SettingsTrackersState> ctx) {
  ctx.dispose();
}
