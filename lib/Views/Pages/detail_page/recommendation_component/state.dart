import 'package:fish_redux/fish_redux.dart';
import 'package:taiyaki/Models/Anilist/models.dart';
import 'package:taiyaki/Views/Pages/detail_page/recommendation_component/cells/state.dart';

import '../state.dart';

class RecommendationState extends ImmutableSource
    implements Cloneable<RecommendationState> {
  List<AnilistNode> recommendations = [];

  @override
  RecommendationState clone() {
    return RecommendationState()..recommendations = recommendations;
  }

  @override
  Object getItemData(int index) {
    final _item = recommendations[index];
    return RecommendationCellsState(
      media: _item,
    );
  }

  @override
  String getItemType(int index) => 'recommendation_cells';

  @override
  int get itemCount => recommendations.length;

  @override
  ImmutableSource setItemData(int index, Object data) {
    throw UnimplementedError();
  }
}

class RecommendationConnector extends ConnOp<DetailState, RecommendationState> {
  @override
  RecommendationState get(DetailState state) {
    final subState = RecommendationState().clone();
    subState.recommendations = state.anilistData!.recommendations;
    return subState;
  }
}
