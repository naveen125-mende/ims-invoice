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

    doc.setFontSize(12);
    doc.setFont('helvetica','bold');
    doc.text('TAX INVOICE', pageWidth / 2, 10, { align: 'center' });
    doc.rect(4,15,pageWidth-8,69);
    doc.setFontSize(10);
    doc.setFont('helvetica','bold');
    doc.text('devlats pvt ltd',6, 20,);
    doc.setFont('helvetica','normal');
    doc.text('Devlats',6, 24);
    doc.text('Nizamabad It Hub', 6, 28);
    doc.text('Mobile No: 9182029402, 9182029402', 6,32);
    doc.text('Email:info@devlats.com', 6, 36);
    doc.text(`GSTIN/UIN : ${this.invoiceDetails.gstin}`, 6,40);
    // const imageBase64 = await this.getImageAsBase64(imageUrl);
    // doc.addImage(imageBase64, 'JPEG', 17, 28, 16, 16);
    doc.setFont('helvetica','bold');     
    doc.text('Buyer',6, 50, );
    doc.text('Ganesh Ebterprises', 6, 54);
     doc.setFont('helvetica','normal');
    doc.text('Ganesh', 6,58 );
    doc.text('Near Bus Stand Nizamabad', 6, 62);
    doc.text('Mobile No: 919876543210', 6,66);
     doc.text('Email:info@ganesh.com', 6,70);
    doc.text(`GSTIN/UIN : ${this.invoiceDetails.gstin}`, 6,74);
    
    doc.setFont('helvetica','bold');
    doc.rect((pageWidth/2)+9, 42,46 ,14);
    doc.text(`Invoice No. `, (pageWidth/2)+12, 48);
    doc.text(`64`, (pageWidth/2) + 12, 53);
    doc.rect((pageWidth/2)+9, 56,46 ,14);
    doc.text(`Invoice No. `, (pageWidth/2)+12, 62);
    doc.text(`64`, (pageWidth/2) + 12, 67);
    doc.rect((pageWidth/2)+9, 70,46 ,14);
    doc.text(`Invoice No. `, (pageWidth/2)+12, 76);
    doc.text(`64`, (pageWidth/2) + 12, 81);
    doc.rect((pageWidth/2)+55, 42,46 ,14);
    doc.text(`Invoice No. `, (pageWidth/2)+58, 48);
    doc.text(`64`, (pageWidth/2)+58, 53);
    doc.rect((pageWidth/2)+55, 56,46 ,14);
    doc.text(`Invoice No. `, (pageWidth/2)+58, 62);
    doc.text(`64`, (pageWidth/2) +58, 67);
    doc.rect((pageWidth/2) + 55, 70,46 ,14);
    doc.text(`Invoice No. `, (pageWidth/2) + 58, 76);
    doc.text(`64`, (pageWidth/2) + 58, 81);

   

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
        fillColor: [230, 230, 230],
        textColor: 0,
        halign: 'center'
      },
      styles: {
        fontSize: 9,
        cellPadding: 3
      },
      tableWidth: 198,
      margin: { left:6},

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
    doc.setFont('helvetica','bold');
    doc.text('E. & O. E', 190, 135);

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
      columnStyles: {
        1: { halign: 'right' },
        3: { halign: 'right' },
        5: { halign: 'right' },
        6: { halign: 'right' }
      },
      tableWidth: 198,
      margin: { left:6},
    });
    doc.setFont('helvetica','normal');
    doc.setFontSize(10);
    doc.text('Tax Amount  (in words):',6,196)
    doc.text('INR Five thousand nine hundred Only',6,202)
    doc.text('Payment Type: Cash',6,208)
    doc.text('Total Weight: 0.2kg',6,214)
    doc.setFont('helvetica','bold');
    doc.text("Company's Bank Details",6,224)
    doc.setFont('helvetica','normal');
    doc.text('Bank Name: Axis Bank',6,230)
    doc.text('A/c No : 00000000',6,236)
    doc.text('Branch & IFS CODE : 357657',6,242)
    doc.setFontSize(8);
    doc.setFont('helvetica','bold');
    doc.text(`Sub Total : ${this.invoiceDetails.subTotal}`,155,196)
    doc.text(`Discount: ${this.invoiceDetails.discount}`,155,202)
    doc.text(`Transport Charges: ${this.invoiceDetails.transportCharges}`,155,208)
    doc.text(`Loading Charges : ${this.invoiceDetails.loadingCharges}`,155,214)
    doc.text(`UnLoading Charges : ${this.invoiceDetails.unloadingCharges}`,155,220)
    doc.text(`Total Amount : ${this.invoiceDetails.totalAmount}`,155,226)
    doc.text(`Paid Amount (19/07/2025) : ${this.invoiceDetails.paidAmount}`,155,232)
    doc.text(`Remaining Amount : ${this.invoiceDetails.remainingAmount}`,155,238
)
    doc.setFont('helvetica','bold');
    doc.setFontSize(10);
    doc.text('For National Entreprises',158,254)
    doc.line(155, 264, 195, 264);
    doc.setFontSize(8);
    doc.setFont('helvetica','bold');
    doc.text("Authorised signatory",162,268)
    doc.rect(4,276,202,12);
    doc.text("Declaration",8,280)
    doc.setFont('helvetica','normal');
    doc.text("We declare that this invoice shows the actual ptice of the goods described and that all particulars are true and correct.",8,284)
    doc.text("This is a Computer Generated Invoice",pageWidth / 2, 292, { align: 'center' })
    // doc.text("3. NO CLAIM SHALL BE ENTERTAINED AFTER PLAYING THE TILES",margin+3,272)
    // doc.text("4. Returns of goods will be accepted within 7 days from the date of purchase.",margin+3,276)
    doc.save(`Invoice_${invoice.invoiceId}.pdf`);
  }

}