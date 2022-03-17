import React, { useEffect, useState } from 'react';

import EmojiMarker from './EmojiMarker';

import GoogleMapReact from 'google-map-react';

const MapsKey = process.env.REACT_APP_MAPS_KEY || '';

interface Trail {
  name: string,
  imageUrl: string,
  distance: number,
}

function Geolocation() {
  const [ latitude, setLatitude ] = useState<number>();
  const [ longitude, setLongitude ] = useState<number>();

  const [ trails, setTrails ] = useState<Trail[]>([]);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(position => {
      const { latitude, longitude } = position.coords;
      setLatitude(latitude);
      setLongitude(longitude);
    });

    return () => {
      navigator.geolocation.clearWatch(watchId);
    }
  });

  const center = {
    lat: latitude || 0,
    lng: longitude || 0
  }

  return (
    <div className='App-map'>
      { latitude && longitude ? 
      <GoogleMapReact
        bootstrapURLKeys={{ key: MapsKey }}
        center={center}
        defaultZoom={13}
      >
        <EmojiMarker lat={latitude} lng={longitude} emoji={'🏞️'} />
      </GoogleMapReact>
      : <></> }
    </div>
  );
};

export default Geolocation;
