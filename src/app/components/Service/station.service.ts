import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface Station {
  name: string;
  id?: string;
  sequence?: number; // Order/sequence for calculating distance
}

@Injectable({
  providedIn: 'root'
})
export class StationService {
  constructor(private readonly http: HttpClient) {}

  // Get tram stations from CSV
  getTramStations(): Observable<Station[]> {
    return this.http.get('/alex_tram_stations_enriched.csv', { responseType: 'text' }).pipe(
      map(csv => this.parseTramCSV(csv)),
      catchError(error => {
        console.error('Error loading tram stations:', error);
        return of([]);
      })
    );
  }

  // Get metro stations from GeoJSON
  getMetroStations(): Observable<Station[]> {
    return this.http.get<any>('/NewMetro.geojson').pipe(
      map(geojson => this.parseMetroGeoJSON(geojson)),
      catchError(error => {
        console.error('Error loading metro stations:', error);
        return of([]);
      })
    );
  }

  // Get bus stations (placeholder - add real data if available)
  getBusStations(): Observable<Station[]> {
    // For now, return sample bus stations
    const busStations: Station[] = [
      { name: 'Cairo Central', id: 'BUS_01', sequence: 1 },
      { name: 'Alexandria', id: 'BUS_02', sequence: 2 },
      { name: 'Giza', id: 'BUS_03', sequence: 3 },
      { name: 'Luxor', id: 'BUS_04', sequence: 4 },
      { name: 'Aswan', id: 'BUS_05', sequence: 5 },
      { name: 'Port Said', id: 'BUS_06', sequence: 6 },
      { name: 'Suez', id: 'BUS_07', sequence: 7 }
    ];
    return of(busStations);
  }

  // Get stations based on category
  getStationsByCategory(category: 'bus' | 'tram' | 'metro'): Observable<Station[]> {
    switch (category) {
      case 'tram':
        return this.getTramStations();
      case 'metro':
        return this.getMetroStations();
      case 'bus':
        return this.getBusStations();
      default:
        return of([]);
    }
  }

  private parseTramCSV(csv: string): Station[] {
    const lines = csv.split('\n');
    const stations: Station[] = [];

    // Skip header line
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line) {
        const columns = line.split(',');
        if (columns.length >= 5) {
          stations.push({
            id: columns[0],
            name: columns[1],
            sequence: Number.parseInt(columns[4]) // sequence_order column
          });
        }
      }
    }

    return stations;
  }

  private parseMetroGeoJSON(geojson: any): Station[] {
    const stations: Station[] = [];

    if (geojson.features && Array.isArray(geojson.features)) {
      geojson.features.forEach((feature: any, index: number) => {
        if (feature.properties?.name) {
          stations.push({
            id: `METRO_${index + 1}`,
            name: feature.properties.name,
            sequence: index + 1
          });
        }
      });
    }

    // Filter out empty names
    return stations.filter(station => station.name && station.name.trim() !== '');
  }
}

