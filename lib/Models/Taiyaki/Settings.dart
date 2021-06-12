import 'package:hive/hive.dart';

part 'Settings.g.dart';

@HiveType(typeId: 7)
class AppSettingsModel {
  @HiveField(0)
  bool blurSpoilers;
  @HiveField(1)
  bool autoChange100;
  @HiveField(2)
  bool isDarkMode;
  @HiveField(3)
  String accent;
  @HiveField(4)
  bool updateAt75;

  AppSettingsModel(
      {this.autoChange100 = true,
      this.blurSpoilers = true,
      this.isDarkMode = false,
      this.updateAt75 = true,
      this.accent = '581886'});

  AppSettingsModel copyWith({
    bool? blurSpoilers,
    bool? autoChange100,
    bool? isDarkMode,
    bool? updateAt75,
    String? accent,
  }) =>
      AppSettingsModel(
        blurSpoilers: blurSpoilers ?? this.blurSpoilers,
        autoChange100: autoChange100 ?? this.autoChange100,
        isDarkMode: isDarkMode ?? this.isDarkMode,
        accent: accent ?? this.accent,
        updateAt75: updateAt75 ?? this.updateAt75,
      );
}
