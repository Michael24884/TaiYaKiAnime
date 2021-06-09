import 'package:fish_redux/fish_redux.dart';
import 'package:taiyaki/Models/SIMKL/models.dart';
import 'package:taiyaki/Services/Hosts/Base.dart';
import 'package:taiyaki/Services/Sources/Base.dart';
import 'package:taiyaki/Views/Pages/video_page/page.dart';

//TODO replace with your own action
enum VideoAction {
  action,
  onFS,
  updateFS,
  changeVideoSource,
  expandSynopsis,
  togglePlaylist,

  setAvailableQualities,
  setAvailableHosts,
  setCurrentQuality,
  setCurrentHost,
  setSimklEpisode,
  updateSimklEpisode,

  saveHistory,
  saveLastWatchingModel,

  syncWatchList,

  onSettings,
}

class VideoActionCreator {
  static Action onAction() {
    return const Action(VideoAction.action);
  }

  static Action updateSimklEpisode(SimklEpisodeModel episodeModel) {
    return Action(VideoAction.updateSimklEpisode, payload: episodeModel);
  }

  static Action setSimklEpisode(SimklEpisodeModel episodeModel) {
    return Action(VideoAction.setSimklEpisode, payload: episodeModel);
  }

  static Action togglePlaylist(bool open) {
    return Action(VideoAction.togglePlaylist, payload: open);
  }

  static Action onSettings() {
    return const Action(VideoAction.onSettings);
  }

  static Action expandSynopsis() {
    return const Action(VideoAction.expandSynopsis);
  }

  static Action syncWatchList() {
    return const Action(
      VideoAction.syncWatchList,
    );
  }

  static Action saveLastWatchingModel() {
    return const Action(VideoAction.saveLastWatchingModel);
  }

  static Action saveHistory() {
    return const Action(VideoAction.saveHistory);
  }

  static Action setCurrentQuality(HostsLinkModel quality) {
    return Action(VideoAction.setCurrentQuality, payload: quality);
  }

  static Action setCurrentHost(SourceEpisodeHostsModel host) {
    return Action(VideoAction.setCurrentHost, payload: host);
  }

  static Action setAvailableQualities(List<HostsLinkModel> hosts) {
    return Action(VideoAction.setAvailableQualities, payload: hosts);
  }

  static Action setAvailableHosts(List<SourceEpisodeHostsModel> hosts) {
    return Action(VideoAction.setAvailableHosts, payload: hosts);
  }

  static Action changeVideoSource(VideoPageArguments args) {
    return Action(VideoAction.changeVideoSource, payload: args);
  }

  static Action onFS() {
    return const Action(VideoAction.onFS);
  }

  static Action onUpdateFS() {
    return const Action(VideoAction.updateFS);
  }
}
