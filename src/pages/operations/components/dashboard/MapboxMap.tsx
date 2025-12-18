
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MAPBOX_ACCESS_TOKEN } from '@/config';
import { Post } from '@/types/operations';
import { LoadingAnimation } from '@/components/ui/loading-animation';

// Set Mapbox access token
mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

interface MapboxMapProps {
  posts: Post[];
  config?: Record<string, any>;
  onPostSelect?: (postId: string) => void;
}

export default function MapboxMap({ posts, config, onPostSelect }: MapboxMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  const defaultConfig = {
    showLabels: true,
    clusterMarkers: true,
    mapStyle: 'streets'
  };

  // Combine default config with user customizations
  const mapConfig = config ? { ...defaultConfig, ...config } : defaultConfig;

  useEffect(() => {
    // Return early if no Mapbox token or container
    if (!MAPBOX_ACCESS_TOKEN || !mapContainer.current) {
      return;
    }

    // Don't initialize the map more than once
    if (map.current) return;

    // Get map style based on config
    const getMapStyle = () => {
      switch (mapConfig.mapStyle) {
        case 'satellite':
          return 'mapbox://styles/mapbox/satellite-streets-v12';
        case 'dark':
          return 'mapbox://styles/mapbox/dark-v11';
        case 'light':
          return 'mapbox://styles/mapbox/light-v11';
        case 'streets':
        default:
          return 'mapbox://styles/mapbox/streets-v12';
      }
    };

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: getMapStyle(),
      center: [78.9629, 20.5937], // Center on India
      zoom: 4
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add geolocate control
    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true
      }),
      'top-right'
    );

    // Clean up on unmount
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Update markers when posts change
  useEffect(() => {
    if (!map.current || !posts.length) return;

    // Ensure the map is loaded
    map.current.on('load', () => {
      // Remove existing sources and layers
      if (map.current!.getSource('posts')) {
        map.current!.removeLayer('post-clusters');
        map.current!.removeLayer('post-cluster-count');
        map.current!.removeLayer('unclustered-post');
        map.current!.removeSource('posts');
      }

      // Create GeoJSON data from posts
      const geojson = {
        type: 'FeatureCollection',
        features: posts.map(post => ({
          type: 'Feature',
          properties: {
            id: post.id,
            name: post.name,
            status: post.status,
            client: post.clientName
          },
          geometry: {
            type: 'Point',
            coordinates: [post.location.longitude, post.location.latitude]
          }
        }))
      };

      // Add posts as a source
      map.current!.addSource('posts', {
        type: 'geojson',
        data: geojson as any,
        cluster: mapConfig.clusterMarkers,
        clusterMaxZoom: 14,
        clusterRadius: 50
      });

      // Add cluster layers if clustering is enabled
      if (mapConfig.clusterMarkers) {
        map.current!.addLayer({
          id: 'post-clusters',
          type: 'circle',
          source: 'posts',
          filter: ['has', 'point_count'],
          paint: {
            'circle-color': [
              'step',
              ['get', 'point_count'],
              '#51bbd6',
              10,
              '#f1f075',
              30,
              '#f28cb1'
            ],
            'circle-radius': [
              'step',
              ['get', 'point_count'],
              20,
              10,
              30,
              30,
              40
            ]
          }
        });

        map.current!.addLayer({
          id: 'post-cluster-count',
          type: 'symbol',
          source: 'posts',
          filter: ['has', 'point_count'],
          layout: {
            'text-field': '{point_count_abbreviated}',
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12
          }
        });
      }

      // Add a layer for individual posts
      map.current!.addLayer({
        id: 'unclustered-post',
        type: 'circle',
        source: 'posts',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': [
            'match',
            ['get', 'status'],
            'active', '#4CAF50',
            'inactive', '#9E9E9E',
            'completed', '#2196F3',
            '#E91E63' // default color
          ],
          'circle-radius': 10,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#fff'
        }
      });

      // Add labels if enabled
      if (mapConfig.showLabels) {
        map.current!.addLayer({
          id: 'post-labels',
          type: 'symbol',
          source: 'posts',
          filter: ['!', ['has', 'point_count']],
          layout: {
            'text-field': ['get', 'name'],
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12,
            'text-offset': [0, 1.5],
            'text-anchor': 'top'
          },
          paint: {
            'text-color': '#333',
            'text-halo-color': '#fff',
            'text-halo-width': 1
          }
        });
      }

      // Add popup on click
      map.current!.on('click', 'unclustered-post', (e) => {
        if (!e.features) return;
        
        const feature = e.features[0];
        const coordinates = (feature.geometry as any).coordinates.slice();
        const { id, name, client, status } = feature.properties as any;
        
        // Allow post selection if callback provided
        if (onPostSelect && id) {
          onPostSelect(id);
        }
        
        new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(`
            <div class="p-2">
              <h3 class="font-bold">${name}</h3>
              <p>Client: ${client}</p>
              <p>Status: ${status}</p>
              ${onPostSelect ? '<p class="text-blue-500 cursor-pointer mt-2">Click to view details</p>' : ''}
            </div>
          `)
          .addTo(map.current!);
      });

      // Change cursor when hovering over a point
      map.current!.on('mouseenter', 'unclustered-post', () => {
        if (map.current) map.current.getCanvas().style.cursor = 'pointer';
      });

      map.current!.on('mouseleave', 'unclustered-post', () => {
        if (map.current) map.current.getCanvas().style.cursor = '';
      });

      // Fit map to all markers
      if (posts.length > 0) {
        const bounds = new mapboxgl.LngLatBounds();
        posts.forEach(post => {
          bounds.extend([post.location.longitude, post.location.latitude]);
        });
        map.current!.fitBounds(bounds, { padding: 50 });
      }
    });
  }, [posts, mapConfig, onPostSelect]);

  if (!MAPBOX_ACCESS_TOKEN) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-red-500">Mapbox access token not configured.</p>
      </div>
    );
  }

  return (
    <div className="relative h-full">
      <div ref={mapContainer} className="h-full rounded-md" />
      {posts.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 bg-opacity-70 dark:bg-opacity-70">
          <LoadingAnimation size="sm" color="red" />
          <span className="ml-2">Loading posts...</span>
        </div>
      )}
    </div>
  );
}
