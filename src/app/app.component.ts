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
    doc.text('Credit-Note Settle Invoice', pageWidth / 2, 10, { align: 'center' });
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
    let totalAmount = 0;

    this.invoiceDetails.saleItems.forEach((saleItem: any) => {
      saleItem.item.forEach((itm: any) => {
        const rowTotal = saleItem.quantity * saleItem.salePrice;
        totalAmount += rowTotal;
        itemRows.push([
          rowIndex++,
          saleItem.customerName || '-',
          saleItem.phoneNumber || '-',
          itm.creditNoteDate || '-',
          itm.settledDate || '-',
          itm.creditNoteAmount || 'kg',
          itm.settledAmount || 'kg',
          rowTotal.toFixed(2)
        ]);
      });
    });


    autoTable(doc, {
      startY: 88,
      head: [['Sr.No', 'Customer Name', 'Phone Number', 'Credit-Note date', 'settled Date', 'Credit-Note Amount', 'Settled Amount']],
      body: itemRows,
      theme: 'grid',
      headStyles: {
        fillColor: [246, 248, 251],
        textColor: 0,
        halign: 'left' // default alignment
      },
      styles: {
        fontSize: 9,
        textColor: 0,
        cellPadding: 3
      },
      columnStyles: {
        8: { halign: 'right' } // Right-align body & footer of Amount
      },
      tableWidth: 202,
      margin: { left: 4 },
      didDrawCell: function (data) {
        // Check if we are in the header and Amount column (index 8)
        if (data.section === 'head' && data.column.index === 8) {
          data.cell.styles.halign = 'right';
        }
      }
    });









    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Amount  (in words):', 6, 140)
    doc.text('INR Five thousand nine hundred', 6, 146)


    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('For National Enterprises', 139, 240)
    doc.line(139, 264, 206, 264);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text("Authorised signatory", 139, 268)
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