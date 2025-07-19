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
    doc.text('TAX INVOICE', pageWidth / 2, 15, { align: 'center' });

    doc.setFontSize(10);
    doc.text(`GSTIN/UIN:${invoice.gstin}`, 10, 15);
    doc.text(`Orginal/Recipient`, 170, 15);
    // const imageBase64 = await this.getImageAsBase64(imageUrl);
    // doc.addImage(imageBase64, 'JPEG', 17, 28, 16, 16);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text(`Devlats`, pageWidth / 2, 22, { align: 'center' })
    doc.setFont('helvetica', 'normal');
    doc.text(`Nizambad It Hub`, pageWidth / 2, 26, { align: 'center' })
    doc.text(`Mobile No: 9182029402, 9182029402`, pageWidth / 2, 30, { align: 'center' })
    doc.text(`Email:info@devlats.com`, pageWidth / 2, 34, { align: 'center' })

    doc.setFontSize(9);
    doc.rect(margin, 40, 62, 24);
    doc.text(`Billed By: Devlats`, margin + 2, 45);
    doc.text(`Phone: ${billedBy.contactNumber}`, margin + 2, 50);
    doc.text(`Email: ${billedBy.email || '-'}`, margin + 2, 55);
    doc.text(`GST No: ${invoice.store.gstNumber || '-'}`, margin + 2, 60);
    doc.rect(72, 40, 62, 24);
    doc.text(`Billed To: ${billedTo.name}`, 75, 45);
    doc.text(`Phone: ${billedTo.contactNumber}`, 75, 50);
    doc.text(`Email: ${billedTo.email || '-'}`, 75, 55);
    doc.text(`GST No: ${invoice.customer.gstNo || '-'}`, 75, 60);
    doc.rect(134, 40, 62, 24);
    doc.text(`Invoice No: ${invoice.invoiceId}`, 137, 45);
    doc.text(`Date: ${formatDate(invoice.invoiceDate)}`, 137, 50);
    doc.text(`Total Weight: ${invoice.weight} kg`, 137, 55);
    doc.text(`Payment Mode: ${payments[0]?.paymentMode?.paymentModeName || '-'}`, 137, 60);

    doc.rect(margin, 64, 186, 10);
    doc.text('Notes :', margin + 2, 70);

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
      startY: 78,
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
      tableWidth: 187,
      margin: { left: 10 },

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
    doc.text('E. & O. E', 184, 123);

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
      startY: 125,
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
      margin: { left: 10 },
      tableWidth: 187
    });
    doc.setFont('helvetica','normal');
    doc.setFontSize(10);
    doc.text('Tax Amount  (in words) :',margin,182)
    doc.text('INR Five thousand nine hundred Only :',margin,188)
    doc.setFont('helvetica','bold');
    doc.text("Company's Bank Details",margin,200)
    doc.setFont('helvetica','normal');
    doc.text('Bank Name: Axis Bank',margin,206)
    doc.text('A/c No : 00000000',margin,212)
    doc.text('Branch & IFS CODE : 357657',margin,218)
    doc.setFontSize(8);
    doc.setFont('helvetica','bold');
    doc.text(`Sub Total : ${this.invoiceDetails.subTotal}`,155,182)
    doc.text(`Discount: ${this.invoiceDetails.discount}`,155,187)
    doc.text(`Transport Charges: ${this.invoiceDetails.transportCharges}`,155,192)
    doc.text(`Loading Charges : ${this.invoiceDetails.loadingCharges}`,155,197)
    doc.text(`UnLoading Charges : ${this.invoiceDetails.unloadingCharges}`,155,202)
    doc.text(`Total Amount : ${this.invoiceDetails.totalAmount}`,155,208)
    doc.text(`Paid Amount : ${this.invoiceDetails.paidAmount}`,155,213)
    doc.text(`Remaining Amount : ${this.invoiceDetails.remainingAmount}`,155,218
)
    doc.setFont('helvetica','bold');
    doc.setFontSize(12);
    doc.text('For Your Company Name',margin,250)
    doc.line(120, 246, 150, 246);
    doc.line(165, 246, 195, 246);
    doc.setFontSize(8);
    doc.setFont('helvetica','bold');
    doc.text("Reciever's Signature",120,250)
    doc.text("Authorised signatory",165,250)
    doc.rect(margin,255,187,25);
    doc.text("Terms & Conditions :-",margin+2,260)
    doc.setFont('helvetica','normal');
    doc.text("1. Good once solid will not be taken back or exchanged.",margin+3,264)
    doc.text("2. Subject to local jurisdiction only",margin+3,268)
    doc.text("3. NO CLAIM SHALL BE ENTERTAINED AFTER PLAYING THE TILES",margin+3,272)
    doc.text("4. Returns of goods will be accepted within 7 days from the date of purchase.",margin+3,276)
    doc.save(`Invoice_${invoice.invoiceId}.pdf`);
  }

}