import 'package:taiyaki/Services/Sources/Gogoanime.dart';

import 'Base.dart';

final TAIYAKI_SOURCES = [GogoAnime()];

SourceBase nameToSourceBase(String name) {
  switch (name) {
    case 'GogoAnime':
      return new GogoAnime();
    default:
      throw Exception('This source does not exist');
  }
}
