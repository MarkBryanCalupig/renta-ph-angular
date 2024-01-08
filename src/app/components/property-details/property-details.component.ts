import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Landlord } from 'src/app/common/landlord';
import { LandlordService } from 'src/app/services/landlord.service';
import { Property } from 'src/app/common/property';
import { PropertyService } from 'src/app/services/property.service';
import { PropertyDetails } from 'src/app/common/property-details';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-property-details',
  templateUrl: './property-details.component.html',
  styleUrls: ['./property-details.component.css']
})
/* The class has a property and landlord object. The property object is used to display the property
details. The landlord object is used to display the landlord details */
export class PropertyDetailsComponent implements OnInit {
  property:Property= new Property();
  landlord: Landlord = new Landlord();
  propertyDetails:PropertyDetails= new PropertyDetails();
  userId: number;
 
  
  constructor( private router: Router, private propertyService: PropertyService, private landlordService: LandlordService,
                          private route:ActivatedRoute, private appComponent: AppComponent) { }

  ngOnInit(): void {
    this.userId = this.appComponent.userId;
    this.displayProperty();
    
  }

  ngAfterViewInit() {
    // Hack: Scrolls to top of Page after page view initialized
    let top = document.getElementById('top');
    if (top !== null) {
      top.scrollIntoView();
      top = null;
    }
  }

  // This will gets a property to be displayed in the ui.
  /**
   * The function gets the property id from the route, then uses the property id to get the property
   * and landlord data from the database
   */
  // displayProperty() {
  //   // get the "id" param string. convert string to a number using the "+" symbol
  //   const thePropertyId: number = +this.route.snapshot.paramMap.get('id');
    
  //   this.propertyService.getProperty(thePropertyId).subscribe(data => {this.property=data },
  // error =>{ console.log(error)
  //   });

  //   this.propertyService.getPropertyLandlord(thePropertyId).subscribe(data => {this.landlord=data});
  
  
  displayProperty() {
    // get the "id" param string. convert string to a number using the "+" symbol
    const thePropertyId: number = +this.route.snapshot.paramMap.get('id');
    
    this.propertyService.getPropertyUsingDTO(thePropertyId).subscribe(data => {this.propertyDetails=data },
  error =>{ console.log(error)
    });

    this.propertyService.getPropertyLandlord(thePropertyId).subscribe(data => {this.landlord=data});
}
  
  

}
