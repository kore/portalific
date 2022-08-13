import { useRef } from "react";
import { useDrop } from "react-dnd";

export default function Column({ column, length, moveModule, children }) {
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

      // Do not allow item to drop on current column
      if (item.column === column) {
        return;
      }

      // Time to actually perform the action
      moveModule(item.column, item.index, column, length);
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.column = column;
      item.index = length;
    },
  });

  drop(ref);

  return (
    <li className={""} ref={ref} data-handler-id={handlerId}>
      {children}
    </li>
  );
}
