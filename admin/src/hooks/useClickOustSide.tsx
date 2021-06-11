import { RefObject, useEffect } from "react";

function useClickOutside(ref: RefObject<HTMLElement>, handler: Function) {
  console.log("进来了");
  useEffect(() => {
    console.log("ref应该变化了", ref);
    const listener = (event: MouseEvent) => {
      console.log("事件");
      if (!ref.current || ref.current.contains(event.target as HTMLElement)) {
        return;
      }
      handler(event);
    };
    document.addEventListener("click", listener);
    return () => {
      console.log("上一个删了");
      document.removeEventListener("click", listener);
    };
  }, [ref]);
}

export default useClickOutside;
