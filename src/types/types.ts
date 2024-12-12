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
    userId?:string;
    avata?: string
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
    customerId?: string;
    nameCustomer?: string
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
    status: number;
    clause?: string;
    image?: string;
    // image?: string[];
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
  

  export interface Deposit {
    id: string;
    deposit_amount: number;
    roomid: string;
    roomname: string;
    move_in_date: Date;
    payment_method: string;
    customerid: string;
    customername: string;
    image: string[];
    note: string;
    status: number;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export interface ServiceMeterReadings {
    id: string; // UUID
    building_name: string | null; // varchar(255)
    building_id: string | null; // UUID
    room_name: string | null; // varchar(255)
    room_id: string | null; // UUID
    status: number; // int
    recorded_by: string | null; // varchar(255)
    recordid: string | null; // UUID
    record_date: Date; // timestamp with time zone
    electricity_old: number; // numeric
    electricity_new: number; // numeric
    electricity_price: number; // numeric
    electricity_cost: number; // numeric
    water_old: number; // numeric
    water_new: number; // numeric
    water_price: number; // numeric
    water_cost: number; // numeric
    confirmation_status: boolean; // boolean
    total_amount: number; // numeric
    CreatedAt?: Date; // timestamp with time zone
    UpdatedAt?: Date; // timestamp with time zone
  }
  


  export interface Bill {
    id: string; // UUID
    bill_name?: string; // Optional, varchar(255)
    status: number;
    status_payment: number;
    building_id: string; // UUID
    customer_name?: string; // Optional, varchar(255)
    customer_id: string; // UUID
    date?: string; // ISO string for timestamp with time zone
    roomid: string; // UUID
    roomname?: string; // Optional, varchar(255)
    payment_date?: string; // ISO string for timestamp with time zone
    due_date?: string; // ISO string for timestamp with time zone
    cost_room: number;
    cost_service: number;
    total_amount: number;
    penalty_amount: number;
    discount: number;
    final_amount: number;
    note?: string; // Optional, varchar(255)
    createdAt?: string; // ISO string for timestamp with time zone
    updatedAt?: string; // ISO string for timestamp with time zone
}

export interface Problem  {
  id: string; // UUID
  room_name?: string; // Optional, because it might be null
  problem?: string; // Optional
  decription?: string; // Optional
  image?: string[]; // Optional
  fatal_level?: number; // Optional, assuming it can be null
  status?: number; // Optional, assuming it can be null
  createdAt?: string; // Optional, assuming it can be null
  updatedAt?: string; // Optional, assuming it can be null
};


export interface TransactionGroup {
  id: string; // Unique identifier for the transaction group
  type: number; // Represents the type of the transaction group (e.g., 0 for default)
  name: string; // Name of the transaction group
  image?: string; // URL or path to an image associated with the transaction group
  note: string; // Additional notes or comments
};


export interface Transaction {
  id: string;
  date: string; // ISO 8601 format
  amount: number;
  transactiongroupid: string;
  transactiongroupname: string;
  paymentmethod: string;
  contractid: string;
  contractname: string;
  note: string;
  image: string; // URL or base64-encoded string
};


export interface Booking {
  id: string;
  roomid: string;
  customername: string;
  phone: string;
  email: string;
  date: string; 
  status: number; 
  note: string;
  roomname: string
};

export interface UserTokens{
  userId: string
  device: string
  token: string
} 
