import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";

interface InvoiceItem {
  item_name: string;
  quantity: number;
  rate: number;
  tax_rate: number | null;
  tax_amount: number | null;
  discount_amount: number | null;
  total: number;
  hsn_code: string | null;
  unit: string | null;
}

interface Invoice {
  id: string;
  invoice_number: string;
  invoice_date: string;
  due_date: string | null;
  total_amount: number | null;
  paid_amount: number | null;
  subtotal: number | null;
  tax_amount: number | null;
  discount_amount: number | null;
  status: string | null;
  notes: string | null;
  terms: string | null;
  parties?: {
    name: string;
    phone: string | null;
    email: string | null;
    billing_address: string | null;
    gstin: string | null;
  } | null;
}

interface BusinessSettings {
  business_name: string | null;
  gstin: string | null;
  phone: string | null;
  email: string | null;
  business_address: string | null;
}

interface GeneratePDFParams {
  invoice: Invoice;
  items: InvoiceItem[];
  settings: BusinessSettings | null;
  type: "sale" | "purchase";
}

export function generateInvoicePDF({ invoice, items, settings, type }: GeneratePDFParams) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text(settings?.business_name || "Your Business", 14, 20);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  let yPos = 28;
  
  if (settings?.business_address) {
    doc.text(settings.business_address, 14, yPos);
    yPos += 5;
  }
  if (settings?.phone) {
    doc.text(`Phone: ${settings.phone}`, 14, yPos);
    yPos += 5;
  }
  if (settings?.gstin) {
    doc.text(`GSTIN: ${settings.gstin}`, 14, yPos);
    yPos += 5;
  }

  // Invoice Title
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  const title = type === "sale" ? "TAX INVOICE" : "PURCHASE INVOICE";
  doc.text(title, pageWidth - 14, 20, { align: "right" });
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Invoice #: ${invoice.invoice_number}`, pageWidth - 14, 28, { align: "right" });
  doc.text(`Date: ${format(new Date(invoice.invoice_date), "dd MMM yyyy")}`, pageWidth - 14, 34, { align: "right" });
  if (invoice.due_date) {
    doc.text(`Due: ${format(new Date(invoice.due_date), "dd MMM yyyy")}`, pageWidth - 14, 40, { align: "right" });
  }

  // Party Info Box
  const partyLabel = type === "sale" ? "Bill To:" : "Supplier:";
  yPos = Math.max(yPos, 50) + 10;
  
  doc.setFillColor(245, 245, 245);
  doc.rect(14, yPos, pageWidth - 28, 30, "F");
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(partyLabel, 18, yPos + 8);
  
  doc.setFont("helvetica", "normal");
  doc.text(invoice.parties?.name || "Walk-in Customer", 18, yPos + 15);
  
  let partyY = yPos + 21;
  if (invoice.parties?.billing_address) {
    doc.text(invoice.parties.billing_address, 18, partyY);
    partyY += 5;
  }
  if (invoice.parties?.gstin) {
    doc.text(`GSTIN: ${invoice.parties.gstin}`, 18, partyY);
  }

  // Items Table
  yPos += 40;
  
  const tableData = items.map((item, index) => [
    (index + 1).toString(),
    item.item_name,
    item.hsn_code || "-",
    item.quantity.toString(),
    item.unit || "pcs",
    `₹${item.rate.toLocaleString()}`,
    item.tax_rate ? `${item.tax_rate}%` : "-",
    `₹${item.total.toLocaleString()}`,
  ]);

  autoTable(doc, {
    startY: yPos,
    head: [["#", "Item", "HSN", "Qty", "Unit", "Rate", "Tax", "Amount"]],
    body: tableData,
    theme: "striped",
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: 255,
      fontStyle: "bold",
    },
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: "auto" },
      2: { cellWidth: 25 },
      3: { cellWidth: 15, halign: "right" },
      4: { cellWidth: 15 },
      5: { cellWidth: 25, halign: "right" },
      6: { cellWidth: 20, halign: "right" },
      7: { cellWidth: 30, halign: "right" },
    },
  });

  // Summary
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  const summaryX = pageWidth - 80;
  
  const subtotal = invoice.subtotal || 0;
  const taxAmount = invoice.tax_amount || 0;
  const discountAmount = invoice.discount_amount || 0;
  const totalAmount = invoice.total_amount || 0;
  const paidAmount = invoice.paid_amount || 0;
  const balanceDue = totalAmount - paidAmount;

  doc.setFontSize(10);
  let summaryY = finalY;
  
  doc.text("Subtotal:", summaryX, summaryY);
  doc.text(`₹${subtotal.toLocaleString()}`, pageWidth - 14, summaryY, { align: "right" });
  summaryY += 6;
  
  if (discountAmount > 0) {
    doc.text("Discount:", summaryX, summaryY);
    doc.text(`-₹${discountAmount.toLocaleString()}`, pageWidth - 14, summaryY, { align: "right" });
    summaryY += 6;
  }
  
  doc.text("Tax:", summaryX, summaryY);
  doc.text(`₹${taxAmount.toLocaleString()}`, pageWidth - 14, summaryY, { align: "right" });
  summaryY += 8;
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Total:", summaryX, summaryY);
  doc.text(`₹${totalAmount.toLocaleString()}`, pageWidth - 14, summaryY, { align: "right" });
  summaryY += 8;
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Paid:", summaryX, summaryY);
  doc.text(`₹${paidAmount.toLocaleString()}`, pageWidth - 14, summaryY, { align: "right" });
  summaryY += 6;
  
  doc.setFont("helvetica", "bold");
  doc.text("Balance Due:", summaryX, summaryY);
  doc.text(`₹${balanceDue.toLocaleString()}`, pageWidth - 14, summaryY, { align: "right" });

  // Notes & Terms
  if (invoice.notes || invoice.terms) {
    summaryY += 15;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    
    if (invoice.notes) {
      doc.setFont("helvetica", "bold");
      doc.text("Notes:", 14, summaryY);
      doc.setFont("helvetica", "normal");
      doc.text(invoice.notes, 14, summaryY + 5, { maxWidth: 80 });
    }
    
    if (invoice.terms) {
      doc.setFont("helvetica", "bold");
      doc.text("Terms & Conditions:", 100, summaryY);
      doc.setFont("helvetica", "normal");
      doc.text(invoice.terms, 100, summaryY + 5, { maxWidth: 80 });
    }
  }

  // Save PDF
  doc.save(`${invoice.invoice_number}.pdf`);
}
