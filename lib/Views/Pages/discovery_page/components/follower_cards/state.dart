import 'package:fish_redux/fish_redux.dart';
import 'package:taiyaki/Models/Anilist/models.dart';
import 'package:taiyaki/Views/Pages/discovery_page/components/follower_cells/state.dart';
import 'package:taiyaki/Views/Pages/discovery_page/state.dart';

class FollowerCardsState extends ImmutableSource
    implements Cloneable<FollowerCardsState> {
  List<AnilistFollowersActivityModel> activity = [];

  @override
  FollowerCardsState clone() {
    return FollowerCardsState();
  }

  @override
  Object getItemData(int index) {
    final _item = activity[index];
    return FollowersCellsState(activity: _item);
  }

  @override
  String getItemType(int index) {
    return 'follower_cells';
  }

  @override
  int get itemCount => activity.length;

  @override
  ImmutableSource setItemData(int index, Object data) {
    // TODO: implement setItemData
    throw UnimplementedError();
  }
}

class FollowersCardsConnector
    extends ConnOp<DiscoveryState, FollowerCardsState> {
  @override
  FollowerCardsState get(DiscoveryState state) {
    final subState = FollowerCardsState().clone();
    subState.activity = state.activity;
    return subState;
  }
}
