import 'package:fish_redux/fish_redux.dart';

import 'action.dart';
import 'state.dart';

Effect<FollowerCardsState> buildEffect() {
  return combineEffects(<Object, Effect<FollowerCardsState>>{
    FollowerCardsAction.action: _onAction,
  });
}

void _onAction(Action action, Context<FollowerCardsState> ctx) {}
