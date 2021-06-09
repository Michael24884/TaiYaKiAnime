import 'package:fish_redux/fish_redux.dart';
import 'package:taiyaki/Models/Anilist/models.dart';

import 'action.dart';
import 'state.dart';

Reducer<DiscoveryState> buildReducer() {
  return asReducer(
    <Object, Reducer<DiscoveryState>>{
      DiscoveryAction.action: _onAction,
      DiscoveryAction.updateTrending: _updateTrending,
      DiscoveryAction.updatePopular: _updatePopular,
      DiscoveryAction.updateActivity: _updateActivity,
      DiscoveryAction.updateJustAdded: _updateJustAdded,
      DiscoveryAction.updateSeasonal: _updateSeasonal,
      DiscoveryAction.updateNextSeason: _updateNextSeason,
      DiscoveryAction.updateContinueItems: _updateContinueItems,
    },
  );
}

DiscoveryState _onAction(DiscoveryState state, Action action) {
  final DiscoveryState newState = state.clone();
  return newState;
}

DiscoveryState _updateContinueItems(DiscoveryState state, Action action) {
  final DiscoveryState newState = state.clone();
  newState.continueItems = action.payload;
  return newState;
}

DiscoveryState _updateActivity(DiscoveryState state, Action action) {
  final DiscoveryState newState = state.clone();
  newState.activity = action.payload;
  return newState;
}

DiscoveryState _updateSeasonal(DiscoveryState state, Action action) {
  final DiscoveryState newState = state.clone();
  final List<AnilistNode> data = action.payload;
  newState.seasonalData = data;
  return newState;
}

DiscoveryState _updateNextSeason(DiscoveryState state, Action action) {
  final DiscoveryState newState = state.clone();
  final List<AnilistNode> data = action.payload;
  newState.nextSeasonalData = data;
  return newState;
}

DiscoveryState _updateJustAdded(DiscoveryState state, Action action) {
  final DiscoveryState newState = state.clone();
  final List<AnilistNode> data = action.payload;
  newState.justAddedData = data;
  return newState;
}

DiscoveryState _updateTrending(DiscoveryState state, Action action) {
  final DiscoveryState newState = state.clone();
  final List<AnilistNode> data = action.payload;
  newState.trendingData = data;
  return newState;
}

DiscoveryState _updatePopular(DiscoveryState state, Action action) {
  final DiscoveryState newState = state.clone();
  final List<AnilistNode> data = action.payload;
  newState.popularData = data;
  return newState;
}
