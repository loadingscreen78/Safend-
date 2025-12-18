
import { useState, useEffect } from 'react';
import { Clock } from "lucide-react";

export function DigitalClock() {
  const [time, setTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };
  
  return (
    <div className="flex items-center gap-2">
      <Clock className="h-4 w-4 text-red-600" />
      <span className="text-xl font-mono">{formatTime(time)}</span>
    </div>
  );
}
