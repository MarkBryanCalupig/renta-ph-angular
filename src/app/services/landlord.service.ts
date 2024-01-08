import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Landlord } from '../common/landlord';
import { LandlordStatistics } from '../common/landlord-statistics';

@Injectable({
  providedIn: 'root'
})
export class LandlordService {
  private baseUrl = 'http://localhost:8082/api/landlords';
  constructor(private httpClient: HttpClient) {
  }

  // This will list the landlords.
  getLandlordList(): Observable<Landlord[]> {
    return this.httpClient.get<GetResponse>(this.baseUrl).pipe(map(response => response._embedded.landlords));
  }

  // This will get the landlord with the given id.
  getLandlord(theLandlordId: number): Observable<Landlord> {

    // need to build URL based on Property id
    const landlordUrl = `${this.baseUrl}/${theLandlordId}`;

    console.log(landlordUrl + " getLandlordById");
    return this.httpClient.get<Landlord>(landlordUrl);
  }

  getLandlordStatistics(theLandlordId: number): Observable<LandlordStatistics> {
    const landlordStatisticsUrl = `http://localhost:8082/landlords/${theLandlordId}/statistics`;
    return this.httpClient.get<LandlordStatistics>(landlordStatisticsUrl);
  }

}

interface GetResponse {
  _embedded: {
    landlords: Landlord[];
  }
}



