// Dart imports:
import 'dart:async';

// Project imports:
import 'package:better_player/src/configuration/better_player_controls_configuration.dart';
import 'package:better_player/src/controls/better_player_clickable_widget.dart';
import 'package:better_player/src/controls/better_player_controls_state.dart';
import 'package:better_player/src/controls/better_player_material_progress_bar.dart';
import 'package:better_player/src/controls/better_player_progress_colors.dart';
import 'package:better_player/src/core/better_player_controller.dart';
import 'package:better_player/src/core/better_player_utils.dart';
import 'package:better_player/src/video_player/video_player.dart';

// Flutter imports:
import 'package:flutter/material.dart';
import 'package:taiyaki/Models/SIMKL/models.dart';
import 'package:taiyaki/Services/Hosts/Base.dart';

import 'TaiyakiSize.dart';

// import 'better_player_clickable_widget.dart';

class TaiyakiControls extends StatefulWidget {
  ///Callback used to send information if player bar is hidden or not
  final Function(bool visbility) onControlsVisibilityChanged;
  final VoidCallback onFS;
  final bool isFullscreen;
  final VoidCallback togglePlaylist;

  final SimklEpisodeModel episode;

  ///Controls config
  final BetterPlayerControlsConfiguration controlsConfiguration;

  const TaiyakiControls({
    Key? key,
    required this.togglePlaylist,
    required this.episode,
    required this.onFS,
    required this.isFullscreen,
    required this.onControlsVisibilityChanged,
    required this.controlsConfiguration,
  }) : super(key: key);

  @override
  State<StatefulWidget> createState() {
    return _TaiyakiControlsState();
  }
}

class _TaiyakiControlsState extends BetterPlayerControlsState<TaiyakiControls> {
  VideoPlayerValue? _latestValue;
  double? _latestVolume;
  bool _hideStuff = true;
  Timer? _hideTimer;
  Timer? _initTimer;
  Timer? _showAfterExpandCollapseTimer;
  bool _displayTapped = false;
  bool _wasLoading = false;
  VideoPlayerController? _controller;
  BetterPlayerController? _betterPlayerController;
  StreamSubscription? _controlsVisibilityStreamSubscription;

  BetterPlayerControlsConfiguration get _controlsConfiguration =>
      widget.controlsConfiguration;

  @override
  VideoPlayerValue? get latestValue => _latestValue;

  @override
  BetterPlayerController? get betterPlayerController => _betterPlayerController;

  @override
  BetterPlayerControlsConfiguration get betterPlayerControlsConfiguration =>
      _controlsConfiguration;

  @override
  Widget build(BuildContext context) {
    _wasLoading = isLoading(_latestValue);
    if (_latestValue?.hasError == true) {
      return Container(
        color: Colors.black,
        child: _buildErrorWidget(),
      );
    }
    return Stack(
      fit: StackFit.expand,
      children: [
        AnimatedOpacity(
          opacity: _hideStuff ? 0 : 1,
          duration: widget.controlsConfiguration.controlsHideTime,
          child: Container(color: Colors.black.withOpacity(0.65)),
        ),
        GestureDetector(
          onTap: () {
            _hideStuff
                ? cancelAndRestartTimer()
                : setState(() {
                    _hideStuff = true;
                  });
          },
          onDoubleTap: () {
            cancelAndRestartTimer();
            _onPlayPause();
          },
          child: AbsorbPointer(
            absorbing: _hideStuff,
            child: Column(
              children: [
                _buildTopBar(),
                if (_wasLoading)
                  Expanded(child: Center(child: _buildLoadingWidget()))
                else
                  _buildHitArea(),
                _buildBottomBar(),
              ],
            ),
          ),
        ),
      ],
    );
  }

  @override
  void dispose() {
    _dispose();
    super.dispose();
  }

  void _dispose() {
    _controller?.removeListener(_updateState);
    _hideTimer?.cancel();
    _initTimer?.cancel();
    _showAfterExpandCollapseTimer?.cancel();
    _controlsVisibilityStreamSubscription?.cancel();
  }

  @override
  void didChangeDependencies() {
    final _oldController = _betterPlayerController;
    _betterPlayerController = BetterPlayerController.of(context);
    _controller = _betterPlayerController!.videoPlayerController;
    _latestValue = _controller!.value;

    if (_oldController != _betterPlayerController) {
      _dispose();
      _initialize();
    }

    super.didChangeDependencies();
  }

  Widget _buildErrorWidget() {
    final errorBuilder =
        _betterPlayerController!.betterPlayerConfiguration.errorBuilder;
    if (errorBuilder != null) {
      return errorBuilder(
          context,
          _betterPlayerController!
              .videoPlayerController!.value.errorDescription);
    } else {
      final textStyle = TextStyle(color: _controlsConfiguration.textColor);
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.warning,
              color: _controlsConfiguration.iconsColor,
              size: 42,
            ),
            Text(
              _betterPlayerController!.translations.generalDefaultError,
              style: textStyle,
            ),
            if (_controlsConfiguration.enableRetry)
              TextButton(
                onPressed: () {
                  _betterPlayerController!.retryDataSource();
                },
                child: Text(
                  _betterPlayerController!.translations.generalRetry,
                  style: textStyle.copyWith(fontWeight: FontWeight.bold),
                ),
              )
          ],
        ),
      );
    }
  }

  Widget _buildTopBar() {
    if (!betterPlayerController!.controlsEnabled) {
      return const SizedBox();
    }

    return Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
      AnimatedOpacity(
        opacity: _hideStuff ? 0.0 : 1.0,
        duration: _controlsConfiguration.controlsHideTime,
        onEnd: _onPlayerHide,
        child: Container(
          width: widget.isFullscreen ? TaiyakiSize.height : null,
          height: _controlsConfiguration.controlBarHeight,
          child: Padding(
            padding: const EdgeInsets.all(6.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                if (widget.isFullscreen)
                  SizedBox(
                    width: TaiyakiSize.height * 0.8,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(widget.episode.title,
                            style:
                                const TextStyle(fontWeight: FontWeight.w700)),
                        Text('Episode ${widget.episode.episode}'),
                      ],
                    ),
                  )
                else
                  SizedBox(
                    width: TaiyakiSize.width * 0.7,
                  ),
                Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    if (widget.isFullscreen)
                      IconButton(
                        icon: Icon(Icons.featured_play_list),
                        onPressed: () {
                          _controller?.pause();
                          widget.togglePlaylist();
                        },
                      )
                    else
                      const SizedBox(width: 45),
                    IconButton(
                      icon: Icon(Icons.more_vert),
                      onPressed: onShowMoreClicked,
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      )

      // if (_controlsConfiguration.enablePip)
      //   _buildPipButtonWrapperWidget(_hideStuff, _onPlayerHide)
      // else
      //   const SizedBox(),
      // if (_controlsConfiguration.enableOverflowMenu)
      //   AnimatedOpacity(
      //     opacity: _hideStuff ? 0.0 : 1.0,
      //     duration: _controlsConfiguration.controlsHideTime,
      //     onEnd: _onPlayerHide,
      //     child: Container(
      //       height: _controlsConfiguration.controlBarHeight,
      //       child: Row(
      //         mainAxisAlignment: MainAxisAlignment.end,
      //         children: [
      //           _buildMoreButton(),
      //         ],
      //       ),
      //     ),
      //   )
      // else
      //   const SizedBox()
    ]);
  }

  Widget _buildPipButton() {
    return BetterPlayerMaterialClickableWidget(
      onTap: () {
        betterPlayerController!.enablePictureInPicture(
            betterPlayerController!.betterPlayerGlobalKey!);
      },
      child: Padding(
        padding: const EdgeInsets.all(8),
        child: Icon(
          betterPlayerControlsConfiguration.pipMenuIcon,
          color: betterPlayerControlsConfiguration.iconsColor,
        ),
      ),
    );
  }

  Widget _buildPipButtonWrapperWidget(
      bool hideStuff, void Function() onPlayerHide) {
    return FutureBuilder<bool>(
      future: betterPlayerController!.isPictureInPictureSupported(),
      builder: (context, snapshot) {
        final bool isPipSupported = snapshot.data ?? false;
        if (isPipSupported &&
            _betterPlayerController!.betterPlayerGlobalKey != null) {
          return AnimatedOpacity(
            opacity: hideStuff ? 0.0 : 1.0,
            duration: betterPlayerControlsConfiguration.controlsHideTime,
            onEnd: onPlayerHide,
            child: Container(
              height: betterPlayerControlsConfiguration.controlBarHeight,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  _buildPipButton(),
                ],
              ),
            ),
          );
        } else {
          return const SizedBox();
        }
      },
    );
  }

  Widget _buildMoreButton() {
    return BetterPlayerMaterialClickableWidget(
      onTap: () {
        onShowMoreClicked();
      },
      child: Padding(
        padding: const EdgeInsets.all(8),
        child: Icon(
          _controlsConfiguration.overflowMenuIcon,
          color: _controlsConfiguration.iconsColor,
        ),
      ),
    );
  }

  Widget _buildBottomBar() {
    if (!betterPlayerController!.controlsEnabled) {
      return const SizedBox();
    }
    return AnimatedOpacity(
      opacity: _hideStuff ? 0.0 : 1.0,
      duration: _controlsConfiguration.controlsHideTime,
      onEnd: _onPlayerHide,
      child: Container(
        height: _controlsConfiguration.controlBarHeight,
        // color: _controlsConfiguration.controlBarColor,
        child: Row(
          children: [
            // if (_controlsConfiguration.enablePlayPause)
            //   _buildPlayPause(_controller!)
            // else
            const SizedBox(),
            if (_betterPlayerController!.isLiveStream())
              _buildLiveWidget()
            else
              _controlsConfiguration.enableProgressText
                  ? _buildPosition()
                  : const SizedBox(),
            if (_betterPlayerController!.isLiveStream())
              const SizedBox()
            else
              _controlsConfiguration.enableProgressBar
                  ? _buildProgressBar()
                  : const SizedBox(),
            if (_controlsConfiguration.enableMute)
              _buildMuteButton(_controller)
            else
              const SizedBox(),
            if (_controlsConfiguration.enableFullscreen)
              _buildExpandButton()
            else
              const SizedBox(),
          ],
        ),
      ),
    );
  }

  Widget _buildLiveWidget() {
    return Expanded(
      child: Text(
        _betterPlayerController!.translations.controlsLive,
        style: TextStyle(
            color: _controlsConfiguration.liveTextColor,
            fontWeight: FontWeight.bold),
      ),
    );
  }

  Widget _buildExpandButton() {
    return BetterPlayerMaterialClickableWidget(
      onTap: _onExpandCollapse,
      child: AnimatedOpacity(
        opacity: _hideStuff ? 0.0 : 1.0,
        duration: _controlsConfiguration.controlsHideTime,
        child: Container(
          height: _controlsConfiguration.controlBarHeight,
          margin: const EdgeInsets.only(right: 12.0),
          padding: const EdgeInsets.symmetric(horizontal: 8.0),
          child: Center(
            child: Icon(
              widget.isFullscreen
                  ? _controlsConfiguration.fullscreenDisableIcon
                  : _controlsConfiguration.fullscreenEnableIcon,
              color: _controlsConfiguration.iconsColor,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildHitArea() {
    if (!betterPlayerController!.controlsEnabled) {
      return const SizedBox();
    }
    return Expanded(
      child: Container(
        color: Colors.transparent,
        child: Center(
          child: AnimatedOpacity(
            opacity: _hideStuff ? 0.0 : 1.0,
            duration: _controlsConfiguration.controlsHideTime,
            child: Stack(
              fit: StackFit.expand,
              children: [
                _buildMiddleRow(),
                _buildNextVideoWidget(),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildMiddleRow() {
    return Container(
      // height: ,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          // if (_controlsConfiguration.enableSkips)
          _buildSkipButton(),
          // else
          //   const SizedBox(),
          // _buildReplayButton(),
          _buildPlayPauseButton(),
          if (_controlsConfiguration.enableSkips)
            _buildForwardButton()
          else
            const SizedBox(),
        ],
      ),
    );
  }

  Widget _buildHitAreaClickableButton(
      {Widget? icon, required void Function() onClicked}) {
    return BetterPlayerMaterialClickableWidget(
      onTap: onClicked,
      child: Align(
        child: Container(
          decoration: BoxDecoration(
            // color: _controlsConfiguration.controlBarColor,
            borderRadius: BorderRadius.circular(48),
          ),
          child: Padding(
            padding: const EdgeInsets.all(1),
            child: Stack(
              children: [icon!],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildSkipButton() {
    return IconButton(
      icon: Icon(
        Icons.fast_rewind,
        size: 45,
        color: _controlsConfiguration.iconsColor,
      ),
      onPressed: skipBack,
    );
  }

  Widget _buildForwardButton() {
    return IconButton(
      icon: Icon(
        Icons.fast_forward,
        size: 45,
        color: _controlsConfiguration.iconsColor,
      ),
      onPressed: skipForward,
    );
  }

  Widget _buildPlayPauseButton() {
    return IconButton(
      icon: Icon(
        _controller!.value.isPlaying ? Icons.pause : Icons.play_arrow,
        size: 65,
        color: _controlsConfiguration.iconsColor,
      ),
      onPressed: _onPlayPause,
    );
    //   icon: Icon(
    //     _controller!.value.isPlaying ? Icons.pause : Icons.play_arrow,
    //     size: 32,
    //     color: _controlsConfiguration.iconsColor,
    //   ),
    //   onClicked: _onPlayPause,
    // );
  }

  Widget _buildReplayButton() {
    final bool isFinished = isVideoFinished(_latestValue);
    if (!isFinished) {
      return const SizedBox();
    }

    return _buildHitAreaClickableButton(
      icon: Icon(
        Icons.replay,
        size: 32,
        color: _controlsConfiguration.iconsColor,
      ),
      onClicked: () {
        if (_latestValue != null && _latestValue!.isPlaying) {
          if (_displayTapped) {
            setState(() {
              _hideStuff = true;
            });
          } else {
            cancelAndRestartTimer();
          }
        } else {
          _onPlayPause();

          setState(() {
            _hideStuff = true;
          });
        }
      },
    );
  }

  Widget _buildNextVideoWidget() {
    return StreamBuilder<int?>(
      stream: _betterPlayerController!.nextVideoTimeStreamController.stream,
      builder: (context, snapshot) {
        final time = snapshot.data;
        if (time != null && time > 0) {
          return BetterPlayerMaterialClickableWidget(
            onTap: () {
              _betterPlayerController!.playNextVideo();
            },
            child: Align(
              alignment: Alignment.bottomRight,
              child: Container(
                margin: const EdgeInsets.only(bottom: 4, right: 24),
                decoration: BoxDecoration(
                  color: _controlsConfiguration.controlBarColor,
                  borderRadius: BorderRadius.circular(32),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(12),
                  child: Text(
                    "${_betterPlayerController!.translations.controlsNextVideoIn} $time ...",
                    style: const TextStyle(color: Colors.white),
                  ),
                ),
              ),
            ),
          );
        } else {
          return const SizedBox();
        }
      },
    );
  }

  Widget _buildMuteButton(
    VideoPlayerController? controller,
  ) {
    return BetterPlayerMaterialClickableWidget(
      onTap: () {
        cancelAndRestartTimer();
        if (_latestValue!.volume == 0) {
          _betterPlayerController!.setVolume(_latestVolume ?? 0.5);
        } else {
          _latestVolume = controller!.value.volume;
          _betterPlayerController!.setVolume(0.0);
        }
      },
      child: AnimatedOpacity(
        opacity: _hideStuff ? 0.0 : 1.0,
        duration: _controlsConfiguration.controlsHideTime,
        child: ClipRect(
          child: Container(
            height: _controlsConfiguration.controlBarHeight,
            padding: const EdgeInsets.symmetric(horizontal: 8),
            child: Icon(
              (_latestValue != null && _latestValue!.volume > 0)
                  ? _controlsConfiguration.muteIcon
                  : _controlsConfiguration.unMuteIcon,
              color: _controlsConfiguration.iconsColor,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildPlayPause(VideoPlayerController controller) {
    return BetterPlayerMaterialClickableWidget(
      onTap: _onPlayPause,
      child: Container(
        height: _controlsConfiguration.controlBarHeight,
        margin: const EdgeInsets.symmetric(horizontal: 4),
        padding: const EdgeInsets.symmetric(horizontal: 12),
        child: Icon(
          controller.value.isPlaying
              ? _controlsConfiguration.pauseIcon
              : _controlsConfiguration.playIcon,
          color: _controlsConfiguration.iconsColor,
        ),
      ),
    );
  }

  Widget _buildPosition() {
    final position =
        _latestValue != null ? _latestValue!.position : Duration.zero;
    final duration = _latestValue != null && _latestValue!.duration != null
        ? _latestValue!.duration!
        : Duration.zero;

    return Padding(
      padding: const EdgeInsets.only(right: 24),
      child: Text(
        '${BetterPlayerUtils.formatDuration(position)} / ${BetterPlayerUtils.formatDuration(duration)}',
        style: TextStyle(
          fontSize: 14,
          color: _controlsConfiguration.textColor,
          decoration: TextDecoration.none,
        ),
      ),
    );
  }

  @override
  void cancelAndRestartTimer() {
    _hideTimer?.cancel();
    _startHideTimer();

    setState(() {
      _hideStuff = false;
      _displayTapped = true;
    });
  }

  Future<void> _initialize() async {
    _controller!.addListener(_updateState);

    _updateState();

    if ((_controller!.value.isPlaying) ||
        _betterPlayerController!.betterPlayerConfiguration.autoPlay) {
      _startHideTimer();
    }

    if (_controlsConfiguration.showControlsOnInitialize) {
      _initTimer = Timer(const Duration(milliseconds: 200), () {
        setState(() {
          _hideStuff = false;
        });
      });
    }

    _controlsVisibilityStreamSubscription =
        _betterPlayerController!.controlsVisibilityStream.listen((state) {
      setState(() {
        _hideStuff = !state;
      });
      if (!_hideStuff) {
        cancelAndRestartTimer();
      }
    });
  }

  void _onExpandCollapse() {
    setState(() {
      _hideStuff = true;

      widget.onFS();
      _showAfterExpandCollapseTimer =
          Timer(_controlsConfiguration.controlsHideTime, () {
        setState(() {
          cancelAndRestartTimer();
        });
      });
    });
  }

  void _onPlayPause() {
    bool isFinished = false;

    if (_latestValue?.position != null && _latestValue?.duration != null) {
      isFinished = _latestValue!.position >= _latestValue!.duration!;
    }

    setState(() {
      if (_controller!.value.isPlaying) {
        _hideStuff = false;
        _hideTimer?.cancel();
        _betterPlayerController!.pause();
      } else {
        cancelAndRestartTimer();

        if (!_controller!.value.initialized) {
        } else {
          if (isFinished) {
            _betterPlayerController!.seekTo(const Duration());
          }
          _betterPlayerController!.play();
          _betterPlayerController!.cancelNextVideoTimer();
        }
      }
    });
  }

  void _startHideTimer() {
    if (_betterPlayerController!.controlsAlwaysVisible) {
      return;
    }
    _hideTimer = Timer(const Duration(seconds: 3), () {
      setState(() {
        _hideStuff = true;
      });
    });
  }

  void _updateState() {
    if (mounted) {
      if (!_hideStuff ||
          isVideoFinished(_controller!.value) ||
          _wasLoading ||
          isLoading(_controller!.value)) {
        setState(() {
          _latestValue = _controller!.value;
          if (isVideoFinished(_latestValue)) {
            _hideStuff = false;
          }
        });
      }
    }
  }

  Widget _buildProgressBar() {
    return Expanded(
      child: Padding(
        padding: const EdgeInsets.only(right: 20),
        child: BetterPlayerMaterialVideoProgressBar(
          _controller,
          _betterPlayerController,
          onDragStart: () {
            _hideTimer?.cancel();
          },
          onDragEnd: () {
            _startHideTimer();
          },
          colors: BetterPlayerProgressColors(
              playedColor: _controlsConfiguration.progressBarPlayedColor,
              handleColor: _controlsConfiguration.progressBarHandleColor,
              bufferedColor: _controlsConfiguration.progressBarBufferedColor,
              backgroundColor:
                  _controlsConfiguration.progressBarBackgroundColor),
        ),
      ),
    );
  }

  void _onPlayerHide() {
    _betterPlayerController!.toggleControlsVisibility(!_hideStuff);
    widget.onControlsVisibilityChanged(!_hideStuff);
  }

  Widget? _buildLoadingWidget() {
    if (_controlsConfiguration.loadingWidget != null) {
      return _controlsConfiguration.loadingWidget;
    }

    return CircularProgressIndicator(
      valueColor:
          AlwaysStoppedAnimation<Color>(_controlsConfiguration.loadingColor),
    );
  }
}
