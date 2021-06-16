import 'package:flutter/material.dart';
import 'package:modal_bottom_sheet/modal_bottom_sheet.dart';
import 'package:taiyaki/Services/Exceptions/API/Exceptions+API.dart';
import 'package:taiyaki/Services/Sources/Base.dart';
import 'package:taiyaki/Services/Sources/Gogoanime.dart';
import 'package:taiyaki/Services/Sources/index.dart';
import 'package:taiyaki/Views/Widgets/TaiyakiSize.dart';
import 'package:taiyaki/Views/Widgets/search_bar.dart';
import 'package:taiyaki/Views/Widgets/tiles.dart';

class SourceSearchPage extends StatefulWidget {
  final String query;
  final Function(Map<String, String>) onLink;

  SourceSearchPage({required this.query, required this.onLink});

  @override
  _SourceSearchPageState createState() => _SourceSearchPageState();
}

class _SourceSearchPageState extends State<SourceSearchPage> {
  SourceBase _currentSource = new GogoAnime();
  bool isLoading = false;
  List<SourceSearchResultsModel> results = [];

  @override
  void initState() {
    super.initState();
    _search(widget.query);
  }

  @override
  void dispose() {
    _currentSource.dispose();
    super.dispose();
  }

  Future _search(String query) async {
    this.setState(() => isLoading = true);

    try {
      final _results = await _currentSource.getSearchResults(query);
      this.setState(() {
        isLoading = false;
        results = _results;
      });
    } on SourceException {} catch (e) {}
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
          child: SingleChildScrollView(
        child: Column(
          children: [
            SearchBar(
                isLoading: isLoading,
                placeholder: 'Enter a custom query',
                onDelayedEnter: (String query) {
                  this.setState(() => results = []);
                  _search(query);
                },
                onEnter: (_) {}),
            if (isLoading)
              Center(
                child: CircularProgressIndicator(),
              )
            else if (results.isEmpty)
              Center(
                  child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                    Icon(Icons.inbox, size: 75),
                    Text('No results found', style: TextStyle(fontSize: 20)),
                  ]))
            else
              Column(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Padding(
                      padding: const EdgeInsets.all(8.0),
                      child: ElevatedButton(
                          onPressed: () {
                            showCupertinoModalBottomSheet(
                                context: context,
                                builder: (builder) {
                                  return Scaffold(
                                    body: Container(
                                        child: Column(
                                      children: [
                                        Padding(
                                          padding: const EdgeInsets.all(12.0),
                                          child: Text('Select a source',
                                              style: TextStyle(
                                                  fontWeight: FontWeight.w700,
                                                  fontSize: 16)),
                                        ),
                                        Expanded(
                                          child: ListView.builder(
                                            itemCount: TAIYAKI_SOURCES.length,
                                            itemBuilder: (context, index) =>
                                                SourceTiles(
                                                    onTap: () {
                                                      final _newSource =
                                                          TAIYAKI_SOURCES[
                                                              index];
                                                      this.setState(() =>
                                                          _currentSource =
                                                              _newSource);
                                                    },
                                                    name: TAIYAKI_SOURCES[index]
                                                        .name),
                                          ),
                                        ),
                                      ],
                                    )),
                                  );
                                });
                          },
                          child:
                              Text('Current Source: ${_currentSource.name}')),
                    ),
                    Container(
                        height: TaiyakiSize.height * 0.85,
                        child: ListView.builder(
                            shrinkWrap: true,
                            // physics: NeverScrollableScrollPhysics(),
                            itemCount: results.length,
                            itemBuilder: (BuildContext context, int index) {
                              final _result = results[index];
                              return Tiles(
                                image: _result.image,
                                title: _result.title,
                                onTap: () {
                                  final _link = _result.link;
                                  widget.onLink({_link: _currentSource.name});
                                },
                              );
                            }))
                  ])
          ],
        ),
      )),
    );
  }
}
