import 'package:fish_redux/fish_redux.dart';
import 'package:flutter/material.dart' hide Action;
import 'package:hive/hive.dart';
import 'package:taiyaki/Models/Taiyaki/DetailDatabase.dart';
import 'package:taiyaki/Utils/strings.dart';

import 'action.dart';
import 'state.dart';

Effect<HistoryState> buildEffect() {
  return combineEffects(<Object, Effect<HistoryState>>{
    HistoryAction.action: _onAction,
    Lifecycle.initState: _onInit,
    HistoryAction.loadHistory: _onInit,
    HistoryAction.deleteHistory: _deleteHistory
  });
}

void _onAction(Action action, Context<HistoryState> ctx) {}

void _deleteHistory(Action action, Context<HistoryState> ctx) async {
  showDialog(
      context: ctx.context,
      builder: (builder) => AlertDialog(
            title: Text(
              'Delete History?',
              style: TextStyle(
                  fontWeight: FontWeight.bold,
                  color: Colors.redAccent,
                  fontSize: 16),
            ),
            content: Text('This action is irreversible'),
            actions: [
              TextButton(
                  onPressed: () => Navigator.of(ctx.context).pop(),
                  child: Text('Cancel')),
              ElevatedButton(
                  onPressed: () {
                    final _box = Hive.box<HistoryModel>(HIVE_HISTORY_BOX);
                    _box.deleteAll(_box.values).whenComplete(() {
                      ctx.dispatch(HistoryActionCreator.loadHistory());
                      Navigator.of(ctx.context).pop();
                    });
                  },
                  style: ElevatedButton.styleFrom(primary: Colors.red),
                  child: Text('Delete'))
            ],
          ));
}

void _onInit(Action action, Context<HistoryState> ctx) async {
  final _box = Hive.box<HistoryModel>(HIVE_HISTORY_BOX);
  if (_box.isNotEmpty) {
    final _history = _box.values.toList();
    _history.sort((a, b) => b.lastModified.compareTo(a.lastModified));
    ctx.dispatch(HistoryActionCreator.onInit(_history));
  }
}
