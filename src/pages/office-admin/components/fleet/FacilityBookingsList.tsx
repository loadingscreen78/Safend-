
import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Building, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FacilityBookingForm } from "./FacilityBookingForm";

interface Facility {
  id: string;
  name: string;
  type: 'meeting-room' | 'conference-hall' | 'auditorium' | 'training-room' | 'recreation';
  capacity: number;
  location: string;
  amenities: string[];
}

interface FacilityBooking {
  id: string;
  facilityId: string;
  facilityName: string;
  purpose: string;
  startTime: string;
  endTime: string;
  bookedBy: string;
  attendees: number;
  status: 'confirmed' | 'pending' | 'cancelled';
}

interface FacilityBookingsListProps {
  branchId: string;
  searchQuery: string;
}

// Mock data for facilities and bookings
const facilities: Facility[] = [
  {
    id: "fac-001",
    name: "Main Conference Room",
    type: "conference-hall",
    capacity: 30,
    location: "2nd Floor, East Wing",
    amenities: ["Projector", "Video Conferencing", "Whiteboard"]
  },
  {
    id: "fac-002",
    name: "Training Room A",
    type: "training-room",
    capacity: 20,
    location: "1st Floor, West Wing",
    amenities: ["Projector", "Whiteboard", "Computers"]
  },
  {
    id: "fac-003",
    name: "Meeting Room 101",
    type: "meeting-room",
    capacity: 8,
    location: "1st Floor, North Wing",
    amenities: ["TV Screen", "Whiteboard"]
  }
];

const bookings: FacilityBooking[] = [
  {
    id: "book-001",
    facilityId: "fac-001",
    facilityName: "Main Conference Room",
    purpose: "Quarterly Review Meeting",
    startTime: "2025-05-15T10:00:00Z",
    endTime: "2025-05-15T12:00:00Z",
    bookedBy: "John Smith",
    attendees: 25,
    status: "confirmed"
  },
  {
    id: "book-002",
    facilityId: "fac-002",
    facilityName: "Training Room A",
    purpose: "New Employee Orientation",
    startTime: "2025-05-16T09:00:00Z",
    endTime: "2025-05-16T17:00:00Z",
    bookedBy: "HR Department",
    attendees: 15,
    status: "confirmed"
  },
  {
    id: "book-003",
    facilityId: "fac-003",
    facilityName: "Meeting Room 101",
    purpose: "Client Meeting",
    startTime: "2025-05-14T14:30:00Z",
    endTime: "2025-05-14T15:30:00Z",
    bookedBy: "Sarah Johnson",
    attendees: 6,
    status: "confirmed"
  }
];

export function FacilityBookingsList({ branchId, searchQuery }: FacilityBookingsListProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [facilityBookings, setFacilityBookings] = useState<FacilityBooking[]>([]);
  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate API call to fetch bookings
    setIsLoading(true);
    setTimeout(() => {
      // Filter bookings by search query if provided
      const filtered = searchQuery
        ? bookings.filter(
            (booking) =>
              booking.facilityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
              booking.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
              booking.bookedBy.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : bookings;
      
      setFacilityBookings(filtered);
      setIsLoading(false);
    }, 500);
  }, [searchQuery]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const handleBookingSuccess = () => {
    setIsBookingFormOpen(false);
    toast({
      title: "Booking Created",
      description: "Facility booking has been created successfully.",
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="w-8 h-8 border-4 border-safend-red border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (facilityBookings.length === 0) {
    return (
      <div className="space-y-4">
        <Alert className="bg-blue-50 border-blue-100 text-blue-800">
          <Building className="h-4 w-4" />
          <AlertDescription>
            No facility bookings found matching your criteria.
          </AlertDescription>
        </Alert>
        
        <div className="flex justify-end">
          <Button 
            variant="outline"
            onClick={() => setIsBookingFormOpen(true)}
          >
            <CalendarIcon className="h-4 w-4 mr-2" />
            Book Facility
          </Button>
        </div>
        
        {/* Booking Form Dialog */}
        <Dialog open={isBookingFormOpen} onOpenChange={setIsBookingFormOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Book a Facility</DialogTitle>
            </DialogHeader>
            <FacilityBookingForm 
              branchId={branchId} 
              onSuccess={handleBookingSuccess} 
            />
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Facility Bookings</h3>
        <Button 
          variant="outline"
          onClick={() => setIsBookingFormOpen(true)}
        >
          <CalendarIcon className="h-4 w-4 mr-2" />
          Book Facility
        </Button>
      </div>
      
      <div className="grid gap-4">
        {facilityBookings.map((booking) => (
          <Card key={booking.id} className="p-4">
            <div className="flex flex-col md:flex-row justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-gray-500" />
                  <h4 className="font-medium">{booking.facilityName}</h4>
                  {booking.status === 'confirmed' && (
                    <Badge className="bg-green-500">Confirmed</Badge>
                  )}
                  {booking.status === 'pending' && (
                    <Badge className="bg-yellow-500">Pending</Badge>
                  )}
                  {booking.status === 'cancelled' && (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">Cancelled</Badge>
                  )}
                </div>
                
                <div className="text-sm text-gray-600">{booking.purpose}</div>
                
                <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-500">
                  <span>Start: {formatDate(booking.startTime)}</span>
                  <span>End: {formatDate(booking.endTime)}</span>
                  <span>Booked by: {booking.bookedBy}</span>
                  <span>Attendees: {booking.attendees}</span>
                </div>
              </div>
              
              <div className="flex gap-2 mt-4 md:mt-0">
                <Button size="sm" variant="outline">View Details</Button>
                {booking.status !== 'cancelled' && (
                  <Button size="sm" variant="outline" className="text-red-600 border-red-600">Cancel</Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      {/* Booking Form Dialog */}
      <Dialog open={isBookingFormOpen} onOpenChange={setIsBookingFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Book a Facility</DialogTitle>
          </DialogHeader>
          <FacilityBookingForm 
            branchId={branchId} 
            onSuccess={handleBookingSuccess} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
