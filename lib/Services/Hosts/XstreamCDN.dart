import 'package:dio/dio.dart';
import 'package:taiyaki/Services/Sources/Base.dart';

import 'Base.dart';

class _XstreamModel {
  final String file, label;
  _XstreamModel({required this.file, required this.label});
  factory _XstreamModel.fromJson(Map<String, dynamic> json) =>
      _XstreamModel(file: json['file'], label: json['label']);
}

class XstreamCDN with HostsAPIRequests implements HostsBase {
  @override
  bool get allowsDownloads => true;

  @override
  Future<List<HostsLinkModel>> getLinks(String link) async {
    final _api = Uri.parse(link);
    final _jsonLink = _api.scheme +
        '://' +
        _api.host +
        '/api/source/' +
        _api.pathSegments.last;
    final _response = await requests.post(_jsonLink,
        data: {'r': '', "d": 'fcdn.stream'},
        options: Options(headers: {'Referer': link}));

    final List<_XstreamModel> _results = List<_XstreamModel>.from(
        _response.data['data'].map((e) => _XstreamModel.fromJson(e)).toList());

    return _results
        .map((e) => HostsLinkModel(
              name: e.label,
              link: e.file,
              headers: {"Referer": 'https://fcdn.stream/'},
            ))
        .toList();
  }

  @override
  SourceInfo get info => SourceInfo(developer: 'Taiyaki');

  @override
  String get name => 'XstreamCDN';
}
