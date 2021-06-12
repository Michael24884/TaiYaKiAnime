import 'package:fish_redux/fish_redux.dart';

import 'state.dart';
import 'view.dart';

class CharacterCellsComponent extends Component<CharacterCellsState> {
  CharacterCellsComponent()
      : super(
          view: buildView,
          dependencies: Dependencies<CharacterCellsState>(
              adapter: null, slots: <String, Dependent<CharacterCellsState>>{}),
        );
}
