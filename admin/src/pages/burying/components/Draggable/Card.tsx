import React, { CSSProperties, FC, memo, useMemo, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { ItemTypes } from "./ItemTypes";
import "./card.less";
// const style: CSSProperties = {
//   border: "1px dashed gray",
//   backgroundColor: "white",
//   cursor: "move",
//   marginRight:"15px"
// };

export interface CardProps {
  id: any;
  text: string;
  moveCard: (draggedId: string, id: string) => void;
}

export const Card: FC<CardProps> = memo(({ id, text, moveCard }) => {
  const ref = useRef(null);
  const [{ isDragging }, connectDrag] = useDrag(() => ({
    item: { id, type: ItemTypes.CARD },
    collect: (monitor: any) => {
      const result = {
        isDragging: monitor.isDragging(),
      };
      return result;
    },
  }));

  const [, connectDrop] = useDrop(
    () => ({
      accept: ItemTypes.CARD,
      hover({ id: draggedId }: { id: string; type: string }) {
        if (draggedId !== id) {
          moveCard(draggedId, id);
        }
      },
    }),
    [id, moveCard]
  );

  connectDrag(ref);
  connectDrop(ref);
  // const opacity = isDragging ? 0 : 1;
  // const containerStyle = useMemo(() => ({ ...style, opacity }), [opacity]);

  return (
    <div ref={ref} className="card">
      <img src={text} alt="" style={{ width: 200 }} />
    </div>
  );
});
