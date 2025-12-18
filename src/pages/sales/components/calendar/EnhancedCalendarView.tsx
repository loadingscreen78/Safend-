
import { useState, useEffect } from "react";
import { Calendar, Views, dateFnsLocalizer } from "react-big-calendar";
import { format } from "date-fns";
import { parse } from "date-fns";
import { startOfWeek } from "date-fns";
import { getDay } from "date-fns";
import { enIN } from "date-fns/locale/en-IN";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { subscribeToUnifiedCalendar, UnifiedCalendarEvent } from "@/services/firebase/UnifiedCalendarFirebaseService";
import { CalendarEvent } from "./CalendarEvent";
import { EventDetailDialog } from "./EventDetailDialog";
import { CreateEventDialog } from "./CreateEventDialog";


// Setup the localizer for react-big-calendar
const locales = {
  "en-IN": enIN,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Event type configurations for display
const eventTypes = {
  meeting: { color: "#4f46e5", icon: "Calendar" },
  contract: { color: "#f59e0b", icon: "FileText" },
  compliance: { color: "#ef4444", icon: "Clipboard" },
  followup: { color: "#6366f1", icon: "Phone" },
  service: { color: "#22c55e", icon: "Briefcase" },
};

export function EnhancedCalendarView({ filter }: { filter?: string }) {
  const [view, setView] = useState("month");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [events, setEvents] = useState<UnifiedCalendarEvent[]>([]);
  const [activeFilter, setActiveFilter] = useState("all");
  
  // Subscribe to unified calendar events from Firebase
  useEffect(() => {
    const unsubscribe = subscribeToUnifiedCalendar((firebaseEvents) => {
      setEvents(firebaseEvents);
    });
    
    return () => unsubscribe();
  }, []);
  
  // Filter events based on active filter
  const filteredEvents = events.filter(event => {
    if (activeFilter === "all") return true;
    if (activeFilter === "meetings") return event.type === "meeting";
    if (activeFilter === "contracts") return event.type === "contract";
    if (activeFilter === "compliance") return event.type === "service" || event.type === "followup" || event.type === "compliance";
    return true;
  });
  
  const handleViewChange = (newView: string) => {
    setView(newView);
  };
  
  const handleNavigate = (date: Date, view: string) => {
    setSelectedDate(date);
  };
  
  const handleSelectEvent = (event: any) => {
    setSelectedEvent(event);
    setIsEventModalOpen(true);
  };
  
  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    setSelectedEvent({ start, end });
    setIsCreateEventOpen(true);
  };
  
  const eventStyleGetter = (event: any) => {
    const eventType = event.type || "meeting";
    const color = eventTypes[eventType as keyof typeof eventTypes]?.color || "#4f46e5";
    return {
      style: {
        backgroundColor: color,
        border: 'none',
        borderRadius: "4px",
        color: '#ffffff',
        fontSize: '12px',
        padding: '2px 4px',
        margin: '1px 0',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap' as const,
      },
    };
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Sales Calendar</h2>
          <p className="text-muted-foreground">
            Manage client meetings, site visits and important dates
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button onClick={() => setIsCreateEventOpen(true)} className="bg-primary hover:bg-primary/90">
            Add Event
          </Button>
          
          <Select value={view} onValueChange={handleViewChange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="day">Day</SelectItem>
              <SelectItem value="agenda">Agenda</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Calendar Events</CardTitle>
              <CardDescription>Client meetings, contract deadlines and compliance dates</CardDescription>
            </div>
            
            <div className="flex items-center gap-2">
              <Tabs value={activeFilter} onValueChange={setActiveFilter} className="h-8">
                <TabsList>
                  <TabsTrigger value="all" className="h-8">All ({events.length})</TabsTrigger>
                  <TabsTrigger value="meetings" className="h-8">Meetings</TabsTrigger>
                  <TabsTrigger value="contracts" className="h-8">Contracts</TabsTrigger>
                  <TabsTrigger value="compliance" className="h-8">Compliance</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[700px] p-6">
            {filteredEvents.length > 0 ? (
              <Calendar
                localizer={localizer}
                events={filteredEvents}
                startAccessor="start"
                endAccessor="end"
                view={view as any}
                onView={(newView) => handleViewChange(newView)}
                date={selectedDate}
                onNavigate={handleNavigate}
                selectable
                onSelectEvent={handleSelectEvent}
                onSelectSlot={handleSelectSlot}
                eventPropGetter={eventStyleGetter}
                components={{
                  event: CalendarEvent,
                }}
                views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
                popup
                popupOffset={30}
                style={{ height: '100%' }}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                  <p className="text-lg font-medium">No events found</p>
                  <p className="text-sm mt-2">Create quotations, agreements, or work orders to see them here</p>
                  <Button onClick={() => setIsCreateEventOpen(true)} className="mt-4">
                    Add Manual Event
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Event detail dialog */}
      <EventDetailDialog
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        event={selectedEvent}
        eventTypes={eventTypes}
      />
      
      {/* Create event dialog */}
      <CreateEventDialog
        isOpen={isCreateEventOpen}
        onClose={() => setIsCreateEventOpen(false)}
        initialEvent={selectedEvent}
        eventTypes={eventTypes}
      />
    </div>
  );
}
