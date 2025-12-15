import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface PortalDropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  align?: 'left' | 'right';
  className?: string;
}

const PortalDropdown: React.FC<PortalDropdownProps> = ({ 
  trigger, 
  children, 
  isOpen, 
  onClose, 
  align = 'left',
  className = '' 
}) => {
  const triggerRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ top: 0, left: 0, minWidth: 0 });

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;

      setCoords({
        top: rect.bottom + scrollY + 8, // 8px gap
        left: align === 'left' ? rect.left + scrollX : rect.right + scrollX,
        minWidth: 150 // Default min width
      });
    }
  }, [isOpen, align]);

  // Handle click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        triggerRef.current && 
        !triggerRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest('.portal-dropdown-content')
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  return (
    <>
      <div ref={triggerRef} className="relative inline-block h-full">
        {trigger}
      </div>
      
      {isOpen && createPortal(
        <div 
            className={`portal-dropdown-content fixed z-[9999] bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100 ${className}`}
            style={{ 
                top: coords.top, 
                left: align === 'left' ? coords.left : 'auto', 
                right: align === 'right' ? (window.innerWidth - coords.left) : 'auto',
                minWidth: '200px'
            }}
        >
          {children}
        </div>,
        document.body
      )}
    </>
  );
};

export default PortalDropdown;