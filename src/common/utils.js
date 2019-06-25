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
