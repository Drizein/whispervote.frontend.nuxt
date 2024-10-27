export class TeamMemberDto {
  id: string;
  role: RoleEnum;
  change: boolean = false;

  constructor(payload: any) {
    this.id = payload.Id;
    this.role = payload.role;
  }
}

export enum RoleEnum {
  User = 0,
  Moderator = 1,
  Admin = 2,
  Operator = 3,
}
