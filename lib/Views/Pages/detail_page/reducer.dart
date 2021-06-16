import 'package:fish_redux/fish_redux.dart';
import 'package:flutter/material.dart' hide Action;
import 'package:taiyaki/Views/Widgets/taiyaki_image.dart';

import 'action.dart';
import 'state.dart';

Reducer<DetailState> buildReducer() {
  return asReducer(
    <Object, Reducer<DetailState>>{
      DetailAction.action: _onAction,
      DetailAction.updateAnilistData: _updateData,
      DetailAction.updateMALEntryData: _updateMALEntry,
      DetailAction.updateDetailDatabase: _updateDetail,
      DetailAction.updateSimklEpisodes: _updateSimklEpisodes,
      DetailAction.updateSimklData: _updateSimklData,
      DetailAction.updateCovers: _updateCover,
      DetailAction.switchCovers: _switchCovers,
    },
  );
}

DetailState _onAction(DetailState state, Action action) {
  final DetailState newState = state.clone();
  return newState;
}

DetailState _updateCover(DetailState state, Action action) {
  final DetailState newState = state.clone();
  final String image = action.payload;
  newState.covers = [...state.covers, image];
  return newState;
}

DetailState _switchCovers(DetailState state, Action action) {
  final DetailState newState = state.clone();
  if (state.covers.length > 1) {
    final last = state.covers.removeAt(0);
    newState.covers = state.covers.sublist(1)..add(last);
  }
  return newState;
}

DetailState _updateSimklData(DetailState state, Action action) {
  final DetailState newState = state.clone();
  newState.simklData = action.payload;
  return newState;
}

DetailState _updateSimklEpisodes(DetailState state, Action action) {
  final DetailState newState = state.clone();
  newState.episodes = action.payload;
  return newState;
}

DetailState _updateDetail(DetailState state, Action action) {
  final DetailState newState = state.clone();
  newState.setDetailDatabaseModel = action.payload;
  return newState;
}

DetailState _updateMALEntry(DetailState state, Action action) {
  final DetailState newState = state.clone();
  newState.malEntryData = action.payload;
  return newState;
}

DetailState _updateData(DetailState state, Action action) {
  final DetailState newState = state.clone();
  newState.anilistData = action.payload;
  return newState;
}
