import { authenticateUser } from './protected';


export const verifyAuth = authenticateUser;


export { adminOnly, clientAccess, restrict, ensureOwnership } from './protected';
export type { IUserProtected } from './protected';
