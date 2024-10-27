export class SurveyPostDto {
  title: string = '';
  description: string = '';
  options: string[] = [];
  runtime: Date = new Date();
  tags: string[] = [];
  information: string = '';
}
