import 'package:fish_redux/fish_redux.dart';
import 'package:taiyaki/Models/Anilist/models.dart';
import 'package:taiyaki/Views/Pages/detail_page/state.dart';

class OverviewState implements Cloneable<OverviewState> {
  AnilistNode? data;

  bool synopsisExpanded = false;

  @override
  OverviewState clone() {
    return OverviewState()
      ..data = data
      ..synopsisExpanded = synopsisExpanded;
  }
}

class OverviewConnector extends ConnOp<DetailState, OverviewState> {
  @override
  OverviewState get(DetailState state) {
    final subState = new OverviewState().clone();
    subState.data = state.anilistData;
    subState.synopsisExpanded = state.synopsisExpanded;
    return subState;
  }

  @override
  void set(DetailState state, OverviewState subState) {
    state.synopsisExpanded = subState.synopsisExpanded;
  }
}
