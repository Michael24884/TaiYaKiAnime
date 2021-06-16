import 'package:animator/animator.dart';
import 'package:fish_redux/fish_redux.dart';
import 'package:flutter/cupertino.dart';
import 'package:taiyaki/Models/Taiyaki/Settings.dart';
import 'package:taiyaki/Models/Taiyaki/User.dart';
import 'package:taiyaki/Store/GlobalSettingsStore/GlobalSettingsAction.dart';
import 'package:taiyaki/Store/GlobalSettingsStore/GlobalSettingsState.dart';
import 'package:taiyaki/Store/GlobalSettingsStore/GlobalSettingsStore.dart';
import 'package:taiyaki/Store/GlobalUserStore/GlobalUserState.dart';
import 'package:taiyaki/Store/GlobalUserStore/GlobalUserStore.dart';

class OnboardingState
    implements
        GlobalUserBaseState,
        GlobalSettingsBaseState,
        Cloneable<OnboardingState> {
  final animeKey = AnimatorKey();

  PageController? pageController;

  @override
  OnboardingState clone() {
    return OnboardingState()..pageController = pageController;
  }

  @override
  AppSettingsModel get appSettings =>
      GlobalSettingsStore.store.getState().appSettings;

  @override
  set appSettings(AppSettingsModel _appSettings) {
    GlobalSettingsStore.store
        .dispatch(GlobalSettingsActionCreator.onUpdateSettings(_appSettings));
    // appSettings = _appSettings;
  }

  @override
  UserModel? anilistUser = GlobalUserStore.store.getState().anilistUser;

  @override
  UserModel? myanimelistUser = GlobalUserStore.store.getState().myanimelistUser;

  @override
  UserModel? simklUser = GlobalUserStore.store.getState().simklUser;
}

OnboardingState initState(Map<String, dynamic> args) {
  return OnboardingState();
}
