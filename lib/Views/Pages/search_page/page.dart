import 'package:fish_redux/fish_redux.dart';
import 'package:taiyaki/Views/Pages/search_page/adapter.dart';
import 'package:taiyaki/Views/Pages/search_page/filter_sheet_component/component.dart';
import 'package:taiyaki/Views/Pages/search_page/filter_sheet_component/state.dart';

import 'effect.dart';
import 'reducer.dart';
import 'state.dart';
import 'view.dart';

class SearchPage extends Page<SearchState, Map<String, dynamic>> {
  SearchPage()
      : super(
          initState: initState,
          effect: buildEffect(),
          reducer: buildReducer(),
          view: buildView,
          dependencies: Dependencies<SearchState>(
              adapter: NoneConn<SearchState>() + SearchAdapter(),
              slots: <String, Dependent<SearchState>>{
                'filter_bottom_sheet':
                    FilterSheetConnector() + FilterSheetComponent()
              }),
          middleware: <Middleware<SearchState>>[],
        );
}
