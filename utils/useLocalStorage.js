import * as React from "react";

const useLocalStorage = (storageKey, fallbackState) => {
  const [value, setValue] = React.useState(
    (typeof localStorage !== "undefined") ?
      JSON.parse(localStorage.getItem(storageKey)) ?? fallbackState :
      fallbackState
  );

  React.useEffect(() => {
    localStorage?.setItem(storageKey, JSON.stringify(value));
  }, [value, storageKey]);

  return [value, setValue];
};

export default useLocalStorage;
