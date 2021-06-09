import 'package:fish_redux/fish_redux.dart';
import 'package:flutter/material.dart' hide Action;
import 'package:hive/hive.dart';
import 'package:modal_bottom_sheet/modal_bottom_sheet.dart';
import 'package:taiyaki/Models/SIMKL/models.dart';
import 'package:taiyaki/Models/Taiyaki/DetailDatabase.dart';
import 'package:taiyaki/Utils/strings.dart';
import 'package:taiyaki/Views/Pages/detail_page/action.dart';
import 'package:taiyaki/Views/Pages/video_page/page.dart';
import 'package:taiyaki/Views/Widgets/source_search_page.dart';

import 'action.dart';
import 'state.dart';

Effect<WatchState> buildEffect() {
  return combineEffects(<Object, Effect<WatchState>>{
    WatchAction.action: _onAction,
    WatchAction.openSourceSelector: _onOpenSourceSelector,
    WatchAction.onPickedLink: _onPickedLink,
    WatchAction.moveToVideoPage: _moveToVideo,
  });
}

void _onAction(Action action, Context<WatchState> ctx) {}

void _moveToVideo(Action action, Context<WatchState> ctx) {
  final SimklEpisodeModel args = action.payload;
  final VideoPageArguments _videoArgs = VideoPageArguments(
      databaseModel: ctx.state.databaseModel!,
      episode: args,
      playlist: ctx.state.episodes);
  Navigator.of(ctx.context).pushNamed('video_page', arguments: _videoArgs);
}

void _onPickedLink(Action action, Context<WatchState> ctx) async {
  final Map<String, String> _link = action.payload;

  DetailDatabaseModel _newDatabase = ctx.state.databaseModel!.copyWith(
      link: _link.keys.first,
      createdAt: DateTime.now(),
      episodeProgress: {0: 0},
      seekTo: {0: 0},
      individualSettingsModel: IndividualSettingsModel(autoSync: true),
      sourceName: _link.values.first);

  final _box = Hive.box<DetailDatabaseModel>(HIVE_DETAIL_BOX);
  _box.put(ctx.state.databaseModel!.ids.anilist, _newDatabase).whenComplete(() {
    ctx.dispatch(WatchActionCreator.updateDatabase(_newDatabase));
    Navigator.of(ctx.context).pop();
    ctx.dispatch(DetailActionCreator.fetchSimklEpisodes(_link.keys.first));
  });
}

void _onOpenSourceSelector(Action action, Context<WatchState> ctx) {
  showCupertinoModalBottomSheet(
      context: ctx.context,
      builder: (context) => SourceSearchPage(
            query: ctx.state.title,
            onLink: (Map<String, String> link) =>
                ctx.dispatch(WatchActionCreator.onPickedLink(link)),
          ));
}
