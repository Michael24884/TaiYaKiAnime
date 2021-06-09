import 'package:fish_redux/fish_redux.dart';
import 'package:taiyaki/Views/Pages/detail_page/overview_component/characters_component/adapter.dart';

import 'state.dart';
import 'view.dart';

class CharactersComponent extends Component<CharactersState> {
  CharactersComponent()
      : super(
          view: buildView,
          dependencies: Dependencies<CharactersState>(
              adapter: NoneConn<CharactersState>() + CharactersAdapter(),
              slots: <String, Dependent<CharactersState>>{}),
        );
}
