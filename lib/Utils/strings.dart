import 'dart:math';

const HIVE_DETAIL_BOX = 'HIVE_DETAIL_BOX';
const HIVE_HISTORY_BOX = 'HIVE_HISTORY_BOX';
const HIVE_SETTINGS_BOX = 'HIVE_SETTINGS_BOX';

const _chars = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890';
Random _rnd = Random();

String getRandString(int length) => String.fromCharCodes(Iterable.generate(
    length, (_) => _chars.codeUnitAt(_rnd.nextInt(_chars.length))));

String convertSecondsToDays(int seconds) {
  final _duration = Duration(seconds: seconds);

  final _day = _duration.inDays;
  final _hour = _duration.inHours;
  final _minute = _duration.inMinutes;

  if (_day > 0) {
    if (_day == 1) return '1 day';
    return '$_day days';
  }

  if (_hour > 0) {
    if (_hour == 1) return '1 hour';
    return '$_hour hours';
  }

  if (_minute > 0) {
    return '$_minute minutes';
  }

  return 'Delayed';
}

String? simklThumbnailGen(String? tag,
    {bool isPoster = false, bool isFanArt = false}) {
  if (tag != null) {
    if (isFanArt) return 'https://simkl.in/fanart/${tag}_mobile.jpg';
    if (isPoster) return 'https://simkl.in/posters/${tag}_ca.jpg';
    return 'https://simkl.in/episodes/${tag}_w.jpg';
  }
}
