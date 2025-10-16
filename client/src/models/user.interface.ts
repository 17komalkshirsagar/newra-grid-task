export interface IUser {
    _id?: string
    clinicId?: string
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    phone: string
    confirmPassword?: string
    profile?: string
    role: ' Admin' | 'User';
    status?: 'active' | 'inactive';
    token?: string
}