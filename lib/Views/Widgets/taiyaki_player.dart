import 'package:better_player/better_player.dart';
import 'package:fijkplayer/fijkplayer.dart';
import 'package:flutter/material.dart';
import 'package:hive/hive.dart';
import 'package:taiyaki/Models/SIMKL/models.dart';
import 'package:taiyaki/Models/Taiyaki/DetailDatabase.dart';
import 'package:taiyaki/Models/Taiyaki/Sync.dart';
import 'package:taiyaki/Services/API/Anilist+API.dart';
import 'package:taiyaki/Services/API/MyAnimeList+API.dart';
import 'package:taiyaki/Services/Hosts/Base.dart';
import 'package:taiyaki/Store/GlobalSettingsStore/GlobalSettingsStore.dart';
import 'package:taiyaki/Store/GlobalUserStore/GlobalUserStore.dart';
import 'package:taiyaki/Utils/strings.dart';
import 'package:taiyaki/Views/Pages/video_page/page.dart';
import 'package:taiyaki/Views/Widgets/taiyaki_image.dart';
import 'package:wakelock/wakelock.dart';

import 'TaiyakiControls.dart';
import 'TaiyakiSize.dart';

class TaiyakiPlayer extends StatefulWidget {
  final VoidCallback onFS;
  final bool isFullscreen, isPlaylistVisible;
  final HostsLinkModel hostsLinkModel;
  final VideoPageArguments args;
  final VoidCallback onSettings;
  final Function(SimklEpisodeModel) onEpisodeSelected;
  final Function(bool) handlePlaylist;

  final List<HostsLinkModel> qualities;

  BetterPlayerController? playerController;
  final List<SimklEpisodeModel> playlist;

  TaiyakiPlayer(
      {required this.isFullscreen,
      required this.onFS,
      required this.handlePlaylist,
      required this.isPlaylistVisible,
      required this.playerController,
      required this.qualities,
      this.playlist = const [],
      required this.onEpisodeSelected,
      required this.args,
      required this.onSettings,
      required this.hostsLinkModel});

  @override
  _TaiyakiPlayerState createState() => _TaiyakiPlayerState();
}

class _TaiyakiPlayerState extends State<TaiyakiPlayer>
    with SingleTickerProviderStateMixin {
  AnimationController? _controller;
  // FijkPlayer? playerController;

  Duration? videoDuration;
  bool didUpdateEpisode = false;
  // bool isPlaylistVisible = false;
  bool didAskTime = false;

  @override
  void didChangeDependencies() {
    print('changed video dependencies');

    super.didChangeDependencies();
  }

  @override
  void initState() {
    _controller = AnimationController(vsync: this);
    super.initState();
    _setUpPlayer();
  }

  @override
  void didUpdateWidget(covariant TaiyakiPlayer oldWidget) {
    if (oldWidget.args.episode != widget.args.episode ||
        oldWidget.hostsLinkModel.link != widget.hostsLinkModel.link) {
      _setUpPlayer(updateInProgress: true);
      this.setState(() {
        didUpdateEpisode = false;
        didAskTime = false;
      });
    }

    if (!widget.isFullscreen && widget.isPlaylistVisible)
      widget.handlePlaylist(false);

    super.didUpdateWidget(oldWidget);
  }

  void _setUpPlayer({bool updateInProgress = false}) async {
    print('the new link: ${widget.hostsLinkModel.link}');
    final _betterPlayerDataSource = BetterPlayerDataSource(
      BetterPlayerDataSourceType.network,
      widget.hostsLinkModel.link,
      headers: widget.hostsLinkModel.headers,
      cacheConfiguration: BetterPlayerCacheConfiguration(
        useCache: true,
      ),
      liveStream: false,
      resolutions: new Map.fromIterable(widget.qualities,
          key: (e) => e.name, value: (e) => e.link),
    );
    widget.playerController?.setupDataSource(
      _betterPlayerDataSource,
    );
    widget.playerController?.addEventsListener(_playerWatcher);
    // widget.playerController
    //     ?.setDataSource(widget.hostsLinkModel.link, autoPlay: true);
  }

  void _onPosUpdate(Duration pos) async {
    if (videoDuration != null && !didAskTime) {
      widget.playerController?.pause();
      this.setState(() => didAskTime = true);

      final _timer = widget.args.databaseModel.seekTo;
      final int? _match = _timer?.keys
          .firstWhere((element) => element == widget.args.episode.episode);
      if (_match != null) {
        final int _item = _timer![_match]!;
        widget.playerController?.pause();
        showDialog(
          context: context,
          builder: (builder) => AlertDialog(
            title: Text('Would you like to resume where you left off?',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            content: Text('Continue at: ${Duration(milliseconds: _item)}?'),
            actions: [
              ElevatedButton(
                  onPressed: () {
                    Navigator.of(context).pop();
                    widget.playerController?.play();
                  },
                  child: Text('Cancel')),
              ElevatedButton(
                  onPressed: () {
                    Navigator.of(context).pop();
                    widget.playerController
                        ?.seekTo(Duration(milliseconds: _item))
                        .whenComplete(() => widget.playerController?.play());
                  },
                  child: Text('Continue')),
            ],
          ),
        );
      } else {
        // widget.playerController?.start();
      }
    }

    final _box = Hive.box<DetailDatabaseModel>(HIVE_DETAIL_BOX);

    if (_box.isNotEmpty && (pos.inSeconds % 8 == 0)) {
      final DetailDatabaseModel? _currentAnime =
          _box.get(widget.args.databaseModel.ids.anilist);
      if (_currentAnime != null) {
        _currentAnime
          ..lastWatchingModel = LastWatchingModel(
              watchingEpisode: widget.args.episode,
              progress: pos.inSeconds.toDouble());
        (_currentAnime.episodeProgress ??= {}).addAll({
          widget.args.episode.episode:
              (pos.inSeconds / videoDuration!.inSeconds)
        });
        _currentAnime.seekTo!
            .addAll({widget.args.episode.episode: pos.inMilliseconds});
        await _box.put(widget.args.databaseModel.ids.anilist, _currentAnime);
      }
    }

    if (videoDuration != null) {
      if (((pos.inMilliseconds / videoDuration!.inMilliseconds) >= 0.75 &&
              (int.parse(pos.inSeconds.floor().toStringAsFixed(0)) % 4 == 0)) &&
          (widget.args.databaseModel.individualSettingsModel?.autoSync ??
              false) &&
          GlobalSettingsStore.store.getState().appSettings.updateAt75 &&
          !this.didUpdateEpisode) {
        //AUTO UPDATE
        this.setState(() => didUpdateEpisode = true);

        final _state = GlobalUserStore.store.getState();
        final _videoArgs = widget.args;

        final SyncModel _syncModel = SyncModel(
          progress: _videoArgs.episode.episode,
        );

        if (_state.anilistUser != null) {
          String _status = 'Watching';
          if ((_videoArgs.databaseModel.totalEpisodes != 0) &&
              (_videoArgs.episode.episode ==
                  _videoArgs.databaseModel.totalEpisodes))
            _status = 'Completed';

          AnilistAPI().syncProgress(_videoArgs.databaseModel.ids.anilist,
              _syncModel.copyWith(status: _status));
        }
        if (_state.myanimelistUser != null) {
          String _status = 'watching';
          if ((_videoArgs.databaseModel.totalEpisodes != 0) &&
              (_videoArgs.episode.episode ==
                  _videoArgs.databaseModel.totalEpisodes))
            _status = 'completed';

          MyAnimeListAPI().syncProgress(
              _videoArgs.databaseModel.ids.myanimelist,
              _syncModel.copyWith(status: _status));
        }
      }
      ;
    }
  }

  void _playerWatcher(BetterPlayerEvent events) {
    if (widget.playerController == null) return;

    if (events.betterPlayerEventType == BetterPlayerEventType.play) {
      Wakelock.enable();
    }

    if (events.betterPlayerEventType == BetterPlayerEventType.initialized) {
      final _value = widget.playerController!.videoPlayerController?.value;
      this.setState(() => videoDuration = _value?.duration);
    }

    if (events.betterPlayerEventType == BetterPlayerEventType.progress) {
      final event = widget.playerController!.videoPlayerController?.value;
      if (videoDuration == null) {
        this.setState(() => videoDuration = event?.duration);
      }
      if (event?.position != null) {
        _onPosUpdate(event!.position);
      }
    }

    if (events.betterPlayerEventType == BetterPlayerEventType.finished) {
      final _box = Hive.box<DetailDatabaseModel>(HIVE_DETAIL_BOX);
      if (_box.isNotEmpty) {
        final DetailDatabaseModel? _currentAnime =
            _box.get(widget.args.databaseModel.ids.anilist);
        if (_currentAnime != null) {
          (_currentAnime.episodeProgress ??= {}).addAll({
            widget.args.episode.episode: 100.0,
          });
          _box.put(widget.args.databaseModel.ids.anilist, _currentAnime);
        }
      }

      if (GlobalSettingsStore.store.getState().appSettings.autoChange100) {
        //Move To next video
        final _index = widget.playlist.indexWhere(
            (element) => element.episode == widget.args.episode.episode);
        if ((_index + 1) <= widget.playlist.length) {
          final _newEp = widget.playlist[_index + 1];
          widget.onEpisodeSelected(_newEp);
        }
      }
    }

    if (events.betterPlayerEventType == BetterPlayerEventType.finished ||
        events.betterPlayerEventType == BetterPlayerEventType.pause) {
      Wakelock.disable();
    }

    // FijkValue value = widget.playerController!.value;
    // this.setState(() => videoDuration = value.duration);
  }

  @override
  void dispose() {
    Wakelock.disable();
    widget.playerController?.videoPlayerController!.videoEventStreamController
        .close();
    widget.playerController?.removeEventsListener(_playerWatcher);
    widget.playerController?.dispose(forceDispose: true);
    // widget.playerController?.removeListener(_playerWatcher);

    // widget.playerController?.takeSnapShot().then((value) {
    //   String thumbnail = String.fromCharCodes(value);
    //   final _box = Hive.box<DetailDatabaseModel>(HIVE_DETAIL_BOX);
    //   DetailDatabaseModel _item =
    //       _box.get(widget.args.databaseModel.ids.anilist)!;
    //
    //   _item = _item.copyWith(
    //       lastWatchingModel: LastWatchingModel(
    //           watchingEpisode: _item.lastWatchingModel!.watchingEpisode
    //               .copyWith(thumbnail: thumbnail),
    //           progress: _item.lastWatchingModel!.progress));
    //   _box.put(widget.args.databaseModel.ids.anilist, _item);
    // });
    super.dispose();
    // playerController?.release();
    // playerController?.dispose();
  }

  void _onFS() {
    widget.onFS();
  }

  // void _onPlaylist() {
  //   this.setState(() => isPlaylistVisible = true);
  // }

  //
  void _onSettings() => widget.onSettings();

  @override
  Widget build(BuildContext context) {
    return Container(
        height:
            widget.isFullscreen ? TaiyakiSize.width : TaiyakiSize.height * 0.3,
        child: Stack(
          fit: StackFit.expand,
          children: [
            widget.playerController == null
                ? Container(
                    child: Center(
                    child: CircularProgressIndicator(),
                  ))
                : Container(
                    height: widget.isFullscreen
                        ? TaiyakiSize.width
                        : TaiyakiSize.height * 0.3,
                    child: BetterPlayer(
                      controller: widget.playerController!,
                    ),
                  ),
            // FijkView(
            //     color: Colors.black,
            //     height: widget.isFullscreen
            //         ? TaiyakiSize.width
            //         : TaiyakiSize.height * 0.3,
            //     player: widget.playerController,
            //     fs: widget.isFullscreen,
            //     panelBuilder: (FijkPlayer player, FijkData data,
            //             BuildContext context, Size size, text) =>
            //         taiakiControlBuilder(
            //           player,
            //           data,
            //           context,
            //           size,
            //           text,
            //           widget.isFullscreen,
            //           _onFS,
            //           _onPlaylist,
            //           _onSettings,
            //           widget.args,
            //         )),
            Visibility(
              visible: (widget.isFullscreen && widget.isPlaylistVisible),
              child: TaiyakiPlaylist(
                episode: widget.args.episode.episode,
                closePlaylist: () {
                  widget.handlePlaylist(false);
                  widget.playerController?.play();
                },
                onEpisodeSelected: (episode) {
                  widget.handlePlaylist(false);
                  widget.onEpisodeSelected(episode);
                },
                playlist: widget.playlist,
              ),
            )
          ],
        ));
  }
}

class TaiyakiPlaylist extends StatefulWidget {
  final List<SimklEpisodeModel> playlist;
  final VoidCallback closePlaylist;
  final int episode;
  final Function(SimklEpisodeModel) onEpisodeSelected;

  TaiyakiPlaylist(
      {required this.episode,
      this.playlist = const [],
      required this.onEpisodeSelected,
      required this.closePlaylist});

  @override
  __TaiyakiPlaylistState createState() =>
      __TaiyakiPlaylistState(episode: episode);
}

class __TaiyakiPlaylistState extends State<TaiyakiPlaylist> {
  int index;
  late SimklEpisodeModel _selectedEpisode;

  __TaiyakiPlaylistState({required int episode}) : index = episode;

  @override
  void initState() {
    Wakelock.enable();
    final SimklEpisodeModel? _ep =
        widget.playlist.firstWhere((element) => element.episode == index);
    if (_ep != null && widget.playlist.isNotEmpty)
      this.setState(() {
        _selectedEpisode = _ep;
      });
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      // width: TaiyakiSize.height * 0.12,
      child: Stack(
        fit: StackFit.expand,
        children: [
          AnimatedSwitcher(
            duration: const Duration(milliseconds: 1250),
            child: Container(
              key: UniqueKey(),
              child: TaiyakiImage(
                url: simklThumbnailGen(_selectedEpisode.thumbnail),
                height: TaiyakiSize.width,
                width: TaiyakiSize.height,
                // width: TaiyakiSize.height * 0.12,
              ),
            ),
          ),
          Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.centerLeft,
                end: Alignment.centerRight,
                colors: [
                  Colors.black.withOpacity(0.56),
                  Colors.black.withOpacity(0.75)
                ],
              ),
            ),
          ),
          Container(
              child: Row(
            children: [
              Padding(
                padding: const EdgeInsets.all(8.0),
                child: SizedBox(
                  width: TaiyakiSize.height * 0.34,
                  child: ListView.builder(
                    itemCount: widget.playlist.length,
                    itemBuilder: (context, index) => GestureDetector(
                      onTap: () {
                        this.setState(
                            () => _selectedEpisode = widget.playlist[index]);
                      },
                      child: _TaiyakiPlaylistEpisodeCells(
                          isCurrentIndex: _selectedEpisode.episode ==
                              widget.playlist[index].episode,
                          episode: widget.playlist[index]),
                    ),
                  ),
                ),
              ),
              Expanded(
                  child: Padding(
                padding: const EdgeInsets.fromLTRB(12.0, 15.0, 8.0, 8.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          Text(
                              'Episode ${_selectedEpisode.episode} - ${_selectedEpisode.title}',
                              textAlign: TextAlign.right,
                              style: TextStyle(
                                  fontWeight: FontWeight.w600,
                                  fontSize: 15,
                                  color: Colors.white)),
                          Padding(
                            padding: const EdgeInsets.only(top: 20.0),
                            child: SizedBox(
                                height: TaiyakiSize.height * 0.3,
                                child: SingleChildScrollView(
                                  child: Text(
                                      _selectedEpisode.description ??
                                          'No description for this episode',
                                      textAlign: TextAlign.right,
                                      style: TextStyle(
                                          fontSize: 14, color: Colors.white)),
                                )),
                          ),
                        ]),
                    Expanded(
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: [
                          ElevatedButton(
                            onPressed: widget.closePlaylist,
                            child: Text('Close'),
                            style: ElevatedButton.styleFrom(
                                primary: Colors.redAccent),
                          ),
                          SizedBox(width: 15),
                          SizedBox(
                            width: TaiyakiSize.height * 0.2,
                            child: ElevatedButton(
                                onPressed: () =>
                                    widget.onEpisodeSelected(_selectedEpisode),
                                child: Text('Play Now')),
                          )
                        ],
                      ),
                    )
                  ],
                ),
              ))
            ],
          )),
        ],
      ),
    );
  }
}

class _TaiyakiPlaylistEpisodeCells extends StatelessWidget {
  final SimklEpisodeModel episode;
  final bool isCurrentIndex;

  _TaiyakiPlaylistEpisodeCells(
      {required this.episode, required this.isCurrentIndex});

  @override
  Widget build(BuildContext context) {
    return Container(
        margin: const EdgeInsets.fromLTRB(8.0, 12.0, 8.0, 8.0),
        // width: TaiyakiSize.height * 0.,
        height: TaiyakiSize.height * 0.26,
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Container(
            decoration: BoxDecoration(
                border: Border.all(
                    width: isCurrentIndex ? 3 : 0, color: Colors.green)),
            child: TaiyakiImage(
              url: simklThumbnailGen(episode.thumbnail),
            ),
          ),
          SizedBox(height: 5),
          Text("Episode ${episode.episode}",
              style:
                  TextStyle(fontWeight: FontWeight.w600, color: Colors.white)),
          Text(episode.title,
              style: TextStyle(fontSize: 13, color: Colors.white), maxLines: 1)
        ]));
  }
}
