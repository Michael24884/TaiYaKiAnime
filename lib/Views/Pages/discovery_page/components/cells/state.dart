import 'package:fish_redux/fish_redux.dart';

class DiscoveryRowCellsState implements Cloneable<DiscoveryRowCellsState> {
  String title;
  String coverImage;
  int id;

  DiscoveryRowCellsState({this.id = 0, this.coverImage = '', this.title = ''});

  @override
  DiscoveryRowCellsState clone() {
    return DiscoveryRowCellsState()
      ..title = title
      ..coverImage = coverImage
      ..id = id;
  }
}
