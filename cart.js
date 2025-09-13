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

    // Parse the JSON string back into a JavaScript object
    const orderDoc = JSON.parse(localStorage.getItem(i));
    if (!orderDoc) continue;

    console.log(orderDoc.title); // Output: John Doe
    console.log(orderDoc.date);  // Output: 30

    // Estimated delivery: 3–5 days
    const placedDate = orderDoc.date?.toDate?.() || new Date(orderDoc.date);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const estFrom = new Date(placedDate);
    estFrom.setDate(estFrom.getDate() + orderRange1);
    const estTo = new Date(placedDate);
    estTo.setDate(estTo.getDate() + orderRange2);
    let state = 'complete'
    let state2 = state == 'complete' ? 'received' : 'pending'
    // Create card
    addOrderCard({
      title: orderDoc.title,
      price: orderDoc.price,
      date: `${placedDate.toLocaleDateString(undefined, options)}`,
      deliveryRange: `${estFrom.toLocaleDateString(undefined, options)} - ${estTo.toLocaleDateString(undefined, options)}`,
      status: state2,
      image: orderDoc.image,
      orderid: orderDoc.orderid,
    });
  }
}

loadOrders();