export class SurveyGetResponseDto {
  PublicKey: string;
  Survey: SurveyGetResponseSurveyDto;
}

export class SurveyGetResponseSurveyDto {
  Title: string;
  Description: string;
  Options: SurveyGetResponseOptionDto[];
  Runtime: string;
  Tags: SurveyGetResponseTagDto[];
  Information: string;
  TotalVotes: number;
  Votes: any;
  CreatedAt: string;
  SurveyId: string;
}

export class SurveyGetResponseOptionDto {
  Value: string;
  Count: number;
  OptionId: string;
  Selected: boolean = false;
}

export class SurveyGetResponseTagDto {
  Value: string;
  SurveyId: string;
  CreatedAt: string;
  Id: string;
}
