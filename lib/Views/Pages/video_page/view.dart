import 'package:fish_redux/fish_redux.dart';
import 'package:flutter/material.dart';
import 'package:taiyaki/Views/Pages/video_page/page.dart';
import 'package:taiyaki/Views/Widgets/TaiyakiSize.dart';
import 'package:taiyaki/Views/Widgets/taiyaki_player.dart';

import 'action.dart';
import 'state.dart';

Widget buildView(VideoState state, Dispatch dispatch, ViewService viewService) {
  return WillPopScope(
    onWillPop: () async {
      if (state.isFullscreen) {
        dispatch(VideoActionCreator.onFS());
        return false;
      }
      return true;
    },
    child: Scaffold(
      appBar: state.isFullscreen ? null : AppBar(),
      body: Container(
        // height: !state.isFullscreen ? TaiyakiSize.height * 0.3 : null,
        child: Column(
          children: [
            state.currentSelectedQuality == null
                ? Container(
                    height: !state.isFullscreen
                        ? TaiyakiSize.height * 0.3
                        : TaiyakiSize.width,
                    color: Theme.of(viewService.context).colorScheme.surface,
                    child: Center(
                      child: CircularProgressIndicator(),
                    ),
                  )
                // : Container(
                //     color: Colors.green, height: TaiyakiSize.height * 0.3),

                : TaiyakiPlayer(
                    handlePlaylist: (value) =>
                        dispatch(VideoActionCreator.togglePlaylist(value)),
                    isPlaylistVisible: state.isPlaylistVisible,
                    playerController: state.videoController,
                    args: VideoPageArguments(
                        episode: state.episode!,
                        databaseModel: state.detailDatabaseModel!),
                    hostsLinkModel: state.currentSelectedQuality!,
                    isFullscreen: state.isFullscreen,
                    onFS: () => dispatch(
                      VideoActionCreator.onFS(),
                    ),
                    qualities: state.allAvailableQualities,
                    onEpisodeSelected: (episode) =>
                        dispatch(VideoActionCreator.setSimklEpisode(episode)),
                    playlist: state.playlist,
                    onSettings: () => dispatch(VideoActionCreator.onSettings()),
                  ),
            if (!state.isFullscreen)
              Expanded(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(8.0, 8.0, 8.0, 0.0),
                  child: SingleChildScrollView(
                    child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(state.episode!.title,
                              style: TextStyle(
                                  fontWeight: FontWeight.w800, fontSize: 16)),
                          Text('Episode ' + state.episode!.episode.toString(),
                              style: TextStyle(fontWeight: FontWeight.w600)),
                          Padding(
                              padding: const EdgeInsets.only(top: 12),
                              child: GestureDetector(
                                onTap: () => dispatch(
                                    VideoActionCreator.expandSynopsis()),
                                child: Text(
                                    state.episode!.description ??
                                        'No description available',
                                    maxLines: state.synopsisExpanded ? 250 : 3,
                                    overflow: TextOverflow.ellipsis),
                              )),
                          viewService.buildComponent('queue_component'),
                        ]),
                  ),
                ),
              )
          ],
        ),
      ),
    ),
  );
}
