import 'package:fish_redux/fish_redux.dart';
import 'package:taiyaki/Store/GlobalSettingsStore/GlobalSettingsStore.dart';

import 'action.dart';
import 'state.dart';

Effect<GeneralComponentState> buildEffect() {
  return combineEffects(<Object, Effect<GeneralComponentState>>{
    GeneralComponentAction.action: _onAction,
    Lifecycle.initState: _onInit,
  });
}

void _onAction(Action action, Context<GeneralComponentState> ctx) {}

void _onInit(Action action, Context<GeneralComponentState> ctx) {
  ctx.addObservable(GlobalSettingsStore.store.subscribe);
}
