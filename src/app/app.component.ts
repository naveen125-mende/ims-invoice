import { Component } from '@angular/core';
import { InvoiceDetails } from './constants';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatNumber } from '@angular/common';
import { log } from 'node:console';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ims-invoice';
  invoiceDetails = InvoiceDetails;


  downloadPdf() {
    const downloadData = {
      invoiceData: this.invoiceDetails,
      billedBy: {
        name: this.invoiceDetails.store.storeName,
        contactNumber: this.invoiceDetails.store.contactNumber,
        email: this.invoiceDetails.store.email,
      },
      billedTo: {
        name: this.invoiceDetails.customer.customerName,
        contactNumber: this.invoiceDetails.customer.contactNumber,
        email: this.invoiceDetails.customer.email,
      },
      invoiceItems: this.invoiceDetails.saleItems,
      invoiceType: 'Sale Invoice',
      payments: this.invoiceDetails.salePayments,
    };
    this.generateJsPdf(downloadData)
  }

  async generateJsPdf(downloadData: any): Promise<void> {
    const doc = new jsPDF('p', 'mm', 'a4');
    const margin = 10;
    const lineHeight = 6;

    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const invoice = downloadData.invoiceData;
    const billedBy = downloadData.billedBy;
    const billedTo = downloadData.billedTo;
    const items = downloadData.invoiceItems;
    const payments = downloadData.payments;
    const organization = invoice.store.organization;

    const formatDate = (unix: number) => {
      const date = new Date(unix * 1000);
      return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    };

    const formatNumber = (num: number): string => {
      return num.toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    };


    // Set fill color (RGB format: R, G, B)
    doc.setFillColor(240, 240, 240); // light gray background

    // Draw filled rectangle
    doc.rect(60, 2, pageWidth - 120, pageHeight - 4, 'F');

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('RAJARAM GENERAL', pageWidth / 2, 10, { align: 'center' });
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('OLD AYYAPPA NEAR STREET', 65, 18);
    doc.text('KARAIUDI', 120, 18);
    doc.text('GSTIN : 33', pageWidth / 2, 23, { align: 'center' });
    doc.line(60, 25, 150, 25);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('GST INVOICE', pageWidth / 2, 29.5, { align: 'center' });
    doc.line(60, 31, 150, 31);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('24-JUL-25', 62, 34);
    doc.setFont('helvetica', 'normal');
    doc.text('PH : 9159721395 / 8667479126 BILL NO :', 80, 34);
    doc.setFont('helvetica', 'bold');
    doc.text('11,613', 134, 34);
    doc.line(60, 35, 150, 35);
    doc.text('BUYER NAME :', 65, 39);
    doc.setFont('helvetica', 'normal');
    doc.text('RAM', 87.5, 39);
    doc.setFont('helvetica', 'bold');
    doc.text('MOBILE NUMBER :', 65, 43);
    doc.setFont('helvetica', 'normal');
    doc.text('+91 9182029042', 92, 43);
    doc.setFont('helvetica', 'bold');
    doc.text('COUNTER SALES', pageWidth / 2, 48, { align: 'center' });
    doc.line(60, 50, 150, 50);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('particulars', 62, 55);
    doc.text('Rate', 100, 55);
    doc.text('Qty', 115, 55);
    doc.text('Amount', 130, 55);
    doc.line(60, 57, 150, 57);







    doc.line(60, 205, 150, 205);

    doc.setFontSize(15);
    doc.text('60', 70, 212);
    doc.text('TOTAL :', 90, 212);

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('5,537.35', 125, 212);


    doc.line(60, 216, 150, 216);





















    // doc.text("3. NO CLAIM SHALL BE ENTERTAINED AFTER PLAYING THE TILES",margin+3,272)
    // doc.text("4. Returns of goods will be accepted within 7 days from the date of purchase.",margin+3,276)
    doc.save(`Invoice_${invoice.invoiceId}.pdf`);
  }

}