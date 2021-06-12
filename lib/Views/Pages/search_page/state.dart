import 'package:fish_redux/fish_redux.dart';
import 'package:taiyaki/Models/Anilist/models.dart';
import 'package:taiyaki/Models/Anilist/typed_models.dart';
import 'package:taiyaki/Views/Pages/search_page/cells/state.dart';

class SearchState extends ImmutableSource implements Cloneable<SearchState> {
  bool isLoading = false;

  List<AnilistNode> results = [];

  List<String> enabledGenres = [];
  List<String> enabledTags = [];
  String enabledSeason = AnilistGraphTypes.anilistSeasons.first;
  int? year;
  String? query;

  @override
  SearchState clone() {
    return SearchState()
      ..isLoading = isLoading
      ..results = results
      ..year = year
      ..query = query
      ..enabledTags = enabledTags
      ..enabledGenres = enabledGenres
      ..enabledSeason = enabledSeason;
  }

  @override
  Object getItemData(int index) {
    final _item = results[index];
    return SearchCellsState(
      media: _item,
    );
  }

  @override
  String getItemType(int index) {
    return 'search_cells';
  }

  @override
  int get itemCount => results.length;

  @override
  ImmutableSource setItemData(int index, Object data) {
    // TODO: implement setItemData
    throw UnimplementedError();
  }
}

SearchState initState(Map<String, dynamic> args) {
  return SearchState();
}
