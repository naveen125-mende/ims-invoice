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
    doc.setFillColor(53, 53, 53); // Light gray
    doc.rect(10, 10, pageWidth - 20, 30, 'F'); // x, y, width, height, style 'F' for filled
    //Logo Image


    doc.addImage(imageUrl, 'JPEG', 155, 5, 38, 10);

    // ...existing code...
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text('Credit-Note Settle Invoice', pageWidth - 15, 18, { align: 'right' });

    doc.setFontSize(12);
    doc.text(`Invoice #: ${downloadData.invoiceData.invoiceId}`, pageWidth - 15, 24, { align: 'right' });
    doc.text(`Date: ${downloadData.invoiceData.invoiceDate}`, pageWidth - 15, 30, { align: 'right' });
    doc.text(`GSTIN: ${downloadData.invoiceData.store.gstin}`, pageWidth - 15, 36, { align: 'right' });

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
    doc.setFontSize(12);
    doc.text(downloadData.billedBy.name, col1X, sectionY + lineGap);
    doc.setFontSize(10);
    doc.setTextColor(53, 53, 53);
    doc.text('Nizamabad IT Hub', col1X, sectionY + lineGap * 2);
    doc.text(`Phone: ${downloadData.billedBy.contactNumber}`, col1X, sectionY + lineGap * 3);
    doc.text(`Email: ${downloadData.billedBy.email}`, col1X, sectionY + lineGap * 4);
    doc.text(`GSTIN: ${downloadData.invoiceData.store.gstin}`, col1X, sectionY + lineGap * 5);

    // BILLED TO
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0); // Black color
    doc.text('BILLED TO', col2X, sectionY);
    doc.setFontSize(12);
    doc.text(downloadData.billedTo.name, col2X, sectionY + lineGap);
    doc.setFontSize(10);
    doc.setTextColor(53, 53, 53);
    doc.text(`Phone: ${downloadData.billedTo.contactNumber}`, col2X, sectionY + lineGap * 2);
    doc.text(`Email: ${downloadData.billedTo.email}`, col2X, sectionY + lineGap * 3);
    doc.text(`GSTIN: ${downloadData.invoiceData.customer.gstin}`, col2X, sectionY + lineGap * 4);

    // INVOICE Details
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0); // Black color
    doc.text('INVOICE Details', col3X, sectionY);
    doc.setFontSize(12);
    doc.text(downloadData.invoiceData.invoiceId, col3X, sectionY + lineGap);
    doc.setFontSize(10);
    doc.setTextColor(53, 53, 53);
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
    doc.setDrawColor(238, 238, 238);   // Blue color
    doc.setLineWidth(0.5);           // Thickness of 1.5 units
    doc.line(10, 80, pageWidth - 10, 80);
    const totalQuantity = this.invoiceDetails.saleItems.reduce((sum: number, item: any) => {
      return sum + item.quantity;
    }, 0);

    autoTable(doc, {
      startY: 83,
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
      tableWidth: 190,
      margin: { left: 10 },
      didDrawCell: function (data) {
        // Check if we are in the header and Amount column (index 8)
        if (data.section === 'head' && data.column.index === 8) {
          data.cell.styles.halign = 'right';
        }
      }
    });


    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);
    doc.setTextColor(53, 53, 53);
    doc.text('Amount  (in words):', 10, 120)
    doc.text('INR Five thousand nine hundred', 10, 126)

    doc.setTextColor(0);
    const bottomMargin = 10;
    const footerStartY = pageHeight - bottomMargin - 62;




    doc.setFont('helvetica', 'bold');
    doc.text('Authorization', pageWidth / 4 + 50, footerStartY - 80);
    doc.setDrawColor(238, 238, 238);   // Blue color
    doc.setLineWidth(0.5);           // Thickness of 1.5 units
    doc.line(100, footerStartY - 60, pageWidth - 10, footerStartY - 60);

    doc.setFont('helvetica', 'normal');
    doc.text("Receiver's Signature", pageWidth / 4 + 50, footerStartY - 55);
    doc.text('Authorised Signatory', pageWidth / 4 + 100, footerStartY - 55);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('Terms and Conditions:', 10, footerStartY + 32);

    doc.setFont('helvetica', 'normal');
    doc.text('1. Good once sold will not be taken back or exchanged.', 10, footerStartY + 38);
    doc.text('2. Subject to local jurisdiction only.', 10, footerStartY + 43);
    doc.setFont('helvetica', 'bold');
    doc.text('3. NO CLAIM SHALL BE ENTERTAINED AFTER LEAVING THE TILES', 10, footerStartY + 48);
    doc.setFont('helvetica', 'normal');
    doc.text('4. Returns of goods will be accepted within 7 days from the date of purchase.', 10, footerStartY + 53);

    doc.setDrawColor(238, 238, 238);   // Blue color
    doc.setLineWidth(0.5);           // Thickness of 1.5 units
    doc.line(10, footerStartY + 57, pageWidth - 10, footerStartY + 57);

    doc.setFont('helvetica', 'bold');
    doc.text('Thank you for your business!', pageWidth / 2, footerStartY + 65, { align: 'center' });

    doc.save(`Invoice_${downloadData.invoiceData.invoiceId}.pdf`);
  }
}