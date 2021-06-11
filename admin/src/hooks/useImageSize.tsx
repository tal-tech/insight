import { useEffect, useState } from "react";
import { imageGetSize } from "../utils/image";

function useImageSize(url: string, zoom: number = 1) {
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);

  useEffect(() => {
    imageGetSize(url, (width: number, height: number): void => {
      if (zoom === 0) return console.error("缩放倍数不能为 0");
      setWidth(width / zoom);
      setHeight(height / zoom);
    });
  }, [url, zoom]);

  return [width, height];
}

export default useImageSize;
