import 'package:fish_redux/fish_redux.dart';
import 'package:taiyaki/Models/Taiyaki/Sync.dart';

import '../../state.dart';

class Card2State implements Cloneable<Card2State> {
  List<AnimeListModel> animeList = [];

  @override
  Card2State clone() {
    return Card2State()..animeList = animeList;
  }
}

class Card2Connector extends ConnOp<ProfileState, Card2State> {
  @override
  Card2State get(ProfileState state) {
    final subState = Card2State().clone();
    subState.animeList = state.data;
    return subState;
  }
}
