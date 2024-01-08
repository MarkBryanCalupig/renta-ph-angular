import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  hasLandlord: boolean;
  landlordId: number;
  userId: number;


  constructor(private route: ActivatedRoute, private router: Router, private appComponent: AppComponent) { }

  ngOnInit(): void {
    this.userId = this.appComponent.userId;
    this.route.paramMap.subscribe(() => {
    });
  }

  // This will search for the property name.
  doSearch(value: string) {
    if (value != null ){
      console.log(`value=${value}`);
      this.router.navigateByUrl(`properties/search/${value}`);
    }
    else{
      this.router.navigateByUrl(`properties`);
    }
  }

  // This will search for the property name with the given landlord.
  doSearchByLandlordPropertyName(value: string) {
    console.log(`value=${value} landlord`);
    this.router.navigateByUrl(`properties/landlord/${this.landlordId}/search/${value}`);
  }
}
