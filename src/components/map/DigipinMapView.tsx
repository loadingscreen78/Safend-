import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { MapPin, Loader2, ExternalLink } from 'lucide-react';
import { processDigipin } from '@/services/digipin/DigipinService';
import { useToast } from '@/hooks/use-toast';

interface DigipinMapViewProps {
  digipin?: string;
  onLocationDecoded?: (data: {
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
}

export function DigipinMapView({ digipin: initialDigipin, onLocationDecoded }: DigipinMapViewProps) {
  const [digipin, setDigipin] = useState(initialDigipin || '');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  const handleDecode = async () => {
    const cleanDigipin = digipin.replace(/-/g, '');
    if (!/^[A-Z0-9]{9,12}$/.test(cleanDigipin)) {
      toast({
        title: 'Invalid DigiPIN',
        description: 'DigiPIN must be in format XXX-XXX-XXXX (e.g., 5C8-8J9-7FT7)',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const decoded = await processDigipin(digipin);
      
      if (decoded.success && decoded.data) {
        setResult(decoded.data);
        
        // Callback to parent component
        if (onLocationDecoded) {
          onLocationDecoded({
            latitude: decoded.data.latitude,
            longitude: decoded.data.longitude,
            address: decoded.data.address,
          });
        }

        toast({
          title: 'DigiPIN Decoded Successfully',
          description: `Location: ${decoded.data.address}`,
        });
      } else {
        toast({
          title: 'Decode Failed',
          description: decoded.error || 'Failed to decode DigiPIN',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: (error as Error).message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const mapplsKey = import.meta.env.VITE_MAPPLS_MAP_KEY;

  return (
    <div className="space-y-4">
      {/* DigiPIN Input */}
      <div className="flex gap-2">
        <div className="flex-1 space-y-2">
          <Label htmlFor="digipin-input">DigiPIN</Label>
          <Input
            id="digipin-input"
            value={digipin}
            onChange={(e) => {
              let value = e.target.value.toUpperCase();
              // Allow alphanumeric and dashes only
              value = value.replace(/[^A-Z0-9-]/g, '');
              // Auto-format with dashes (XXX-XXX-XXXX)
              if (value.length > 3 && value[3] !== '-') {
                value = value.slice(0, 3) + '-' + value.slice(3);
              }
              if (value.length > 7 && value[7] !== '-') {
                value = value.slice(0, 7) + '-' + value.slice(7);
              }
              // Limit to format XXX-XXX-XXXX (13 chars with dashes)
              value = value.slice(0, 13);
              setDigipin(value);
            }}
            placeholder="e.g., 5C8-8J9-7FT7"
            maxLength={13}
          />
        </div>
        <div className="flex items-end">
          <Button 
            onClick={handleDecode} 
            disabled={loading || digipin.replace(/-/g, '').length < 9}
            className="gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Decoding...
              </>
            ) : (
              <>
                <MapPin className="h-4 w-4" />
                Decode
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Results */}
      {result && (
        <Card className="p-4 space-y-4">
          {/* Location Details */}
          <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-600" />
              Location Details
            </h3>
            
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">DigiPIN:</span>
                <p className="font-mono font-semibold">{result.code}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Accuracy:</span>
                <p className="font-semibold">{result.accuracy}/10</p>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground">Coordinates:</span>
                <p className="font-mono text-xs">
                  {result.latitude.toFixed(6)}, {result.longitude.toFixed(6)}
                </p>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground">Address:</span>
                <p className="text-sm">{result.address}</p>
              </div>
            </div>
          </div>

          {/* Map Display */}
          <div className="space-y-2">
            <h3 className="font-semibold">Map View</h3>
            
            {mapplsKey ? (
              <iframe
                src={`https://apis.mappls.com/advancedmaps/v1/${mapplsKey}/map_load?lat=${result.latitude}&lng=${result.longitude}&zoom=17`}
                width="100%"
                height="300"
                frameBorder="0"
                className="rounded-md border"
                title="Mappls Map"
              />
            ) : (
              <iframe
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${result.longitude-0.01},${result.latitude-0.01},${result.longitude+0.01},${result.latitude+0.01}&layer=mapnik&marker=${result.latitude},${result.longitude}`}
                width="100%"
                height="300"
                frameBorder="0"
                className="rounded-md border"
                title="OpenStreetMap"
              />
            )}
          </div>

          {/* Map Links */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 gap-2"
              onClick={() => window.open(result.mapplsUrl, '_blank')}
            >
              <ExternalLink className="h-4 w-4" />
              Open in Mappls
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 gap-2"
              onClick={() => window.open(result.googleMapsUrl, '_blank')}
            >
              <ExternalLink className="h-4 w-4" />
              Open in Google Maps
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
