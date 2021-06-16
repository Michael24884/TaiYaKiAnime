import 'package:fish_redux/fish_redux.dart';
import 'package:taiyaki/Models/Anilist/models.dart';

class FollowersCellsState implements Cloneable<FollowersCellsState> {
  AnilistFollowersActivityModel? activity;

  FollowersCellsState({this.activity});

  @override
  FollowersCellsState clone() {
    return FollowersCellsState()..activity = activity;
  }
}
