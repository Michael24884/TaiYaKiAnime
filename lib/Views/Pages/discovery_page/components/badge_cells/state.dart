import 'package:fish_redux/fish_redux.dart';

class BadeCellsState implements Cloneable<BadeCellsState> {
  @override
  BadeCellsState clone() {
    return BadeCellsState();
  }
}

BadeCellsState initState(Map<String, dynamic> args) {
  return BadeCellsState();
}
