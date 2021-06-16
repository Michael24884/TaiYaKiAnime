import 'package:fish_redux/fish_redux.dart';
import 'package:flutter/material.dart';
import 'package:modal_bottom_sheet/modal_bottom_sheet.dart';
import 'package:taiyaki/Views/Widgets/search_bar.dart';

import 'action.dart';
import 'state.dart';

Widget buildView(
    SearchState state, Dispatch dispatch, ViewService viewService) {
  final _adapter = viewService.buildAdapter();

  return Scaffold(
    floatingActionButton: FloatingActionButton(
      onPressed: () => showCupertinoModalBottomSheet(
          context: viewService.context,
          builder: (BuildContext context) =>
              viewService.buildComponent('filter_bottom_sheet')),
      child: Icon(Icons.filter_alt_sharp),
    ),
    appBar: AppBar(
      title: Text('Search'),
    ),
    body: ListView(
      children: [
        SearchBar(
          onEnter: (String query) =>
              dispatch(SearchActionCreator.setQuery(query)),
        ),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 8.0),
          child: ElevatedButton(
              onPressed: () => dispatch(SearchActionCreator.onSearch()),
              child: Text('Search')),
        ),
        if (state.isLoading)
          Center(
            child: CircularProgressIndicator(),
          )
        else
          ListView.builder(
            shrinkWrap: true,
            itemBuilder: _adapter.itemBuilder,
            itemCount: _adapter.itemCount,
            physics: NeverScrollableScrollPhysics(),
          )
      ],
    ),
  );
}
