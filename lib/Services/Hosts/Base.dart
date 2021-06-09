import 'package:dio/dio.dart';
import 'package:taiyaki/Services/Sources/Base.dart';

class HostsAPIRequests {
  Dio requests = Dio()
    ..interceptors.add(InterceptorsWrapper(
        onRequest: (RequestOptions options, RequestInterceptorHandler handler) {
      return handler.next(options);
    }));
}

abstract class HostsBase {
  bool get allowsDownloads;
  String get name;
  SourceInfo get info;

  Future<List<HostsLinkModel>> getLinks(String link);
}

class HostsLinkModel {
  final String name;
  final String link;
  final Map<String, String>? headers;
  HostsLinkModel({required this.name, required this.link, this.headers});
}
