import React, { useEffect, useState } from 'react';
import GoogleMapReact from 'google-map-react';
import getAllTrails from './getAllTrails';
import EmojiMarker from './EmojiMarker';
import { Button } from '@chakra-ui/button';
import Trail from './Trail';

const MapsKey = process.env.REACT_APP_MAPS_KEY || '';

function Geolocation() {
  const [ latitude, setLatitude ] = useState<number>();
  const [ longitude, setLongitude ] = useState<number>();
  const [ nearLatitude, setNearLatitude ] = useState<number>();
  const [ nearLongitude, setNearLongitude ] = useState<number>();

  const [ trails, setTrails ] = useState<Trail[]>([]);
  
  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(position => {
      const { latitude, longitude } = position.coords;
      setLatitude(latitude);
      setLongitude(longitude);

      const grossLatitude = Math.round(latitude * 1e5) / 1e5;
      if (nearLongitude !== grossLatitude) {
        setNearLatitude(grossLatitude);
      }

      const grossLongitude = Math.round(longitude * 1e5) / 1e5;
      if (nearLongitude !== grossLongitude) {
        setNearLongitude(grossLongitude);
      }
    });

    return () => {
      navigator.geolocation.clearWatch(watchId);
    }
  }, [nearLatitude, nearLongitude]);

  useEffect(() => {
    if (nearLatitude && nearLongitude) {
      getAllTrails(nearLatitude, nearLongitude).then(trails => {
        setTrails(trails);
      });
    }
  }, [nearLatitude, nearLongitude]);

  const claim = async () => {
    console.log("claim tokens");
  };

  if (latitude && longitude) {
    return (
      <div className='App-map'>
        <GoogleMapReact 
          bootstrapURLKeys={{ key: MapsKey }}
          center={{lat: latitude, lng: longitude}}
          defaultZoom={13}
        >
          <EmojiMarker lat={latitude} lng={longitude} emoji={'🏞️'} />
        </GoogleMapReact>
        <div>
          {trails.map((trail) => (
            <div>
              <p key={trail.id}>{trail.id}</p>
              <Button colorScheme='green' size='lg' onClick={() => claim()}>Claim</Button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return <></>
};

export default Geolocation;
