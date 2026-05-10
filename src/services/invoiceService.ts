import jsPDF from "jspdf";


interface InvoiceItem {
  name: string;
  price: number;
  quantity: number;
}

interface InvoiceData {
  id: string;
  date: string;
  status: string;
  total: number;
  subtotal: number;
  shippingCost: number;
  discount: number;
  items: InvoiceItem[];
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export function generateInvoice(order: any, user: any) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFontSize(24);
  doc.setTextColor(28, 26, 23);
  doc.text("FORMA", pageWidth / 2, 30, { align: "center" });

  doc.setFontSize(10);
  doc.setTextColor(200, 169, 126);
  doc.text("Furniture Store", pageWidth / 2, 38, { align: "center" });

  // Invoice title
  doc.setFontSize(18);
  doc.setTextColor(28, 26, 23);
  doc.text("INVOICE", 20, 55);

  // Order info
  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text(`Invoice #: ${order.id}`, 20, 65);
  doc.text(`Date: ${order.date}`, 20, 72);
  doc.text(`Status: ${order.status}`, 20, 79);

  // Customer info
  if (user) {
    doc.text(`Customer: ${user.firstName}${user.lastName ? ` ${user.lastName}` : ""}`, pageWidth - 20, 65, { align: "right" });
    doc.text(`Email: ${user.email}`, pageWidth - 20, 72, { align: "right" });
  }

  // Shipping address
  const shippingAddr = order.shippingAddress || 
    (order.street ? {
      street: order.street,
      city: order.city,
      state: order.state,
      zipCode: order.zipCode || order.zip_code,
      country: order.country,
    } : null);
  
  if (shippingAddr) {
    const addr = shippingAddr;
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text("Ship To:", pageWidth - 20, 79, { align: "right" });
    doc.text(`${addr.street || ""}`, pageWidth - 20, 86, { align: "right" });
    doc.text(`${addr.city || ""}, ${addr.state || ""} ${addr.zipCode || ""}`, pageWidth - 20, 93, { align: "right" });
    doc.text(`${addr.country || ""}`, pageWidth - 20, 100, { align: "right" });
  }

  // Items
  let yPos = 120;
  doc.setFontSize(11);
  doc.setFont(undefined, "bold");
  doc.text("ITEMS", 20, yPos);
  yPos += 10;

  // Table header
  doc.setFontSize(9);
  doc.setFont(undefined, "bold");
  doc.text("Item", 20, yPos);
  doc.text("Price", 120, yPos, { align: "right" });
  doc.text("Qty", 140, yPos, { align: "right" });
  doc.text("Total", 190, yPos, { align: "right" });
  yPos += 5;

  doc.line(20, yPos, 190, yPos);
  yPos += 8;

  // Table rows
  doc.setFont(undefined, "normal");
  const items = order.items || [];
  for (const item of items) {
    const name = item.name || "Product";
    const price = item.price || 0;
    const qty = item.quantity || 1;
    const total = price * qty;

    doc.text(name.substring(0, 40), 20, yPos);
    doc.text(`${price.toLocaleString()} PLN`, 120, yPos, { align: "right" });
    doc.text(`${qty}`, 140, yPos, { align: "right" });
    doc.text(`${total.toLocaleString()} PLN`, 190, yPos, { align: "right" });
    yPos += 8;
  }

  yPos += 5;

  // Totals
  const subtotal = order.subtotal || order.total || 0;
  const shipping = order.shippingCost || 0;
  const discount = order.discount || 0;
  const total = order.total || subtotal + shipping - discount;

  doc.setFontSize(9);
  doc.text("Subtotal:", pageWidth - 70, yPos);
  doc.text(`${subtotal.toLocaleString()} PLN`, pageWidth - 20, yPos, { align: "right" });
  yPos += 7;

  if (shipping > 0) {
    doc.text("Shipping:", pageWidth - 70, yPos);
    doc.text(`${shipping.toLocaleString()} PLN`, pageWidth - 20, yPos, { align: "right" });
    yPos += 7;
  }

  if (discount > 0) {
    doc.text("Discount:", pageWidth - 70, yPos);
    doc.text(`-${discount.toLocaleString()} PLN`, pageWidth - 20, yPos, { align: "right" });
    yPos += 7;
  }

  yPos += 3;
  doc.line(pageWidth - 70, yPos, pageWidth - 20, yPos);
  yPos += 7;

  doc.setFontSize(11);
  doc.setFont(undefined, "bold");
  doc.text("Total:", pageWidth - 70, yPos);
  doc.text(`${total.toLocaleString()} PLN`, pageWidth - 20, yPos, { align: "right" });

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text("Thank you for your business!", pageWidth / 2, 280, { align: "center" });
  doc.text("Forma Furniture Store • www.forma.com", pageWidth / 2, 285, { align: "center" });

  // Save
  doc.save(`Invoice_${order.id}.pdf`);
}
