import {Accessor, createSignal} from 'solid-js';

export function useDragable(params: {
  onDown?: DownCallback;
  onMove: MoveCallback;
  onUp?: () => void;
}): [(event: MouseEvent) => void, Accessor<boolean>] {
  const [isDrag, setIsDrag] = createSignal(false);

  function handler(mouseDownEvent: MouseEvent) {
    mouseDownEvent.stopPropagation();
    const element = mouseDownEvent.currentTarget as HTMLElement;

    const startPoint = getPointFromEvent(mouseDownEvent, element);
    setIsDrag(true);
    params.onDown?.(startPoint);

    let startX = mouseDownEvent.clientX,
      startY = mouseDownEvent.clientY;

    function mouseMoveHandler(moveEvent: MouseEvent) {
      params.onMove({
        coords: getPointFromEvent(moveEvent, element),
        shift: [moveEvent.clientX - startX, startY - moveEvent.clientY],
      });

      startX = moveEvent.clientX;
      startY = moveEvent.clientY;
    }

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener(
      'mouseup',
      () => {
        setIsDrag(false);
        params.onUp?.();
        document.removeEventListener('mousemove', mouseMoveHandler);
      },
      {
        once: true,
      },
    );
  }

  return [handler, isDrag];
}

type Vector = [number, number];
type Point = Vector;

type DownCallback = (start: Point) => void;
type MoveCallback = (param: {coords: Point; shift: Vector}) => void;

function getPointFromEvent(event: MouseEvent, element: Element): Point {
  const clientRect = element.getBoundingClientRect();

  const x = event.clientX - clientRect.x;
  const y = event.clientY - clientRect.y;
  return [x, y];
}
