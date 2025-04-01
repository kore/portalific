import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";

export default function Module({
  id,
  type,
  column,
  index,
  moveModule,
  children,
  hiddenOnDevices = [],
}) {
  const ref = useRef(null);

  const [{ handlerId }, drop] = useDrop({
    accept: "MODULE",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }

      // Don't replace items with themselves
      const moveTarget = { id, index, column };
      if (
        item.index === moveTarget.index &&
        item.column === moveTarget.column
      ) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (item.index < moveTarget.index && hoverClientY < hoverMiddleY) {
        return;
      }
      // Dragging upwards
      if (item.index > moveTarget.index && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveModule(item.column, item.index, moveTarget.column, moveTarget.index);
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.column = moveTarget.column;
      item.index = moveTarget.index;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: "MODULE",
    item: () => {
      return { id, index, column };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  // Create BEM visibility modifiers
  let visibilityClasses = [];
  if (hiddenOnDevices.includes("mobile")) {
    visibilityClasses.push("module--hidden-mobile");
  }
  if (hiddenOnDevices.includes("tablet")) {
    visibilityClasses.push("module--hidden-tablet");
  } else {
    visibilityClasses.push("module--visible-tablet");
  }
  if (hiddenOnDevices.includes("desktop")) {
    visibilityClasses.push("module--hidden-desktop");
  } else {
    visibilityClasses.push("module--visible-desktop");
  }

  return (
    <li
      className={`module module--${type} ${visibilityClasses.join(" ")} theme-transition`}
      style={{ opacity: isDragging ? 0.2 : 1 }}
      ref={ref}
      data-handler-id={handlerId}
    >
      {children}
    </li>
  );
}
