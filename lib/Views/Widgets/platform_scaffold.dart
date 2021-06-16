import 'dart:io' show Platform;

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class PlatformScaffold extends StatelessWidget {
  final Widget child;
  final String appBarTitle;
  final List<Widget>? actions;

  PlatformScaffold(
      {required this.child, required this.appBarTitle, this.actions});

  @override
  Widget build(BuildContext context) {
    if (Platform.isIOS) {
      return CupertinoPageScaffold(
          child: NestedScrollView(
        headerSliverBuilder: (BuildContext context, bool isInnerBoxScrolled) {
          return [
            CupertinoSliverNavigationBar(
              heroTag: appBarTitle,
              largeTitle: Text(appBarTitle,
                  style: TextStyle(
                      color: Theme.of(context).textTheme.bodyText1!.color)),
              trailing: (actions?.isNotEmpty ?? false) ? actions!.first : null,
            )
          ];
        },
        body: child,
      ));
    }
    return Scaffold(
      appBar: AppBar(
        title: Text(appBarTitle),
        actions: actions,
      ),
      body: child,
    );
  }
}
