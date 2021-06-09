import 'package:fish_redux/fish_redux.dart';

//TODO replace with your own action
enum RecommendationAction { action }

class RecommendationActionCreator {
  static Action onAction() {
    return const Action(RecommendationAction.action);
  }
}
