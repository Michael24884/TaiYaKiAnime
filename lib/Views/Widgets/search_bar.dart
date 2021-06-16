import 'package:flutter/material.dart';

import 'TaiyakiSize.dart';

class SearchBar extends StatefulWidget {
  final Function(String) onEnter;
  final Function(String)? onDelayedEnter;
  final String? placeholder;
  final bool isLoading;

  SearchBar(
      {required this.onEnter,
      this.isLoading = false,
      this.onDelayedEnter,
      this.placeholder});

  @override
  _SearchBarState createState() => _SearchBarState();
}

class _SearchBarState extends State<SearchBar> {
  late TextEditingController _textController;
  bool _showClear = false;

  @override
  void initState() {
    _textController = TextEditingController();
    super.initState();
  }

  @override
  void dispose() {
    _textController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(8.0),
      child: Container(
        decoration: BoxDecoration(
            borderRadius: const BorderRadius.all(Radius.circular(6.0)),
            boxShadow: const [
              BoxShadow(
                color: Colors.black26,
                spreadRadius: 6.0,
                blurRadius: 8.0,
                offset: Offset(1, 2),
              )
            ],
            color: Theme.of(context).colorScheme.surface),
        child: Padding(
          padding: const EdgeInsets.all(4.0),
          child: SizedBox(
            // height: TaiyakiSize.height * 0.05,
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.center,
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                SizedBox(
                  width: TaiyakiSize.width * 0.8,
                  child: TextField(
                    enabled: !widget.isLoading,
                    controller: _textController,
                    decoration: InputDecoration(
                      border: InputBorder.none,
                      helperText: widget.placeholder ?? 'Search for an anime',
                    ),
                    onChanged: (String query) {
                      if (query.length > 1)
                        this.setState(() => _showClear = true);
                      else
                        this.setState(() => _showClear = false);

                      if (widget.onDelayedEnter == null) widget.onEnter(query);
                    },
                    textInputAction: TextInputAction.search,
                    onSubmitted: widget.onDelayedEnter != null
                        ? widget.onDelayedEnter
                        : widget.onEnter,
                  ),
                ),
                if (_showClear == true)
                  IconButton(
                    icon: Icon(Icons.close),
                    onPressed: () {
                      _textController.clear();
                      this.setState(() => _showClear = false);
                    },
                  )
              ],
            ),
          ),
        ),
      ),
    );
  }
}
