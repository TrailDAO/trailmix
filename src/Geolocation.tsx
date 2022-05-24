import React, { useEffect, useState } from 'react';
import GoogleMapReact from 'google-map-react';
import { Button } from '@chakra-ui/button';
import getAllTrails from './getAllTrails';
import EmojiMarker from './EmojiMarker';
import { useWeb3 } from '@3rdweb/hooks';
import Trail from './Trail';

import { TrailTokenAddress } from './Addresses';
import { ethers } from 'ethers';

export const TrailContract = require('./Trail.json');

const MapsKey = process.env.REACT_APP_MAPS_KEY || '';

function Geolocation() {
  const { address, provider } = useWeb3();

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

  const claim = async (trailAddress: string) => {
    if (provider) {
      // generatecall snarkjs, not sure how this should work
      // verify inputs

      const trail = new ethers.Contract(trailAddress, TrailContract.abi, provider.getSigner());
      const tx = await trail.hike();
      await tx.wait();
    }

    console.log("claim tokens");
  };

  if (latitude && longitude && provider) {
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
              <p key={trail.address}>{trail.address}</p>
              <Button colorScheme='green' size='lg' onClick={() => claim(trail.address)}>Claim</Button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return <></>
};

export default Geolocation;
