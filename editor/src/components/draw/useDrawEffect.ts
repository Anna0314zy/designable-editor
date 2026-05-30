import { useState, useEffect, useRef, useCallback } from 'react';

export const useDrawRectangle = () => {
  const [drawing, setDrawing] = useState(false);
  const [rectangle, setRectangle] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const ref = useRef<HTMLDivElement>();

  const handleMouseDown = useCallback((e) => {
    const rect = ref.current.getBoundingClientRect();
    setDrawing(true);
    setRectangle({ x: e.clientX - rect.left, y: e.clientY - rect.top, width: 0, height: 0 });
  },[]);

  const handleMouseMove = useCallback((e) => {
    if (!drawing) return;
    const clientRect = ref.current.getBoundingClientRect();
    setRectangle((rect) => {
      const newWidth = e.clientX - clientRect.left - rect.x;
      const newHeight = e.clientY - clientRect.top - rect.y;
      return {
        x: newWidth < 0 ? e.clientX - clientRect.left : rect.x,
        y: newHeight < 0 ? e.clientY - clientRect.top : rect.y,
        width: Math.abs(newWidth),
        height: Math.abs(newHeight),
      };
    });
  },[drawing]);

  const handleMouseUp = useCallback(() => {
    setDrawing(false);
  },[]);

  useEffect(() => {
    const element = ref.current;
    if (element) {
      element.addEventListener('mousedown', handleMouseDown);
      element.addEventListener('mousemove', handleMouseMove);
      element.addEventListener('mouseup', handleMouseUp);
      return () => {
        element.removeEventListener('mousedown', handleMouseDown);
        element.removeEventListener('mousemove', handleMouseMove);
        element.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [handleMouseDown, handleMouseMove, handleMouseUp]);

  return { ref, rectangle, drawing };
}