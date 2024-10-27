// Định nghĩa giao diện cho User
export interface User {
    id?: string;
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
    fee_based_service: string[]; 
    free_service: string[];
    utilities: string;
    building_note?: string;
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