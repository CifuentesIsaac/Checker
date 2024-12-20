export interface LoginResponse {
    ok:Boolean,
    msg:String,
    jwt:string,    
    user:user
}

export interface numParte {
    _id?: number;
    NumIssue: number;
    NumPart: string;
    Qty: number;
    Description: string;
    DNFP: string;
    TestCode: string;
    Project: string;
    IndividualWeight: number;
    customer: string;
    Status: boolean;
};

export interface user {
    _id?: number;
    Employee_ID: number;
    Role: number;
    Department: number;
    Name: string;
    LastName: string;
    Password: string;
    Mail: string;
    Active: boolean;
    ItsNew: boolean;
};

export interface Server {
    ok: Boolean,
    msg: String
}