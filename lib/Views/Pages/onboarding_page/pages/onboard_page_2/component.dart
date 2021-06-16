import 'package:fish_redux/fish_redux.dart';

import 'reducer.dart';
import 'state.dart';
import 'view.dart';

class OnboardingPage2Component extends Component<OnboardingPage2State> {
  OnboardingPage2Component()
      : super(
          reducer: buildReducer(),
          view: buildView,
          dependencies: Dependencies<OnboardingPage2State>(
              adapter: null,
              slots: <String, Dependent<OnboardingPage2State>>{}),
        );
}
