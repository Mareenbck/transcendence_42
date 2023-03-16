export interface UserDto {
  id: number;
  username: string;
  email: string;
  hash: string;
  hashedRtoken: string;
  friendsTo: UserDto[];
}
