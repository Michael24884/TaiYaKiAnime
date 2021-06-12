import 'package:fish_redux/fish_redux.dart';

import 'reducer.dart';
import 'state.dart';
import 'view.dart';

class Card3Component extends Component<Card3State> {
  Card3Component()
      : super(
          reducer: buildReducer(),
          view: buildView,
          dependencies: Dependencies<Card3State>(
              adapter: null, slots: <String, Dependent<Card3State>>{}),
        );
}
