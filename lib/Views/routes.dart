// ignore: import_of_legacy_library_into_null_safe
import 'package:fish_redux/fish_redux.dart';
import 'package:taiyaki/Store/GlobalUserStore/GlobalUserState.dart';
import 'package:taiyaki/Store/GlobalUserStore/GlobalUserStore.dart';
import 'package:taiyaki/Views/Pages/anime_list_page/page.dart';
import 'package:taiyaki/Views/Pages/detail_page/page.dart';
import 'package:taiyaki/Views/Pages/discovery_page/page.dart';
import 'package:taiyaki/Views/Pages/history_page/page.dart';
import 'package:taiyaki/Views/Pages/search_page/page.dart';
import 'package:taiyaki/Views/Pages/settings_page/page.dart';

import 'Pages/downloads_page/page.dart';
import 'Pages/onboarding_page/page.dart';
import 'Pages/profile_page/page.dart';
import 'Pages/video_page/page.dart';

final AbstractRoutes routes = new PageRoutes(
    pages: <String, Page<Object, dynamic>>{
      'anime_list_page': AnimeListPage(),
      'discovery_page': DiscoveryPage(),
      'detail_page': DetailPage(),
      'downloads_page': DownloadsPage(),
      'history_page': HistoryPage(),
      'onboarding_page': OnboardingPage(),
      'profile_page': ProfilePage(),
      'settings_page': SettingsPage(),
      'search_page': SearchPage(),
      'video_page': VideoPage(),
    },
    visitor: (String path, Page<Object, dynamic> page) {
      /// 只有特定的范围的 Page 才需要建立和 AppStore 的连接关系
      /// 满足 Page<T> ，T 是 GlobalBaseState 的子类
      if (page.isTypeof<GlobalUserBaseState>()) {
        /// 建立 AppStore 驱动 PageStore 的单向数据连接
        /// 1. 参数1 AppStore
        /// 2. 参数2 当 AppStore.state 变化时, PageStore.state 该如何变化
        page.connectExtraStore<GlobalUserState>(GlobalUserStore.store,
            (dynamic pagestate, GlobalUserState appState) {
          final GlobalUserBaseState p = pagestate;
          if (p.anilistUser != appState.anilistUser ||
              p.simklUser != appState.simklUser ||
              p.myanimelistUser != appState.myanimelistUser) {
            if (pagestate is Cloneable) {
              final dynamic copy = pagestate.clone();
              final GlobalUserBaseState newState = copy;
              newState.myanimelistUser = appState.myanimelistUser;
              newState.simklUser = appState.simklUser;
              newState.anilistUser = appState.anilistUser;
              return newState;
            }
          }
          return pagestate;
        });
      }
    });
