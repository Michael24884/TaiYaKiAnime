import 'package:fish_redux/fish_redux.dart';

//TODO replace with your own action
enum DiscoveryRowCellsAction { action }

class DiscoveryRowCellsActionCreator {
  static Action onAction() {
    return const Action(DiscoveryRowCellsAction.action);
  }
}
