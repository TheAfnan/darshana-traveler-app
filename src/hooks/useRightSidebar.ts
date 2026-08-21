import { useState, useCallback } from 'react';

interface UseRightSidebarReturn {
  isOpen: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
}

export const useRightSidebar = (): UseRightSidebarReturn => {
  const [isOpen, setIsOpen] = useState(false);

  const openSidebar = useCallback(() => setIsOpen(true), []);
  const closeSidebar = useCallback(() => setIsOpen(false), []);
  const toggleSidebar = useCallback(() => setIsOpen(prev => !prev), []);

  return {
    isOpen,
    openSidebar,
    closeSidebar,
    toggleSidebar,
  };
};
