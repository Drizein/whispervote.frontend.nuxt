export class ReportSurveyPostDto {
  surveyId: string;
  reason: string;

  constructor(surveyId?: string, reason?: string) {
    this.surveyId = surveyId || '';
    this.reason = reason || '';
  }
}
