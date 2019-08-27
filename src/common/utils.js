import { useEffect, useRef } from 'react';
import dayjs from 'dayjs';

import 'dayjs/locale/af';
import 'dayjs/locale/ar';
import 'dayjs/locale/az';
import 'dayjs/locale/be';
import 'dayjs/locale/bg';
import 'dayjs/locale/bm';
import 'dayjs/locale/bn';
import 'dayjs/locale/bo';
import 'dayjs/locale/bs';
import 'dayjs/locale/ca';
import 'dayjs/locale/cs';
import 'dayjs/locale/cy';
import 'dayjs/locale/da';
import 'dayjs/locale/de';
import 'dayjs/locale/el';
import 'dayjs/locale/en';
import 'dayjs/locale/eo';
import 'dayjs/locale/es';
import 'dayjs/locale/et';
import 'dayjs/locale/eu';
import 'dayjs/locale/fa';
import 'dayjs/locale/fi';
import 'dayjs/locale/fo';
import 'dayjs/locale/fr';
import 'dayjs/locale/ga';
import 'dayjs/locale/gl';
import 'dayjs/locale/gu';
import 'dayjs/locale/he';
import 'dayjs/locale/hi';
import 'dayjs/locale/hr';
import 'dayjs/locale/hu';
import 'dayjs/locale/id';
import 'dayjs/locale/is';
import 'dayjs/locale/it';
import 'dayjs/locale/ja';
import 'dayjs/locale/ka';
import 'dayjs/locale/kk';
import 'dayjs/locale/km';
import 'dayjs/locale/kn';
import 'dayjs/locale/ko';
import 'dayjs/locale/lt';
import 'dayjs/locale/lv';
import 'dayjs/locale/mk';
import 'dayjs/locale/ml';
import 'dayjs/locale/mr';
import 'dayjs/locale/ms';
import 'dayjs/locale/mt';
import 'dayjs/locale/my';
import 'dayjs/locale/nb';
import 'dayjs/locale/ne';
import 'dayjs/locale/nl';
import 'dayjs/locale/nn';
import 'dayjs/locale/pl';
import 'dayjs/locale/pt';
import 'dayjs/locale/ro';
import 'dayjs/locale/ru';
import 'dayjs/locale/si';
import 'dayjs/locale/sk';
import 'dayjs/locale/sl';
import 'dayjs/locale/sq';
import 'dayjs/locale/sr';
import 'dayjs/locale/sv';
import 'dayjs/locale/sw';
import 'dayjs/locale/ta';
import 'dayjs/locale/te';
import 'dayjs/locale/th';
import 'dayjs/locale/tr';
import 'dayjs/locale/tzm';
import 'dayjs/locale/uk';
import 'dayjs/locale/ur';
import 'dayjs/locale/uz';
import 'dayjs/locale/vi';
import 'dayjs/locale/yo';

export const locales = {
  af: 'Afrikaans',
  ar: 'Arabic',
  az: 'Azerbaijani',
  be: 'Belarusian',
  bg: 'Bulgarian',
  bm: 'Bambara',
  bn: 'Bengali',
  bo: 'Tibetan',
  bs: 'Bosnian',
  ca: 'Catalan',
  cs: 'Czech',
  cy: 'Welsh',
  da: 'Danish',
  de: 'German',
  el: 'Greek',
  en: 'English',
  eo: 'Esperanto',
  es: 'Spanish',
  et: 'Estonian',
  eu: 'Basque',
  fa: 'Persian',
  fi: 'Finnish',
  fo: 'Faroese',
  fr: 'French',
  ga: 'Irish',
  gl: 'Galician',
  gu: 'Gujarati',
  he: 'Hebrew',
  hi: 'Hindi',
  hr: 'Croatian',
  hu: 'Hungarian',
  id: 'Indonesian',
  is: 'Icelandic',
  it: 'Italian',
  ja: 'Japanese',
  ka: 'Georgian',
  kk: 'Kazakh',
  km: 'Khmer',
  kn: 'Kannada',
  ko: 'Korean',
  lt: 'Lithuanian',
  lv: 'Latvian',
  mk: 'Macedonian',
  ml: 'Malayalam',
  mr: 'Marathi',
  ms: 'Malay',
  mt: 'Maltese',
  my: 'Burmese',
  nb: 'Norwegian Bokmål',
  ne: 'Nepali',
  nl: 'Dutch',
  nn: 'Norwegian Nynorsk',
  pl: 'Polish',
  pt: 'Portuguese',
  ro: 'Romanian',
  ru: 'Russian',
  si: 'Sinhala',
  sk: 'Slovak',
  sl: 'Slovenian',
  sq: 'Albanian',
  sr: 'Serbian',
  sv: 'Swedish',
  sw: 'Swahili',
  ta: 'Tamil',
  te: 'Telugu',
  th: 'Thai',
  tr: 'Turkish',
  tzm: 'Central Morocco Tamazight',
  uk: 'Ukrainian',
  ur: 'Urdu',
  uz: 'Uzbek',
  vi: 'Vietnamese',
  yo: 'Yoruba',
};

export const _tr = key => {
  return key;
};

export const dayNumbersToObjects = (number, day) => {
  return number.map(number => {
    return {
      number,
      day,
    };
  });
};

export const upFirst = txt => {
  return `${txt[0].toUpperCase()}${txt.substring(1)}`;
};

export const fromToDays = (from, to) => {
  const diff = Math.abs(dayjs(from).diff(dayjs(to), 'day'));
  return [...Array(diff + 1).keys()].map(idx =>
    dayjs(from)
      .add(idx, 'days')
      .format('YYYY-MM-DD')
  );
};

export const monthColors = [
  '#337E92' /* jan */,
  '#709030' /* feb */,
  '#337763' /* mar */,
  '#449944' /* apr */,
  '#555599' /* may */,
  '#C06030' /* jun */,
  '#AA4444' /* jul */,
  '#CC6612' /* aug */,
  '#425F8F' /* sep */,
  '#775544' /* okt */,
  '#777722' /* nov */,
  '#445566' /* dec */,
];

export const trashSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
  <path d="M15 4V3H9v1H4v2h1v13c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V6h1V4h-5zm2 15H7V6h10v13z"/>
  <path d="M9 8h2v9H9zm4 0h2v9h-2z"/>
</svg>`;

export const checkSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <path d="M435.848 83.466L172.804 346.51l-96.652-96.652c-4.686-4.686-12.284-4.686-16.971 0l-28.284 28.284c-4.686 4.686-4.686 12.284 0 16.971l133.421 133.421c4.686 4.686 12.284 4.686 16.971 0l299.813-299.813c4.686-4.686 4.686-12.284 0-16.971l-28.284-28.284c-4.686-4.686-12.284-4.686-16.97 0z"/>
</svg>`;

export const gSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48">
  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
</svg>`;

export const cogSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <path d="M482.696 299.276l-32.61-18.827a195.168 195.168 0 0 0 0-48.899l32.61-18.827c9.576-5.528 14.195-16.902 11.046-27.501-11.214-37.749-31.175-71.728-57.535-99.595-7.634-8.07-19.817-9.836-29.437-4.282l-32.562 18.798a194.125 194.125 0 0 0-42.339-24.48V38.049c0-11.13-7.652-20.804-18.484-23.367-37.644-8.909-77.118-8.91-114.77 0-10.831 2.563-18.484 12.236-18.484 23.367v37.614a194.101 194.101 0 0 0-42.339 24.48L105.23 81.345c-9.621-5.554-21.804-3.788-29.437 4.282-26.36 27.867-46.321 61.847-57.535 99.595-3.149 10.599 1.47 21.972 11.046 27.501l32.61 18.827a195.168 195.168 0 0 0 0 48.899l-32.61 18.827c-9.576 5.528-14.195 16.902-11.046 27.501 11.214 37.748 31.175 71.728 57.535 99.595 7.634 8.07 19.817 9.836 29.437 4.283l32.562-18.798a194.08 194.08 0 0 0 42.339 24.479v37.614c0 11.13 7.652 20.804 18.484 23.367 37.645 8.909 77.118 8.91 114.77 0 10.831-2.563 18.484-12.236 18.484-23.367v-37.614a194.138 194.138 0 0 0 42.339-24.479l32.562 18.798c9.62 5.554 21.803 3.788 29.437-4.283 26.36-27.867 46.321-61.847 57.535-99.595 3.149-10.599-1.47-21.972-11.046-27.501zm-65.479 100.461l-46.309-26.74c-26.988 23.071-36.559 28.876-71.039 41.059v53.479a217.145 217.145 0 0 1-87.738 0v-53.479c-33.621-11.879-43.355-17.395-71.039-41.059l-46.309 26.74c-19.71-22.09-34.689-47.989-43.929-75.958l46.329-26.74c-6.535-35.417-6.538-46.644 0-82.079l-46.329-26.74c9.24-27.969 24.22-53.869 43.929-75.969l46.309 26.76c27.377-23.434 37.063-29.065 71.039-41.069V44.464a216.79 216.79 0 0 1 87.738 0v53.479c33.978 12.005 43.665 17.637 71.039 41.069l46.309-26.76c19.709 22.099 34.689 47.999 43.929 75.969l-46.329 26.74c6.536 35.426 6.538 46.644 0 82.079l46.329 26.74c-9.24 27.968-24.219 53.868-43.929 75.957zM256 160c-52.935 0-96 43.065-96 96s43.065 96 96 96 96-43.065 96-96-43.065-96-96-96zm0 160c-35.29 0-64-28.71-64-64s28.71-64 64-64 64 28.71 64 64-28.71 64-64 64z"/>
</svg>`;

export const signOutSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M160 217.1c0-8.8 7.2-16 16-16h144v-93.9c0-7.1 8.6-10.7 13.6-5.7l141.6 143.1c6.3 6.3 6.3 16.4 0 22.7L333.6 410.4c-5 5-13.6 1.5-13.6-5.7v-93.9H176c-8.8 0-16-7.2-16-16v-77.7m-32 0v77.7c0 26.5 21.5 48 48 48h112v61.9c0 35.5 43 53.5 68.2 28.3l141.7-143c18.8-18.8 18.8-49.2 0-68L356.2 78.9c-25.1-25.1-68.2-7.3-68.2 28.3v61.9H176c-26.5 0-48 21.6-48 48zM0 112v288c0 26.5 21.5 48 48 48h132c6.6 0 12-5.4 12-12v-8c0-6.6-5.4-12-12-12H48c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16h132c6.6 0 12-5.4 12-12v-8c0-6.6-5.4-12-12-12H48C21.5 64 0 85.5 0 112z"/></svg>`;

export const descriptionSvg = `<svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 1024 1024"><path d="M121.9 259.8h489.9c31.5 0 57.1-28.6 57.1-63.9s-25.5-63.9-57-63.9h-490c-31.5 0-57.1 28.6-57.1 63.9s25.6 63.9 57.1 63.9zm6.8 316.1h766.6c35.3 0 63.9-28.6 63.9-63.9s-28.6-63.9-63.9-63.9H128.7c-35.3 0-63.9 28.6-63.9 63.9s28.6 63.9 63.9 63.9zm766.6 188.3H128.7c-35.3 0-63.9 28.6-63.9 63.9S93.4 892 128.7 892h766.6c35.3 0 63.9-28.6 63.9-63.9s-28.6-63.9-63.9-63.9z"/></svg>`;

export const parseHour = str => {
  let timeParsed, timeSplitted, hour, min;
  timeSplitted = str.split(':');
  if (timeSplitted.length > 1 && timeSplitted[1].length === 2 && timeSplitted[0].length < 3) {
    hour = parseInt(timeSplitted[0], 10);
    min = parseInt(timeSplitted[1], 10);
  }
  if (hour >= 0 && hour <= 23 && min >= 0 && min <= 59) {
    return `${hour}:${min < 10 ? '0' + min : min}`;
  } else {
    timeParsed = str.split(/(am|AM|pm|PM)/);
    if (timeParsed && timeParsed.length === 3) {
      const amPm = timeParsed[1].toLowerCase();
      let min = '0';
      timeSplitted = timeParsed[0].split(':');
      hour = parseInt(timeSplitted[0], 10);
      if (timeSplitted.length > 1) {
        min = parseInt(timeSplitted[1], 10);
        if (timeSplitted[1].length < 2) {
          min = -1;
        }
      }
      if (hour > 0 && hour <= 12 && min >= 0 && min <= 59) {
        return `${(hour % 12) + (amPm === 'am' ? 0 : 12)}:${min < 10 ? '0' + min : min}`;
      }
    }
  }
  return null;
};
