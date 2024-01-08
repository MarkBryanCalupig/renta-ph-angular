import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Availability } from '../common/availability';
import { Landlord } from '../common/landlord';
import { Property } from '../common/property';
import { PropertyDetails } from '../common/property-details';

@Injectable({
  providedIn: 'root'
})

export class PropertyService {


  private baseUrl = 'http://localhost:8082/api/properties';
  private baseUrlNoAPI = 'http://localhost:8082/properties';


  constructor(private httpClient: HttpClient) { }

  // This will list the properties, includes the pagination settings.
  /**
   * This function is used to get a list of properties from the database based on the page number and
   * page size.
   * @param {number} thePage - the page number
   * @param {number} thePageSize - number - the number of properties to be displayed on the page
   * @returns GetResponseProperties
   */
  getPropertyListPaginate(thePage: number, thePageSize: number): Observable<GetResponseProperties> {
    // need to build URL based on Landlord id, page and size 
    const searchUrl = `${this.baseUrl}` + `/search/findByAvailabilityOrderByPropertyNameAsc/?availability=1&page=${thePage}&size=${thePageSize}`;
    console.log(searchUrl + " getPropertyListPaginate");
    return this.httpClient.get<GetResponseProperties>(searchUrl);
  }

  // This will list the properties with the given landlord id, includes the pagination settings.  
  /**
   * The function takes a property id as a parameter, builds a URL based on the property id, and then
   * calls the HTTP GET method to retrieve the property from the REST API
   * @param {number} thePropertyId - the id of the property to retrieve
   * @returns Observable<Property>
   */
  getPropertyListPaginateByLandlordId(thePage: number,
    thePageSize: number,
    theLandlordId: number): Observable<GetResponseProperties> {

    // need to build URL based on Landlord id, page and size 
    const searchUrl = `${this.baseUrl}/search/findByLandlordIdOrderByPropertyNameAsc?id=${theLandlordId}`
      + `&page=${thePage}&size=${thePageSize}`;
    console.log(searchUrl + " getPropertyListPaginateById");
    return this.httpClient.get<GetResponseProperties>(searchUrl);
  }

  // This will call to get the property with the given id.  
  // getProperty(thePropertyId: number): Observable<Property> {

  //   // need to build URL based on Property id
  //   const propertyUrl = `${this.baseUrl}/${thePropertyId}`;

  //   console.log(propertyUrl + " getPropertyById");
  //   return this.httpClient.get<Property>(propertyUrl);
  // }

  getPropertyUsingDTO(thePropertyId: number): Observable<PropertyDetails> {

    // need to build URL based on Property id
    const propertyUrlUsingDTO = `${this.baseUrlNoAPI}/details/${thePropertyId}`;

    console.log(propertyUrlUsingDTO + " getPropertyById");
    return this.httpClient.get<PropertyDetails>(propertyUrlUsingDTO);
  }

  getProperty(thePropertyId: number): Observable<Property> {

    // need to build URL based on Property id
    const propertyUrl = `${this.baseUrl}/${thePropertyId}`;

    console.log(propertyUrl + " getPropertyById");
    return this.httpClient.get<Property>(propertyUrl);
  }

  // This will call to get the landlord of the given property id.  
  /**
   * The function takes a property id as a parameter, builds a URL based on the property id, and then
   * calls the HTTP GET method to retrieve the property's landlord
   * @param {number} thePropertyId - number
   * @returns Observable<Landlord>
   */
  getPropertyLandlord(thePropertyId: number): Observable<Landlord> {
    // need to build URL based on Property id
    const propertyUrl = `${this.baseUrl}/${thePropertyId}/landlord`;

    console.log(propertyUrl + " getPropertyById");
    return this.httpClient.get<Landlord>(propertyUrl);

  }


  /**
   * It returns an Observable of type GetResponseProperties
   * @param {number} thePage - the page number
   * @param {number} thePageSize - number - the number of properties to be displayed on the page
   * @param {string} theKeyword - the keyword to search for
   * @returns Observable<GetResponseProperties>
   */
  searchPropertiesPaginate(thePage: number,
    thePageSize: number,
    theKeyword: string): Observable<GetResponseProperties> {

    // need to build URL based on keyword, page and size 
    const searchUrl = `${this.baseUrl}/search/findByAvailabilityAndPropertyNameContainingIgnoreCaseOrderByPropertyNameAsc?availability=1&name=${theKeyword}`
      + `&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProperties>(searchUrl);
  }

  /**
   * It returns an Observable of type GetResponseProperties
   * @param {number} theId - the id of the landlord
   * @param {number} thePage - the page number
   * @param {number} thePageSize - number - the number of properties to be displayed on a page
   * @param {string} theKeyword - the keyword to search for
   * @returns GetResponseProperties
   */
  searchPropertiesByLandlordIdPaginate(theId: number,
    thePage: number,
    thePageSize: number,
    theKeyword: string): Observable<GetResponseProperties> {

    // need to build URL based on keyword, page and size 
    const searchUrl = `${this.baseUrl}/search/findByLandlordIdAndPropertyNameContainingIgnoreCaseOrderByPropertyNameAsc?id=${theId}&name=${theKeyword}`
      + `&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProperties>(searchUrl);
  }

  /**
   * The function takes a property object as an argument, and returns an observable of type Property
   * @param {Property} property - Property - this is the property object that we are sending to the
   * server.
   * @returns Observable<Property>
   */
  addProperty(property: Property): Observable<Property> {
    const addUrl = `${this.baseUrlNoAPI}/add`;
    return this.httpClient.post<Property>(addUrl, property);
  }


  /**
   * The function takes a property object as an argument, and returns an observable of type Property
   * @param {Property} property - Property - the property object to be updated
   * @returns An observable of type Property.
   */
  updateProperty(property: Property): Observable<Property> {
    const updateUrl = `${this.baseUrlNoAPI}/update`;
    return this.httpClient.put<Property>(updateUrl, property);
  }

  /**
   * It takes an id as a parameter, and returns an Observable of type void
   * @param {number} id - number - the id of the property to delete
   * @returns Observable<void>
   */
  deleteProperty(id: number): Observable<void> {
    const deleteUrl = `${this.baseUrlNoAPI}/delete/${id}`;
    return this.httpClient.delete<void>(deleteUrl);
  }

  changeAvailabitily(availability : Availability): Observable<Property>{
    const availabilityUrl= `${this.baseUrlNoAPI}/changeAvailability`
    return this.httpClient.put<Property>(availabilityUrl, availability);

  }

}

interface GetResponseProperties {
  _embedded: {
    properties: Property[];
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}

interface GetResponsePropertyLandlord {
  _embedded: {
    landlord: Landlord[];
  }
}





