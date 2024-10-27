export interface RouteNavButton {
  title: string;
  to: string;
  icon: string;
  requiresAuth: boolean;
  hideIfAuth: boolean;
  roles: string[];
}
