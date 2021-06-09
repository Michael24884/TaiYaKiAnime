import 'package:fish_redux/fish_redux.dart';
import 'package:taiyaki/Store/GlobalUserStore/GlobalUserStore.dart';

import 'action.dart';
import 'state.dart';

Effect<SettingsState> buildEffect() {
  return combineEffects(<Object, Effect<SettingsState>>{
    SettingsAction.action: _onAction,
    Lifecycle.initState: _onInit,
    // SettingsAction.updateSetting: _updateSettings
  });
}

void _onAction(Action action, Context<SettingsState> ctx) {}

// void _updateSettings(Action action, Context<SettingsState> ctx) {
//   final AppSettingsModel appSettingsModel = action.payload;
//
//   GlobalSettingsStore.store
//       .dispatch(GlobalSettingsActionCreator.onUpdateSettings(appSettingsModel));
// }

void _onInit(Action action, Context<SettingsState> ctx) {
  ctx.addObservable(GlobalUserStore.store.subscribe);
  // ctx.listen(onChange: () {
  //   print('updated page');
  //   ctx.forceUpdate();
  // });
  GlobalUserStore.store.observable().listen((event) {
    final state = ctx.state;
    if (event.anilistUser != state.anilistUser) {
      ctx.state.anilistUser = event.anilistUser;
    }
    if (event.myanimelistUser != state.myanimelistUser)
      ctx.state.myanimelistUser = event.myanimelistUser;
    if (event.simklUser != state.simklUser)
      ctx.state.simklUser = event.simklUser;
    // event.myanimelistUser != state.myanimelistUser ||
    // event.simklUser != state.simklUser) ctx.forceUpdate();
    ctx.forceUpdate();
  });
}
