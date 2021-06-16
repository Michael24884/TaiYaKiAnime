import 'package:fish_redux/fish_redux.dart';

class ContinueWatchingRowState implements Cloneable<ContinueWatchingRowState> {
  @override
  ContinueWatchingRowState clone() {
    return ContinueWatchingRowState();
  }
}

ContinueWatchingRowState initState(Map<String, dynamic> args) {
  return ContinueWatchingRowState();
}
