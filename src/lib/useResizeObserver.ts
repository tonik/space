import * as React from "react";

interface UseResizeObserverOptions {
  ref: React.RefObject<Element | null>;
}
export function useResizeObserver({ ref }: UseResizeObserverOptions) {
  const [{ width, height }, setDimensions] = React.useState({
    width: 0,
    height: 0,
  });

  React.useEffect(() => {
    if (!ref.current) {
      return;
    }

    const resizeObserver = new ResizeObserver(([entry]) => {
      if (!entry) return;
      const contentBoxSize = entry.contentBoxSize[0];
      if (!contentBoxSize) return;

      setDimensions({
        width: contentBoxSize.inlineSize,
        height: contentBoxSize.blockSize,
      });
    });

    const element = ref.current;

    const { width: initialWidth, height: initialHeight } =
      element.getBoundingClientRect();
    setDimensions({ width: initialWidth, height: initialHeight });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.unobserve(element);
    };
  }, [ref]);

  return {
    width,
    height,
  };
}
