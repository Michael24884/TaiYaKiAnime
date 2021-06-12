import 'package:fish_redux/fish_redux.dart';

import 'reducer.dart';
import 'state.dart';
import 'view.dart';

class OnboardPage5Component extends Component<OnboardPage5State> {
  OnboardPage5Component()
      : super(
          reducer: buildReducer(),
          view: buildView,
          dependencies: Dependencies<OnboardPage5State>(
              adapter: null, slots: <String, Dependent<OnboardPage5State>>{}),
        );
}
