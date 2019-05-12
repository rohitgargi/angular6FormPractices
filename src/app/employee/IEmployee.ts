import { ISkill } from './ISkill';
export interface IEmployee{
    id: number,
    fullName: string,
    email: string,
    confirmEmail:string,
    phone?:number,
    contactPreference:string,
    skills: ISkill[]
} 