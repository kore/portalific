import * as React from 'react'

const useLocalStorage = (storageKey, fallbackState) => {
  const [value, setValue] = React.useState(
    typeof window.localStorage !== 'undefined'
      ? (JSON.parse(window.localStorage.getItem(storageKey)) ?? fallbackState)
      : fallbackState
  )

  React.useEffect(() => {
    window.localStorage?.setItem(storageKey, JSON.stringify(value))
  }, [value, storageKey])

  return [value, setValue]
}

export default useLocalStorage
