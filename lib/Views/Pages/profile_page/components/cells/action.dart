import 'package:fish_redux/fish_redux.dart';

//TODO replace with your own action
enum AnimeListCellAction { action }

class AnimeListCellActionCreator {
  static Action onAction() {
    return const Action(AnimeListCellAction.action);
  }
}
