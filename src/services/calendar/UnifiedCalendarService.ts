export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: 'sales-meeting' | 'site-visit' | 'contract-deadline' | 'hr-interview' | 'operations-planning' | 'office-admin' | 'compliance' | 'follow-up';
  module: 'sales' | 'hr' | 'operations' | 'office-admin';
  location?: string;
  attendees?: string[];
  description?: string;
  clientId?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled';
  reminderMinutes?: number;
  isRecurring?: boolean;
  recurringPattern?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  resourcesRequired?: string[];
  conflictsWith?: string[];
}

export interface ConflictDetection {
  hasConflict: boolean;
  conflictingEvents: CalendarEvent[];
  conflictType: 'time-overlap' | 'resource-conflict' | 'attendee-conflict' | 'location-conflict';
  suggestion?: string;
}

export interface ResourceOptimization {
  resourceId: string;
  resourceType: 'meeting-room' | 'vehicle' | 'equipment' | 'personnel';
  availability: Array<{ start: Date; end: Date; isAvailable: boolean }>;
  utilizationRate: number;
}

class UnifiedCalendarService {
  private events: CalendarEvent[] = [];
  private resources: ResourceOptimization[] = [];

  // Mock data for demonstration
  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    this.events = [
      {
        id: "1",
        title: "Client Meeting - Apex Corporate",
        start: new Date(2025, 0, 15, 10, 0),
        end: new Date(2025, 0, 15, 11, 30),
        type: "sales-meeting",
        module: "sales",
        location: "Apex Corporate Office",
        attendees: ["Raj Kumar", "Priya Singh"],
        description: "Quarterly review meeting with client",
        clientId: "CLI-001",
        priority: "high",
        status: "scheduled",
        reminderMinutes: 30,
        resourcesRequired: ["meeting-room-1", "projector"]
      },
      {
        id: "2",
        title: "Site Assessment - Industrial Park",
        start: new Date(2025, 0, 17, 9, 0),
        end: new Date(2025, 0, 17, 12, 0),
        type: "site-visit",
        module: "sales",
        location: "Industrial Park Ltd, Sector 3",
        attendees: ["Vikram Mehta", "Site Engineer"],
        description: "Initial site assessment for new contract",
        clientId: "CLI-008",
        priority: "medium",
        status: "scheduled",
        reminderMinutes: 60,
        resourcesRequired: ["vehicle-1", "assessment-kit"]
      },
      {
        id: "3",
        title: "HR Interview - Security Supervisor",
        start: new Date(2025, 0, 18, 14, 0),
        end: new Date(2025, 0, 18, 15, 0),
        type: "hr-interview",
        module: "hr",
        location: "HR Conference Room",
        attendees: ["HR Manager", "Operations Head"],
        description: "Interview for Security Supervisor position",
        priority: "medium",
        status: "scheduled",
        reminderMinutes: 15,
        resourcesRequired: ["meeting-room-2"]
      },
      {
        id: "4",
        title: "Operations Planning - Night Shift Coverage",
        start: new Date(2025, 0, 20, 16, 0),
        end: new Date(2025, 0, 20, 17, 30),
        type: "operations-planning",
        module: "operations",
        location: "Operations Center",
        attendees: ["Ops Manager", "Shift Supervisors"],
        description: "Planning optimal coverage for night shifts",
        priority: "high",
        status: "scheduled",
        reminderMinutes: 30,
        resourcesRequired: ["ops-room", "scheduling-system"]
      },
      {
        id: "5",
        title: "Office Admin - Facility Maintenance",
        start: new Date(2025, 0, 22, 11, 0),
        end: new Date(2025, 0, 22, 12, 0),
        type: "office-admin",
        module: "office-admin",
        location: "Main Office",
        attendees: ["Admin Manager", "Maintenance Team"],
        description: "Monthly facility maintenance review",
        priority: "medium",
        status: "scheduled",
        reminderMinutes: 45,
        resourcesRequired: ["maintenance-tools"]
      }
    ];
  }

  // Get all events with optional filtering
  getEvents(filter?: string, module?: string): CalendarEvent[] {
    let filteredEvents = [...this.events];

    if (module) {
      filteredEvents = filteredEvents.filter(event => event.module === module);
    }

    if (filter && filter !== "All Events") {
      switch (filter) {
        case "Sales Meetings":
          filteredEvents = filteredEvents.filter(event => event.type === "sales-meeting");
          break;
        case "Site Visits":
          filteredEvents = filteredEvents.filter(event => event.type === "site-visit");
          break;
        case "Contract Deadlines":
          filteredEvents = filteredEvents.filter(event => event.type === "contract-deadline");
          break;
        case "HR Interviews":
          filteredEvents = filteredEvents.filter(event => event.type === "hr-interview");
          break;
        case "Operations Planning":
          filteredEvents = filteredEvents.filter(event => event.type === "operations-planning");
          break;
        case "Office Admin Meetings":
          filteredEvents = filteredEvents.filter(event => event.type === "office-admin");
          break;
        case "Compliance Deadlines":
          filteredEvents = filteredEvents.filter(event => event.type === "compliance");
          break;
      }
    }

    return filteredEvents.sort((a, b) => a.start.getTime() - b.start.getTime());
  }

  // Detect conflicts for a new event
  detectConflicts(newEvent: Partial<CalendarEvent>): ConflictDetection {
    if (!newEvent.start || !newEvent.end) {
      return { hasConflict: false, conflictingEvents: [], conflictType: 'time-overlap' };
    }

    const conflicts: CalendarEvent[] = [];
    let conflictType: ConflictDetection['conflictType'] = 'time-overlap';

    for (const event of this.events) {
      // Time overlap check
      const hasTimeOverlap = newEvent.start < event.end && newEvent.end > event.start;
      
      if (hasTimeOverlap) {
        // Check for attendee conflicts
        if (newEvent.attendees && event.attendees) {
          const hasAttendeeConflict = newEvent.attendees.some(attendee => 
            event.attendees!.includes(attendee)
          );
          if (hasAttendeeConflict) {
            conflictType = 'attendee-conflict';
            conflicts.push(event);
            continue;
          }
        }

        // Check for resource conflicts
        if (newEvent.resourcesRequired && event.resourcesRequired) {
          const hasResourceConflict = newEvent.resourcesRequired.some(resource => 
            event.resourcesRequired!.includes(resource)
          );
          if (hasResourceConflict) {
            conflictType = 'resource-conflict';
            conflicts.push(event);
            continue;
          }
        }

        // Check for location conflicts
        if (newEvent.location && event.location && newEvent.location === event.location) {
          conflictType = 'location-conflict';
          conflicts.push(event);
        }
      }
    }

    const hasConflict = conflicts.length > 0;
    let suggestion = '';

    if (hasConflict) {
      switch (conflictType) {
        case 'attendee-conflict':
          suggestion = 'Consider rescheduling or finding alternative attendees';
          break;
        case 'resource-conflict':
          suggestion = 'Try booking alternative resources or different time slot';
          break;
        case 'location-conflict':
          suggestion = 'Choose a different location or reschedule the meeting';
          break;
        default:
          suggestion = 'Consider adjusting the time to avoid overlap';
      }
    }

    return {
      hasConflict,
      conflictingEvents: conflicts,
      conflictType,
      suggestion
    };
  }

  // Add a new event
  addEvent(event: Omit<CalendarEvent, 'id'>): CalendarEvent {
    const newEvent: CalendarEvent = {
      ...event,
      id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    this.events.push(newEvent);
    this.triggerNotification(newEvent, 'created');
    return newEvent;
  }

  // Update an existing event
  updateEvent(id: string, updates: Partial<CalendarEvent>): CalendarEvent | null {
    const eventIndex = this.events.findIndex(event => event.id === id);
    if (eventIndex === -1) return null;

    this.events[eventIndex] = { ...this.events[eventIndex], ...updates };
    this.triggerNotification(this.events[eventIndex], 'updated');
    return this.events[eventIndex];
  }

  // Delete an event
  deleteEvent(id: string): boolean {
    const eventIndex = this.events.findIndex(event => event.id === id);
    if (eventIndex === -1) return false;

    const deletedEvent = this.events[eventIndex];
    this.events.splice(eventIndex, 1);
    this.triggerNotification(deletedEvent, 'deleted');
    return true;
  }

  // Get resource utilization
  getResourceUtilization(resourceId: string, dateRange: { start: Date; end: Date }): ResourceOptimization {
    const eventsUsingResource = this.events.filter(event => 
      event.resourcesRequired?.includes(resourceId) &&
      event.start >= dateRange.start &&
      event.end <= dateRange.end
    );

    const totalMinutes = (dateRange.end.getTime() - dateRange.start.getTime()) / (1000 * 60);
    const usedMinutes = eventsUsingResource.reduce((total, event) => 
      total + (event.end.getTime() - event.start.getTime()) / (1000 * 60), 0
    );

    const utilizationRate = totalMinutes > 0 ? (usedMinutes / totalMinutes) * 100 : 0;

    return {
      resourceId,
      resourceType: this.getResourceType(resourceId),
      availability: this.generateAvailabilitySlots(resourceId, dateRange),
      utilizationRate: Math.round(utilizationRate * 100) / 100
    };
  }

  // Get upcoming events requiring attention
  getUpcomingEvents(days: number = 7): CalendarEvent[] {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(now.getDate() + days);

    return this.events
      .filter(event => event.start >= now && event.start <= futureDate)
      .sort((a, b) => a.start.getTime() - b.start.getTime());
  }

  // Private helper methods
  private getResourceType(resourceId: string): ResourceOptimization['resourceType'] {
    if (resourceId.includes('room')) return 'meeting-room';
    if (resourceId.includes('vehicle')) return 'vehicle';
    if (resourceId.includes('equipment') || resourceId.includes('kit') || resourceId.includes('tools')) return 'equipment';
    return 'personnel';
  }

  private generateAvailabilitySlots(resourceId: string, dateRange: { start: Date; end: Date }): Array<{ start: Date; end: Date; isAvailable: boolean }> {
    // This is a simplified implementation - in reality, you'd check against actual bookings
    const slots = [];
    const current = new Date(dateRange.start);
    
    while (current < dateRange.end) {
      const slotEnd = new Date(current);
      slotEnd.setHours(current.getHours() + 1);
      
      const isBooked = this.events.some(event => 
        event.resourcesRequired?.includes(resourceId) &&
        event.start <= current && event.end > current
      );

      slots.push({
        start: new Date(current),
        end: new Date(slotEnd),
        isAvailable: !isBooked
      });

      current.setHours(current.getHours() + 1);
    }

    return slots;
  }

  private triggerNotification(event: CalendarEvent, action: 'created' | 'updated' | 'deleted') {
    // In a real implementation, this would send push notifications, emails, etc.
    console.log(`Calendar notification: Event "${event.title}" was ${action}`);
    
    // Could integrate with external notification services
    if (event.reminderMinutes && action === 'created') {
      this.scheduleReminder(event);
    }
  }

  private scheduleReminder(event: CalendarEvent) {
    if (!event.reminderMinutes) return;

    const reminderTime = new Date(event.start.getTime() - (event.reminderMinutes * 60 * 1000));
    const now = new Date();

    if (reminderTime > now) {
      const delay = reminderTime.getTime() - now.getTime();
      setTimeout(() => {
        console.log(`Reminder: "${event.title}" starts in ${event.reminderMinutes} minutes`);
        // In real implementation, trigger actual notification
      }, delay);
    }
  }
}

export const unifiedCalendarService = new UnifiedCalendarService();