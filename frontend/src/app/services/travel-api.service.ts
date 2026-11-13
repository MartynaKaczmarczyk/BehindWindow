import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ExploreResponse } from '../models/travel';

@Injectable({ providedIn: 'root' })
export class TravelApiService {
  private readonly http = inject(HttpClient);

  explore(latitude: number, longitude: number): Observable<ExploreResponse> {
    const params = new HttpParams()
      .set('lat', latitude)
      .set('lon', longitude);

    return this.http.get<ExploreResponse>('/api/explore', { params });
  }
}