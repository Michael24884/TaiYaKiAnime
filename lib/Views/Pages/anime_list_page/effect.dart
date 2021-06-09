import 'package:fish_redux/fish_redux.dart';
import 'package:flutter/material.dart' hide Action;
import 'package:taiyaki/Models/Taiyaki/Trackers.dart';
import 'package:taiyaki/Views/Pages/detail_page/page.dart';

import 'action.dart';
import 'state.dart';

Effect<AnimeListState> buildEffect() {
  return combineEffects(<Object, Effect<AnimeListState>>{
    AnimeListAction.action: _onAction,
    Lifecycle.initState: _onInit,
    AnimeListAction.moveToDetail: _moveToDetail,
  });
}

void _onAction(Action action, Context<AnimeListState> ctx) {}

void _moveToDetail(Action action, Context<AnimeListState> ctx) async {
  final _isMal = ctx.state.tracker == ThirdPartyTrackersEnum.myanimelist;
  await Navigator.of(ctx.context).pushNamed('detail_page',
      arguments: DetailPageArguments(id: action.payload, isMal: _isMal));
}

void _onInit(Action action, Context<AnimeListState> ctx) async {}
