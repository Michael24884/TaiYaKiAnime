import 'package:fish_redux/fish_redux.dart';

//TODO replace with your own action
enum GeneralComponentAction { action }

class GeneralComponentActionCreator {
  static Action onAction() {
    return const Action(GeneralComponentAction.action);
  }
}
