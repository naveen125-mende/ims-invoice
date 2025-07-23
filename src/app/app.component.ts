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
    doc.rect(6, 6, pageWidth - 12, 58,)
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Sale Invoice', pageWidth / 2, 15, { align: 'center' });

    doc.setFontSize(10);
    doc.text(`GSTIN/UIN:${invoice.gstin}`, 10, 15);
    doc.text(`Orginal/Recipient`, 170, 15);
    // const imageBase64 = await this.getImageAsBase64(imageUrl);
    // doc.addImage(imageBase64, 'JPEG', 17, 28, 16, 16);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`Devlats`, pageWidth / 2, 22, { align: 'center' })
    doc.setFont('helvetica', 'normal');
    doc.text(`Nizambad It Hub`, pageWidth / 2, 27, { align: 'center' })
    doc.text(`Mobile No: 9182029402, 9182029402`, pageWidth / 2, 32, { align: 'center' })
    doc.text(`Email:info@devlats.com`, pageWidth / 2, 37, { align: 'center' })

    doc.setFontSize(10);
    doc.rect(6, 40, 66, 24);
    doc.text(`Billed By: Devlats`, 10, 45);
    doc.text(`Phone: ${billedBy.contactNumber}`, 10, 50);
    doc.text(`Email: ${billedBy.email || '-'}`, 10, 55);
    doc.text(`GST No: ${invoice.store.gstNumber || '-'}`, 10, 60);
    doc.rect(72, 40, 66, 24);
    doc.text(`Billed To: ${billedTo.name}`, 76, 45);
    doc.text(`Phone: ${billedTo.contactNumber}`, 76, 50);
    doc.text(`Email: ${billedTo.email || '-'}`, 76, 55);
    doc.text(`GST No: ${invoice.customer.gstNo || '-'}`, 76, 60);
    doc.rect(138, 40, 66, 24);
    doc.text(`Invoice No: ${invoice.invoiceId}`, 142, 45);
    doc.text(`Date: ${formatDate(invoice.invoiceDate)}`, 142, 50);
    doc.text(`Total Weight: ${invoice.weight} kg`, 142, 55);
    doc.text(`Payment Mode: ${payments[0]?.paymentMode?.paymentModeName || '-'}`, 142, 60);

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
      startY: 70,
      head: [['Sr.No', 'Item Name', 'HSN/SAC', 'Brean/Qlt', 'Qty', 'Unit', 'Rate', 'Disc', 'Amount']],
      body: itemRows,
      theme: 'grid',
      headStyles: {
        fillColor: [222, 222, 222],
        textColor: 0,
        halign: 'right',
      },
      styles: {
        halign: 'right',
        fontSize: 10,
        textColor: 0,
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
    doc.text('E. & O. E', 188, 116);

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
      startY: 118,
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
      margin: { left: 6 },
      tableWidth: 198
    });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Tax Amount  (in words):', 59, 176)
    doc.setFont('helvetica', 'normal');
    doc.text('INR Five thousand nine hundred Only', 59, 182)
    doc.text('Payment Type: Cash', 59, 188)
    doc.text('Total Weight: 0.2kg', 59, 194)
    doc.setFont('helvetica', 'bold');
    doc.text("Company's Bank Details", 6, 176)
    doc.setFont('helvetica', 'normal');
    doc.text('Bank Name: Axis Bank', 6, 182)
    doc.text('A/c No : 00000000', 6, 188)
    doc.text('Branch & IFS CODE : 357657', 6, 194)
    doc.setFontSize(8);
    // === Main Summary Box ===
    doc.setFillColor(255, 255, 255); // Light background
    doc.setDrawColor(0, 0, 0);       // Border color
    doc.roundedRect(139, 174, 65, 68, 0, 0, 'FD'); // (x, y, w, h, rx, ry, Fill+Draw)

    // === Text inside box ===
    doc.setTextColor(0);
    doc.setFontSize(12);

    doc.text("Sub Total", 142, 182);
    doc.text(`${this.invoiceDetails.subTotal}`, 192, 182);

    doc.text("Discount", 142, 190);
    doc.text(`${this.invoiceDetails.discount}`, 199, 190);

    doc.text("Transport Charges", 142, 198);
    doc.text(`${this.invoiceDetails.transportCharges}`, 199, 198);

    doc.text("Loading Charges", 142, 206);
    doc.text(`${this.invoiceDetails.loadingCharges}`, 199, 206);

    doc.text("UnLoading Charges", 142, 214);
    doc.text(`${this.invoiceDetails.unloadingCharges}`, 199, 214);

    // === Total Amount Bar ===
    doc.setFillColor(53, 53, 53); // Dark gray background
    doc.roundedRect(141, 217, 61, 8, 0, 0, 'F'); // Rounded bar
    doc.setTextColor(255, 255, 255);
    doc.text("Total Amount", 142, 222);
    doc.text(`${this.invoiceDetails.totalAmount}`, 192, 222);

    // === Remaining Info ===
    doc.setTextColor(0, 0, 0);
    doc.text("Paid Amount", 142, 230);
    doc.setFontSize(8);
    doc.text("(20/06/2025)", 167, 229.5);
    doc.setFontSize(10);
    doc.text(`${this.invoiceDetails.paidAmount}`, 193.5, 230);

    doc.text("Remaining Amount", 142, 236);
    doc.text(`${this.invoiceDetails.remainingAmount}`, 199, 236);


    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('For Your Company Name', margin, 262)
    doc.line(120, 258, 150, 258);
    doc.line(165, 258, 195, 258);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text("Reciever's Signature", 120, 262)
    doc.text("Authorised signatory", 165, 262)
    doc.rect(6, 268, 198, 24);
    doc.text("Terms & Conditions :-", margin + 2, 273)
    doc.setFont('helvetica', 'normal');
    doc.text("1. Good once solid will not be taken back or exchanged.", margin + 3, 277)
    doc.text("2. Subject to local jurisdiction only", margin + 3, 281)
    doc.text("3. NO CLAIM SHALL BE ENTERTAINED AFTER PLAYING THE TILES", margin + 3, 285)
    doc.text("4. Returns of goods will be accepted within 7 days from the date of purchase.", margin + 3, 289)
    doc.save(`Invoice_${invoice.invoiceId}.pdf`);
  }

}