import { Landlord } from "./landlord";

export class Property { 
    
                public id: number;
                public landlord: Landlord;
                public imageUrl: string;
                public propertyName: string;
                public propertyAddress: string;
                public propertyType: string;
                public areaInFeet: number;
                public bedCapacity: number;
                public price: number;
                public availability: number;
                public description: string;
}

