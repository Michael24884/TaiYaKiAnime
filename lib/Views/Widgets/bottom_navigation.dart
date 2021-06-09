import 'package:flutter/material.dart';

import '../routes.dart';

class TaiyakiBottomNavigation extends StatefulWidget {
  TaiyakiBottomNavigation({Key key = const Key('taiyaki_bottom_navigation')})
      : super(key: key);

  @override
  _BottomNavigationState createState() => _BottomNavigationState();
}

class _BottomNavigationState extends State<TaiyakiBottomNavigation> {
  int index = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: index,
        selectedItemColor: Theme.of(context).colorScheme.secondary,
        onTap: (int newIndex) => this.setState(() => index = newIndex),
        unselectedItemColor: Colors.grey,
        items: [
          BottomNavigationBarItem(
              icon: Icon(Icons.dashboard), label: 'Discover'),
          BottomNavigationBarItem(icon: Icon(Icons.history), label: 'History'),
          // BottomNavigationBarItem(
          //     icon: Icon(Icons.download_sharp), label: 'Downloads'),
          BottomNavigationBarItem(
              icon: Icon(Icons.settings), label: 'Settings'),
        ],
      ),
      body: IndexedStack(
        index: index,
        children: [
          routes.buildPage('discovery_page', null),
          routes.buildPage('history_page', null),
          // routes.buildPage('downloads_page', null),
          routes.buildPage('settings_page', null),
        ],
      ),
    );
  }
}
