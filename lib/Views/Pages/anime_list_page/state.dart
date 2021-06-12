import 'package:fish_redux/fish_redux.dart';
import 'package:taiyaki/Models/Taiyaki/Sync.dart';
import 'package:taiyaki/Models/Taiyaki/Trackers.dart';
import 'package:taiyaki/Views/Pages/anime_list_page/components/list_cells/state.dart';

import 'page.dart';

class AnimeListState extends ImmutableSource
    implements Cloneable<AnimeListState> {
  List<AnimeListModel> list = [];
  ThirdPartyTrackersEnum? tracker;

  @override
  AnimeListState clone() {
    return AnimeListState()..list = list;
  }

  @override
  Object getItemData(int index) {
    final _item = list[index];
    return ListCellState(model: _item);
  }

  @override
  String getItemType(int index) {
    return 'anime_list_cell';
  }

  @override
  int get itemCount => list.length;

  @override
  ImmutableSource setItemData(int index, Object data) {
    // TODO: implement setItemData
    throw UnimplementedError();
  }
}

AnimeListState initState(AnimeListPageArguments args) {
  return AnimeListState()
    ..list = args.list
    ..tracker = args.tracker;
}
