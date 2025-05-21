import { Roles } from './roles';

export type UserDto = {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: Roles;
  logoAttachmentUrl?: string;
};
export { Roles };
