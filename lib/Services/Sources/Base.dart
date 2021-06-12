import 'package:dio/dio.dart';

abstract class SourceBase {
  Future<List<String>> getEpisodeLinks(String link);
  Future<List<SourceSearchResultsModel>> getSearchResults(String query);
  Future<List<SourceEpisodeHostsModel>> getEpisodeHosts(String episodeLink);
  Future<int> getTotalEpisodesAvailable(String link);
  void dispose();

  String get name;
  bool get usesCloudflare;
  Dio get request;
  SourceInfo get info;

  SourceBase() {
    request.interceptors.add(
      InterceptorsWrapper(onRequest:
          (RequestOptions options, RequestInterceptorHandler handler) {
        print('hello world');
        if (options.uri.scheme != 'https') {
          final _newUrl = options.baseUrl.replaceFirst('http', 'https');
          options.copyWith(baseUrl: _newUrl);
        }
        return handler.next(options);
      }, onResponse: (Response response, handler) {
        print('returning data');
      }),
    );
  }
}

class SourceInfo {
  final String developer;

  SourceInfo({required this.developer});
}

class SourceSearchResultsModel {
  final String title;
  final String image;
  final String link;
  SourceSearchResultsModel(
      {required this.title, required this.link, required this.image});
}

class SourceEpisodeHostsModel {
  final String host;
  final String hostLink;
  SourceEpisodeHostsModel({required this.hostLink, required this.host});
}
