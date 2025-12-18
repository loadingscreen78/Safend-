
import { Calendar, Check } from "lucide-react";
import { MapPin, FileText, Clipboard, Phone, Users } from "lucide-react";

interface CalendarEventProps {
  event: {
    title: string;
    type: string;
  };
}

export function CalendarEvent({ event }: CalendarEventProps) {
  // Select icon based on event type
  let Icon = Calendar;
  switch (event.type) {
    case "site-visit":
      Icon = MapPin;
      break;
    case "contract":
      Icon = FileText;
      break;
    case "compliance":
      Icon = Clipboard;
      break;
    case "follow-up":
      Icon = Phone;
      break;
    case "team":
      Icon = Users;
      break;
    default:
      Icon = Calendar;
  }
  
  return (
    <div className="flex items-center truncate w-full">
      <Icon className="h-3 w-3 mr-1 flex-shrink-0 opacity-80" />
      <span className="truncate text-xs font-medium leading-tight">{event.title}</span>
    </div>
  );
}
