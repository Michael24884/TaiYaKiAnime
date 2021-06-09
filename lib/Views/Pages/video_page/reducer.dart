import 'package:fish_redux/fish_redux.dart';

import 'action.dart';
import 'state.dart';

Reducer<VideoState> buildReducer() {
  return asReducer(
    <Object, Reducer<VideoState>>{
      VideoAction.action: _onAction,
      VideoAction.updateFS: _onFS,
      VideoAction.setAvailableHosts: _setAvailableHosts,
      VideoAction.setAvailableQualities: _setAvailableQualities,
      VideoAction.setCurrentHost: _setCurrentHost,
      VideoAction.setCurrentQuality: _setCurrentQuality,
      VideoAction.expandSynopsis: _expandSynopsis,
      VideoAction.updateSimklEpisode: _updateSimklEpisode,
      VideoAction.togglePlaylist: _togglePlaylist,
    },
  );
}

VideoState _onAction(VideoState state, Action action) {
  final VideoState newState = state.clone();
  return newState;
}

VideoState _togglePlaylist(VideoState state, Action action) {
  final VideoState newState = state.clone();
  newState.isPlaylistVisible = action.payload;
  return newState;
}

VideoState _updateSimklEpisode(VideoState state, Action action) {
  final VideoState newState = state.clone();
  newState.allAvailableHosts = [];
  newState.allAvailableQualities = [];
  newState.currentSelectedHost = null;
  newState.currentSelectedQuality = null;
  newState.episode = action.payload;
  return newState;
}

VideoState _expandSynopsis(VideoState state, Action action) {
  final VideoState newState = state.clone();
  newState.synopsisExpanded = !state.synopsisExpanded;
  return newState;
}

VideoState _setCurrentHost(VideoState state, Action action) {
  final VideoState newState = state.clone();
  newState.currentSelectedHost = action.payload;
  return newState;
}

VideoState _setCurrentQuality(VideoState state, Action action) {
  final VideoState newState = state.clone();
  newState.currentSelectedQuality = action.payload;
  return newState;
}

VideoState _setAvailableQualities(VideoState state, Action action) {
  final VideoState newState = state.clone();
  newState.allAvailableQualities = action.payload;
  return newState;
}

VideoState _setAvailableHosts(VideoState state, Action action) {
  final VideoState newState = state.clone();
  newState.allAvailableHosts = action.payload;
  return newState;
}

VideoState _onFS(VideoState state, Action action) {
  final VideoState newState = state.clone();
  newState.isFullscreen = !state.isFullscreen;
  return newState;
}
