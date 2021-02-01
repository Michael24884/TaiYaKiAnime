import {AnilistDates} from '../Models/Anilist';

export const timeUntil = (seconds: number): string => {
  seconds = Number(seconds);
  var d = Math.floor(seconds / (3600 * 24));
  var h = Math.floor((seconds % (3600 * 24)) / 3600);
  var m = Math.floor((seconds % 3600) / 60);
  // var s = Math.floor(seconds % 60);

  if (d > 0) return `${d} ${d === 1 ? 'day' : 'days'}`;
  if (h > 0) return `${h} ${h === 1 ? 'hour' : 'hours'}`;
  else return `${m} ${m === 1 ? 'minute' : 'minutes'}`;

  //   var dDisplay = d > 0 ? d + (d == 1 ? ' day ' : ' days ') : '';
  //   var hDisplay = h > 0 ? h + (h == 1 ? ' hour ' : ' hours ') : '';
  //   var mDisplay = m > 0 ? m + (m == 1 ? ' minute ' : ' minutes ') : '';

  //   return dDisplay + hDisplay + mDisplay;
};

export function shuffleArray(array: any[]) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

export const minutesToHours = new Map<number, string>([
  [60, 'Every 1 hour'],
  [120, 'Every 2 hours'],
  [360, 'Every 6 hours'],
  [720, 'Every 12 hours'],
  [1440, 'Once a day'],
  [10080, 'Once a week'],
]);

export const dateNumToString = (aniDate: AnilistDates): string => {
  const {day, year, month} = aniDate;
  if (!day || !year || !month) return '??-?-????';
  try {
    const date = new Date(month + '/' + day + '/' + year).toLocaleDateString(
      [],
      {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      },
    );
    return date;
  } catch (e) {
    return '?? -?-????';
  }
};

export function simklThumbnails(
  img?: string,
  format: 'poster' | 'episode' | 'fanart' = 'poster',
): string | undefined {
  if (!img || img === 'null') return undefined;
  if (format === 'poster')
    return 'https://simkl.net/posters/' + img + '_ca.jpg';
  else if (format === 'fanart')
    return 'https://simkl.net/fanart/' + img + '_mobile.jpg';
  else return 'https://simkl.net/episodes/' + img + '_w.jpg';
}

export function splitRatios(
  stringRatio: string,
): {width: number; height: number} {
  const box = stringRatio.split('x');
  if (!Number(box[0]) || !Number(box[1])) {
    throw 'Items must be a number';
  }
  const width = Number(box[0]),
    height = Number(box[1]);
  return {width, height};
}

export function MALtoSimkl(_: number): number {
  return 1;
}

export function cleanString(item: string) {
  return item.replace(/<\w+>|<\/\w+>/g, '');
}

export function breakLine(_: string, _1: string[]): string {
  return '\n';
}
export function italics(_: string, matches: string[]): string {
  return matches[1];
}
export function paragraph(_: string, matches: string[]): string {
  return `\n ${matches[1]}`;
}

export function cleanUnderlines(item: string) {
  return item.replace(/_/, ' ');
}

export function getMinutesFromSeconds(seconds: number) {
  const minutes = seconds >= 60 ? Math.floor(seconds / 60) : 0;
  const second = Math.floor(seconds - minutes * 60);
  return `${minutes >= 10 ? minutes : '0' + minutes}:${
    second >= 10 ? second : '0' + second
  }`;
}

export function randomAgent(): string {
    const rand = Math.random() * userAgents.length - 1;
    return userAgents[Math.ceil(rand)];
} 

export const userAgents = [
'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/37.0.2062.94 Chrome/37.0.2062.94 Safari/537.36',
'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.85 Safari/537.36',
'Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko',
'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:40.0) Gecko/20100101 Firefox/40.0',
'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/600.8.9 (KHTML, like Gecko) Version/8.0.8 Safari/600.8.9',
'Mozilla/5.0 (iPad; CPU OS 8_4_1 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Version/8.0 Mobile/12H321 Safari/600.1.4',
'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.85 Safari/537.36',
'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.85 Safari/537.36',
'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.10240',
'Mozilla/5.0 (Windows NT 6.3; WOW64; rv:40.0) Gecko/20100101 Firefox/40.0',
'Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; rv:11.0) like Gecko',
'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.85 Safari/537.36',
'Mozilla/5.0 (Windows NT 6.1; Trident/7.0; rv:11.0) like Gecko',
'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:40.0) Gecko/20100101 Firefox/40.0',
'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_4) AppleWebKit/600.7.12 (KHTML, like Gecko) Version/8.0.7 Safari/600.7.12',
'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.85 Safari/537.36',
'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:40.0) Gecko/20100101 Firefox/40.0',
'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/600.8.9 (KHTML, like Gecko) Version/7.1.8 Safari/537.85.17',
'Mozilla/5.0 (iPad; CPU OS 8_4 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Version/8.0 Mobile/12H143 Safari/600.1.4',
'Mozilla/5.0 (iPad; CPU OS 8_3 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Version/8.0 Mobile/12F69 Safari/600.1.4',
'Mozilla/5.0 (Windows NT 6.1; rv:40.0) Gecko/20100101 Firefox/40.0',
'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; WOW64; Trident/6.0)',
'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0)',
'Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; Touch; rv:11.0) like Gecko',
'Mozilla/5.0 (Windows NT 5.1; rv:40.0) Gecko/20100101 Firefox/40.0',
]