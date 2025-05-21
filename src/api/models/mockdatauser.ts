import { UserDto } from './user';
import { Roles } from './roles';

export const mockUser: UserDto = {
  id: 1,
  firstName: 'Afanasiy',
  lastName: 'Velosipedov',
  email: 'abcd1234@mail.com',
  role: Roles.User,
  logoAttachmentUrl: '',
};
