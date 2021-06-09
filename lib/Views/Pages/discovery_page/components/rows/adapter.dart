import 'package:fish_redux/fish_redux.dart';
import 'package:taiyaki/Views/Pages/discovery_page/components/cells/component.dart';
import 'package:taiyaki/Views/Pages/discovery_page/components/rows/state.dart';

class RowsAdapter extends SourceFlowAdapter<RowsState> {
  RowsAdapter()
      : super(pool: <String, Component<Object>>{
          'cells': DiscoveryRowCellsComponent(),
        });
}
