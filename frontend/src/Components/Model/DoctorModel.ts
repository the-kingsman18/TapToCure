export interface Doctor{
            doctorId:string;
            degree:string;
            speciality: string;
            experience: number;
            medicalLicense:number;
            state: string;
            city: string;
            clinicAddress:string;
            about:string;
            isAvailable:boolean;
            status:string;    //'pending'|'approved'|'rejected';
            imageURL:string;
            profileimage:File;
}