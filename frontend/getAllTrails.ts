import axios from 'axios';
import Trail from './Trail';

const esUrl = process.env.EXPO_PUBLIC_ES_NODE;

const getAllTrails = async (latitude: number, longitude: number): Promise<Trail[]> => {
  try {
    // TODO: Call proprietary api for search results
    const res = await axios.get(`${esUrl}/trails/_search`, {
      auth: {
        username: process.env.EXPO_PUBLIC_ES_USER || '',
        password: process.env.EXPO_PUBLIC_ES_PASS || ''
      }
    });

    const searchResults = res.data.hits.hits;
    // TODO: Transform lat lon to decimal degrees
    // Call trail contract to get additional data
    const trails = searchResults.map((searchResult: any) => {
      const trail: Trail = {
        address: searchResult._id,
        latitude: searchResult._source.coordinate.lat,
        longitude: searchResult._source.coordinate.lon
      };
      return trail;
    });
    
    return trails;
  } catch (error) {
    console.error('Error fetching trails:', error);
    return [];
  }
};

export default getAllTrails; 