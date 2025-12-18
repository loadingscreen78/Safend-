
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppData } from "@/contexts/AppDataContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search, Filter, Car, Calendar, Building } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { VehiclesList } from "./fleet/VehiclesList";
import { FacilityBookingsList } from "./fleet/FacilityBookingsList";
import { VehicleForm } from "./fleet/VehicleForm";
import { FacilityBookingForm } from "./fleet/FacilityBookingForm";
import { TripLogsList } from "./fleet/TripLogsList";
import { TripLogForm } from "./fleet/TripLogForm";

export function FacilitiesFleet() {
  const { activeBranch, isLoading } = useAppData();
  const [activeTab, setActiveTab] = useState("vehicles");
  const [searchQuery, setSearchQuery] = useState("");
  const [isVehicleFormOpen, setIsVehicleFormOpen] = useState(false);
  const [isTripLogFormOpen, setIsTripLogFormOpen] = useState(false);
  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);
  
  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-safend-red border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Facilities & Fleet Management</h2>
        
        <div className="flex gap-2">
          {activeTab === "vehicles" && (
            <>
              <Dialog open={isVehicleFormOpen} onOpenChange={setIsVehicleFormOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="flex items-center gap-1">
                    <PlusCircle className="h-4 w-4" />
                    <span>Add Vehicle</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Register New Vehicle</DialogTitle>
                  </DialogHeader>
                  <VehicleForm 
                    branchId={activeBranch} 
                    onSuccess={() => setIsVehicleFormOpen(false)} 
                  />
                </DialogContent>
              </Dialog>
              
              <Dialog open={isTripLogFormOpen} onOpenChange={setIsTripLogFormOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline" className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Log Trip</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Log Vehicle Trip</DialogTitle>
                  </DialogHeader>
                  <TripLogForm 
                    branchId={activeBranch} 
                    onSuccess={() => setIsTripLogFormOpen(false)} 
                  />
                </DialogContent>
              </Dialog>
            </>
          )}
          
          {activeTab === "facilities" && (
            <Dialog open={isBookingFormOpen} onOpenChange={setIsBookingFormOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="flex items-center gap-1">
                  <PlusCircle className="h-4 w-4" />
                  <span>Book Facility</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Book Facility</DialogTitle>
                </DialogHeader>
                <FacilityBookingForm 
                  branchId={activeBranch} 
                  onSuccess={() => setIsBookingFormOpen(false)} 
                />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={activeTab === "vehicles" ? "Search vehicles..." : "Search facility bookings..."}
            className="pl-8 w-full"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Filter className="h-4 w-4" />
          <span>Filter</span>
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">
            {activeTab === "vehicles" ? "Fleet Management" : "Facility Bookings"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="vehicles" className="flex items-center gap-1">
                <Car className="h-4 w-4" />
                <span>Vehicles</span>
              </TabsTrigger>
              <TabsTrigger value="trips">Trip Logs</TabsTrigger>
              <TabsTrigger value="facilities" className="flex items-center gap-1">
                <Building className="h-4 w-4" />
                <span>Facilities</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="vehicles">
              <VehiclesList 
                branchId={activeBranch}
                searchQuery={searchQuery}
                onLogTripClick={() => setIsTripLogFormOpen(true)}
              />
            </TabsContent>
            
            <TabsContent value="trips">
              <TripLogsList 
                branchId={activeBranch}
                searchQuery={searchQuery}
              />
            </TabsContent>
            
            <TabsContent value="facilities">
              <FacilityBookingsList 
                branchId={activeBranch}
                searchQuery={searchQuery}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
