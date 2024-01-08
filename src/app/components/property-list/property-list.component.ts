/* The PropertyListComponent class is used to list the properties of a landlord */
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { Availability } from 'src/app/common/availability';
import { Landlord } from 'src/app/common/landlord';
import { LandlordStatistics } from 'src/app/common/landlord-statistics';
import { Property } from 'src/app/common/property';
import { PropertyDetails } from 'src/app/common/property-details';
import { LandlordService } from 'src/app/services/landlord.service';
import { PropertyService } from 'src/app/services/property.service';

@Component({
  selector: 'app-property-list',
  templateUrl: './property-list.component.html',
  styleUrls: ['./property-list.component.css']
})
export class PropertyListComponent implements OnInit {

  landlord: Landlord = new Landlord();
  property: Property = new Property();
  availability: Availability= new Availability();
  propertyDetails: PropertyDetails = new PropertyDetails();

  pageTitle: String;
  userId: number;
  landlorStatistics: LandlordStatistics = new LandlordStatistics();


  properties: Property[] = [];
  currentLandlordId: number;
  previousLandlordId: number;
  hasLandlordId: boolean;
  status: boolean;
  searchMode: boolean = false;


  // new properties for pagination
  thePageNumber: number = 1;
  thePageSize: number = 6;
  theTotalElements: number = 0;


  previousKeyword: string = null;

  id: number;
  mode: String;

  constructor(private propertyService: PropertyService, private route: ActivatedRoute,
    private landlordService: LandlordService, private appComponent: AppComponent) { }

  ngOnInit() {
    this.route.paramMap.subscribe(() => {
      this.pageTitle = this.appComponent.pageTitle;
      this.userId = this.appComponent.userId;
      this.listProperties();
    });
  }

  // This will list the properties according to the given conditions.
  /**
   * If the URL contains a keyword parameter, then we're in search mode, so we call the
   * handleSearchProperties() function, otherwise we're in list mode, so we call the
   * handleListProperties() function
   */
  listProperties() {
    // // check if "id" parameter is available
    if (this.userId != 0) {
      this.getLandlordStatistics();
    }


    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode) {
      this.handleSearchProperties();
    }
    else {
      this.handleListProperties();
    }

  }

  // This will list the properties according to the search conditions.
  /**
   * If the keyword is different than the previous keyword, then set the page number to 1
   */
  handleSearchProperties() {

    const theKeyword: string = this.route.snapshot.paramMap.get('keyword');

    // if we have a different keyword than previous
    // then set thePageNumber to 1

    if (this.previousKeyword != theKeyword) {
      this.thePageNumber = 1;
    }

    this.previousKeyword = theKeyword;

    console.log(`keyword=${theKeyword}, thePageNumber=${this.thePageNumber}`);



    if (this.userId == 0) {
      // now search for the products using keyword
      this.propertyService.searchPropertiesPaginate(this.thePageNumber - 1,
        this.thePageSize,
        theKeyword).subscribe(this.processResult());

    } else {
      // now search for the products using keyword
      this.propertyService.searchPropertiesByLandlordIdPaginate(this.userId, this.thePageNumber - 1,
        this.thePageSize, 
        theKeyword).subscribe(this.processResult());
    }
  }

  // This will list the properties according to the conditions. It can list for the users view or list for the landlord's view.
  /**
   * If the route has an id parameter, then get the properties for the given landlord id, otherwise get
   * all the properties
   */
  handleListProperties() {

    // check if "id" parameter is available

    if (this.userId != 0) {
      this.currentLandlordId = this.userId;
      //
      // Check if we have a different landlord than previous
      // Note: Angular will reuse a component if it is currently being viewed

      // if we have a different landlord id than previous
      // then set thePageNumber back to 1
      this.previousLandlordId = this.currentLandlordId;

      console.log(`currentLandlordId=${this.currentLandlordId}, thePageNumber=${this.thePageNumber}`);

      // now get the products for the given category id
      // this.propertyService.getPropertyListPaginateBy(this.thePageNumber - 1,
      //                                           this.thePageSize,
      //                                           this.currentLandlordId)
      //                                           .subscribe(this.processResult());
      this.propertyService.getPropertyListPaginateByLandlordId(this.thePageNumber - 1,
        this.thePageSize,
        this.currentLandlordId)
        .subscribe(this.processResult());
    }
    else {
      // no id available ... will show all the properties
      this.propertyService.getPropertyListPaginate(this.thePageNumber - 1,
        this.thePageSize)
        .subscribe(this.processResult());
    }

  }

  // This will process the results of listProperties method.
  /**
   * It takes the data returned from the server and assigns it to the properties array, the page
   * number, the page size, and the total number of elements
   * @returns The data is being returned.
   */
  processResult() {
    return data => {
      this.properties = data._embedded.properties;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    };
  }

  // This will update the paginations settings.
  /**
   * The function updates the page size and resets the page number to 1
   * @param {number} pageSize - the number of items to display per page
   */
  updatePageSize(pageSize: number) {
    this.thePageSize;
    this.thePageNumber = 1;
    this.listProperties();
  }

  // This will validate the given instructions from the property-list-html.
  /**
   * It creates a button, sets the button's attributes, and then clicks the button
   * @param {number} id - the id of the property to be edited or deleted
   * @param {String} mode - add, edit, delete, makeUnavailable, makeAvailable
   */
  public onOpenModal(id: number, mode: String): void {
    const container = document.getElementById('main-container')
    const button = document.createElement('button')
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    this.mode = mode;
    if (mode == 'add') {
      this.property = new Property();
      button.setAttribute('data-target', '#formModal');
    }
    if (mode == 'edit') {
      this.propertyService.getProperty(id).subscribe(data => { this.property = data })
      button.setAttribute('data-target', '#formModal');
    }
    if (mode == 'delete') {
      this.id = id;
      button.setAttribute('data-target', '#deleteModal');
    }
    if (mode == 'makeUnavailable') {
      button.setAttribute('data-target', '#availabilityModal');
    }
    if (mode == 'makeAvailable') {
      button.setAttribute('data-target', '#availabilityModal');
    }
    container.appendChild(button);
    button.click();
  }

  // This will send a property object to be added in the server.
  /**
   * The function is called when the user clicks the "Add Property" button on the "Add Property" form.
   * The function then calls the "addProperty" function in the "PropertyService" service, which sends a
   * POST request to the server to add the property to the database. The function then calls the
   * "listProperties" function to update the list of properties on the page
   * @param {NgForm} property - NgForm - this is the form that is being submitted
   */
  public onAddProperty(property: NgForm): void {
    document.getElementById('close-form').click();

    this.landlord.id = this.currentLandlordId;
    this.property.landlord = this.landlord;

    this.propertyService.addProperty(this.property).subscribe(data => {
      console.log(data);
      this.listProperties();
    },
      error => console.log(error.message));
    property.reset;
  }

  // This will send a property object to be updated in the server.
  /**
   * The function is called when the user clicks the "Update" button on the form. It closes the form,
   * sets the property's id to the id of the property that was selected, sets the landlord's id to the id
   * of the current landlord, sets the property's landlord to the current landlord, and then calls the
   * updateProperty() function in the property service
   * @param {Property} property - Property - this is the property object that is passed in from the form.
   */
  public onUpdateProperty(property: Property): void {
    document.getElementById('close-form').click();

    property.id = this.property.id;
    this.landlord.id = this.currentLandlordId;
    property.landlord = this.landlord;
    console.log(property);
    this.propertyService.updateProperty(property).subscribe(data => {
      console.log(data);
      this.listProperties();
    },
      error => console.log(error.message));
  }

  /**
 * The function is called when the user clicks the delete button on the property details page. The
 * function calls the deleteProperty() function in the property service, which sends a delete request
 * to the server. The function then calls the listProperties() function to refresh the list of
 * properties
 * @param {number} id - number - the id of the property to be deleted
 */
  public onDeleteProperty(id: number): void {
    document.getElementById('close-forms').click();
    this.propertyService.deleteProperty(id).subscribe(data => {
      console.log(data);
      this.listProperties();
    },
      error => console.log(error.message));
  }

  public changePropertyAvailability(id: number, presentAvailability:number): void {
    this.availability.id=id;
    this.availability.availability=presentAvailability;

    this.propertyService.changeAvailabitily(this.availability).subscribe(data => {
      console.log(data);
      this.listProperties();
    },
      error => console.log(error.message));
  }

  public getLandlordStatistics() {
    this.landlordService.getLandlordStatistics(this.userId).subscribe(data => {
      console.log(data),
      this.landlorStatistics = data
      if (this.landlorStatistics.montlyIncome==null){
        this.landlorStatistics.montlyIncome=0;
      }
    });
  }

}

