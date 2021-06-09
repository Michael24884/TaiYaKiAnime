import 'package:fish_redux/fish_redux.dart';

//TODO replace with your own action
enum DownloadsAction { action }

class DownloadsActionCreator {
  static Action onAction() {
    return const Action(DownloadsAction.action);
  }
}
