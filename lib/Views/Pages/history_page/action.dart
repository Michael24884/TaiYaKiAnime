import 'package:fish_redux/fish_redux.dart';
import 'package:taiyaki/Models/Taiyaki/DetailDatabase.dart';

//TODO replace with your own action
enum HistoryAction { action, init, loadHistory, deleteHistory }

class HistoryActionCreator {
  static Action onAction() {
    return const Action(HistoryAction.action);
  }

  static Action deleteHistory() {
    return const Action(HistoryAction.deleteHistory);
  }

  static Action loadHistory() {
    return const Action(HistoryAction.loadHistory);
  }

  static Action onInit(List<HistoryModel> history) {
    return Action(HistoryAction.init, payload: history);
  }
}
