import 'package:fish_redux/fish_redux.dart';

class DownloadsState implements Cloneable<DownloadsState> {
  @override
  DownloadsState clone() {
    return DownloadsState();
  }
}

DownloadsState initState(Map<String, dynamic> args) {
  return DownloadsState();
}
