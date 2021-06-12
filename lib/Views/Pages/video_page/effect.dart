import 'package:better_player/better_player.dart';
import 'package:fijkplayer/fijkplayer.dart';
import 'package:fish_redux/fish_redux.dart';
import 'package:flutter/material.dart' hide Action;
import 'package:flutter/services.dart';
import 'package:hive/hive.dart';
import 'package:modal_bottom_sheet/modal_bottom_sheet.dart';
import 'package:taiyaki/Models/SIMKL/models.dart';
import 'package:taiyaki/Models/Taiyaki/DetailDatabase.dart';
import 'package:taiyaki/Services/Hosts/Base.dart';
import 'package:taiyaki/Services/Hosts/index.dart';
import 'package:taiyaki/Services/Sources/Base.dart';
import 'package:taiyaki/Services/Sources/index.dart';
import 'package:taiyaki/Utils/strings.dart';
import 'package:taiyaki/Views/Pages/video_page/page.dart';
import 'package:taiyaki/Views/Widgets/TaiyakiControls.dart';
import 'package:taiyaki/Views/Widgets/TaiyakiSize.dart';
import 'package:taiyaki/Views/Widgets/bottom_navigation.dart';

import 'action.dart';
import 'state.dart';

Effect<VideoState> buildEffect() {
  return combineEffects(<Object, Effect<VideoState>>{
    VideoAction.action: _onAction,
    Lifecycle.initState: _onInit,
    Lifecycle.dispose: _onDispose,
    VideoAction.onFS: _enterPage,
    VideoAction.changeVideoSource: _loadVideo,
    VideoAction.saveHistory: _saveHistory,
    VideoAction.saveLastWatchingModel: _saveLastWatchingModel,
    VideoAction.onSettings: _onSettings,
    VideoAction.setSimklEpisode: _setSimklEpisode,
  });
}

void _onAction(Action action, Context<VideoState> ctx) {}

void _onSettings(Action action, Context<VideoState> ctx) {
  void _showQualityDialog() {
    Navigator.of(ctx.context).pop();

    showDialog(
        context: ctx.context,
        builder: (builder) => AlertDialog(
              title: Text('Select a quality'),
              content: SizedBox(
                // height: TaiyakiSize.height * 0.28,
                width: TaiyakiSize.width * 0.45,
                child: ListView.builder(
                    shrinkWrap: true,
                    itemExtent: TaiyakiSize.height * 0.09,
                    itemCount: ctx.state.allAvailableQualities.length,
                    itemBuilder: (context, index) => Container(
                        child: GestureDetector(
                            onTap: () {
                              Navigator.of(context).pop();
                              ctx.dispatch(VideoActionCreator.setCurrentQuality(
                                  ctx.state.allAvailableQualities[index]));
                            },
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(ctx
                                    .state.allAvailableQualities[index].name),
                                if (ctx.state.allAvailableQualities[index]
                                        .name ==
                                    ctx.state.currentSelectedQuality?.name)
                                  Icon(
                                    Icons.check,
                                    color: Colors.green,
                                  )
                              ],
                            )))),
              ),
            ));
  }

  void _showHostDialog() {
    Navigator.of(ctx.context).pop();

    showDialog(
        context: ctx.context,
        builder: (builder) => AlertDialog(
              title: Text('Select a host'),
              content: SizedBox(
                height: TaiyakiSize.height * 0.28,
                width: TaiyakiSize.width * 0.45,
                child: ListView.builder(
                    shrinkWrap: true,
                    itemExtent: TaiyakiSize.height * 0.09,
                    itemCount: ctx.state.allAvailableHosts.length,
                    itemBuilder: (context, index) => Container(
                            child: SizedBox(
                          height: TaiyakiSize.height * 0.09,
                          child: GestureDetector(
                              onTap: () => ctx.dispatch(
                                  VideoActionCreator.setCurrentHost(
                                      ctx.state.allAvailableHosts[index])),
                              child: Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                children: [
                                  Text(ctx.state.allAvailableHosts[index].host),
                                  if (ctx.state.allAvailableHosts[index].host ==
                                      ctx.state.currentSelectedHost?.host)
                                    Icon(Icons.check, color: Colors.green)
                                ],
                              )),
                        ))),
              ),
            ));
  }

  final TextStyle style = TextStyle(fontWeight: FontWeight.w600, fontSize: 18);

  showCupertinoModalBottomSheet(
    enableDrag: false,
    context: ctx.context,
    builder: (builder) => Material(
      child: Container(
        height: TaiyakiSize.height * 0.25,
        child: Padding(
          padding: const EdgeInsets.all(8.0),
          child: ListView(
            itemExtent: TaiyakiSize.height * 0.12,
            children: [
              GestureDetector(
                onTap: _showQualityDialog,
                child: Container(
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Quality',
                        style: style,
                      ),
                      Text(ctx.state?.currentSelectedQuality?.name ?? '???'),
                    ],
                  ),
                ),
              ),
              GestureDetector(
                onTap: _showHostDialog,
                child: Container(
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('Server', style: style),
                      Text(ctx.state?.currentSelectedHost?.host ?? '???'),
                    ],
                  ),
                ),
              )
            ],
          ),
        ),
      ),
    ),
    expand: false,
    barrierColor: Colors.black54,
  );
}

void _saveLastWatchingModel(Action action, Context<VideoState> ctx) async {
  final _box = Hive.box<DetailDatabaseModel>(HIVE_DETAIL_BOX)
      .get(ctx.state.detailDatabaseModel!.ids.anilist);

  if (_box == null) return;
  _box
    ..lastWatchingModel =
        LastWatchingModel(watchingEpisode: ctx.state.episode!, progress: 0);

  await Hive.box(HIVE_DETAIL_BOX).put(_box.ids.anilist, _box);
}

void _saveHistory(Action action, Context<VideoState> ctx) {
  final _state = ctx.state;
  final _box = Hive.box<HistoryModel>(HIVE_HISTORY_BOX);
  final HistoryModel _history = new HistoryModel(
      title: _state.detailDatabaseModel!.title,
      coverImage: _state.detailDatabaseModel!.coverImage,
      sourceName: _state.detailDatabaseModel!.sourceName!,
      id: _state.detailDatabaseModel!.ids.anilist,
      lastModified: DateTime.now());
  _box.put(_history.id, _history);
}

void _setUpPlayer(Action action, Context<VideoState> ctx) {
  final BetterPlayerConfiguration _betterPlayerConfiguration =
      BetterPlayerConfiguration(
          allowedScreenSleep: false,
          autoPlay: true,
          handleLifecycle: false,
          autoDispose: false,
          controlsConfiguration: BetterPlayerControlsConfiguration(
              playerTheme: BetterPlayerTheme.custom,
              customControlsBuilder: (BetterPlayerController _) {
                return TaiyakiControls(
                    togglePlaylist: () =>
                        ctx.dispatch(VideoActionCreator.togglePlaylist(true)),
                    episode: ctx.state.episode!,
                    controlsConfiguration: BetterPlayerControlsConfiguration(
                      controlsHideTime: const Duration(milliseconds: 250),
                      controlBarHeight: 55,
                    ),
                    onControlsVisibilityChanged: (bool controlsVisible) {},
                    onFS: () => ctx.dispatch(VideoActionCreator.onFS()),
                    isFullscreen: ctx.state.isFullscreen);
              }),
          routePageBuilder: (BuildContext context,
              Animation<double> enterFS,
              Animation<double> exitFS,
              BetterPlayerControllerProvider provider) {
            return Container();
          }
          // routePageBuilder:
          );
  ctx.state.videoController = new BetterPlayerController(
    _betterPlayerConfiguration,
  );
  // ctx.state.playerController = new FijkPlayer()
  //   // ..setOption(
  //   //     FijkOption.formatCategory, 'headers', widget.hostsLinkModel.headers)
  //   ..setOption(FijkOption.playerCategory, 'mediacodec-all-videos', 1)
  //   ..setOption(FijkOption.hostCategory, 'request-screen-on', 1);
  // ..setDataSource(widget.hostsLinkModel.link, autoPlay: true)
  // ..addListener(_playerWatcher)
  // ..onCurrentPosUpdate.listen(_onPosUpdate);

  ctx.dispatch(VideoActionCreator.changeVideoSource(VideoPageArguments(
      episode: ctx.state.episode!,
      databaseModel: ctx.state.detailDatabaseModel!)));
}

void _onInit(Action action, Context<VideoState> ctx) async {
  _setUpPlayer(action, ctx);
}

void _setSimklEpisode(Action action, Context<VideoState> ctx) async {
  // ctx.state.playerController?.release();
  // ctx.state.playerController?.dispose();

  // if (ctx.state.playerController?.dataSource != null) {
  // ctx.state.playerController = new FijkPlayer();
  // }

  ctx.state.videoController =
      new BetterPlayerController(BetterPlayerConfiguration());
  final SimklEpisodeModel episode = action.payload;

  ctx.dispatch(VideoActionCreator.updateSimklEpisode(episode));

  ctx.dispatch(VideoActionCreator.changeVideoSource(VideoPageArguments(
      episode: episode, databaseModel: ctx.state.detailDatabaseModel!)));

  _setUpPlayer(action, ctx);
}

void _loadVideo(Action action, Context<VideoState> ctx) async {
  final VideoPageArguments _data = action.payload;
  final List<SourceEpisodeHostsModel> _hosts =
      await nameToSourceBase(_data.databaseModel.sourceName!)
          .getEpisodeHosts(_data.episode.link!);

  ctx.dispatch(VideoActionCreator.setAvailableHosts(_hosts));

  final SourceEpisodeHostsModel stream =
      _hosts.firstWhere((e) => e.host.toLowerCase() == 'xstreamcdn');

  ctx.dispatch(VideoActionCreator.setCurrentHost(stream));

  final List<HostsLinkModel> _hostList =
      await nameToHostsBase(stream.host).getLinks(stream.hostLink);
  if (_hostList.isEmpty) {
    //handle error
    return;
  }
  ctx.dispatch(VideoActionCreator.setAvailableQualities(_hostList));
  ctx.dispatch(VideoActionCreator.setCurrentQuality(_hostList.first));
  ctx.dispatch(VideoActionCreator.saveHistory());
}

void _onDispose(Action action, Context<VideoState> ctx) {
  _exitPage();
  // ctx.state.playerController?.release();
}

void _enterPage(Action action, Context<VideoState> ctx) {
  if (ctx.state.isFullscreen) {
    _exitPage();
    ctx.dispatch(VideoActionCreator.onUpdateFS());
    return;
  }
  SystemChrome.setPreferredOrientations([
    DeviceOrientation.landscapeLeft,
    DeviceOrientation.landscapeRight,
  ]);
  SystemChrome.setEnabledSystemUIOverlays([]);
  ctx.dispatch(VideoActionCreator.onUpdateFS());
}

void _exitPage() {
  SystemChrome.setPreferredOrientations([DeviceOrientation.portraitUp]);
  SystemChrome.setEnabledSystemUIOverlays(SystemUiOverlay.values);
}
