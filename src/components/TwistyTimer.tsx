// taken from
// https://github.com/cubing/react-cubing/blob/main/src/TwistyPlayer/index.tsx
import * as React from 'react';
import { TwistyPlayer as TP, TwistyPlayerConfig } from 'cubing/twisty';

export interface TwistyPlayerExtendedConfig extends TwistyPlayerConfig {
  className?: string;
  onTwistyInit?: (twisty: TP) => void;
}

export const TwistyTimer = ({
  className,
  onTwistyInit,
  ...props
}: TwistyPlayerExtendedConfig) => {
  const [, setTwisty] = React.useState<TP>();
  const spanRef = React.useRef<HTMLSpanElement | null>(null);

  React.useEffect(() => {
    const newTwisty = new TP(props);
    if (className) {
      newTwisty.className = className;
    }
    newTwisty.style.maxHeight = '350px';
    newTwisty.style.width = '100%';
    
    setTwisty(newTwisty);
    spanRef.current?.appendChild(newTwisty);
    if (onTwistyInit) onTwistyInit(newTwisty);
    return () => { spanRef.current?.removeChild(newTwisty) }
  }, [props.alg]);

  return <span id="twisty-header" className={className} ref={spanRef} />;
};
