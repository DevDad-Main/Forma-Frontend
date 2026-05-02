declare module 'jspdf-autotable' {
  import { jsPDF } from 'jspdf';
  
  interface AutoTableOptions {
    startY?: number;
    head?: any[][];
    body?: any[][];
    theme?: string;
    headStyles?: any;
    styles?: any;
    columnStyles?: any;
    [key: string]: any;
  }
  
  interface jsPDFWithAutoTable extends jsPDF {
    autoTable: (options: AutoTableOptions) => void;
    lastAutoTable: {
      finalY: number;
    };
  }
  
  export function autoTable(doc: jsPDF, options: AutoTableOptions): void;
  export default function(doc: jsPDF, options: AutoTableOptions): void;
}
