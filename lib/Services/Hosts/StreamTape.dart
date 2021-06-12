import 'dart:convert';

import 'package:html/parser.dart';
import 'package:taiyaki/Services/Exceptions/API/Exceptions+API.dart';
import 'package:taiyaki/Services/Sources/Base.dart';

import 'Base.dart';

class StreamTape with HostsAPIRequests implements HostsBase {
  @override
  bool get allowsDownloads => true;

  @override
  Future<List<HostsLinkModel>> getLinks(String link) async {
    final _reponse = await requests.get(link);
    final _$ = parse(_reponse.data)
        .querySelectorAll('script')
        .firstWhere((element) => element.innerHtml.contains('var vidconfig'))
        .innerHtml;

    final RegExp _regExp = RegExp(r'\s{.+};', multiLine: true);
    String? _match = _regExp.stringMatch(_$);
    if (_match == null) throw HostsException(error: 'Could not grab the link');

    _match = _match.substring(0, _match.length - 1).trim();
    final _json = json.decode(_match);
    final String id = _json['id'];
    final String corslink = Uri.parse(_json['cors']).pathSegments.last;
    final String title = _json['showtitle'];

    final Uri realLink = Uri(
        scheme: 'https',
        host: 'streamtape.com',
        path: '/get_video',
        query: 'id=$id&$corslink&stream=1');
    final _hostModel = HostsLinkModel(
        name: 'Custom',
        link: realLink.toString(),
        headers: {'Referer': 'https://streamtape.com/e/$id/$title'});

    return [_hostModel];
  }

  @override
  // TODO: implement info
  SourceInfo get info => throw UnimplementedError();

  @override
  String get name => 'StreamTape';
}
