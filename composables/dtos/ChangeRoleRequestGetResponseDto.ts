export class ChangeRoleRequestGetResponseDto {
  createdAt: Date;
  id: string;
  reason: string;
  requesterId: string;
  role: string;

  constructor(from: IChangeRoleRequestGetResponseDto) {
    this.createdAt = new Date(from.CreatedAt);
    this.id = from.Id;
    this.reason = from.Reason;
    this.requesterId = from.RequesterId;
    this.role = from.Role;
  }
}

export interface IChangeRoleRequestGetResponseDto {
  CreatedAt: string;
  Id: string;
  Reason: string;
  RequesterId: string;
  Role: string;
}
