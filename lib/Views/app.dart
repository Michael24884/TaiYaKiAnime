import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:taiyaki/Store/GlobalSettingsStore/GlobalSettingsStore.dart';
import 'package:taiyaki/Store/GlobalUserStore/GlobalUserStore.dart';
import 'package:taiyaki/Views/Widgets/Theme.dart';
import 'package:taiyaki/Views/routes.dart';

import 'Widgets/bottom_navigation.dart';

class CreateApp extends StatefulWidget {
  @override
  _CreateAppState createState() => _CreateAppState();
}

class _CreateAppState extends State<CreateApp> {
  bool _isDark = GlobalSettingsStore.store.getState().appSettings.isDarkMode;
  String _accent = GlobalSettingsStore.store.getState().appSettings.accent;

  @override
  void initState() {
    GlobalSettingsStore.store.observable().listen((event) {
      final _isDarkS = event.appSettings;
      if (_isDarkS.isDarkMode != this._isDark)
        this.setState(() => _isDark = _isDarkS.isDarkMode);
      if (_isDarkS.accent != this._accent)
        this.setState(() => _accent = _isDarkS.accent);
    });
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: _isDark
          ? ThemeData.dark().copyWith(
              accentColor: Color(int.parse('0xff$_accent')),
              // colorScheme: ,
              primaryColor: Color(int.parse('0xff$_accent')),
              brightness: Brightness.dark,
              colorScheme: darkColorScheme(_accent),
              textTheme:
                  GoogleFonts.poppinsTextTheme(ThemeData.dark().textTheme))
          : ThemeData.light().copyWith(
              primaryColor: Color(int.parse('0xff$_accent')),
              accentColor: Color(int.parse('0xff$_accent')),
              brightness: Brightness.light,
              colorScheme: lightColorScheme(_accent),
              textTheme:
                  GoogleFonts.poppinsTextTheme(ThemeData.light().textTheme)),
      // home: TaiyakiBottomNavigation(),
      home: GlobalUserStore.store.getState().passedOnboarding
          ? TaiyakiBottomNavigation()
          : routes.buildPage('onboarding_page', null),
      onGenerateRoute: (RouteSettings settings) {
        return MaterialPageRoute(builder: (BuildContext context) {
          return routes.buildPage(settings.name, settings.arguments);
        });
      },
    );
  }
}
