import 'package:fish_redux/fish_redux.dart';
import 'package:taiyaki/Models/Taiyaki/Sync.dart';

//TODO replace with your own action
enum SyncAction { action, onUpdateAnilist, onUpdateMAL, onUpdateSimkl }

class SyncActionCreator {
  static Action onAction() {
    return const Action(SyncAction.action);
  }

  static Action onUpdateAnilist(SyncModel model) {
    return Action(SyncAction.onUpdateAnilist, payload: model);
  }

  static Action onUpdateMAL(SyncModel model) {
    return Action(SyncAction.onUpdateMAL, payload: model);
  }

  static Action onUpdateSimkl(SyncModel model) {
    return Action(SyncAction.onUpdateSimkl, payload: model);
  }
}
