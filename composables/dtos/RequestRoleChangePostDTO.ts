export class RequestRoleChangePostDTO {
  role: 'Operator' | 'User' | 'Moderator' | 'Admin';
  reason: string;
}
