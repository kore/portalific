import { useState } from "react";
import Link from "next/link";
import { CogIcon } from "@heroicons/react/outline";
import Modal from "./Modal";
import Settings from "./Settings";

export default function Header({
  name,
  modules,
  setModules,
  settings,
  setSettings,
}) {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <header className="flex w-full items-center p-2">
      <Link href="/">
        <a className="grow text-left text-2xl dark:text-white">{name}</a>
      </Link>
      <button
        type="button"
        className="ml-1 shrink-0 rounded-full p-1 text-primary-200 hover:bg-primary-800 hover:text-white focus:bg-primary-900 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-900"
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
