import { useEffect, useRef } from 'react';

interface UseAutoPageTurnProps {
  isEnabled: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  delay?: number; // delay in milliseconds
}

export const useAutoPageTurn = ({
  isEnabled,
  currentPage,
  totalPages,
  onPageChange,
  delay = 5000, // Default 5 seconds
}: UseAutoPageTurnProps) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isEnabled && currentPage < totalPages - 1) {
      timeoutRef.current = setTimeout(() => {
        onPageChange(currentPage + 1);
      }, delay);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isEnabled, currentPage, totalPages, delay, onPageChange]);

  const reset = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  return { reset };
};
