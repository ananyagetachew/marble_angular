import {Injectable} from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import {FinalConstants} from './final-constants';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor() {
  }

  public exportAsExcelFile(json: any[], excelFileName: string, headerInfo: any[]): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
    XLSX.utils.sheet_add_json(workbook.Sheets.data, json, {
      origin: 'A5',
    });
    // add an empty line for padding betweeen header and content on excel export
    XLSX.utils.sheet_add_json(workbook.Sheets.data, [
      {
        '': '',
        ' ': '',
        '  ': '',
        '   ': '',
        '    ': '',
        '     ': '',
        '      ': '',
        '       ': '',
        '        ': '',
        '         ': '',
        '          ': ''
      }
    ], {
      origin: 'A3'
    });
    // append the headerinfo the a1 cell
    XLSX.utils.sheet_add_json(workbook.Sheets.data, headerInfo, {
      origin: 'A1'
    });
    const excelBuffer: any = XLSX.write(workbook, {bookType: 'xlsx', type: 'array'});
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {type: FinalConstants.EXCEL_TYPE});
    const exportFileName = `${fileName}-${new Date().toLocaleString().replace(/\/|:/g, '-')}${FinalConstants.EXCEL_EXTENSION}`;
    FileSaver.saveAs(data, exportFileName);
  }

}
