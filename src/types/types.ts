// Định nghĩa giao diện cho User
export interface User {
    id: string;
    firstName?: string;
    lastName?: string;
    username: string;
    password: string;
    email?: string;
    role?: string;
    authenticationType?: number;
    createdAt?: string;
    updatedAt?: string;
    salts?: string;
    phone?:string;
    status?:string;
    userId?:string
  }

  export interface Building {
    id: string;
    building_name: string;
    number_of_floors: number;
    rental_costs: number;
    description: string;
    address: string;
    city: string;
    district: string;
    payment_date: number;
    advance_notice: number;
    payment_time: number;
    payment_timeout: number;
    management: string;
    fee_based_service: ServiceInfo[]; 
    free_service: string[] | undefined;
    utilities: string;
    building_note?: string;
  }




  // export interface Service {
  //   serviceId : string | null,
  //   serviceName : string | null
  // }

  export interface ServiceInfo {
    serviceId: string | null;
    serviceName: string | null;
}

  
  export interface Service {
    service_name: string;
    collect_fees: string;
    unitMeasure: string;
    service_cost: number;
    note?: string;
    image?: string;
    createdAt?: string ;
    updatedAt?: string;
    id?: string;
  }


  export interface Room {
      id: string;
      room_name?: string;
      status?: number;
      room_price?: number;
      floor?: number;
      number_of_bedrooms?: number;
      number_of_living_rooms?: number;
      acreage?: number;
      limited_occupancy?: number;
      deposit?: number;
      renter?: number;
      roomservice?: ServiceInfo[];
      imageUrls?: string[];
      utilities?: string;
      interior?: string;
      describe?: string;
      note?: string;
      building_Id?: string;
      CreatedAt?: Date;
      UpdatedAt?: Date;
    }

    export interface Tenant {
      id?: string;
      customer_name: string;
      phone_number: string;
      choose_room?: string;
      email: string;
      date_of_birth: Date;
      cccd: string;
      date_of_issue: Date;
      place_of_issue: string;
      address?: string;
      imageCCCDs: string[];
      roomName: string;
    }
    


  export interface Contract {
    id: string; // Guid
    contract_name: string;
    rentalManagement?: string;
    room: string;
    roomId: string; // Guid
    start_day: Date;
    end_day: Date;
    billing_start_date: Date;
    payment_term: number;
    room_fee: number;
    deposit: number;
    customerId?: string; // Guid
    // service?: ServiceInfo[];
    service?: string;
    clause?: string;
    image?: string;
    customerName?: string | undefined;
  }
  
  
  export interface Account {
    id?:string,
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    role: string;
    email: string;
    phone: string;
    userId? : string
  }
  