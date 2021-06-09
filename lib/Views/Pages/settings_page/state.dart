import 'package:fish_redux/fish_redux.dart';
import 'package:flutter/material.dart';
import 'package:taiyaki/Models/Taiyaki/Settings.dart';
import 'package:taiyaki/Models/Taiyaki/Trackers.dart';
import 'package:taiyaki/Models/Taiyaki/User.dart';
import 'package:taiyaki/Store/GlobalSettingsStore/GlobalSettingsAction.dart';
import 'package:taiyaki/Store/GlobalSettingsStore/GlobalSettingsState.dart';
import 'package:taiyaki/Store/GlobalSettingsStore/GlobalSettingsStore.dart';
import 'package:taiyaki/Store/GlobalUserStore/GlobalUserAction.dart';
import 'package:taiyaki/Store/GlobalUserStore/GlobalUserState.dart';
import 'package:taiyaki/Store/GlobalUserStore/GlobalUserStore.dart';

class SettingsState
    implements
        GlobalUserBaseState,
        GlobalSettingsBaseState,
        Cloneable<SettingsState> {
  final List<Tab> tabs = [
    Tab(text: 'General'),
    Tab(text: 'Customization'),
    Tab(text: 'Notifications'),
    Tab(
      text: 'Trackers',
    ),
  ];

  @override
  SettingsState clone() {
    return SettingsState();
  }

  @override
  UserModel? get anilistUser => GlobalUserStore.store.getState().anilistUser;

  @override
  UserModel? get myanimelistUser =>
      GlobalUserStore.store.getState().myanimelistUser;

  @override
  UserModel? get simklUser => GlobalUserStore.store.getState().simklUser;

  @override
  set anilistUser(UserModel? _anilistUser) {
    if (_anilistUser != null)
      GlobalUserStore.store.dispatch(GlobalUserActionCreator.onUpdateUser(
          UpdateModel(
              model: _anilistUser, tracker: ThirdPartyTrackersEnum.anilist)));
  }

  @override
  set myanimelistUser(UserModel? _myanimelistUser) {
    print('myanimelist');
    if (_myanimelistUser != null)
      GlobalUserStore.store.dispatch(GlobalUserActionCreator.onUpdateUser(
          UpdateModel(
              model: _myanimelistUser,
              tracker: ThirdPartyTrackersEnum.myanimelist)));
  }

  @override
  set simklUser(UserModel? _simklUser) {
    if (_simklUser != null)
      GlobalUserStore.store.dispatch(GlobalUserActionCreator.onUpdateUser(
          UpdateModel(
              model: _simklUser, tracker: ThirdPartyTrackersEnum.simkl)));
  }

  @override
  AppSettingsModel get appSettings =>
      GlobalSettingsStore.store.getState().appSettings;

  @override
  set appSettings(AppSettingsModel _appSettings) {
    GlobalSettingsStore.store
        .dispatch(GlobalSettingsActionCreator.onUpdateSettings(_appSettings));
  }
}

SettingsState initState(Map<String, dynamic> args) {
  return SettingsState();
}
