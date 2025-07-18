//   async generateJsPdf(downloadData: any): Promise<void> {
//     const baseURLimages = this.apiService.getApiEndpoint();

//     const doc = new jsPDF();
//     const pageWidth = doc.internal.pageSize.width;
//     const pageHeight = doc.internal.pageSize.height;

//     //Logo Image
//     // const logoImage = '../../../../assets/images/devlats-logo-smart.jpg';
//     // const logoImageBase64 = await this.getImageAsBase64(logoImage);
//     // doc.addImage(logoImageBase64, 'JPEG', 155, 5, 38, 10);

//     // Set fonts and colors
//     doc.setFont('helvetica', 'normal');
//     doc.setFontSize(12);
//     doc.setTextColor(32, 34, 36);
//     doc.setTextColor(0, 0, 0);

//     // GST DETAILS
//     doc.setTextColor(32, 34, 36);
//     doc.text('GST No : ', 17, 20);
//     doc.text('Cell No  : ', 17, 25);
//     doc.text('Invoice No    : ', 143, 20);
//     doc.text('Invoice Date : ', 143, 25);

//     doc.text(
//       downloadData.invoiceData.store.gstNumber
//         ? downloadData.invoiceData.store.gstNumber
//         : '',
//       37,
//       20
//     );
//     doc.text(downloadData.invoiceData.store.contactNumber, 37, 25);
//     doc.text(downloadData.invoiceData.invoiceId, 173, 20);
//     let invoiceDate;

//     switch (downloadData.invoiceType) {
//       case 'Purchase Invoice':
//         invoiceDate = downloadData.invoiceData.invoiceDate;
//         break;
//       case 'Return Invoice':
//         invoiceDate = downloadData.invoiceData.invoiceDate;
//         break;
//       case 'Estimation Invoice':
//         invoiceDate = downloadData.invoiceData.estimationDate;
//         break;
//       default:
//         invoiceDate = downloadData.invoiceData.invoiceDate;
//         break;
//     }
//     const formattedDate = invoiceDate
//       ? this.unixStampToDatePipe.transform(invoiceDate)
//       : '-';

//     doc.text(formattedDate, 173, 25);

//     const imageUrl = downloadData.invoiceData.store.organization.image
//       ? baseURLimages + downloadData.invoiceData.store.organization.image
//       : '../../../../assets/images/logo.jpg';

//     const imageBase64 = await this.getImageAsBase64(imageUrl);

//     doc.addImage(imageBase64, 'JPEG', 17, 28, 16, 16);

//     // Company Name (Centered)
//     doc.setFontSize(24);
//     doc.text(downloadData.invoiceData.store.storeName, pageWidth / 2, 33, {
//       align: 'center',
//     });

//     //Sub-heading (Centered)
//     doc.setFontSize(16);
//     doc.text(downloadData.invoiceType, pageWidth / 2, 41, { align: 'center' });

//     // Billed By section
//     doc.setFontSize(12);
//     doc.setFillColor(246, 250, 254);
//     doc.setDrawColor(0, 0, 0);
//     doc.roundedRect(15, 46, 83, 28, 5, 5, 'F');
//     doc.setTextColor(73, 133, 229);
//     doc.setFont('helvetica', 'bold');
//     doc.text('Billed By : ', 20, 54);
//     doc.setTextColor(0, 0, 0);
//     doc.setFont('helvetica', 'normal');
//     doc.text('Phone', 20, 63);
//     doc.text('Email', 20, 69);

//     const minWidth = 50;
//     const lines = doc.splitTextToSize(downloadData.billedBy.name, minWidth);
//     let currentY = 54;
//     const lineHeight = 5;
//     for (let i = 0; i < lines.length; i++) {
//       doc.text(lines[i], 42, currentY);
//       currentY += lineHeight;
//     }
//     doc.text(': ' + downloadData.billedBy.contactNumber, 34, 63);
//     doc.text(': ' + downloadData.billedBy.email, 34, 69);

//     //Billed To section
//     doc.setFontSize(12);
//     doc.setFillColor(246, 250, 254);
//     doc.setDrawColor(0, 0, 0);
//     doc.roundedRect(pageWidth - 105, 46, 88, 28, 5, 5, 'F');
//     doc.setTextColor(73, 133, 229);
//     doc.setFont('helvetica', 'bold');
//     doc.text('Billed To : ', pageWidth - 100, 54);
//     doc.setTextColor(0, 0, 0);
//     doc.setFont('helvetica', 'normal');
//     doc.text('Phone', pageWidth - 100, 63);
//     doc.text('Email', pageWidth - 100, 69);
//     doc.text(downloadData.billedTo.name, pageWidth - 78, 54);
//     doc.text(': ' + downloadData.billedTo.contactNumber, pageWidth - 86, 63);
//     doc.text(
//       ': ' + (downloadData.billedTo.email ? downloadData.billedTo.email : ''),
//       pageWidth - 86,
//       69
//     );

//     let startY = 78;
//     const headings = [
//       '#',
//       'Item Name',
//       'Brand/Quality',
//       'Quantity',
//       'Unit',
//       'Price',
//       'Amount',
//     ];

//     const saleHeadings = [
//       '#',
//       'Item Name',
//       'Brand/Quality',
//       'Quantity',
//       'Unit',
//       'Price',
//       'Discount',
//       'Amount',
//     ];

//     // Construct the table body
//     let s_no_counter = 1;
//     const tableBody = downloadData.invoiceItems.map((item: any) => {
//       if (downloadData.invoiceType === 'Sale Invoice') {
//         return [
//           s_no_counter++,
//           item.item.itemName,
//           item.item.quality.qualityName,
//           item.quantity,
//           item.unit,
//           item.price,
//           this.getItemDiscountValue(item),
//           item.totalAmount,
//         ];
//       } else {
//         return [
//           s_no_counter++,
//           item.item.itemName,
//           item.item.quality.qualityName,
//           item.quality,
//           item.unit,
//           item.price,
//           item.totalAmount,
//         ];
//       }
//     });

//     const rowHeight = 8; // Adjust this value as needed
//     let tableHeight = tableBody.length * 10;
//     const additionalContentHeight = pageHeight - startY - tableHeight;

//     let remainingHeight =
//       pageHeight - tableHeight - startY - additionalContentHeight;
//     const tableHeading =
//       downloadData.invoiceType === 'Sale Invoice' ? saleHeadings : headings;
//     autoTable(doc, {
//       head: [tableHeading],
//       body: tableBody,
//       startY,
//       headStyles: {
//         fillColor: [0, 112, 192],
//         textColor: 255,
//         cellPadding: 1.5,
//         halign: 'center',
//         valign: 'middle',
//       },
//       columnStyles: {
//         1: { cellWidth: 40 },
//       },
//       bodyStyles: {
//         halign: 'center',
//         valign: 'middle',
//         cellPadding: 3,
//       },
//       didDrawPage: function (data) {
//         if (data.cursor && data.cursor.y !== undefined) {
//           tableHeight = data.cursor.y;
//         }
//       },
//     });

//     // line
//     doc.setLineWidth(0.5); // Set the line thickness
//     doc.setDrawColor(245, 245, 245); // Set the line color (black)
//     doc.line(15, tableHeight + 2, pageWidth - 15, tableHeight + 2);

//     doc.text('Total', 30, tableHeight + 9);
//     doc.text(
//       downloadData.invoiceData.subTotal.toString(),
//       pageWidth - 25,
//       tableHeight + 9,
//       {
//         align: 'right',
//       }
//     );

//     const totalQuantity = downloadData.invoiceItems.reduce(
//       (sum: any, item: { quantity: any }) => sum + item.quantity,
//       0
//     );
//     const Id = downloadData.invoiceData.invoiceId;
//     const x = Id.startsWith('SID') ? 107 : 117; // 107 for Sale Invoice and 117  for Purchase Invoice and Return Invoice
//     doc.text(totalQuantity.toString(), x, tableHeight + 9);
//     // line
//     doc.setLineWidth(0.5); // Set the line thickness
//     doc.setDrawColor(245, 245, 245); // Set the line color (black)
//     doc.line(15, tableHeight + 12, pageWidth - 15, tableHeight + 12);

//     //paymentmode
//     if (remainingHeight < 50) {
//       if (tableHeight > 180) {
//         doc.addPage();
//         tableHeight = 10;
//       }
//     }

//     doc.text('Payments : ', 15, tableHeight + 20);
//     const payments = downloadData.payments.map((payment: any) => {
//       return [
//         this.unixStampToDatePipe.transform(payment.paymentDate),
//         payment.paymentMode.paymentModeName,
//         payment.amount,
//       ];
//     });

//     autoTable(doc, {
//       head: [['Date', 'Mode', 'Amount']],
//       body: payments,
//       startY: tableHeight + 23,
//       headStyles: {
//         fillColor: [0, 112, 192],
//         textColor: 255,
//         halign: 'center',
//         valign: 'middle',
//       },
//       bodyStyles: {
//         halign: 'center',
//         valign: 'middle',
//       },
//       columnStyles: {
//         0: { cellWidth: 25 },
//         1: { cellWidth: 25 },
//         2: { cellWidth: 25 },
//       },
//     });

//     const paymentsTableHeight = tableHeight + 23 + payments.length * 10;
//     doc.text('Total Weight : ', 15, paymentsTableHeight + 13);

//     doc.setFont('helvetica', 'bold');
//     doc.setTextColor(73, 133, 229);
//     doc.text(
//       `${downloadData.invoiceData.weight ? downloadData.invoiceData.weight : '0'} Kg`,
//       50,
//       paymentsTableHeight + 13
//     );

//     doc.setFont('helvetica', 'normal');
//     doc.setTextColor(0, 0, 0);

//     // if (
//     //   downloadData.invoiceType === 'Return Invoice' &&
//     //   downloadData.invoiceData.returnedInvoices.length > 0
//     // ) {
//     //   const dueInvoiceHeadings = ['#', 'Invoice Date', 'Invoice Id', 'Amount'];
//     //   const dueInvoiceData = downloadData.invoiceData.returnedInvoices.map(
//     //     (invoice: any, index: number) => {
//     //       return [
//     //         index + 1,
//     //         this.dateStringFormet(invoice.invoiceDate),
//     //         invoice.invoiceId,
//     //         invoice.usedAmount,
//     //       ];
//     //     }
//     //   );
//     //   doc.setFont('helvetica', 'bold');
//     //   doc.text('Due Invoices :', 15, tableHeight + 35);
//     //   doc.setFont('helvetica', 'normal');

//     //   autoTable(doc, {
//     //     head: [dueInvoiceHeadings],
//     //     body: dueInvoiceData,
//     //     tableWidth: 80,
//     //     startY: tableHeight + 40,
//     //     headStyles: {
//     //       fillColor: [73, 133, 229],
//     //       textColor: 255,
//     //       cellPadding: 2,
//     //       halign: 'center',
//     //       valign: 'middle',
//     //     },
//     //     bodyStyles: {
//     //       halign: 'center',
//     //       valign: 'middle',
//     //       cellPadding: 2.5,
//     //     },
//     //   });
//     // }

//     const details = [
//       { label: 'Sub Total ', value: downloadData.invoiceData.subTotal },
//       { label: 'Discount ', value: downloadData.invoiceData.discount },
//       {
//         label: 'Transport Charges ',
//         value: downloadData.invoiceData.transportCharges,
//       },
//       {
//         label: 'Loading Charges ',
//         value: downloadData.invoiceData.loadingCharges,
//       },
//       {
//         label: 'Unloading Charges ',
//         value: downloadData.invoiceData.unloadingCharges,
//       },
//     ];

//     details.forEach(detail => {
//       if (this.isNotZero(detail.value)) {
//         doc.text(detail.label, pageWidth - 100, tableHeight + 20);
//         doc.text(detail.value.toString(), pageWidth - 25, tableHeight + 20, {
//           align: 'right',
//         });
//         tableHeight += 8;
//       }
//     });

//     const detailsHeight = details.length * 10;

//     doc.setFillColor(73, 133, 229);
//     doc.rect(pageWidth - 105, tableHeight + 15, 85, 7, 'F');
//     doc.setTextColor(255, 255, 255);
//     const total =
//       downloadData.invoiceType === 'Return Invoice'
//         ? 'Total Returned'
//         : 'Total';
//     doc.text(total, pageWidth - 100, tableHeight + 20);
//     doc.text(
//       downloadData.invoiceType === 'Estimation Invoice'
//         ? downloadData.invoiceData.subTotal.toString()
//         : downloadData.invoiceData.totalAmount.toString(),
//       pageWidth - 25,
//       tableHeight + 20,
//       {
//         align: 'right',
//       }
//     );

//     doc.setTextColor(0, 0, 0);
//     if (this.isNotZero(downloadData.invoiceData.utilizedCreditBalance)) {
//       doc.text('Utilized Credit Balance', pageWidth - 100, tableHeight + 27);
//       doc.text(
//         downloadData.invoiceData.utilizedCreditBalance,
//         pageWidth - 25,
//         tableHeight + 27,
//         {
//           align: 'right',
//         }
//       );
//     }

//     const paidAmount = downloadData.invoiceData.paidAmount || '0';
//     const invoiceId = downloadData.invoiceData.invoiceId || '';

//     if (invoiceId.startsWith('RID') && !invoiceId.startsWith('EID')) {
//       if (this.isNotZero(paidAmount)) {
//         doc.text('Total returned', pageWidth - 100, tableHeight + 30);
//         doc.text(paidAmount.toString(), pageWidth - 25, tableHeight + 30, {
//           align: 'right',
//         });
//       } else {
//         tableHeight -= 8;
//       }
//     } else if (invoiceId.startsWith('SID') || invoiceId.startsWith('PID')) {
//       if (this.isNotZero(paidAmount)) {
//         doc.text('Paid Amount', pageWidth - 100, tableHeight + 28);
//         doc.text(paidAmount.toString(), pageWidth - 25, tableHeight + 28, {
//           align: 'right',
//         });
//       }
//     }

//     if (this.isNotZero(downloadData.invoiceData.remainingAmount)) {
//       doc.text(
//         `Due Amount ${downloadData.invoiceData.dueDate ? `(${this.unixStampToDatePipe.transform(downloadData.invoiceData.dueDate)})` : ''}`,
//         pageWidth - 100,
//         tableHeight + 35
//       );
//       doc.text(
//         downloadData.invoiceData.remainingAmount.toString(),
//         pageWidth - 25,
//         tableHeight + 35,
//         {
//           align: 'right',
//         }
//       );
//     }

//     if (downloadData.invoiceType === 'Estimation Invoice') {
//       tableHeight -= 15;
//       downloadData.invoiceData.totalAmount = downloadData.invoiceData.subTotal;
//     }

//     doc.text('Amount (in words):', pageWidth - 100, tableHeight + 43);
//     doc.setFontSize(10);
//     const totalInWords = doc.splitTextToSize(
//       this.getTotalInWords(downloadData.invoiceData.totalAmount),
//       70
//     );

//     let currentYPosition = tableHeight + 50;

//     totalInWords.forEach((line: string, index: number) => {
//       if (totalInWords.length === 1) {
//         doc.text(`(${line})`, pageWidth - 100, currentYPosition);
//       } else if (index === 0) {
//         doc.text(`(${line}`, pageWidth - 100, currentYPosition);
//       } else if (index === totalInWords.length - 1) {
//         doc.text(`${line})`, pageWidth - 100, currentYPosition);
//       } else {
//         doc.text(line, pageWidth - 100, currentYPosition);
//       }
//       currentYPosition += 6;
//     });

//     doc.setFontSize(12);

//     if (remainingHeight < additionalContentHeight && remainingHeight < 30) {
//       remainingHeight = pageHeight - startY - tableHeight + 20;
//       const pageCount = doc.internal.pages.length - 1;
//       if (pageCount < 2 && remainingHeight < detailsHeight) {
//         doc.addPage();
//         tableHeight = 0;
//       }
//     }

//     //signature Logo
//     const signatureImage =
//       baseURLimages + downloadData.invoiceData.store.signature;
//     const signatureImageBase64 = await this.getImageAsBase64(signatureImage);
//     doc.addImage(
//       signatureImageBase64,
//       'JPEG',
//       pageWidth - 70,
//       tableHeight + 58,
//       40,
//       14
//     );
//     const width = pageWidth - 60;
//     const storeName = downloadData.invoiceData.store.storeName;
//     const textWidth = storeName.length;
//     const xPosition = width - textWidth;
//     doc.text(`For: ${storeName}`, xPosition, tableHeight + 75, {
//       align: 'left',
//     });
//     doc.text('Authorized Signatory', pageWidth - 74, tableHeight + 80);

//     const termsAndConditions = AppConstant.termsAndConditions;

//     const termsHeight = termsAndConditions.length * rowHeight;
//     let pageCount = doc.internal.pages.length - 1;

//     if (remainingHeight < additionalContentHeight) {
//       startY = 10;
//       if (
//         tableHeight < 200 &&
//         pageCount < 2 &&
//         tableHeight > additionalContentHeight
//       ) {
//         doc.addPage();
//         tableHeight = 10;
//       } else if (termsHeight > remainingHeight - termsHeight && pageCount < 2) {
//         doc.addPage();
//       } else if (
//         remainingHeight < additionalContentHeight &&
//         pageCount < 2 &&
//         tableHeight < 50
//       ) {
//         doc.addPage();
//       }
//     }

//     doc.setFont('helvetica', 'bold');
//     doc.text('TERMS AND CONDITIONS', 15, pageHeight - termsHeight - 30);

//     doc.setFont('helvetica', 'normal');
//     termsAndConditions.forEach((term, index) => {
//       doc.text(
//         `• ${term}`,
//         15,
//         pageHeight - termsHeight + index * rowHeight - 20
//       );
//     });

//     // Pagination
//     pageCount = doc.internal.pages.length - 1;
//     for (let i = 1; i <= pageCount; i++) {
//       doc.setPage(i);
//       doc.setFontSize(10);
//       doc.setLineWidth(0.2);
//       doc.setDrawColor(0, 0, 0);
//       doc.line(15, pageHeight - 17, pageWidth - 15, pageHeight - 17);
//       const pagination = `Page ${i} of ${pageCount}`;
//       const textWidth = doc.getTextWidth(pagination);
//       doc.text(pagination, pageWidth - textWidth - 15, pageHeight - 12);
//     }

//     // Save the PDF
//     doc.save(`Invoice_${downloadData.invoiceData.invoiceId}.pdf`);
//   }