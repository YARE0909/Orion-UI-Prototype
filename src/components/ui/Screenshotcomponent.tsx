import React, { useState, useRef } from "react";
import html2canvas from "html2canvas";
import { Crop } from "lucide-react";

// Props interface to define the onScreenshotTaken function
interface ScreenshotComponentProps {
  onScreenshotTaken: (image: string) => void;
}

const ScreenshotComponent: React.FC<ScreenshotComponentProps> = ({
  onScreenshotTaken,
}) => {
  const [boxSize, setBoxSize] = useState({ width: 300, height: 200 });
  const [boxPosition, setBoxPosition] = useState({ top: 50, left: 50 });
  const [isResizing, setIsResizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isCapturing, setIsCapturing] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle drag start
  const handleDragStart = (e: React.MouseEvent) => {
    if (boxRef.current) {
      const boxRect = boxRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - boxRect.left,
        y: e.clientY - boxRect.top,
      });
      setIsDragging(true);
    }
    e.stopPropagation();
  };

  // Handle drag move
  const handleDragMove = (e: MouseEvent) => {
    if (isDragging && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();

      const newLeft = Math.min(
        Math.max(e.clientX - containerRect.left - dragOffset.x, 0),
        containerRect.width - boxSize.width
      );
      const newTop = Math.min(
        Math.max(e.clientY - containerRect.top - dragOffset.y, 0),
        containerRect.height - boxSize.height
      );

      setBoxPosition({ top: newTop, left: newLeft });
    }
  };

  // Handle resize start
  const handleResizeStart = (e: React.MouseEvent) => {
    setIsResizing(true);
    e.stopPropagation();
  };

  // Handle resize move
  const handleResizeMove = (e: MouseEvent) => {
    if (isResizing && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();

      const newWidth = Math.min(
        Math.max(e.clientX - containerRect.left - boxPosition.left, 50),
        containerRect.width - boxPosition.left
      );
      const newHeight = Math.min(
        Math.max(e.clientY - containerRect.top - boxPosition.top, 50),
        containerRect.height - boxPosition.top
      );

      setBoxSize({ width: newWidth, height: newHeight });
    }
  };

  // Take screenshot
  const takeScreenshot = async () => {
    if (boxRef.current) {
      setIsCapturing(true); // Temporarily hide borders and other elements
      const screenshotButton = document.querySelector("button");
      if (screenshotButton) screenshotButton.style.visibility = "hidden"; // Hide the button

      await new Promise((resolve) => setTimeout(resolve, 0)); // Wait for DOM updates

      const { top, left, width, height } = boxRef.current.getBoundingClientRect();

      // Use html2canvas to capture the region
      const canvas = await html2canvas(document.body, {
        useCORS: true,
        x: left,
        y: top,
        width,
        height,
        scrollY: -window.scrollY, // Adjust for scrolling
      });

      const image = canvas.toDataURL("image/png");
      onScreenshotTaken(image); // Pass the image data to the parent component

      // Restore UI
      setIsCapturing(false);
      if (screenshotButton) screenshotButton.style.visibility = "visible";
    }
  };



  // Event listeners for mouse move and up
  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) handleDragMove(e);
      if (isResizing) handleResizeMove(e);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, isResizing, boxPosition, boxSize, dragOffset]);

  return (
    <div
      className="w-full h-full relative flex flex-col items-center justify-center bg-transparent z-50"
      ref={containerRef}
    >
      {/* Resizable and draggable capture area */}
      <div
        ref={boxRef}
        className={`absolute rounded-md bg-transparent cursor-move ${isCapturing ? "" : "border-2 border-dashed border-white"
          }`}
        style={{
          width: `${boxSize.width}px`,
          height: `${boxSize.height}px`,
          top: `${boxPosition.top}px`,
          left: `${boxPosition.left}px`,
        }}
        onMouseDown={handleDragStart}
      >
        {!isCapturing && (
          <div
            className="absolute bottom-0 right-0 w-2 h-2 bg-indigo-500 cursor-se-resize rounded-sm bg-transparent"
            onMouseDown={handleResizeStart}
          />
        )}
      </div>

      {/* Capture button */}
      <button
        className="absolute w-fit rounded-md bg-highlight hover:bg-zinc-300 dark:hover:bg-zinc-700 px-4 py-2 flex items-center justify-center space-x-1"
        style={{
          top: `${boxPosition.top + boxSize.height + 10}px`, // Positioned 10px below the capture area
          left: `${boxPosition.left + boxSize.width / 2}px`, // Centered relative to the capture area
          transform: "translateX(-50%)", // Center alignment
        }}
        onClick={takeScreenshot}
      >
        <Crop />
        <h1>Capture</h1>
      </button>
    </div>
  );
};

export default ScreenshotComponent;