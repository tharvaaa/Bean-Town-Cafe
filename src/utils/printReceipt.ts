import type { OrderItem } from '../db';
import { format } from 'date-fns';

export const printReceipt = (items: OrderItem[], total: number, subtotal: number, tax: number, paymentMethod: string) => {
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) return;

  const dateStr = format(new Date(), 'dd/MM/yyyy HH:mm:ss');
  
  const itemsHtml = items.map(item => `
    <div class="item">
      <div class="item-name">${item.name} ${item.size ? `(${item.size})` : ''}</div>
      <div class="item-details">
        <span>${item.quantity} x ₹${item.price.toFixed(2)}</span>
        <span>₹${(item.quantity * item.price).toFixed(2)}</span>
      </div>
    </div>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Receipt</title>
        <style>
          @page { margin: 0; size: 58mm auto; }
          body {
            font-family: 'Courier New', Courier, monospace;
            width: 58mm;
            margin: 0;
            padding: 5mm;
            font-size: 12px;
            color: #000;
            background: #fff;
          }
          .header { text-align: center; margin-bottom: 5mm; }
          .header h1 { font-size: 16px; margin: 0 0 2mm 0; }
          .header p { margin: 0; font-size: 10px; }
          .divider { border-top: 1px dashed #000; margin: 3mm 0; }
          .item { margin-bottom: 3mm; }
          .item-name { font-weight: bold; margin-bottom: 1mm; }
          .item-details { display: flex; justify-content: space-between; }
          .totals { margin-top: 5mm; }
          .total-line { display: flex; justify-content: space-between; margin-bottom: 1mm; }
          .total-line.grand { font-weight: bold; font-size: 14px; margin-top: 2mm; border-top: 1px solid #000; padding-top: 2mm; }
          .footer { text-align: center; margin-top: 5mm; font-size: 10px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>BEAN TOWN CAFE</h1>
          <p>123 Brew Street, Bean City</p>
          <p>Tel: (555) 123-4567</p>
          <p>${dateStr}</p>
        </div>
        
        <div class="divider"></div>
        
        <div class="items">
          ${itemsHtml}
        </div>
        
        <div class="divider"></div>
        
        <div class="totals">
          <div class="total-line">
            <span>Subtotal</span>
            <span>₹${subtotal.toFixed(2)}</span>
          </div>
          <div class="total-line grand">
            <span>Total</span>
            <span>₹${total.toFixed(2)}</span>
          </div>
          <div class="total-line">
            <span>Payment</span>
            <span>${paymentMethod}</span>
          </div>
        </div>
        
        <div class="divider"></div>
        
        <div class="footer">
          <p>Thank you for your visit!</p>
          <p>Please come again</p>
        </div>
      </body>
    </html>
  `;

  doc.open();
  doc.write(html);
  doc.close();

  setTimeout(() => {
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 1000);
  }, 500);
};
