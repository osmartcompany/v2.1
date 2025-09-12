const orderRange1 = 3;
const orderRange2 = 5;

function addOrderCard({ title, price, date, deliveryRange, status, image, orderid }) {
  const container = document.getElementById("orders-container");
  const card = document.createElement("article");
  card.className = "order-card";
  card.innerHTML = `
        <img class="order-card__image" src="${image}" alt="Product thumbnail"/>
        <div class="order-card__body">
          <header class="order-card__header">
            <h3 class="order-card__title">${title}</h3>
            <span class="order-card__status" data-status="${status}">${status.charAt(0).toUpperCase() + status.slice(1)}</span>
          </header>
          <dl class="order-card__meta">
            <div><dt>Price</dt><dd>Rs. ${price}</dd></div>
            <div><dt>Ordered</dt><dd>${date}</dd></div>
            <div><dt>Est. Delivery</dt><dd>${deliveryRange}</dd></div>
            <div><dt>Order ID</dt><dd>${orderid}</dd></div>
          </dl>
        </div>
      `;
  container.appendChild(card);
}

// Load Orders from firebase
const ordersContainer = document.getElementById("orders-container");
async function loadOrders() {
  ordersContainer.innerHTML = ''
  const orderCount = parseInt(localStorage.getItem("orderCount") || "0", 10);
  for (let i = 1; i <= orderCount; i++) {
    const orderId = localStorage.getItem(i.toString());
    if (!orderId) continue;

    // First check which collection this order is in
    let orderDoc = null;
    let state = "";

    const collections = ["completed orders", "pending orders", "new orders"];
    for (const col of collections) {
      const doc = await db.collection("orders").doc(col).collection("list").doc(orderId).get();
      if (doc.exists) {
        orderDoc = doc.data();
        state = col;
        break;
      }
    }

    if (!orderDoc) continue;

    const productid = orderDoc.productid;
    const pidDoc = await db.collection("productid").doc(productid).get();
    if (!pidDoc.exists) continue;

    const { path, selling_price, name, image } = pidDoc.data();
    const imgSrc = image?.[0] || "assets 2/default.png";

    // Estimated delivery: 3–5 days
    const placedDate = orderDoc.order_placed?.toDate?.() || new Date(orderDoc.order_placed);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const estFrom = new Date(placedDate);
    estFrom.setDate(estFrom.getDate() + orderRange1);
    const estTo = new Date(placedDate);
    estTo.setDate(estTo.getDate() + orderRange2);

    let state2 = state == 'complete' ? 'received' : 'pending'
    // Create card
    addOrderCard({
      title: name,
      price: selling_price,
      date: `${placedDate.toLocaleDateString(undefined, options)}`,
      deliveryRange: `${estFrom.toLocaleDateString(undefined, options)} - ${estTo.toLocaleDateString(undefined, options)}`,
      status: state2,
      image: imgSrc,
      orderid: orderId,
    });
  }
}

loadOrders();