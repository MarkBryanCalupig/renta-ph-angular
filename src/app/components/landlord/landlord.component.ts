import { Component, OnInit } from '@angular/core';
import { Landlord } from 'src/app/common/landlord';
import { LandlordService } from 'src/app/services/landlord.service';

@Component({
  selector: 'app-landlord',
  templateUrl: './landlord.component.html',
  styleUrls: ['./landlord.component.css']
})
export class LandlordComponent implements OnInit {


  constructor() { }


  ngOnInit(): void {

  }

}
