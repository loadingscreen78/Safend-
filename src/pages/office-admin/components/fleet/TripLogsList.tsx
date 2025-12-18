
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle, MapPin } from "lucide-react";
import { TripLog } from "@/types/fleet";
import { getTripLogs, updateTripLog } from "@/services/fleet/FleetService";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TripLogDetails } from "./TripLogDetails";

interface TripLogsListProps {
  branchId: string;
  searchQuery: string;
}

export function TripLogsList({ branchId, searchQuery }: TripLogsListProps) {
  const [trips, setTrips] = useState<TripLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTrip, setSelectedTrip] = useState<TripLog | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { toast } = useToast();

  // Fetch trip logs
  useEffect(() => {
    if (branchId) {
      try {
        const fetchedTrips = getTripLogs(branchId);
        setTrips(fetchedTrips);
      } catch (error) {
        console.error("Error fetching trip logs:", error);
        toast({
          title: "Error",
          description: "Failed to load trip logs.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }
  }, [branchId, toast]);

  // Filter trips based on search query
  const filteredTrips = trips.filter(trip => 
    trip.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trip.driver.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trip.startLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trip.destination.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'planned':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">Planned</Badge>;
      case 'in-progress':
        return <Badge className="bg-amber-500">In Progress</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleCompleteTrip = async (trip: TripLog) => {
    if (!trip.endOdometer) {
      toast({
        title: "Input Required",
        description: "End odometer reading is required to complete this trip.",
        variant: "default"
      });
      
      // Open the details dialog to let them enter the end odometer
      setSelectedTrip(trip);
      setIsDetailsOpen(true);
      return;
    }
    
    try {
      const updatedTrip = await updateTripLog({
        ...trip,
        status: 'completed',
        endDate: new Date().toISOString(),
      });
      
      setTrips(trips.map(t => t.id === updatedTrip.id ? updatedTrip : t));
      
      toast({
        title: "Trip Completed",
        description: "Trip has been marked as completed."
      });
    } catch (error) {
      console.error("Error completing trip:", error);
      toast({
        title: "Error",
        description: "Failed to complete trip.",
        variant: "destructive"
      });
    }
  };

  const handleViewDetails = (trip: TripLog) => {
    setSelectedTrip(trip);
    setIsDetailsOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="w-8 h-8 border-4 border-safend-red border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!filteredTrips.length) {
    return (
      <Alert className="bg-blue-50 border-blue-100 text-blue-800">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          No trip logs found matching your criteria.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {filteredTrips.map((trip) => (
          <div 
            key={trip.id} 
            className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col md:flex-row justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium">{trip.purpose}</h3>
                  {getStatusBadge(trip.status)}
                </div>
                
                <div className="flex items-center gap-2 mb-2 text-sm">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{trip.startLocation} → {trip.destination}</span>
                </div>
                
                <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-500">
                  <span>Driver: {trip.driver}</span>
                  <span>Date: {new Date(trip.startDate).toLocaleDateString()}</span>
                  <span>Time: {new Date(trip.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  {trip.endDate && <span>Return: {new Date(trip.endDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>}
                  {trip.startOdometer && <span>Start: {trip.startOdometer} km</span>}
                  {trip.endOdometer && <span>End: {trip.endOdometer} km</span>}
                </div>
              </div>
              
              <div className="flex md:flex-col gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1 md:flex-none h-8" 
                  onClick={() => handleViewDetails(trip)}
                >
                  <span>Details</span>
                </Button>
                
                {trip.status === 'in-progress' && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1 md:flex-none h-8" 
                    onClick={() => handleCompleteTrip(trip)}
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    <span>Complete</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Trip Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Trip Details</DialogTitle>
          </DialogHeader>
          {selectedTrip && (
            <TripLogDetails 
              tripLog={selectedTrip}
              onUpdate={(updatedTrip) => {
                setTrips(trips.map(t => t.id === updatedTrip.id ? updatedTrip : t));
                setSelectedTrip(updatedTrip);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
