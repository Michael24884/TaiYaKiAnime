import 'package:fish_redux/fish_redux.dart';
import 'package:taiyaki/Views/Pages/search_page/cells/component.dart';
import 'package:taiyaki/Views/Pages/search_page/state.dart';

class SearchAdapter extends SourceFlowAdapter<SearchState> {
  SearchAdapter()
      : super(pool: <String, Component<Object>>{
          'search_cells': SearchCellsComponent(),
        });
}
