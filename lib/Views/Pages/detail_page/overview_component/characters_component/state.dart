import 'package:fish_redux/fish_redux.dart';
import 'package:taiyaki/Models/Anilist/models.dart';
import 'package:taiyaki/Views/Pages/detail_page/character_cells/state.dart';
import 'package:taiyaki/Views/Pages/detail_page/overview_component/state.dart';

class CharactersState extends ImmutableSource
    implements Cloneable<CharactersState> {
  List<AnilistCharactersModel> characters = [];

  @override
  CharactersState clone() {
    return CharactersState()..characters = characters;
  }

  @override
  Object getItemData(int index) {
    final _item = characters[index];
    return CharacterCellsState(
      image: _item.image,
      name: _item.name,
      role: _item.role,
    );
  }

  @override
  String getItemType(int index) {
    return 'character_cells';
  }

  @override
  int get itemCount => characters.length;

  @override
  ImmutableSource setItemData(int index, Object data) {
    // TODO: implement setItemData
    throw UnimplementedError();
  }
}

class CharactersConnector extends ConnOp<OverviewState, CharactersState> {
  @override
  CharactersState get(OverviewState state) {
    final subState = new CharactersState().clone();
    subState.characters = state.data?.characters ?? [];
    return subState;
  }
}
