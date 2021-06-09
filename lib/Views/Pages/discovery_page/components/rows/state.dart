import 'package:fish_redux/fish_redux.dart';
import 'package:taiyaki/Models/Anilist/models.dart';
import 'package:taiyaki/Models/Taiyaki/Misc.dart';
import 'package:taiyaki/Views/Pages/discovery_page/components/cells/state.dart';
import 'package:taiyaki/Views/Pages/discovery_page/state.dart';

class RowsState extends ImmutableSource implements Cloneable<RowsState> {
  String rowTitle;
  String subTitle;
  List<AnilistNode> data;

  RowsState({this.rowTitle = '', this.data = const [], this.subTitle = ''});

  @override
  RowsState clone() {
    return RowsState()
      ..subTitle = subTitle
      ..data = data
      ..rowTitle = rowTitle;
  }

  @override
  Object getItemData(int index) {
    final _item = data[index];
    return new DiscoveryRowCellsState(
      coverImage: _item.coverImage,
      title: _item.title,
      id: _item.id,
    );
  }

  @override
  String getItemType(int index) {
    return 'cells';
  }

  @override
  int get itemCount => data.length;

  @override
  ImmutableSource setItemData(int index, Object data) {
    throw UnimplementedError();
  }
}

class TrendingRowsConnector extends ConnOp<DiscoveryState, RowsState> {
  @override
  RowsState get(DiscoveryState state) {
    final subState = RowsState().clone();
    subState.rowTitle = 'Now Trending';
    subState.subTitle = 'Anime on the rise';
    subState.data = state.trendingData ?? [];
    return subState;
  }
}

class PopularRowsConnector extends ConnOp<DiscoveryState, RowsState> {
  @override
  RowsState get(DiscoveryState state) {
    final subState = RowsState().clone();
    subState.rowTitle = 'Popular';
    subState.subTitle = 'Highest ranked';
    subState.data = state.popularData ?? [];
    return subState;
  }
}

class SeasonalRowsConnector extends ConnOp<DiscoveryState, RowsState> {
  @override
  RowsState get(DiscoveryState state) {
    final subState = RowsState().clone();
    subState.rowTitle = 'This season';
    subState.subTitle =
        '${mapMonthToAnilistSeason(DateTime.now().month)} ${DateTime.now().year}';
    subState.data = state.seasonalData ?? [];
    return subState;
  }
}

class JustAddedRowsConnector extends ConnOp<DiscoveryState, RowsState> {
  @override
  RowsState get(DiscoveryState state) {
    final subState = RowsState().clone();
    subState.rowTitle = 'Just Added to Anilist';
    subState.subTitle = 'Fresh entries from the database';
    subState.data = state.justAddedData ?? [];
    return subState;
  }
}

class NextSeasonRowsConnector extends ConnOp<DiscoveryState, RowsState> {
  @override
  RowsState get(DiscoveryState state) {
    int year;
    final _seasonCheck = mapSeasonToAnilistNextSeason(
        mapMonthToAnilistSeason(DateTime.now().month));
    if (_seasonCheck == 'FALL')
      year = DateTime.now().year + 1;
    else
      year = DateTime.now().year;

    final subState = RowsState().clone();
    subState.rowTitle = 'Next Season';
    subState.subTitle = '${_seasonCheck} $year';
    subState.data = state.nextSeasonalData ?? [];
    return subState;
  }
}
