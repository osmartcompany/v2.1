const firebaseConfig = {
    apiKey: "AIzaSyDFmTqnpTzUpJ6-qOcQhSk3hBpZZvQ_4dk",
    authDomain: "edmart-982fc.firebaseapp.com",
    projectId: "edmart-982fc"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let currentMenu = document.querySelector('.referenceMenu').innerHTML;
let currentSection = document.querySelector('.referenceSection').innerHTML;

// navigation function
function changeContent(Menu, Section) {
    const menu = Menu == '' ? `${currentMenu}` : Menu
    document.querySelector(`.${currentMenu}`).classList.toggle('active');
    const section = Section == '' ? 'main' : Section
    window.location = `${menu}-${section}.html`
    document.querySelector(`.${menu}`).classList.toggle('active');
}

// click on menu when on same menu to navigate to its main section
function changeMenu(Menu) {
    changeContent(Menu, 'main')
}


if (currentMenu == 'services' && currentSection == 'boardServiceOrder') {
    const productid = localStorage.getItem('productid')
    globalThis.productid = productid
    fetchProduct();
}



function delayedRedirect(link) {
    setTimeout(function () {
        window.open(link, '_blank');
    }, 250);
}


window.addEventListener('load', function () {
    const loadingScreen = document.getElementById('loading-screen');
    loadingScreen.style.display = 'none';  // Hide the loading screen
});





if (currentMenu == 'services' && currentSection == 'main') {
    let category = 'BISEH';
    globalThis.category = category; // Store category globally
    // if its not previously loaded, then load the prices
    document.querySelectorAll('.boardServicePrice').forEach(e => e.textContent = "Loading...");
    loadServicePrice();
}






// Select University is working, I checked it



async function selectBoardService(product) {
    localStorage.setItem('productid', product)
    clearProductUI()
    document.querySelector('.footerMenu').classList.add('hidden')
    changeContent('', 'boardServiceOrder');
}






// Function to fetch and display board service prices
const serviceOptions = [
    "Marks_Certificate",
    "Pass_Certificate",
    "Creation_Pakka_Certificate",
    "Duplicate_Pakka_Certificate",
    "Migration",
    "Eligibility_Certificate",
    "Eligibility_Other_Province",
    "DOB_Certificate",
    "Verification",
];

async function loadServicePrice() {
    const docRef = db.collection('products').doc("certificate").collection('list').doc(category);
    docRef.get().then((doc) => {
        const data = doc.data();
        for (const serviceOption of serviceOptions) {
            try {
                if (doc.exists) {
                    const priceEl = document.getElementById("price-" + serviceOption);
                    const linkEl = priceEl.parentElement;

                    priceEl.textContent = `Rs. ${data[serviceOption.replace(/_/g, ' ')].selling_price}`;
                    linkEl.setAttribute('onclick', `selectBoardService('${data[serviceOption.replace(/_/g, ' ')].productid}')`);
                } else {
                    document.getElementById("price-" + serviceOption).textContent = "Not found";
                }
            } catch {
                document.getElementById("price-" + serviceOption).textContent = "Error";
            }
        }
    }).catch((error) => {
        console.error('Error fetching document:', error);
    });
}























const productName = document.getElementById("product-name");
const productCategory = document.getElementById("product-category");
const productImage = document.getElementById("product-image");
const priceDisplay = document.getElementById("price-display");
const payButton = document.getElementById("pay-button");
const nextFormContent1 = document.querySelector(".nextFormContent1");
const nextFormContent2 = document.querySelector(".nextFormContent2");
const nextFormContent3 = document.querySelector(".nextFormContent3");
const screenshotFile = document.getElementById("screenshotFile");

const groupSelect = document.getElementById("group-select");

const classSelect = document.getElementById("class-name");
classSelect.addEventListener("change", () => {
    const val = classSelect.value;
    groupSelect.innerHTML = '<option value="default"></option>'
    if (val === "SSC-I (Class 9)" || val === "SSC-II (Class 10)") {
        ["Science", "General"].forEach(g => groupSelect.innerHTML += `<option value="${g}">${g}</option>`);
    } else if (val === "HSC-I (Class 11)" || val === "HSC-II (Class 12)") {
        ["Pre-Medical", "Pre-Engineering", "Pre-Computer Science", "Commerce", "Humanities-R", "Humanities-P", "Home Economics"]
            .forEach(g => groupSelect.innerHTML += `<option value="${g}">${g}</option>`);
    }
});

let currentProduct = null;

async function fetchProduct() {
    try {
        const pidDoc = await db.collection("productid").doc(productid).get();
        if (!pidDoc.exists) throw new Error("Invalid productid");

        currentProduct = pidDoc.data();
        fillProductUI(currentProduct);
    } catch (e) {
        console.error("Error fetching product:", e);
        priceDisplay.textContent = "Error loading product";
        disablePay();
    }
}

function fillProductUI(product) {
    productName.textContent = product.name;
    productCategory.textContent = `Category: ${product.category}`;
    productImage.src = product.image?.[0] || "assets 2/default.png";
    priceDisplay.textContent = `Rs. ${product.selling_price}`;
    validateForm1();
}

function clearProductUI() {
    productName.textContent = "";
    productCategory.textContent = "";
    productImage.src = "assets 2/loading.gif";
    priceDisplay.textContent = 'Loading Price...';
}

function enableNextFormContent1() {
    console.log('enabled');
    document.querySelectorAll('.btndsl').forEach((element)=>{
        element.disabled = false;
    })
    // nextFormContent1.disabled = false;
    // nextFormContent1.setAttribute('style', "");
}

function disableNextFormContent1() {
    console.log('disabled');
    document.querySelectorAll('.btndsl').forEach((element)=>{
        element.disabled = true;
    })
    // nextFormContent1.disabled = true;
    // nextFormContent1.setAttribute('style', "cursor: not-allowed; opacity: 0.5;");
}

// function enableNextFormContent2() {
//     nextFormContent2.disabled = false;
//     // nextFormContent2.setAttribute('style', "");
// }

// function disableNextFormContent2() {
//     nextFormContent2.disabled = true;
//     // nextFormContent2.setAttribute('style', "cursor: not-allowed; opacity: 0.5;");
// }

// function enableNextFormContent3() {
//     nextFormContent3.disabled = false;
//     nextFormContent3.setAttribute('style', "");
// }

// function disableNextFormContent3() {
//     nextFormContent3.disabled = true;
//     nextFormContent3.setAttribute('style', "cursor: not-allowed; opacity: 0.5;");
// }

document.getElementById("order-form").addEventListener("input", validateForm1);
function validateForm1() {
    const form = document.getElementById("order-form");
    const fields = [...form.elements].filter(el => el.hasAttribute("required"));
    const filled = fields.every(el => el.value.trim() !== "");
    if (filled) {
        if (currentMenu=='services' && currentSection=='boardServiceOrder'){
            if (currentProduct?.selling_price){
                enableNextFormContent1()
            } else {
                disableNextFormContent1()
            }
        } else {
            enableNextFormContent1()
        }
    } else {
        disableNextFormContent1()
    }
}

if (currentSection=='boardServiceOrder2' || currentSection=='boardServiceOrder3'){
    let a = JSON.parse(localStorage.getItem('localProductInfo'))
    if (!a) {
        changeContent('','')
    }
    document.querySelector('#product-name').innerHTML = a['product_name']
    document.querySelector('#price-display').innerHTML = a['product_price']
    document.querySelector('#product-image').src = a['image_src']
}


// function validateForm2() {
//     const form = document.getElementById("order-form");
//     const fields = [...form.elements].filter(el => el.hasAttribute("required"));
//     const filled = fields.every(el => el.value.trim() !== "");
//     if (filled && currentProduct?.selling_price) {
//         enableNextFormContent2()
//     } else {
//         disableNextFormContent2()
//     }
// }

// document.getElementById("order-form").addEventListener("input", validateForm2);



screenshotFile.addEventListener('change', (event) => {
    const selectedFiles = event.target.files;

    if (selectedFiles.length > 0) {
        // enableNextFormContent3()
        enableNextFormContent1()
    } else {
        // disableNextFormContent3()
        disableNextFormContent1()
    }
});


// this is a pay button
// Paybutton
payButton.addEventListener("click", async () => {
    // disableNextFormContent3()
    const orderId = "ORD-" + Math.random().toString(36).substring(2, 10).toUpperCase();
    const form = document.getElementById("order-form");
    const localOrderForm = JSON.parse(localStorage.getItem('localOrderForm'))
    localOrderForm['accountTypeTo'] = document.querySelector('#accountTypeTo').value
    const formData = localOrderForm
    // const formData = Object.fromEntries(new FormData(form).entries());

    const orderData = {
        productid: localStorage.getItem('productid'),
        orderid: orderId,
        order_placed: new Date(),
        form: formData
    };
    const localProductInfo = JSON.parse(localStorage.getItem('localProductInfo'))
    const localOrderData = {
        title: localProductInfo['product_name'],
        price: localProductInfo['product_price'],
        date: new Date(),
        image: localProductInfo['image_src'],
        orderid: orderId,
    }
    saveOrderInfo(localOrderData)
    console.log('orderData saved!')

    const overlay = document.getElementById("overlay");
    const overlayText = document.getElementById("overlay-text");
    const overlayActions = document.getElementById("overlay-actions");

    overlay.classList.remove("hidden");
    overlayText.textContent = "Processing...";
    overlayActions.classList.add("hidden");

    let redirected = false;

    const timeout = setTimeout(() => {
        if (!redirected) {
            overlayText.textContent = "Error placing order.";
            overlayActions.classList.remove("hidden");
        }
    }, 60000);

    try {
        await startImageUpload(orderId)
        await db.collection("orders").doc("new orders").collection("list").doc(orderId).set(orderData);
        showToast('Order Uploaded')
        redirected = true;
        clearTimeout(timeout);
        // where to go after submitting form
        overlay.classList.add("hidden");
        resetOffers()
    } catch (e) {
        console.error(e);
        overlayText.textContent = "Error placing order.";
        overlayActions.classList.remove("hidden");
    }
});

let orderCount;
function saveOrderInfo(orderinfo) {
    if (!localStorage.getItem('orderCount')) {
        localStorage.setItem('orderCount', String(1))
        orderCount = localStorage.getItem('orderCount')
    } else {
        localStorage.setItem('orderCount', String(Number(localStorage.getItem('orderCount')) + 1))
        orderCount = localStorage.getItem('orderCount')
    }
    localStorage.setItem(orderCount, JSON.stringify(orderinfo))
}

function resetOffers() {
    document.querySelector('.successOverlayContainer').style = ''
    localStorage.removeItem('localProductInfo')
    localStorage.removeItem('localOrderForm')
    setTimeout(()=>{
        document.getElementById('order-form').reset()
        window.location.replace('services-main.html')
    }, 3000)
}

function changeView(Hide, Show) {
    document.querySelector(Hide).classList.add('hidden')
    document.querySelector(Show).classList.remove('hidden')
}



nextFormContent1.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setTimeout(() => {
        // document.querySelectorAll('.step')[0].classList.remove('current')
        // document.querySelectorAll('.step')[0].classList.add('completed')
        // document.querySelectorAll('.step')[1].classList.add('current')
        // document.getElementById('accountTypeFrom').required = true
        // document.getElementById('accountNumber').required = true
        const localProductInfo = {
            'product_name': document.querySelector('#product-name').innerHTML,
            'product_price': document.querySelector('#price-display').innerHTML,
            'image_src': document.querySelector('#product-image').src
        }
        localStorage.setItem('localProductInfo', JSON.stringify(localProductInfo))
        const localOrderForm = {
            'customer': document.querySelector('#customer').value,
            'class-name': document.querySelector('#class-name').value,
            'group-select': document.querySelector('#group-select').value,
            'seat_number': document.querySelector('#seat_number').value,
            'record_year': document.querySelector('#record_year').value,
            'phone': document.querySelector('#phone').value,
            'district': document.querySelector('#district').value,
            'city': document.querySelector('#city').value,
            'area': document.querySelector('#area').value,
            'address': document.querySelector('#address').value,
        }
        localStorage.setItem('localOrderForm', JSON.stringify(localOrderForm))
        // changeView('.orderInfo', '.payment')
        document.getElementById('order-form').reset()
        changeContent('','boardServiceOrder2')
    }, 500)
})

if (currentMenu=='services' && currentSection=='boardServiceOrder2') {
    validateForm1()
}

nextFormContent2.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    const localOrderForm = JSON.parse(localStorage.getItem('localOrderForm'))
    localOrderForm['accountTypeFrom'] = document.querySelector('#accountTypeFrom').value
    localOrderForm['accountNumber'] = document.querySelector('#accountNumber').value
    localStorage.setItem('localOrderForm', JSON.stringify(localOrderForm))
    setTimeout(() => {
        // document.querySelectorAll('.step')[1].classList.remove('current')
        // document.querySelectorAll('.step')[1].classList.add('completed')
        // document.querySelectorAll('.step')[2].classList.add('current')
        // changeView('.payment', '.paymentConfirmation')
        document.getElementById('order-form').reset()
        changeContent('services','boardServiceOrder3')
    }, 500)
})












// make recoud_year always between 2000 to current year
document.getElementById('record_year').addEventListener('input', function () {
    const selectedYear = this.value;
    const currentYear = new Date().getFullYear();
    if (selectedYear === '') {
        this.style.border = ""; // Remove the highlight
    } else if (!(selectedYear <= currentYear && selectedYear >= 2000)) {
        // Handle case where selected year is in the past
        this.style.border = "2px solid red"; // Highlight the input
    } else {
        // this.setCustomValidity(""); // Clear any custom validity message
        this.style.border = ""; // Remove the highlight
    }
})



// make select label float when focused
const selects = document.querySelectorAll('.formSelect');
const targetLabels = document.querySelectorAll('.selectLabel');
selects.forEach((select, index) => {
    select.addEventListener('change', (event) => {
        if (event.target.value === 'default') {
            targetLabels[index].removeAttribute('style')
        } else {
            targetLabels[index].setAttribute('style', 'top: -1em; font-size: 0.75em; padding: 0 0.125em;')
        }
    })
});









const FULL_DASH_ARRAY = 339.29;
let timeLeft = 300;
let timerInterval;

// 🕒 Start the countdown timer
function startTimer() {
    const progressCircle = document.getElementById("progress-ring");
    const timerText = document.getElementById("timer-text");

    timerInterval = setInterval(() => {
        timeLeft--;

        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerText.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        const progress = FULL_DASH_ARRAY * (timeLeft / 300);
        progressCircle.setAttribute("stroke-dashoffset", FULL_DASH_ARRAY - progress);

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerText.textContent = "Time's up!";
        }
    }, 1000);
}

// 🏦 Handle bank selection and show payment section
function selectBank(card, BankName) {
    document.querySelectorAll('.bank-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    document.getElementById("accountTypeFrom").value = BankName;
    const accountNameFrom = BankName
    globalThis.accountNameFrom = accountNameFrom
    // document.querySelector('.bank-selection').classList.add('hidden')

    document.querySelector('.accountNumber').style.display = 'block';
}




function selectBankToSend(card, BankName) {
    setTimeout(() => {
        document.querySelector('.countdown-ring').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 250)

    document.querySelectorAll('.bank-card').forEach(c => c.classList.remove('selected'));
    document.getElementById("accountTypeTo").value = BankName;
    const accountNameTo = BankName
    globalThis.accountNameTo = accountNameTo
    card.classList.add('selected');
    fetchAccountNumber(BankName)
    clearInterval(timerInterval);
    timeLeft = 300;
    startTimer();

    document.getElementById('payment-timer').style.display = 'block';
}

async function fetchAccountNumber(iban) {
    const docRef = db.collection('4wwZIToefKer1zug2sc8IHjPh4VIl7beFiA2E4GoZIJHvpQ6A8').doc("accounts");
    docRef.get().then((doc) => {
        try {
            const data = doc.data();
            if (doc.exists) {
                document.getElementById("account-number").textContent = `${data[iban]}`;
                document.getElementById("account-number").style.color = 'black'
            } else {
                document.getElementById("account-number").innerHTML = "Account Full!, Try Other";
            }
        } catch {
            document.getElementById("account-number").innerHTML = "Accounts document not found.";
        }
    }).catch((error) => {
        console.error('Error fetching document:', error);
    });
};


// 📋 Copy account number (uses fallback for WebView support)
function copyToClipboard(contentQuery) {
    const accountNumber = document.querySelector(contentQuery).innerText;

    if (navigator.clipboard) {
        navigator.clipboard.writeText(accountNumber).then(() => {
            showToast("Copied!");
        }).catch((err) => {
            console.warn("Clipboard API failed, using fallback");
            fallbackCopy(accountNumber);
        });
    } else {
        fallbackCopy(accountNumber);
    }
}

// 📋 Clipboard fallback using input element
function fallbackCopy(text) {
    const input = document.createElement('input');
    input.setAttribute('value', text);
    document.body.appendChild(input);
    input.select();
    try {
        const success = document.execCommand('copy');
        showToast(success ? "Copied!" : "Copy failed");
    } catch (err) {
        showToast("Copy not supported");
    }
    document.body.removeChild(input);
}

// ✅ Show toast message (works in WebView too)
function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.remove("show");
    void toast.offsetWidth; // Trigger reflow
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2000);
}



async function startImageUpload(orderid) {
    const file = screenshotFile.files[0];
    const customName = orderid

    const cloudName = 'did3wd6d4';       // Your Cloudinary cloud name
    const uploadPreset = 'oSmartTesting'; // Your unsigned preset

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('public_id', customName); // Custom file name without extension

    try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: 'POST',
            body: formData
        });

        const data = await res.json();

        if (data.secure_url) {
            showToast('Image Uploaded!')
        } else {
            showToast('❌ Image Upload Failed')
        }
    } catch (err) {
        showToast('Error')
    }
}