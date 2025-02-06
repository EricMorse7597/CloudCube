import { useEffect, useState } from "react";

export default function TestPage() {

  const [isSpacebarHeld, setIsSpacebarHeld] = useState(false);
  let holdTimer: NodeJS.Timeout | null = null;

  useEffect(() => {
    const detectKeyDown = (ev: KeyboardEvent) => {
      if (ev.key === " ") {
        holdTimer = setTimeout(() => {
          setIsSpacebarHeld(true);
          console.log("Space clicked");
        }, 300);
      }
    };

    document.addEventListener("keydown", detectKeyDown, true);
    return () => {
      document.removeEventListener("keydown", detectKeyDown, true);
    };
  }, []);

  return <div>Press any key and check the console!</div>;
}
