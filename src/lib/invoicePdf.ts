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
  tcs_amount?: number | null;
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
  logo_url: string | null;
  enable_tcs: boolean | null;
  tcs_percent: number | null;
}

interface GeneratePDFParams {
  invoice: Invoice;
  items: InvoiceItem[];
  settings: BusinessSettings | null;
  type: "sale" | "purchase";
}

// Helper function to format currency properly
function formatCurrency(amount: number): string {
  return `Rs. ${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export async function generateInvoicePDF({ invoice, items, settings, type }: GeneratePDFParams) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const centerX = pageWidth / 2;
  
  let yPos = 15;
  const leftColX = 14;
  const rightColX = pageWidth - 14;

  // Centered Logo (if available) - Increased size
  if (settings?.logo_url) {
    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = settings.logo_url!;
      });
      
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL('image/png');
      
      // Center the logo - increased size
      const logoWidth = 40;
      const logoHeight = 40;
      doc.addImage(dataURL, 'PNG', centerX - logoWidth / 2, yPos, logoWidth, logoHeight);
      yPos += logoHeight + 8;
    } catch (error) {
      console.error("Failed to load logo:", error);
    }
  }

  // Business Name (Left) & TAX INVOICE (Right)
  let leftY = yPos;
  let rightY = yPos;

  // Left column - Business Name and details
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(settings?.business_name || "Your Business", leftColX, leftY);
  leftY += 7;
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  if (settings?.business_address) {
    doc.text(settings.business_address, leftColX, leftY);
    leftY += 5;
  }
  if (settings?.phone) {
    doc.text(`Phone: ${settings.phone}`, leftColX, leftY);
    leftY += 5;
  }
  if (settings?.gstin) {
    doc.text(`GSTIN: ${settings.gstin}`, leftColX, leftY);
    leftY += 5;
  }
  
  // Right column - TAX INVOICE title and Invoice details
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  const title = type === "sale" ? "TAX INVOICE" : "PURCHASE INVOICE";
  doc.text(title, rightColX, rightY, { align: "right" });
  rightY += 7;
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Invoice #: ${invoice.invoice_number}`, rightColX, rightY, { align: "right" });
  rightY += 5;
  doc.text(`Date: ${format(new Date(invoice.invoice_date), "dd MMM yyyy")}`, rightColX, rightY, { align: "right" });
  rightY += 5;
  if (invoice.due_date) {
    doc.text(`Due: ${format(new Date(invoice.due_date), "dd MMM yyyy")}`, rightColX, rightY, { align: "right" });
    rightY += 5;
  }
  
  yPos = Math.max(leftY, rightY);

  // Party Info Box
  const partyLabel = type === "sale" ? "Bill To:" : "Supplier:";
  yPos += 10;
  
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
    formatCurrency(item.rate),
    item.tax_rate ? `${item.tax_rate}%` : "-",
    formatCurrency(item.total),
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
      5: { cellWidth: 28, halign: "right" },
      6: { cellWidth: 20, halign: "right" },
      7: { cellWidth: 32, halign: "right" },
    },
  });

  // Summary
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  const summaryX = pageWidth - 85;
  
  const subtotal = invoice.subtotal || 0;
  const taxAmount = invoice.tax_amount || 0;
  const discountAmount = invoice.discount_amount || 0;
  
  // Calculate TCS if enabled for sale invoices
  const useTcs = settings?.enable_tcs ?? false;
  const tcsRate = settings?.tcs_percent ?? 0;
  const tcsAmount = useTcs && type === "sale" && tcsRate > 0 
    ? ((subtotal - discountAmount + taxAmount) * tcsRate) / 100 
    : (invoice.tcs_amount || 0);
  
  const totalAmount = (invoice.total_amount || 0) + tcsAmount;
  const paidAmount = invoice.paid_amount || 0;
  const balanceDue = totalAmount - paidAmount;

  doc.setFontSize(10);
  let summaryY = finalY;
  
  doc.text("Subtotal:", summaryX, summaryY);
  doc.text(formatCurrency(subtotal), pageWidth - 14, summaryY, { align: "right" });
  summaryY += 6;
  
  if (discountAmount > 0) {
    doc.text("Discount:", summaryX, summaryY);
    doc.text(`-${formatCurrency(discountAmount)}`, pageWidth - 14, summaryY, { align: "right" });
    summaryY += 6;
  }
  
  doc.text("Tax:", summaryX, summaryY);
  doc.text(formatCurrency(taxAmount), pageWidth - 14, summaryY, { align: "right" });
  summaryY += 6;
  
  if (tcsAmount > 0) {
    doc.text(`TCS @ ${tcsRate}%:`, summaryX, summaryY);
    doc.text(formatCurrency(tcsAmount), pageWidth - 14, summaryY, { align: "right" });
    summaryY += 6;
  }
  
  summaryY += 2;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Total:", summaryX, summaryY);
  doc.text(formatCurrency(totalAmount), pageWidth - 14, summaryY, { align: "right" });
  summaryY += 8;
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Paid:", summaryX, summaryY);
  doc.text(formatCurrency(paidAmount), pageWidth - 14, summaryY, { align: "right" });
  summaryY += 6;
  
  doc.setFont("helvetica", "bold");
  doc.text("Balance Due:", summaryX, summaryY);
  doc.text(formatCurrency(balanceDue), pageWidth - 14, summaryY, { align: "right" });

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
