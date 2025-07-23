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
    doc.text('Credit-Note Settle Invoice', pageWidth / 2, 15, { align: 'center' });

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



    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Amount  (in words):', 6, 176)
    doc.text('INR Five thousand nine hundred', 6, 182)

    // === Remaining Info ===
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);



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