export interface UserDto {
  id: number;
  username: string;
  email: string;
  isActive: boolean;
  avatar: any; // TODO: add avatar dto
}