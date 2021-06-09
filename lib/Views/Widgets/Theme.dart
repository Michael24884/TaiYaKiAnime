import 'package:flutter/material.dart';

ColorScheme darkColorScheme(String accent) =>
    ThemeData.dark().colorScheme.copyWith(
        secondary: Color(int.parse('0xff$accent')),
        primary: Color(int.parse('0xff$accent')));

ColorScheme lightColorScheme(String accent) =>
    ThemeData.light().colorScheme.copyWith(
        secondary: Color(int.parse('0xff$accent')),
        primary: Color(int.parse('0xff$accent')));
