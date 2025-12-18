
import { useEffect, useState } from "react";

interface CountUpProps {
  value: number;
  duration?: number;
  formatter?: (value: number) => string;
}

export function CountUp({ value, duration = 1000, formatter }: CountUpProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    const startValue = 0;
    
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      const currentValue = Math.floor(startValue + percentage * (value - startValue));
      setCount(currentValue);
      
      if (percentage < 1) {
        requestAnimationFrame(step);
      } else {
        setCount(value);
      }
    };
    
    requestAnimationFrame(step);
  }, [value, duration]);

  if (formatter) {
    return <>{formatter(count)}</>;
  }

  return <>{count.toLocaleString()}</>;
}
