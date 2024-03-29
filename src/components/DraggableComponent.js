import React from 'react';
import { useDrag } from 'react-dnd';

const DraggableComponent = ({ id, status, children }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type:'TASK',
    item: { id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));
  if(isDragging){
    console.log("the item is dragging is",id)
  }
  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
      {children}
    </div>
  );
};

export default DraggableComponent;
