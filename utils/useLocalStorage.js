import * as React from 'react';

export default (storageKey, fallbackState) => {
  console.info('Use localStorage with', storageKey);
  const [value, setValue] = React.useState(
    ((typeof localStorage !== 'undefined') && JSON.parse(localStorage.getItem(storageKey))) ?? fallbackState
  );

  React.useEffect(() => {
    localStorage?.setItem(storageKey, JSON.stringify(value));
  }, [value, storageKey]);

  return [value, setValue];
};
