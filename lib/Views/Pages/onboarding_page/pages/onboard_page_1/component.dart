import 'package:fish_redux/fish_redux.dart';

import 'reducer.dart';
import 'state.dart';
import 'view.dart';

class OnboardPage1Component extends Component<OnboardPage1State> {
  OnboardPage1Component()
      : super(
          reducer: buildReducer(),
          view: buildView,
          dependencies: Dependencies<OnboardPage1State>(
              adapter: null, slots: <String, Dependent<OnboardPage1State>>{}),
        );
}
