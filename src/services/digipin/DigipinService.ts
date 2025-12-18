/**
 * DigiPIN Service
 * Handles DigiPIN decoding, reverse geocoding, and location management
 */

export interface DigipinDecodeResponse {
  code: string;
  latitude: number;
  longitude: number;
  accuracy: number;
}

export interface ReverseGeocodeResponse {
  formatted_address: string;
}

export interface SavedLocation {
  id?: string;
  digipin: string;
  latitude: number;
  longitude: number;
  address: string;
  accuracy: number;
  createdBy?: string;
  createdAt?: Date;
}

/**
 * Decode a DigiPIN to get coordinates using custom API
 * 
 * API Endpoint: GET /api/digipin/decode?digipin={DIGIPIN}
 */
export const decodeDigipin = async (digipin: string): Promise<DigipinDecodeResponse> => {
  // Validate DigiPIN format (alphanumeric with dashes, e.g., 4P3-JK8-52C9)
  const cleanDigipin = digipin.replace(/-/g, '').toUpperCase();
  if (!/^[A-Z0-9]{9,12}$/.test(cleanDigipin)) {
    throw new Error('DigiPIN must be in format XXX-XXX-XXXX (e.g., 4P3-JK8-52C9)');
  }

  try {
    console.log(`🔍 Decoding DigiPIN via API: ${digipin}`);
    
    // Call DigiPIN decode API
    const response = await fetch(
      `/api/digipin/decode?digipin=${digipin}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ DigiPIN API error:', response.status, errorText);
      throw new Error(`API returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    console.log('✅ DigiPIN API response:', data);

    // Validate response data
    if (!data.latitude || !data.longitude) {
      throw new Error('Invalid response from API: missing coordinates');
    }

    return {
      code: digipin,
      latitude: parseFloat(data.latitude),
      longitude: parseFloat(data.longitude),
      accuracy: data.accuracy || 10
    };
  } catch (error) {
    console.error('❌ Error decoding DigiPIN:', error);
    throw new Error(`Failed to decode DigiPIN: ${(error as Error).message}`);
  }
};

/**
 * Reverse geocode coordinates to get address
 * Uses Mappls if MAPPLS_REST_KEY is available, otherwise falls back to Nominatim
 */
export const reverseGeocode = async (
  latitude: number, 
  longitude: number
): Promise<ReverseGeocodeResponse> => {
  const mapplsKey = import.meta.env.VITE_MAPPLS_REST_KEY;

  try {
    if (mapplsKey) {
      // Use Mappls API
      const response = await fetch(
        `https://apis.mappls.com/advancedmaps/v1/${mapplsKey}/rev_geocode?lat=${latitude}&lng=${longitude}`
      );

      if (!response.ok) {
        throw new Error('Mappls geocoding failed');
      }

      const data = await response.json();
      const address = data.suggestedLocations?.[0]?.formatted_address;

      if (!address) {
        throw new Error('No address found in Mappls response');
      }

      return { formatted_address: address };
    } else {
      // Fallback to Nominatim (OpenStreetMap)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
        {
          headers: {
            'User-Agent': 'SecurityManagementSystem/1.0'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Nominatim geocoding failed');
      }

      const data = await response.json();
      
      return { 
        formatted_address: data.display_name || 'Address not found' 
      };
    }
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    return { formatted_address: 'Address not available' };
  }
};

/**
 * Save location to backend (Firebase or custom backend)
 */
export const saveLocation = async (location: SavedLocation): Promise<string | null> => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const backendSecret = import.meta.env.VITE_BACKEND_SECRET;

  if (!backendUrl) {
    console.warn('No backend URL configured, skipping location save');
    return null;
  }

  try {
    const response = await fetch(`${backendUrl}/save-location`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${backendSecret || ''}`
      },
      body: JSON.stringify({
        digipin: location.digipin,
        latitude: location.latitude,
        longitude: location.longitude,
        address: location.address,
        accuracy: location.accuracy,
        createdBy: location.createdBy || 'system',
        createdAt: new Date().toISOString()
      })
    });

    if (!response.ok) {
      throw new Error('Failed to save location');
    }

    const data = await response.json();
    return data.id || null;
  } catch (error) {
    console.error('Error saving location:', error);
    return null;
  }
};

/**
 * Complete DigiPIN workflow: decode → geocode → save
 */
export const processDigipin = async (digipin: string): Promise<{
  success: boolean;
  data?: {
    code: string;
    latitude: number;
    longitude: number;
    accuracy: number;
    address: string;
    savedId: string | null;
    mapplsUrl: string;
    googleMapsUrl: string;
  };
  error?: string;
}> => {
  try {
    // Step 1: Decode DigiPIN
    const decoded = await decodeDigipin(digipin);

    // Step 2: Reverse geocode to get address
    const geocoded = await reverseGeocode(decoded.latitude, decoded.longitude);

    // Step 3: Save location (best effort)
    const savedId = await saveLocation({
      digipin: decoded.code,
      latitude: decoded.latitude,
      longitude: decoded.longitude,
      address: geocoded.formatted_address,
      accuracy: decoded.accuracy
    });

    // Step 4: Generate map URLs
    const mapplsUrl = `https://mappls.com/?lat=${decoded.latitude}&lng=${decoded.longitude}&zoom=17`;
    const googleMapsUrl = `https://www.google.com/maps?q=${decoded.latitude},${decoded.longitude}`;

    return {
      success: true,
      data: {
        code: decoded.code,
        latitude: decoded.latitude,
        longitude: decoded.longitude,
        accuracy: decoded.accuracy,
        address: geocoded.formatted_address,
        savedId,
        mapplsUrl,
        googleMapsUrl
      }
    };
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message
    };
  }
};

/**
 * Generate map embed URL for displaying in UI
 */
export const getMapEmbedUrl = (latitude: number, longitude: number): string => {
  const mapplsKey = import.meta.env.VITE_MAPPLS_MAP_KEY;
  
  if (mapplsKey) {
    return `https://apis.mappls.com/advancedmaps/v1/${mapplsKey}/map_load?lat=${latitude}&lng=${longitude}&zoom=17`;
  }
  
  // Fallback to OpenStreetMap embed
  return `https://www.openstreetmap.org/export/embed.html?bbox=${longitude-0.01},${latitude-0.01},${longitude+0.01},${latitude+0.01}&layer=mapnik&marker=${latitude},${longitude}`;
};
