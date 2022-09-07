import { XIcon } from "@heroicons/react/24/outline";

export default function ShowHideButton({ hidden, onClick, children }) {
  return (
    <button
      type="button"
      onClick={() => onClick(!hidden)}
      className={
        "flex h-6 w-8 items-center justify-center rounded-3xl p-1 text-center transition" +
        (hidden
          ? " hover:text-gray-800 hover:dark:text-gray-200 text-gray-300 dark:text-gray-700 bg-red-500 hover:bg-white hover:dark:bg-black"
          : " text-gray-800 dark:text-gray-200 hover:text-white hover:dark:text-black bg-white dark:bg-black hover:bg-red-500 hover:dark:bg-red-500")
      }
    >
      {hidden && (
        <XIcon
          className="absolute h-6 w-6 text-white dark:text-black"
          aria-hidden="true"
        />
      )}
      {children}
    </button>
  );
}
