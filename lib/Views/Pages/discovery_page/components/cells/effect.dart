import 'package:fish_redux/fish_redux.dart';
import 'package:flutter/material.dart' hide Action;
import 'package:taiyaki/Views/Pages/detail_page/page.dart';

import 'action.dart';
import 'state.dart';

Effect<DiscoveryRowCellsState> buildEffect() {
  return combineEffects(<Object, Effect<DiscoveryRowCellsState>>{
    DiscoveryRowCellsAction.action: _onAction,
  });
}

void _onAction(Action action, Context<DiscoveryRowCellsState> ctx) {
  Navigator.of(ctx.context).pushNamed('detail_page',
      arguments: DetailPageArguments(id: ctx.state.id));
}
