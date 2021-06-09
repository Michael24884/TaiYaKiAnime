import 'package:fish_redux/fish_redux.dart';

//TODO replace with your own action
enum OverviewAction { action, expandSynopsis }

class OverviewActionCreator {
  static Action onExpandSynopsis() {
    return const Action(OverviewAction.expandSynopsis);
  }
}
