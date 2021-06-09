import 'package:fish_redux/fish_redux.dart';

//TODO replace with your own action
enum RecommendationCellsAction { action }

class RecommendationCellsActionCreator {
  static Action onAction() {
    return const Action(RecommendationCellsAction.action);
  }
}
