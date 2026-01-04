export function printPage() {
  window.print();
}

export function printElement(elementId: string, title?: string) {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id "${elementId}" not found`);
    return;
  }

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    console.error('Could not open print window');
    return;
  }

  const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
    .map(el => el.outerHTML)
    .join('');

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title || 'Print'}</title>
        ${styles}
        <style>
          @media print {
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .no-print {
              display: none !important;
            }
          }
          body {
            padding: 20px;
            background: white;
          }
        </style>
      </head>
      <body>
        ${element.innerHTML}
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();

  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 250);
}

interface PrintTableOptions {
  title: string;
  subtitle?: string;
  columns: string[];
  rows: (string | number)[][];
  summary?: { label: string; value: string }[];
}

export function printTable(options: PrintTableOptions) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    console.error('Could not open print window');
    return;
  }

  const tableRows = options.rows.map(row => 
    `<tr>${row.map(cell => `<td style="padding: 8px; border: 1px solid #ddd;">${cell}</td>`).join('')}</tr>`
  ).join('');

  const tableHeaders = options.columns.map(col => 
    `<th style="padding: 8px; border: 1px solid #ddd; background: #3b82f6; color: white;">${col}</th>`
  ).join('');

  const summaryHtml = options.summary ? `
    <div style="margin-top: 20px; padding: 15px; background: #f5f5f5; border-radius: 4px;">
      <h3 style="margin: 0 0 10px 0;">Summary</h3>
      ${options.summary.map(item => `<p style="margin: 5px 0;"><strong>${item.label}:</strong> ${item.value}</p>`).join('')}
    </div>
  ` : '';

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${options.title}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            max-width: 1000px;
            margin: 0 auto;
          }
          h1 { color: #333; margin-bottom: 5px; }
          h2 { color: #666; font-weight: normal; margin-top: 0; }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>
        <h1>${options.title}</h1>
        ${options.subtitle ? `<h2>${options.subtitle}</h2>` : ''}
        <p>Generated on: ${new Date().toLocaleDateString()}</p>
        <table>
          <thead><tr>${tableHeaders}</tr></thead>
          <tbody>${tableRows}</tbody>
        </table>
        ${summaryHtml}
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();

  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 250);
}
