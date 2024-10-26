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
    status?: number;
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