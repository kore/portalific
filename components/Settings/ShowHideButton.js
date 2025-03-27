import { XCircleIcon } from "@heroicons/react/24/outline";

export default function ShowHideButton({ hidden, onClick, children }) {
  return (
    <button
      type="button"
      onClick={() => onClick(!hidden)}
      className={`theme-switcher__button ${hidden ? 'theme-switcher__button--hidden' : 'theme-switcher__button--visible'}`}
    >
      {hidden && (
        <XCircleIcon
          className="theme-switcher__icon theme-switcher__icon--hidden"
          aria-hidden="true"
        />
      )}
      {children}
    </button>
  );
}
