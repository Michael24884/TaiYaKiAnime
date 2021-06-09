import 'package:fish_redux/fish_redux.dart';

import 'reducer.dart';
import 'state.dart';
import 'view.dart';

class Card2Component extends Component<Card2State> {
  Card2Component()
      : super(
          reducer: buildReducer(),
          view: buildView,
          dependencies: Dependencies<Card2State>(
              adapter: null, slots: <String, Dependent<Card2State>>{}),
        );
}
