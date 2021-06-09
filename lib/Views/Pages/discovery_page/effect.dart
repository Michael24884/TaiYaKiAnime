import 'package:fish_redux/fish_redux.dart';
import 'package:flutter/material.dart' hide Action;
import 'package:hive/hive.dart';
import 'package:taiyaki/Models/Anilist/typed_models.dart';
import 'package:taiyaki/Models/Taiyaki/DetailDatabase.dart';
import 'package:taiyaki/Models/Taiyaki/Misc.dart';
import 'package:taiyaki/Services/API/Anilist+API.dart';
import 'package:taiyaki/Store/GlobalUserStore/GlobalUserStore.dart';
import 'package:taiyaki/Utils/strings.dart';
import 'package:taiyaki/Views/Pages/detail_page/page.dart';

import 'action.dart';
import 'state.dart';

Effect<DiscoveryState> buildEffect() {
  return combineEffects(<Object, Effect<DiscoveryState>>{
    DiscoveryAction.action: _onAction,
    Lifecycle.initState: _onInit,
    DiscoveryAction.grabAnilistActivity: _grabAnilistActivity,
    DiscoveryAction.fetchContinueItems: _fetchLastWatchingItems,
  });
}

void _onAction(Action action, Context<DiscoveryState> ctx) {
  Navigator.of(ctx.context).pushNamed('search_page');
}

void _grabAnilistActivity(Action action, Context<DiscoveryState> ctx) async {
  if (GlobalUserStore.store.getState().anilistUser != null)
    AnilistAPI().getFollowersActivity().then(
        (value) => ctx.dispatch(DiscoveryActionCreator.updateActivity(value)));
}

void _onInit(Action action, Context<DiscoveryState> ctx) async {
  ctx.addObservable(GlobalUserStore.store.subscribe);

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

  AnilistAPI().getPagedData(AnilistPageFilterEnum.trending).then(
      (value) => ctx.dispatch(DiscoveryActionCreator.updateTrending(value)));

  AnilistAPI().getPagedData(AnilistPageFilterEnum.popularity).then(
      (value) => ctx.dispatch(DiscoveryActionCreator.updatePopular(value)));

  AnilistAPI().getPagedData(AnilistPageFilterEnum.justAdded).then(
      (value) => ctx.dispatch(DiscoveryActionCreator.updateJustAdded(value)));

  ctx.broadcast(DiscoveryActionCreator.grabAnilistActivity());

  AnilistAPI().getSearchResults(
      const [],
      const [],
      null,
      DateTime.now().year,
      mapMonthToAnilistSeason(
          DateTime.now().month)).then(
      (value) => ctx.dispatch(DiscoveryActionCreator.updateSeasonal(value)));

  int year;
  final _seasonCheck = mapSeasonToAnilistNextSeason(
      mapMonthToAnilistSeason(DateTime.now().month));
  if (_seasonCheck == 'FALL')
    year = DateTime.now().year + 1;
  else
    year = DateTime.now().year;

  AnilistAPI()
      .getSearchResults(const [], const [], null, year, _seasonCheck).then(
          (value) =>
              ctx.dispatch(DiscoveryActionCreator.updateNextSeason(value)));

  ctx.dispatch(DiscoveryActionCreator.fetchContinueItems());
}

void _fetchLastWatchingItems(Action action, Context<DiscoveryState> ctx) async {
  final _box = Hive.box<DetailDatabaseModel>(HIVE_DETAIL_BOX);
  if (_box.isNotEmpty) {
    final _items = _box.values
        .where((element) => element.lastWatchingModel != null)
        .map((e) => e.lastWatchingModel!);
    ctx.dispatch(DiscoveryActionCreator.updateContinueItems(_items.toList()));
  }
}

Future selectNotification(String? payload, Context<DiscoveryState> ctx) async {
  if (payload != null) {
    debugPrint('notification payload: $payload');
  }
  await Navigator.of(ctx.context).pushNamed('detail_page',
      arguments: DetailPageArguments(id: int.parse(payload!)));
}
