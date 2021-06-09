import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';

class TaiyakiImage extends StatelessWidget {
  final String? url;
  final double? height;
  final double? width;

  final BoxFit fit;

  TaiyakiImage({this.url, this.height, this.width, this.fit = BoxFit.cover});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: width,
      height: height,
      color: Theme.of(context).colorScheme.surface,
      child: url != null
          ? CachedNetworkImage(
              imageUrl: url!,
              fit: fit,
              height: height,
              width: width,
              fadeInDuration: const Duration(milliseconds: 500),
              fadeInCurve: Curves.easeOut,
              placeholder: (BuildContext context, String? progress) {
                return Image.asset(
                  'assets/icon.png',
                  height: height,
                  width: width,
                );
              },
            )
          : Image.asset('assets/icon.png'),
    );
  }
}
