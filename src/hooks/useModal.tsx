import { useState } from 'react';

export const useModal = () => {
  const [isShowing, setIsShowing] = useState<boolean>(false);

  function toggle() {
    setIsShowing(!isShowing);
  }

  return {
    isShowing,
    toggle,
  }
};

export default useModal;