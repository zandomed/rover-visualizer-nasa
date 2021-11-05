import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { format } from 'date-fns';
import { OptionsFilters } from '../models/options-filters';
import { ResponseRoverPhotos } from '../models/response-rover-photos';
import { Rover } from '../models/rover';

@Injectable({
  providedIn: 'root',
})
export class RoverService {
  constructor(private readonly http: HttpClient) {}

  public getPhotosByEarthDate(
    rover: Rover,
    earthDate: Date,
    options?: OptionsFilters
  ) {
    return this.http.get<ResponseRoverPhotos>(`${rover.toLowerCase()}/photos`, {
      params: new HttpParams({
        fromObject: {
          earth_date: format(earthDate, 'yyyy-MM-dd'),
          ...options,
        },
      }),
    });
  }

  public getPhotosByMartialSol(
    rover: Rover,
    sol: number,
    options?: OptionsFilters
  ) {
    return this.http.get<ResponseRoverPhotos>(`${rover}/photos`, {
      params: new HttpParams({
        fromObject: {
          sol,
          ...options,
        },
      }),
    });
  }
}
