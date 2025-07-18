import { Component } from '@angular/core';
import { InvoiceDetails } from './constants';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatNumber } from '@angular/common';

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
    // // Header
    // doc.setFontSize(10);
    // doc.text('GSTIN/ UIN : 29AAACH7409R1ZX', margin, 10);
    // doc.setFontSize(16);
    // doc.text('Tax Invoice', 105, 10, { align: 'center' });

    // doc.setFontSize(10);
    // doc.text('Original/Recipient', 200 - margin, 10, { align: 'right' });

    // doc.addImage('/assets/logo.png', 'PNG', margin, 12, 25, 10); // Change path accordingly

    // doc.text('Devlats', margin, 25);
    // doc.text('Nizamabad IT Hub', margin, 30);
    // doc.text('Mobile No: 9182029042,9182029042', margin, 35);
    // doc.text('Email: info@devlats.com', margin, 40);

    // // Boxed Information
    // doc.setFontSize(9);
    // doc.rect(margin, 45, 90, 25);
    // doc.text('Billed By: Devlats', margin + 2, 50);
    // doc.text('Phone: 9182029042', margin + 2, 55);
    // doc.text('Email: info@devlats.com', margin + 2, 60);
    // doc.text('GSTIN/ UIN :29AAACH7409R1ZX', margin + 2, 65);

    // doc.rect(110, 45, 90, 25);
    // doc.text('Billed To: Ram', 112, 50);
    // doc.text('Phone: 9182020000', 112, 55);
    // doc.text('Email: ram@gmail.com', 112, 60);
    // doc.text('GSTIN/ UIN :99AAACH7409R1ZX', 112, 65);

    // doc.text('Date: Mar 7, 2019', margin, 75);
    // doc.text('Invoice No: 3', 80, 75);
    // doc.text('Payment Mode: CASH', 130, 75);
    // doc.text('Total Weight: 50 kg', 170, 75);

    // // Notes Section
    // doc.rect(margin, 80, 190, 10);
    // doc.text('Notes :', margin + 2, 86);

    // // Table 1 - Item Details
    // (doc as any).autoTable({
    //   startY: 92,
    //   head: [['Sr.No', 'Item Name', 'HSN/SAC', 'Brand/Qlt', 'Qty', 'Unit', 'Price', 'Dis%', 'Amount']],
    //   body: [
    //     ['1', 'Iron', '1005', 'A grade', '5', 'KG', '600', '0%', '3,000.00'],
    //     ['2', 'Birla', '1006', 'A grade', '5', 'KG', '500', '0%', '2,500.00'],
    //   ],
    //   styles: { fontSize: 8, halign: 'center' },
    //   headStyles: { fillColor: [0, 0, 0] },
    // });

    // // Table 2 - Tax Summary
    // (doc as any).autoTable({
    //   startY: (doc as any).lastAutoTable.finalY + 5,
    //   head: [['HSN/SAC', 'Taxable Value', 'Central tax Rate', 'Central tax Amount', 'State tax Rate', 'State tax Amount', 'Total Tax Amount']],
    //   body: [
    //     ['1005', '3,500.00', '10%', '350.00', '10%', '350.00', '700.00'],
    //     ['1006', '2,500.00', '10%', '250.00', '10%', '250.00', '500.00'],
    //     ['Total', '5,500.00', '', '600.00', '', '600.00', '5,500.00'],
    //   ],
    //   styles: { fontSize: 8, halign: 'center' },
    //   headStyles: { fillColor: [0, 0, 0] },
    // });

    // let y = (doc as any).lastAutoTable.finalY + 5;

    // // Amount in Words
    // doc.text('Tax Amount (in words): INR Five thousand nine hundred Only', margin, y);
    // y += lineHeight;

    // // Summary Table
    // const summary = [
    //   ['Sub Total', ': 5,500.00'],
    //   ['Discount', ': 0%'],
    //   ['Transport Charges', ': 200.00'],
    //   ['Loading Charges', ': 100.00'],
    //   ['Unloading Charges', ': 100.00'],
    //   ['Total Amount', ': 5,900.00'],
    //   ['Paid Amount', ': 5,900.00'],
    //   ['Remaining Amount', ': 00'],
    // ];
    // summary.forEach((row) => {
    //   doc.text(row[0], 140, y);
    //   doc.text(row[1], 180, y, { align: 'right' });
    //   y += lineHeight;
    // });

    // // Bank Details
    // y += 4;
    // doc.setFontSize(10);
    // doc.text("Company's Bank Details", margin, y);
    // y += lineHeight;
    // doc.text('Bank Name: Axis Bank', margin, y);
    // y += lineHeight;
    // doc.text('A/c No.: 0000000000', margin, y);
    // y += lineHeight;
    // doc.text('Branch & IFS Code: 357657', margin, y);

    // // Footer
    // y += 12;
    // doc.text('For Your Company Name', margin, y);
    // doc.text('Receiver Signature', 140, y);
    // doc.text('Authorised Signatory', 170, y);

    // y += lineHeight + 2;
    // doc.setFontSize(8);
    // doc.text('Terms & Conditions :-', margin, y);
    // const terms = [
    //   '1. Goods once sold will not be taken back or exchanged.',
    //   '2. Subject to local jurisdiction only.',
    //   '3. NO CLAIM SHALL BE ENTERTAINED AFTERLAYING THE TILES',
    //   '4. Returns of goods will be accepted within 7 days from the date of purchase.',
    // ];
    // terms.forEach((term, i) => {
    //   doc.text(term, margin + 4, y + (i + 1) * lineHeight);
    // });



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

    doc.setFontSize(16);
    doc.text('TAX INVOICE', pageWidth / 2, 15, { align: 'center' });

    doc.setFontSize(11);
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

    doc.text('Receiver Signature', 15, 285);
    doc.text('Authorized Signatory', pageWidth - 50, 285);
    doc.save(`Invoice_${invoice.invoiceId}.pdf`);
  }

}