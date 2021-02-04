export interface AvatarDto {
  id: number;
  blob: string;
  createdAt: Date;
  uploader: UserDto;
}

export interface UserDto {
  id: number;
  username: string;
  email: string;
  isActive: boolean;
  avatar: AvatarDto;
}
