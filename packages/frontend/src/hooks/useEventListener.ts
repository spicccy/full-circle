import { RefObject, useEffect, useRef } from 'react';

type RefOrElement<TElement> = RefObject<TElement> | TElement;

const isRef = <TElement>(
  element: RefOrElement<TElement>
): element is RefObject<TElement> => 'current' in element;

function useEventListener<
  TElement extends Window,
  TEvent extends keyof WindowEventMap
>(
  element: TElement,
  type: TEvent,
  listener: (event: WindowEventMap[TEvent]) => any
): void;

function useEventListener<
  TElement extends Document,
  TEvent extends keyof DocumentEventMap
>(
  element: TElement,
  type: TEvent,
  listener: (event: DocumentEventMap[TEvent]) => any
): void;

function useEventListener<
  TElement extends HTMLElement,
  TEvent extends keyof HTMLElementEventMap
>(
  element: RefOrElement<TElement>,
  type: TEvent,
  listener: (event: HTMLElementEventMap[TEvent]) => any
): void;

function useEventListener<
  TElement extends HTMLElement | Document | Window | null,
  TEvent extends keyof HTMLElementEventMap
>(
  element: TElement,
  type: TEvent,
  listener: (event: HTMLElementEventMap[TEvent]) => any
) {
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
}

export { useEventListener };
