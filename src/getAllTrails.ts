import axios from 'axios';
import Trail from './Trail';

const esUrl = process.env.REACT_APP_ES_NODE;

const getAllTrails = async (latitude: number, longitude: number): Promise<Trail[]> => {
  // TODO: Call proprietary api for search results
  const res = await axios.get(`${esUrl}/trails/_search`, {
    auth: {
      username: process.env.REACT_APP_ES_USER || '',
      password: process.env.REACT_APP_ES_PASS || ''
    }
  });

  const searchResults = res.data.hits.hits;
  // TODO: Transform lat lon to decimal degrees
  // Call trail contract to get additional data
  const trails = searchResults.map((searchResult: any) => {
    const trail = {
      id: searchResult._id,
      latitude: searchResult._source.coordinate.lat,
      longitude: searchResult._source.coordinate.lon
    }
    return trail;
  });
  
  
  return trails;
  
  /*const res = await es.search({
    index: 'trails',
    query: {
      "bool": {
        "must": {
            "match_all": {}
        },
        "filter": {
          "geo_distance": {
            "distance": "200km",
            "pin.location": {
              "lat": latitude,
              "lon": longitude
            }
          }
        }
      }
    }
  }); */
    
  
}

export default getAllTrails;