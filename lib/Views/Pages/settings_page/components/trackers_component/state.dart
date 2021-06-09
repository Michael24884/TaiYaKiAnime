import 'package:fish_redux/fish_redux.dart';
import 'package:taiyaki/Models/Taiyaki/Settings.dart';
import 'package:taiyaki/Models/Taiyaki/User.dart';
import 'package:taiyaki/Views/Pages/settings_page/state.dart';

class SettingsTrackersState implements Cloneable<SettingsTrackersState> {
  UserModel? simklUser;
  UserModel? myanimelistUser;
  UserModel? anilistUser;

  AppSettingsModel? appSettingsModel;

  @override
  SettingsTrackersState clone() {
    return SettingsTrackersState()
      ..appSettingsModel = appSettingsModel
      ..simklUser = simklUser
      ..anilistUser = anilistUser
      ..myanimelistUser = myanimelistUser;
  }
}

class SettingsTrackersConnector
    extends ConnOp<SettingsState, SettingsTrackersState> {
  @override
  SettingsTrackersState get(SettingsState state) {
    final subState = new SettingsTrackersState().clone();
    subState.simklUser = state.simklUser;
    subState.myanimelistUser = state.myanimelistUser;
    subState.anilistUser = state.anilistUser;
    subState.appSettingsModel = state.appSettings;
    return subState;
  }

  // @override
  // void set(SettingsState state, SettingsTrackersState subState) {
  //   state.simklUser = subState.simklUser;
  //   state.myanimelistUser = subState.myanimelistUser;
  //   state.anilistUser = subState.anilistUser;
  // }
}
