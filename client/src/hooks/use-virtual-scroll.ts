import { useState, useEffect, useCallback, useMemo } from 'react';

interface UseVirtualScrollOptions {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
  items: any[];
}

export function useVirtualScroll({
  itemHeight,
  containerHeight,
  overscan = 5,
  items
}: UseVirtualScrollOptions) {
  const [scrollTop, setScrollTop] = useState(0);

  const handleScroll = useCallback((e: Event) => {
    const target = e.target as HTMLElement;
    setScrollTop(target.scrollTop);
  }, []);

  const virtualItems = useMemo(() => {
    const visibleStart = Math.floor(scrollTop / itemHeight);
    const visibleEnd = Math.min(
      visibleStart + Math.ceil(containerHeight / itemHeight),
      items.length - 1
    );

    const startIndex = Math.max(0, visibleStart - overscan);
    const endIndex = Math.min(items.length - 1, visibleEnd + overscan);

    const virtualizedItems = [];
    for (let i = startIndex; i <= endIndex; i++) {
      virtualizedItems.push({
        index: i,
        item: items[i],
        offsetTop: i * itemHeight,
      });
    }

    return virtualizedItems;
  }, [scrollTop, itemHeight, containerHeight, overscan, items]);

  const totalHeight = items.length * itemHeight;

  return {
    virtualItems,
    totalHeight,
    handleScroll,
  };
}