import { useState } from "react";
import Link from "next/link";
import Modal from "./Modal";
import Settings from "./Settings";
import { CogIcon } from "@heroicons/react/outline";

export default function Header({
  name,
  modules,
  setModules,
  settings,
  setSettings,
}) {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <header className="flex items-center p-2 w-full">
      <Link href="/">
        <a className="grow text-2xl dark:text-white text-left">{name}</a>
      </Link>
      <button
        type="button"
        className="flex-shrink-0 rounded-full p-1 ml-1 text-primary-200 hover:bg-primary-800 hover:text-white focus:outline-none focus:bg-primary-900 focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-900 focus:ring-white"
        onClick={() => setShowSettings(true)}
      >
        <span className="sr-only">View notifications</span>
        <CogIcon className="h-6 w-6" aria-hidden="true" />
      </button>
      <Modal open={showSettings} setOpen={setShowSettings}>
        <Settings
          modules={modules}
          setModules={setModules}
          settings={settings}
          setSettings={setSettings}
        />
      </Modal>
    </header>
  );
}
