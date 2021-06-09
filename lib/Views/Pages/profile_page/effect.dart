import 'package:fish_redux/fish_redux.dart';
import 'package:flutter/material.dart' hide Action;
import 'package:taiyaki/Models/Taiyaki/Trackers.dart';
import 'package:taiyaki/Services/API/Anilist+API.dart';
import 'package:taiyaki/Views/Pages/anime_list_page/page.dart';

import 'action.dart';
import 'state.dart';

Effect<ProfileState> buildEffect() {
  return combineEffects(<Object, Effect<ProfileState>>{
    ProfileAction.action: _onAction,
    Lifecycle.initState: _onInit,
    ProfileAction.moveToList: _moveToList,
  });
}

void _onAction(Action action, Context<ProfileState> ctx) {}

void _moveToList(Action action, Context<ProfileState> ctx) {
  Navigator.of(ctx.context).pushNamed('anime_list_page',
      arguments: AnimeListPageArguments(
          tracker: ctx.state.tracker!, list: action.payload));
}

void _onInit(Action action, Context<ProfileState> ctx) async {
  if (ctx.state.tracker != ThirdPartyTrackersEnum.anilist) return;

  final _stats = await AnilistAPI().grabStats();
  ctx.dispatch(ProfileActionCreator.updateStats(_stats));
}
