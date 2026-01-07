import { useCallback, useRef } from 'react';

/**
 * Custom hook for implementing infinite scroll with Intersection Observer
 * @param {Function} callback - Function to call when reaching the end
 * @param {boolean} hasMore - Whether there are more items to load
 * @param {boolean} isLoading - Whether data is currently being loaded
 * @returns {Function} - Ref callback to attach to the sentinel element
 */
export const useInfiniteScroll = (callback, hasMore, isLoading) => {
  const observer = useRef(null);

  const lastElementRef = useCallback(
    (node) => {
      // Don't observe if currently loading
      if (isLoading) return;

      // Disconnect previous observer
      if (observer.current) {
        observer.current.disconnect();
      }

      // Create new observer
      observer.current = new IntersectionObserver(
        (entries) => {
          // If the sentinel is visible and there's more data, trigger callback
          if (entries[0].isIntersecting && hasMore) {
            callback();
          }
        },
        {
          root: null,
          rootMargin: '100px',
          threshold: 0.1
        }
      );

      // Observe the new node
      if (node) {
        observer.current.observe(node);
      }
    },
    [callback, hasMore, isLoading]
  );

  return lastElementRef;
};

