import 'package:fish_redux/fish_redux.dart';

//TODO replace with your own action
enum EpisodeCellAction { action }

class EpisodeCellActionCreator {
  static Action onAction() {
    return const Action(EpisodeCellAction.action);
  }
}
