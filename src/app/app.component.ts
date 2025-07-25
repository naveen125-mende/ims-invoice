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

    const totalAmount = invoice.saleItems.reduce((sum: number, item: any) => {
      return sum + item.quantity * item.salePrice;
    }, 0);

    const totalQuantity = invoice.saleItems.reduce((sum: number, item: any) => {
      return sum + item.quantity;
    }, 0);

    autoTable(doc, {
      startY: 55,
      head: [['Sr.No', 'Item', 'Qty', 'Rate', 'Amount']],
      body: itemRows,
      theme: 'grid',
      headStyles: {
        fillColor: [230, 230, 230],
        textColor: 0,
        halign: 'center'
      },
      styles: {
        fontSize: 9,
        cellPadding: 3
      },
      tableWidth: 90,
      margin: { left: 60 },

      foot: [
        [
          { content: 'Total', colSpan: 4, styles: { halign: 'right', fontStyle: 'bold' } },
          totalQuantity.toString(),
          '', '', '',
          totalAmount.toFixed(2)
        ]
      ],
      footStyles: {
        fillColor: [230, 230, 230],
        fontStyle: 'bold',
        textColor: 20,
        halign: 'right'
      }
    });
    doc.setFont('helvetica', 'bold');
    doc.text('E. & O. E', 130, 100);


    const taxRows = this.invoiceDetails.taxItems.map(item => [
      item.hsnCode,
      formatNumber(item.taxableValue),
      formatNumber(item.centralTaxAmount),
      formatNumber(item.stateTaxAmount),
      formatNumber(item.totalTaxAmount)
    ]);

    const totalTaxable = this.invoiceDetails.taxItems.reduce((sum, item) => sum + item.taxableValue, 0);
    const totalCentral = this.invoiceDetails.taxItems.reduce((sum, item) => sum + item.centralTaxAmount, 0);
    const totalState = this.invoiceDetails.taxItems.reduce((sum, item) => sum + item.stateTaxAmount, 0);
    const totalTaxAmount = this.invoiceDetails.taxItems.reduce((sum, item) => sum + item.totalTaxAmount, 0);

    autoTable(doc, {
      startY: 105,
      theme: 'grid',
      head: [['HSN', 'Taxable Value', 'Central Tax', 'State Tax', 'Total Amount']],
      body: taxRows,
      foot: [
        [
          { content: 'Total', styles: { fontStyle: 'bold', halign: 'right' } },
          { content: formatNumber(totalTaxable), styles: { fontStyle: 'bold' } },
          { content: formatNumber(totalCentral), styles: { fontStyle: 'bold' } },
          { content: formatNumber(totalState), styles: { fontStyle: 'bold' } },
          { content: formatNumber(totalTaxAmount), styles: { fontStyle: 'bold' } }
        ]
      ],
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        halign: 'center',
        valign: 'middle'
      },
      footStyles: {
        fillColor: [255, 255, 255],
        fontStyle: 'bold',
        textColor: 20,
        halign: 'right'
      },
      styles: {
        fontSize: 9,
        lineColor: [0, 0, 0],
        lineWidth: 0.2,
        cellPadding: 3,
        halign: 'right',
        valign: 'middle'
      },
      tableWidth: 90,
      margin: { left: 60 },
    });

    doc.setFont('helvetica','normal');
    doc.setFontSize(10);
    doc.text('Tax Amount  (in words):',64,155)
    doc.text('INR Five thousand nine hundred Only',64,160)
    doc.text('Payment Type: Cash',64,165)
    doc.text('Total Weight: 0.2kg',64,170)

    doc.setFont('helvetica','bold');
    doc.text("Company's Bank Details",64,178)
    doc.setFont('helvetica','normal');
    doc.text('Bank Name: Axis Bank',64,183)
    doc.text('A/c No : 00000000',64,188)
    doc.text('Branch & IFS CODE : 357657',64,193)


    doc.rect(65,198,80,46)
    doc.setFontSize(8);
    doc.setFont('helvetica','bold');
    doc.text(`Sub Total : ${this.invoiceDetails.subTotal}`,70,204)
    doc.text(`Discount: ${this.invoiceDetails.discount}`,70,209)
    doc.text(`Transport Charges: ${this.invoiceDetails.transportCharges}`,70,214)
    doc.text(`Loading Charges : ${this.invoiceDetails.loadingCharges}`,70,219)
    doc.text(`UnLoading Charges : ${this.invoiceDetails.unloadingCharges}`,70,224)
    doc.setFillColor(0, 0, 0); // RGB for black
    doc.rect(68, 227, 75, 5, 'F'); // Adjust width & height as needed
    doc.setTextColor(255, 255, 255);
    doc.text(`Total Amount : ${this.invoiceDetails.totalAmount}`,70,230)
    doc.setTextColor(0, 0, 0);
    doc.text(`Paid Amount (19/07/2025) : ${this.invoiceDetails.paidAmount}`,70,235)
    doc.text(`Remaining Amount : ${this.invoiceDetails.remainingAmount}`,70,240)


    doc.line(110, 264, 150, 264);
    doc.setFontSize(8);
    doc.setFont('helvetica','bold');
    doc.text("Authorised signatory",114,268)

    doc.text("This is a Computer Generated Invoice",pageWidth / 2, 292, { align: 'center' })
    // doc.setFontSize(16);
    // doc.setFont('helvetica', 'bold');
    // doc.text('5,537.35', 125, 212);


    // doc.line(60, 216, 150, 216);





















    // doc.text("3. NO CLAIM SHALL BE ENTERTAINED AFTER PLAYING THE TILES",margin+3,272)
    // doc.text("4. Returns of goods will be accepted within 7 days from the date of purchase.",margin+3,276)
    doc.save(`Invoice_${invoice.invoiceId}.pdf`);
  }

}