import 'package:fish_redux/fish_redux.dart';
import 'package:taiyaki/Views/Pages/detail_page/character_cells/component.dart';
import 'package:taiyaki/Views/Pages/detail_page/overview_component/characters_component/state.dart';

class CharactersAdapter extends SourceFlowAdapter<CharactersState> {
  CharactersAdapter()
      : super(pool: <String, Component<Object>>{
          'character_cells': CharacterCellsComponent(),
        });
}
