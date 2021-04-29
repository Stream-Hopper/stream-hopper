import { useState, useEffect } from 'react';

export const useLocalStorage = (key, defaultValue) => {
  const stored = sessionStorage.getItem(key);
//   const initial = stored !==null ? JSON.parse(stored) : defaultValue;
  const initial = stored ? stored : defaultValue;
    // const initial = defaultValue
    console.log(stored,'CHECK IT OUT')

  const [value, setValue] = useState(initial);

  useEffect(() => {
    // localStorage.setItem(key, JSON.stringify(value));
    sessionStorage.setItem(key, value);
  }, [key, value]);

  return [value, setValue];
};