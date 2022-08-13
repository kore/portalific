import { SunIcon, MoonIcon, GlobeIcon } from "@heroicons/react/outline";

const ThemeSwitcher = () => {
  return (
    <div className="ml-4 flex justify-center rounded-3xl bg-white p-1 dark:bg-gray-900">
      <button
        type="button"
        aria-label="Use Dark Mode"
        onClick={() => {
          document.documentElement.classList.add("dark");
          localStorage.setItem("theme", "dark");
        }}
        className="flex h-8 w-16 items-center justify-center rounded-3xl p-1 text-center transition dark:bg-primary-500"
      >
        <MoonIcon className="h-6 w-6 text-gray-300 dark:text-white" aria-hidden="true" />
      </button>

      <button
        type="button"
        aria-label="Use Light Mode"
        onClick={() => {
          document.documentElement.classList.remove("dark");
          localStorage.setItem("theme", "light");
        }}
        className="flex h-8 w-16 items-center justify-center rounded-3xl bg-primary-500 p-1 text-center transition dark:bg-transparent"
      >
        <SunIcon className="h-6 w-6 text-gray-100 dark:text-gray-400" aria-hidden="true" />
      </button>
    </div>
  );
};

export default function Footer({ copyrightText }) {
  return (
    <footer className="flex flex-row items-center py-2">
      <p className="mb-1 font-bold opacity-80 dark:text-white">
        &copy; {copyrightText}
      </p>
      <ThemeSwitcher />
    </footer>
  );
}
