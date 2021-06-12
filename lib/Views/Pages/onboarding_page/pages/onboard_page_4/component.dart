import 'package:fish_redux/fish_redux.dart';

import 'reducer.dart';
import 'state.dart';
import 'view.dart';

class OnboardingPage4Component extends Component<OnboardingPage4State> {
  OnboardingPage4Component()
      : super(
          reducer: buildReducer(),
          view: buildView,
          dependencies: Dependencies<OnboardingPage4State>(
              adapter: null,
              slots: <String, Dependent<OnboardingPage4State>>{}),
        );
}
