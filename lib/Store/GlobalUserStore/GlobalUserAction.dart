import 'package:fish_redux/fish_redux.dart';
import 'package:taiyaki/Models/Taiyaki/Sync.dart';
import 'package:taiyaki/Models/Taiyaki/Trackers.dart';
import 'package:taiyaki/Models/Taiyaki/User.dart';

class UpdateModel {
  final UserModel model;

  final ThirdPartyTrackersEnum tracker;

  UpdateModel({required this.model, required this.tracker});
}

enum GlobalUserAction { updateUser, onOnboarding, updateUserList, removeUser }

class GlobalUserActionCreator {
  static Action onUpdateUser(UpdateModel? model) {
    return Action(GlobalUserAction.updateUser, payload: model);
  }

  static Action removeUser(ThirdPartyTrackersEnum tracker) {
    return Action(GlobalUserAction.removeUser, payload: tracker);
  }

  static Action onUpdateUserList(
      List<AnimeListModel> model, ThirdPartyTrackersEnum tracker) {
    return Action(GlobalUserAction.updateUserList, payload: {tracker: model});
  }

  static Action onUpdateOnboarding() {
    return const Action(GlobalUserAction.onOnboarding);
  }
}
