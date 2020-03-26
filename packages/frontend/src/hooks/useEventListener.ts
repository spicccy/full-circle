import { RefObject, useEffect, useRef } from 'react';

type RefOrElement<TElement> = RefObject<TElement> | TElement;

const isRef = <TElement>(
  element: RefOrElement<TElement>
): element is RefObject<TElement> => 'current' in element;

export const useEventListener = <
  TElement extends HTMLElement | Document | null,
  TEvent extends keyof HTMLElementEventMap
>(
  element: RefOrElement<TElement>,
  type: TEvent,
  listener: (event: HTMLElementEventMap[TEvent]) => any
) => {
  const savedHandler = useRef(listener);

  useEffect(() => {
    savedHandler.current = listener;
  }, [listener]);

  useEffect(() => {
    const innerElement = isRef(element) ? element.current : element;
    if (!innerElement?.addEventListener) return;

    const eventListener = (ev: any) => savedHandler.current(ev);

    innerElement.addEventListener(type, eventListener);

    return () => innerElement.removeEventListener(type, eventListener);
  }, [type, element]);
};
