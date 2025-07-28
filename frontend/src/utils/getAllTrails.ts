import axios from 'axios';
import { Trail } from '../types';

const esUrl = process.env.EXPO_PUBLIC_ES_NODE;

const getAllTrails = async (latitude: number, longitude: number): Promise<Trail[]> => {
  try {
    const overpassUrl = 'https://overpass-api.de/api/interpreter';
    const radius = 10000; // meters (10km); adjust as needed
    const query = `[out:json]; way(around:${radius},${latitude},${longitude})["highway"~"path|footway|bridleway"]; out geom;`;

    const res = await axios.post(overpassUrl, `data=${encodeURIComponent(query)}`, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    const elements = res.data.elements || [];
    const trails = elements
      .filter((el: any) => el.geometry && el.geometry.length > 0) // Ensure valid geometry
      .map((el: any) => {
        const trail: Trail = {
          address: el.tags?.name || el.id.toString(),
          latitude: el.geometry[0].lat.toString(),
          longitude: el.geometry[0].lon.toString()
        };
        return trail;
      });

    return trails;
  } catch (error) {
    console.error('Error fetching trails from OSM:', error);
    return [];
  }
};

export default getAllTrails; 