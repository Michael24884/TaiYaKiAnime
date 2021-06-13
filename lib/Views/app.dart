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
    var accent = Color(int.parse('0xff$_accent'));
    var bgColor = Color(0xff121212);
    var cardColor = Color(0xff1D1D1D);
    var bottomNavbarColor = Color(0xff1f1f1f);

    return MaterialApp(
      theme: _isDark
          ? ThemeData.dark().copyWith(
              cardColor: cardColor,
              scaffoldBackgroundColor: bgColor,
              dialogBackgroundColor: bgColor,
              appBarTheme: AppBarTheme(
                color: bgColor,
                elevation: 0.0,
              ),
              cardTheme: CardTheme(
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8.0),
                ),
              ),
              bottomNavigationBarTheme: BottomNavigationBarThemeData(
                backgroundColor: bottomNavbarColor,
                type: BottomNavigationBarType.fixed,
                elevation: 8.0,
                showSelectedLabels: true,
                showUnselectedLabels: false,
              ),
              indicatorColor: accent,
              accentColor: accent,
              toggleableActiveColor: accent,
              primaryColor: accent,
              brightness: Brightness.dark,
              colorScheme: darkColorScheme(_accent),
              textTheme:
                  GoogleFonts.poppinsTextTheme(ThemeData.dark().textTheme))
          : ThemeData.light().copyWith(
              indicatorColor: ThemeData.light().scaffoldBackgroundColor,
              primaryColor: accent,
              accentColor: accent,
              toggleableActiveColor: accent,
              brightness: Brightness.light,
              cardTheme: CardTheme(
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8.0),
                ),
              ),
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
