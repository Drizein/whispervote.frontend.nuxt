export class ReportGetDto {
  reason: string;
  reportSurveyId: string;
  survey: ReportSurveyDto;

  constructor(data: any) {
    this.reason = data.Reason;
    this.reportSurveyId = data.ReportSurveyId;
    this.survey = new ReportSurveyDto(data.Survey);
  }
}

export class ReportSurveyDto {
  description: string;
  information: string;
  options: ReportSurveyOptionDto[];
  id: string;
  tags: ReportSurveyIdTagDto[];
  title: string;
  TotalVotes: number;

  constructor(data: any) {
    this.description = data.Description;
    this.information = data.Information;
    this.options = data.Options.map((x: any) => new ReportSurveyOptionDto(x));
    this.id = data.SurveyId;
    this.tags = data.Tags.map((x: any) => new ReportSurveyIdTagDto(x));
    this.title = data.Title;
    this.TotalVotes = data.TotalVotes;
  }
}

export class ReportSurveyOptionDto {
  value: string;
  count: number;

  constructor(data: any) {
    this.value = data.Value;
    this.count = data.Count;
  }
}

export class ReportSurveyIdTagDto {
  id: string;
  value: string;

  constructor(data: any) {
    this.id = data.Id;
    this.value = data.Value;
  }
}
