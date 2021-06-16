import 'package:fish_redux/fish_redux.dart';

import 'action.dart';
import 'state.dart';

Effect<DownloadsState> buildEffect() {
  return combineEffects(<Object, Effect<DownloadsState>>{
    DownloadsAction.action: _onAction,
  });
}

void _onAction(Action action, Context<DownloadsState> ctx) {}
