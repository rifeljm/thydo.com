import { useEffect, useRef } from 'react';
import { format, differenceInCalendarDays, addDays } from 'date-fns';

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

/* https://usehooks.com/useEventListener/ */
export const useEventListener = (eventName, handler, element = global) => {
  // Create a ref that stores handler
  const savedHandler = useRef();

  // Update ref.current value if handler changes.
  // This allows our effect below to always get latest handler ...
  // ... without us needing to pass it in effect deps array ...
  // ... and potentially cause effect to re-run every render.
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(
    () => {
      // Make sure element supports addEventListener
      const isSupported = element && element.addEventListener;
      if (!isSupported) return;

      // Create event listener that calls handler function stored in ref
      const eventListener = event => savedHandler.current(event);

      // Add event listener
      element.addEventListener(eventName, eventListener);

      // Remove event listener on cleanup
      return () => {
        element.removeEventListener(eventName, eventListener);
      };
    },
    [eventName, element] // Re-run if eventName or element changes
  );
};

export const fromToDays = (from, to) => {
  const diff = Math.abs(differenceInCalendarDays(from, to));
  return [...Array(diff + 1).keys()].map(idx => format(addDays(from, idx), 'YYYY-MM-DD'));
};

export const monthColors = [
  '#5061BF',
  '#5CAAD8',
  '#9DC65E',
  '#693E95',
  '#4A9656',
  '#DA4B7E',
  '#8F4C81',
  '#F1B55F',
  '#DF6B46',
  '#DE594B',
  '#644733',
  '#B24143',
];

export const trashSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
  <path d="M15 4V3H9v1H4v2h1v13c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V6h1V4h-5zm2 15H7V6h10v13z"/>
  <path d="M9 8h2v9H9zm4 0h2v9h-2z"/>
</svg>`;

export const checkSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <path d="M435.848 83.466L172.804 346.51l-96.652-96.652c-4.686-4.686-12.284-4.686-16.971 0l-28.284 28.284c-4.686 4.686-4.686 12.284 0 16.971l133.421 133.421c4.686 4.686 12.284 4.686 16.971 0l299.813-299.813c4.686-4.686 4.686-12.284 0-16.971l-28.284-28.284c-4.686-4.686-12.284-4.686-16.97 0z"/>
</svg>`;
