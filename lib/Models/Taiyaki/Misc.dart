String mapMonthToAnilistSeason(int month) {
  if (month == 12 || month <= 2) return 'WINTER';
  if (month >= 3 && month <= 5) return 'SPRING';
  if (month <= 6 && month <= 8)
    return 'SUMMER';
  else
    return 'FALL';
}

String mapSeasonToAnilistNextSeason(String season) {
  switch (season) {
    case 'WINTER':
      return 'SPRING';
    case 'SPRING':
      return 'SUMMER';
    case 'SUMMER':
      return 'FALL';
    default:
      return 'WINTER';
  }
}
