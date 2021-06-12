import 'package:fish_redux/fish_redux.dart';

import 'effect.dart';
import 'reducer.dart';
import 'state.dart';
import 'view.dart';

class GeneralComponentComponent extends Component<GeneralComponentState> {
  GeneralComponentComponent()
      : super(
          effect: buildEffect(),
          reducer: buildReducer(),
          view: buildView,
          dependencies: Dependencies<GeneralComponentState>(
              adapter: null,
              slots: <String, Dependent<GeneralComponentState>>{}),
        );
}
