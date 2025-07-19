import { Component } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { InvoiceDetails } from './constants';
import { async } from 'rxjs';
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
    const imageUrl = '../../public/assets/images/devlats_logo.png';
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(32, 34, 36);
    doc.setTextColor(0, 0, 0);

    // Draw background color rectangle for header area
    doc.setFillColor(0, 112, 192); // Light gray
    doc.rect(10, 10, pageWidth - 20, 30, 'F'); // x, y, width, height, style 'F' for filled
    //Logo Image


    doc.addImage(imageUrl, 'JPEG', 155, 5, 38, 10);

    // ...existing code...
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text('TAX INVOICE', pageWidth - 15, 18, { align: 'right' });

    doc.setFontSize(12);
    doc.text(`Invoice #: ${downloadData.invoiceData.invoiceId}`, pageWidth - 15, 24, { align: 'right' });
    doc.text(`Date: ${downloadData.invoiceData.invoiceDate}`, pageWidth - 15, 30, { align: 'right' });
    doc.text(`GSTIN: ${downloadData.invoiceData.store.gstin}`, pageWidth - 15, 36, { align: 'right' });
    // ...existing code...
    // ...existing code...

    // ...existing code...

    // Column positions
    const col1X = 10;
    const col2X = 90;
    const col3X = 155;
    const sectionY = 50;
    const lineGap = 5;

    // BILLED BY
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0); // Black color
    doc.text('BILLED BY', col1X, sectionY);
    doc.text(downloadData.billedBy.name, col1X, sectionY + lineGap);
    doc.setFontSize(10);
    doc.text('Nizamabad IT Hub', col1X, sectionY + lineGap * 2);
    doc.text(`Phone: ${downloadData.billedBy.contactNumber}`, col1X, sectionY + lineGap * 3);
    doc.text(`Email: ${downloadData.billedBy.email}`, col1X, sectionY + lineGap * 4);
    doc.text(`GSTIN: ${downloadData.invoiceData.store.gstin}`, col1X, sectionY + lineGap * 5);

    // BILLED TO
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0); // Black color
    doc.text('BILLED TO', col2X, sectionY);
    doc.text(downloadData.billedTo.name, col2X, sectionY + lineGap);
    doc.setFontSize(10);
    doc.text(`Phone: ${downloadData.billedTo.contactNumber}`, col2X, sectionY + lineGap * 2);
    doc.text(`Email: ${downloadData.billedTo.email}`, col2X, sectionY + lineGap * 3);
    doc.text(`GSTIN: ${downloadData.invoiceData.customer.gstin}`, col2X, sectionY + lineGap * 4);

    // INVOICE Details
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0); // Black color
    doc.text('INVOICE Details', col3X, sectionY);
    doc.text(downloadData.invoiceData.invoiceId, col3X, sectionY + lineGap);
    doc.setFontSize(10);
    doc.text(`Date: ${downloadData.invoiceData.invoiceDate}`, col3X, sectionY + lineGap * 2);
    doc.text(`Payment Mode: ${downloadData.invoiceData.paymentMode}`, col3X, sectionY + lineGap * 3);
    doc.text(`Total Weight: ${downloadData.invoiceData.totalWeight} kg`, col3X, sectionY + lineGap * 4);
    // ...existing code...

    const itemRows: any[] = [];
    let rowIndex = 1;
    let totalAmount = 0;

    this.invoiceDetails.saleItems.forEach((saleItem: any) => {
      saleItem.item.forEach((itm: any) => {
        const rowTotal = saleItem.quantity * saleItem.salePrice;
        totalAmount += rowTotal;
        itemRows.push([
          rowIndex++,
          itm.itemName,
          itm.hsnCode,
          itm.quality?.qualityName || '-',
          saleItem.quantity,
          itm.unit?.unitShortName || 'kg',
          saleItem.salePrice.toFixed(2),
          saleItem.discount + '%',
          rowTotal.toFixed(2)
        ]);
      });
    });

    const totalQuantity = this.invoiceDetails.saleItems.reduce((sum: number, item: any) => {
      return sum + item.quantity;
    }, 0);

    autoTable(doc, {
      startY: 80,
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
      tableWidth: 190,
      margin: { left: 10 },
      foot: [
        [
          '', '', '', '', '', '', '', // 7 empty cells
          { content: 'Total', styles: { halign: 'right', fontStyle: 'bold' } }, // 8th cell
          totalAmount.toFixed(2) // 9th cell (amount total)
        ]
      ],

      footStyles: {
        fillColor: [230, 230, 230],
        fontStyle: 'bold',
        textColor: 20,
        halign: 'right'
      }
    });


    const formatNumber = (num: number): string => {
      return num.toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    };

    // Correct the body: include all 5 columns
    const taxRows = this.invoiceDetails.taxItems.map(item => [
      item.hsnCode,
      formatNumber(item.taxableValue),
      formatNumber(item.centralTaxAmount),
      formatNumber(item.stateTaxAmount),
      formatNumber(item.totalTaxAmount)
    ]);

    // Totals
    const totalTaxable = this.invoiceDetails.taxItems.reduce((sum, item) => sum + item.taxableValue, 0);
    const totalCentral = this.invoiceDetails.taxItems.reduce((sum, item) => sum + item.centralTaxAmount, 0);
    const totalState = this.invoiceDetails.taxItems.reduce((sum, item) => sum + item.stateTaxAmount, 0);
    const totalTaxAmount = this.invoiceDetails.taxItems.reduce((sum, item) => sum + item.totalTaxAmount, 0);

    autoTable(doc, {
      startY: 124,
      theme: 'grid',
      head: [['HSN/SAC', 'Taxable Value', 'Central Tax', 'State Tax', 'Total Tax Amount']],
      body: taxRows,

      // Correct footer: 5 fields, totals aligned
      foot: [[
        { content: 'Total', styles: { fontStyle: 'bold', halign: 'right' } },
        { content: formatNumber(totalTaxable), styles: { fontStyle: 'bold' } },
        { content: formatNumber(totalCentral), styles: { fontStyle: 'bold' } },
        { content: formatNumber(totalState), styles: { fontStyle: 'bold' } },
        { content: formatNumber(totalTaxAmount), styles: { fontStyle: 'bold' } }
      ]],

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
        2: { halign: 'right' },
        3: { halign: 'right' },
        4: { halign: 'right' }
      },
      tableWidth: 120,
      margin: { left: 10 }
    });

    doc.rect(135,124,65,68)
    doc.text("Sub Total", 140,132);
    doc.text(`${this.invoiceDetails.subTotal}`, 180,132);
    doc.text("Discont", 140,140);
    doc.text(`${this.invoiceDetails.discount}`, 180,140);
    doc.text("Transport Charges", 140,148);
    doc.text(`${this.invoiceDetails.transportCharges}`, 180,148);
    doc.text("Loading Charges", 140,156);
    doc.text(`${this.invoiceDetails.loadingCharges}`, 180,156);
    doc.text("UnLoading Charges", 140,162);
    doc.text(`${this.invoiceDetails.unloadingCharges}`, 180,162);
    doc.text("Total Amount", 140,170);
    doc.text(`${this.invoiceDetails.totalAmount}`, 180,170);
    doc.text("Paid Amount", 140,178);
    doc.text(`${this.invoiceDetails.paidAmount}`, 180,178);
    doc.text("Remaining Amount", 140,186);
    doc.text(`${this.invoiceDetails.remainingAmount}`, 180,186);

    const bottomMargin = 10;
    const footerStartY = pageHeight - bottomMargin - 62;

    doc.setFont('helvetica', 'bold');
    doc.text("Company's Bank Details", 15, footerStartY);

    doc.setFont('helvetica', 'normal');
    doc.setDrawColor(180, 180, 180);
    doc.setFillColor(230, 240, 255); // Light blue background
    doc.rect(15, footerStartY + 3, 80, 22, 'F'); // Bank box with fill
    doc.text('Bank Name: Axis Bank', 18, footerStartY + 10);
    doc.text('A/C No.: 0000000000', 18, footerStartY + 15);
    doc.text('Branch & IFS Code: 357657', 18, footerStartY + 20);

    doc.setFont('helvetica', 'bold');
    doc.text('Authorization', pageWidth / 4 + 60, footerStartY);

    doc.setFont('helvetica', 'normal');
    doc.text("Receiver's Signature", pageWidth / 4 + 60, footerStartY + 22);
    doc.text('Authorised Signatory', pageWidth / 4 + 100, footerStartY + 22);

    doc.setFont('helvetica', 'bold');
    doc.text('Terms and Conditions:', 15, footerStartY + 32);

    doc.setFont('helvetica', 'normal');
    doc.text('1. Good once sold will not be taken back or exchanged.', 15, footerStartY + 38);
    doc.text('2. Subject to local jurisdiction only.', 15, footerStartY + 43);
    doc.setFont('helvetica', 'bold');
    doc.text('3. NO CLAIM SHALL BE ENTERTAINED AFTER LEAVING THE TILES', 15, footerStartY + 48);
    doc.setFont('helvetica', 'normal');
    doc.text('4. Returns of goods will be accepted within 7 days from the date of purchase.', 15, footerStartY + 53);

    doc.setFont('helvetica', 'bold');
    doc.text('Thank you for your business!', pageWidth / 2, pageHeight - 10, { align: 'center' });

    doc.save(`Invoice_${downloadData.invoiceData.invoiceId}.pdf`);
  }
}