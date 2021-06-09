import 'package:fish_redux/fish_redux.dart';

//TODO replace with your own action
enum AnimeListAction { action, moveToDetail }

class AnimeListActionCreator {
  static Action onAction() {
    return const Action(AnimeListAction.action);
  }

  static Action moveToDetail(int id) {
    return Action(AnimeListAction.moveToDetail, payload: id);
  }
}
