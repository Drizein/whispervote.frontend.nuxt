export class CloseReportPostDto {
  reportSurveyId: string;
  resolution: string;
  strikeUser: boolean;
  strikeSurveyCreator: boolean;

  constructor(reportSurveyId?: string, resolution?: string, strikeUser?: boolean, strikeSurveyCreator?: boolean) {
    this.reportSurveyId = reportSurveyId || '';
    this.resolution = resolution || '';
    this.strikeUser = strikeUser || false;
    this.strikeSurveyCreator = strikeSurveyCreator || false;
  }
}
