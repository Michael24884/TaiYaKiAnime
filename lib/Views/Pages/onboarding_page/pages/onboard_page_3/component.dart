import 'package:fish_redux/fish_redux.dart';

import 'reducer.dart';
import 'state.dart';
import 'view.dart';

class OnboardPage3Component extends Component<OnboardPage3State> {
  OnboardPage3Component()
      : super(
          reducer: buildReducer(),
          view: buildView,
          dependencies: Dependencies<OnboardPage3State>(
              adapter: null, slots: <String, Dependent<OnboardPage3State>>{}),
        );
}
