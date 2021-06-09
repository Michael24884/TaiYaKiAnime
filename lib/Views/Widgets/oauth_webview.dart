import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';

class OauthWebview extends StatefulWidget {
  final Uri uri;

  OauthWebview({required this.uri, key}) : super(key: key);

  @override
  _OauthWebviewState createState() => _OauthWebviewState();
}

class _OauthWebviewState extends State<OauthWebview> {
  void _onPageFinished(String url) {
    print('the url is: $url');
  }

  @override
  Widget build(BuildContext context) {
    return WebView(
      initialUrl: widget.uri.toString(),
      initialMediaPlaybackPolicy:
          AutoMediaPlaybackPolicy.require_user_action_for_all_media_types,
      allowsInlineMediaPlayback: false,
      onPageFinished: _onPageFinished,
    );
  }
}
