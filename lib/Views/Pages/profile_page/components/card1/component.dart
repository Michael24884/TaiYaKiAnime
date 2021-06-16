import 'package:fish_redux/fish_redux.dart';

import 'reducer.dart';
import 'state.dart';
import 'view.dart';

class Card1Component extends Component<Card1State> {
  Card1Component()
      : super(
          reducer: buildReducer(),
          view: buildView,
          dependencies: Dependencies<Card1State>(
              adapter: null, slots: <String, Dependent<Card1State>>{}),
        );
}
