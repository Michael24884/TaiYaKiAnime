import 'package:fish_redux/fish_redux.dart';
import 'package:taiyaki/Models/Taiyaki/Settings.dart';

import '../../state.dart';

class OnboardPage1State implements Cloneable<OnboardPage1State> {
  AppSettingsModel? appSettingsModel;

  @override
  OnboardPage1State clone() {
    return OnboardPage1State()..appSettingsModel = appSettingsModel;
  }
}

class OnboardPage1Connector extends ConnOp<OnboardingState, OnboardPage1State> {
  @override
  OnboardPage1State get(OnboardingState state) {
    final subState = OnboardPage1State().clone();
    subState.appSettingsModel = state.appSettings;
    return subState;
  }

  @override
  void set(OnboardingState state, OnboardPage1State subState) {
    state.appSettings = subState.appSettingsModel!;
  }
}
