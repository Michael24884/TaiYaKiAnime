import 'package:fish_redux/fish_redux.dart';
import 'package:taiyaki/Views/Pages/detail_page/recommendation_component/cells/component.dart';
import 'package:taiyaki/Views/Pages/detail_page/recommendation_component/state.dart';

class RecommendationAdapter extends SourceFlowAdapter<RecommendationState> {
  RecommendationAdapter()
      : super(pool: <String, Component<Object>>{
          'recommendation_cells': RecommendationCellsComponent(),
        });
}
