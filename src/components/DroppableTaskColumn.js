import React from 'react';
import { useDrop } from 'react-dnd';

const DroppableTaskColumn = ({ status, onDrop, children }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'TASK',
    drop: (item) => onDrop(item, status),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div ref={drop} >
      {children}
    </div>
  );
};

export default DroppableTaskColumn;
