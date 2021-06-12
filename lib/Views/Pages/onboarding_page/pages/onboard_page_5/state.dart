import 'package:fish_redux/fish_redux.dart';

import '../../state.dart';

class OnboardPage5State implements Cloneable<OnboardPage5State> {
  @override
  OnboardPage5State clone() {
    return OnboardPage5State();
  }
}

class OnboardPage5Connector extends ConnOp<OnboardingState, OnboardPage5State> {
  @override
  OnboardPage5State get(OnboardingState state) {
    final subState = OnboardPage5State().clone();
    return subState;
  }
}
