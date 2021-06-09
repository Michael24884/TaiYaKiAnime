import 'package:fish_redux/fish_redux.dart';
import 'package:taiyaki/Models/SIMKL/models.dart';
import 'package:taiyaki/Models/Taiyaki/DetailDatabase.dart';

enum WatchAction {
  action,
  updateDatabase,
  openSourceSelector,
  onPickedLink,
  moveToVideoPage,
}

class WatchActionCreator {
  static Action onAction() {
    return const Action(WatchAction.action);
  }

  static Action moveToVideoPage(SimklEpisodeModel args) {
    return Action(WatchAction.moveToVideoPage, payload: args);
  }

  static Action onPickedLink(Map<String, String> link) {
    return Action(WatchAction.onPickedLink, payload: link);
  }

  static Action openSourceSelector() {
    return const Action(WatchAction.openSourceSelector);
  }

  static Action updateDatabase(DetailDatabaseModel model) {
    return Action(WatchAction.updateDatabase, payload: model);
  }
}
