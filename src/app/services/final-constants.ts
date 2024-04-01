import { environment } from "../../environments/environment";

export class FinalConstants {
  static API_URL = `http://${environment.API_URL}/api`;
  static AUTHENTICATED_USER_LABEL = 'authenticatedUser';

  static DEPARTMENT_ID_ADMIN = 1;
  static DEPARTMENT_ID_SALES = 2;
  static DEPARTMENT_ID_FACTORY_LOADER = 3;
  static DEPARTMENT_ID_STOCK_MANAGER = 4;
  static DEPARTMENT_ID_PRODUCTION_MANAGER = 5;
  static DEPARTMENT_ID_FINANCE_MANAGER = 6;

  static EXCEL_EXTENSION = '.xlsx';
  static EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

}


