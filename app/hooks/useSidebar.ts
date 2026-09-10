import { useState } from "react";

export function useSidebar() {
  const [state, setState] = useState<'collapse' | 'extend'>('extend');

  function toggleState() {
    if (state === 'extend') {
      setState('collapse');
    } else {
      setState('extend');
    }
  }

  return {
    state,
    setState,
    toggleState,
  }
}
