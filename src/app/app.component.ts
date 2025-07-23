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


    doc.rect(2, 2, pageWidth - 4, pageHeight - 4,)

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Return-Invoice', pageWidth / 2, 10, { align: 'center' });
    doc.rect(4, 15, pageWidth - 8, 69);
    doc.setFontSize(12);

    doc.setFont('helvetica', 'bold');
    doc.text('devlats pvt ltd', 6, 20,);
    doc.setFont('helvetica', 'normal');
    doc.text('Devlats', 6, 24);
    doc.text('Nizamabad It Hub', 6, 28);
    doc.text('Mobile No: 9182029402, 9182029402', 6, 33);
    doc.text('Email:info@devlats.com', 6, 38);
    doc.text(`GSTIN/UIN : ${this.invoiceDetails.gstin}`, 6, 43);
    // const imageBase64 = await this.getImageAsBase64(imageUrl);
    // doc.addImage(imageBase64, 'JPEG', 17, 28, 16, 16);
    doc.setFont('helvetica', 'bold');
    doc.text('Buyer', 6, 52,);
    doc.text('Ganesh Ebterprises', 6, 56);
    doc.setFont('helvetica', 'normal');
    doc.text('Ganesh', 6, 60);
    doc.text('Near Bus Stand Nizamabad', 6, 64);
    doc.text('Mobile No: 919876543210', 6, 68);
    doc.text('Email:info@ganesh.com', 6, 73);
    doc.text(`GSTIN/UIN : ${this.invoiceDetails.gstin}`, 6, 78);

    doc.setFont('helvetica', 'bold');
    doc.rect((pageWidth / 2) + 9, 42, 46, 14);
    doc.text(`Invoice No. `, (pageWidth / 2) + 12, 48);
    doc.text(`64`, (pageWidth / 2) + 12, 53);
    doc.rect((pageWidth / 2) + 9, 56, 46, 14);
    doc.text(`Invoice No. `, (pageWidth / 2) + 12, 62);
    doc.text(`64`, (pageWidth / 2) + 12, 67);
    doc.rect((pageWidth / 2) + 9, 70, 46, 14);
    doc.text(`Invoice No. `, (pageWidth / 2) + 12, 76);
    doc.text(`64`, (pageWidth / 2) + 12, 81);
    doc.rect((pageWidth / 2) + 55, 42, 46, 14);
    doc.text(`Invoice No. `, (pageWidth / 2) + 58, 48);
    doc.text(`64`, (pageWidth / 2) + 58, 53);
    doc.rect((pageWidth / 2) + 55, 56, 46, 14);
    doc.text(`Invoice No. `, (pageWidth / 2) + 58, 62);
    doc.text(`64`, (pageWidth / 2) + 58, 67);
    doc.rect((pageWidth / 2) + 55, 70, 46, 14);
    doc.text(`Invoice No. `, (pageWidth / 2) + 58, 76);
    doc.text(`64`, (pageWidth / 2) + 58, 81);



    const itemRows: any[] = [];
    let rowIndex = 1;
    invoice.saleItems.forEach((saleItem: any) => {
      saleItem.item.forEach((itm: any) => {
        itemRows.push([
          rowIndex++,
          itm.itemName,
          itm.hsnCode,
          itm.quality?.qualityName || '-',
          saleItem.quantity,
          itm.unit?.unitShortName || 'kg',
          saleItem.salePrice.toFixed(2),
          saleItem.discount + '%',
          (saleItem.quantity * saleItem.salePrice).toFixed(2)
        ]);
      });
    });

    // Calculate totals
    const totalAmount = invoice.saleItems.reduce((sum: number, item: any) => {
      return sum + item.quantity * item.salePrice;
    }, 0);

    const totalQuantity = invoice.saleItems.reduce((sum: number, item: any) => {
      return sum + item.quantity;
    }, 0);

    autoTable(doc, {
      startY: 88,
      head: [['Sr.No', 'Item Name', 'HSN/SAC', 'Brean/Qlt', 'Qty', 'Unit', 'Rate', 'Disc', 'Amount']],
      body: itemRows,
      theme: 'grid',
      headStyles: {
        fillColor: [222, 222, 222],
        textColor: 0,
        halign: 'right',
      },
      styles: {
        fontSize: 10,
        textColor: 0,
        halign: 'right',
        cellPadding: 3
      },
      tableWidth: 198,
      margin: { left: 6 },

      foot: [
        [
          { content: 'Total', colSpan: 4, styles: { halign: 'right', fontStyle: 'bold' } },
          totalQuantity.toString(),
          '', '', '',
          totalAmount.toFixed(2)
        ]
      ],
      footStyles: {
        fillColor: [222, 222, 222],
        fontStyle: 'bold',
        textColor: 20,
        halign: 'right'
      }
    });
    doc.setFont('helvetica', 'bold');
    doc.text('E. & O. E', 185, 135);

    const taxRows = this.invoiceDetails.taxItems.map(item => [
      item.hsnCode,
      formatNumber(item.taxableValue),
      `${item.centralTaxRate}%`,
      formatNumber(item.centralTaxAmount),
      `${item.stateTaxRate}%`,
      formatNumber(item.stateTaxAmount),
      formatNumber(item.totalTaxAmount)
    ]);
    const totalTaxable = this.invoiceDetails.taxItems.reduce((sum, item) => sum + item.taxableValue, 0);
    const totalCentral = this.invoiceDetails.taxItems.reduce((sum, item) => sum + item.centralTaxAmount, 0);
    const totalState = this.invoiceDetails.taxItems.reduce((sum, item) => sum + item.stateTaxAmount, 0);
    const totalTaxAmount = this.invoiceDetails.taxItems.reduce((sum, item) => sum + item.totalTaxAmount, 0);

    autoTable(doc, {
      startY: 140,
      theme: 'grid',
      head: [
        [
          { content: 'HSN/SAC', rowSpan: 2 },
          { content: 'Taxable Value', rowSpan: 2 },
          { content: 'Central tax', colSpan: 2 },
          { content: 'Central tax', colSpan: 2 },
          { content: 'Total Tax Amount', rowSpan: 2 }
        ],
        [
          'Rate', 'Amount',
          'Rate', 'Amount'
        ]
      ],
      body: taxRows,
      foot: [
        [
          { content: 'Total', styles: { fontStyle: 'bold', halign: 'right' } },
          { content: formatNumber(totalTaxable), styles: { fontStyle: 'bold' } },
          '', { content: formatNumber(totalCentral), styles: { fontStyle: 'bold' } },
          '', { content: formatNumber(totalState), styles: { fontStyle: 'bold' } },
          { content: formatNumber(totalTaxAmount), styles: { fontStyle: 'bold' } }
        ]
      ],
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        halign: 'right',
        valign: 'middle'
      },
      footStyles: {
        fillColor: [255, 255, 255],
        fontStyle: 'bold',
        textColor: 20,
        halign: 'right'
      },
      styles: {
        fontSize: 10,
        textColor: [0, 0, 0],
        lineColor: [0, 0, 0],
        lineWidth: 0.2,
        cellPadding: 3,
        halign: 'right',
        valign: 'middle'
      },
      columnStyles: {
        1: { halign: 'right' },
        3: { halign: 'right' },
        5: { halign: 'right' },
        6: { halign: 'right' }
      },
      tableWidth: 198,
      margin: { left: 6 },
    });

    doc.setFontSize(8);
    // === Main Summary Box ===
    doc.setFillColor(255, 255, 255); // Light background
    doc.setDrawColor(0, 0, 0);       // Border color
    doc.roundedRect(139, 194, 65, 23, 0, 0, 'FD'); // (x, y, w, h, rx, ry, Fill+Draw)

    // === Text inside box ===
    doc.setTextColor(0);
    doc.setFontSize(12);

    doc.text("Sub Total", 142, 202);
    doc.text(`${this.invoiceDetails.subTotal}`, 192, 202);


    // === Total Amount Bar ===
    doc.setFillColor(53, 53, 53); // Dark gray background
    doc.roundedRect(141, 205, 61, 8, 0, 0, 'F'); // Rounded bar
    doc.setTextColor(255, 255, 255);
    doc.text("Total Amount", 142, 210.5);
    doc.text(`${this.invoiceDetails.totalAmount}`, 192, 210.5);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('For National Enterprises', 6, 240)
    doc.line(6, 264, 43, 264);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text("Authorised signatory", 6, 268)
    doc.rect(4, 276, 202, 12);
    doc.text("Declaration", 8, 280)
    doc.setFont('helvetica', 'normal');
    doc.text("We declare that this invoice shows the actual ptice of the goods described and that all particulars are true and correct.", 8, 284)
    doc.text("This is a Computer Generated Invoice", pageWidth / 2, 292, { align: 'center' })
    // doc.text("3. NO CLAIM SHALL BE ENTERTAINED AFTER PLAYING THE TILES",margin+3,272)
    // doc.text("4. Returns of goods will be accepted within 7 days from the date of purchase.",margin+3,276)
    doc.save(`Invoice_${invoice.invoiceId}.pdf`);
  }

}