import 'package:fish_redux/fish_redux.dart';

import 'action.dart';
import 'state.dart';

Effect<EpisodeCellState> buildEffect() {
  return combineEffects(<Object, Effect<EpisodeCellState>>{
    EpisodeCellAction.action: _onAction,
  });
}

void _onAction(Action action, Context<EpisodeCellState> ctx) {}
