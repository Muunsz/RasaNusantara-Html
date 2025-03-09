document.addEventListener("DOMContentLoaded", () => {
  // Initialize checkout page
  loadCheckoutItems()
  initCheckoutForms()
  initPaymentMethods()

  // Update cart count
  updateCartCount() //Fixed: updateCartCount is now called.  It needs to be defined elsewhere.
})

// Load checkout items from cart
function loadCheckoutItems() {
  const checkoutItemsContainer = document.getElementById("checkout-items")

  // Get cart from localStorage
  const cart = JSON.parse(localStorage.getItem("cart")) || []

  if (checkoutItemsContainer) {
    checkoutItemsContainer.innerHTML = ""

    if (cart.length === 0) {
      // Redirect to cart page if cart is empty
      window.location.href = "cart.html"
      return
    }

    // Render checkout items
    cart.forEach((item) => {
      const itemElement = document.createElement("div")
      itemElement.className = "order-item"

      itemElement.innerHTML = `
        <div class="order-item-image">
          <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="order-item-details">
          <h4>${item.name}</h4>
          <p>Size: ${item.size}</p>
          <p>Quantity: ${item.quantity}</p>
        </div>
        <div class="order-item-price">${item.price}</div>
      `

      checkoutItemsContainer.appendChild(itemElement)
    })

    // Update order summary
    updateOrderSummary()
  }
}

// Update order summary
function updateOrderSummary() {
  const subtotalElement = document.getElementById("checkout-subtotal")
  const shippingElement = document.getElementById("checkout-shipping")
  const taxElement = document.getElementById("checkout-tax")
  const totalElement = document.getElementById("checkout-total")

  // Get cart from localStorage
  const cart = JSON.parse(localStorage.getItem("cart")) || []

  if (subtotalElement && shippingElement && taxElement && totalElement) {
    // Calculate subtotal
    const subtotal = cart.reduce((total, item) => {
      const price = Number.parseInt(item.price.replace(/\D/g, ""))
      return total + price * item.quantity
    }, 0)

    // Calculate shipping (fixed for now)
    const shipping = 20000

    // Calculate tax (10%)
    const tax = subtotal * 0.1

    // Calculate total
    const total = subtotal + shipping + tax

    // Update elements
    subtotalElement.textContent = `Rp ${subtotal.toLocaleString()}`
    shippingElement.textContent = `Rp ${shipping.toLocaleString()}`
    taxElement.textContent = `Rp ${tax.toLocaleString()}`
    totalElement.textContent = `Rp ${total.toLocaleString()}`

    // Store order total in sessionStorage for later use
    sessionStorage.setItem("orderTotal", total)
  }
}

// Initialize checkout forms
function initCheckoutForms() {
  const shippingForm = document.getElementById("shipping-form")
  const paymentForm = document.getElementById("payment-form")
  const backToShippingBtn = document.getElementById("back-to-shipping")

  // Shipping form submission
  if (shippingForm) {
    shippingForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Validate form
      if (!validateShippingForm()) {
        return
      }

      // Store shipping information
      const shippingInfo = {
        firstName: document.getElementById("first-name").value,
        lastName: document.getElementById("last-name").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        address: document.getElementById("address").value,
        city: document.getElementById("city").value,
        postalCode: document.getElementById("postal-code").value,
        deliveryNotes: document.getElementById("delivery-notes").value,
        deliveryTime: document.getElementById("delivery-time").value,
      }

      // Store shipping info in sessionStorage
      sessionStorage.setItem("shippingInfo", JSON.stringify(shippingInfo))

      // Move to payment step
      goToStep(2)
    })
  }

  // Back to shipping button
  if (backToShippingBtn) {
    backToShippingBtn.addEventListener("click", () => {
      goToStep(1)
    })
  }

  // Payment form submission
  if (paymentForm) {
    paymentForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Validate form based on selected payment method
      if (!validatePaymentForm()) {
        return
      }

      // Get selected payment method
      const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value

      // Store payment information
      const paymentInfo = {
        method: paymentMethod,
      }

      // Add payment method specific details
      if (paymentMethod === "credit-card") {
        paymentInfo.cardName = document.getElementById("card-name").value
        paymentInfo.cardNumber = document.getElementById("card-number").value
        paymentInfo.expiryDate = document.getElementById("expiry-date").value
        paymentInfo.cvv = document.getElementById("cvv").value
      } else if (paymentMethod === "e-wallet") {
        paymentInfo.eWalletType = document.getElementById("e-wallet-type").value
        paymentInfo.eWalletNumber = document.getElementById("e-wallet-number").value
      }

      // Store payment info in sessionStorage
      sessionStorage.setItem("paymentInfo", JSON.stringify(paymentInfo))

      // Create order
      createOrder()

      // Move to confirmation step
      goToStep(3)
    })
  }
}

// Validate shipping form
function validateShippingForm() {
  const firstName = document.getElementById("first-name").value
  const lastName = document.getElementById("last-name").value
  const email = document.getElementById("email").value
  const phone = document.getElementById("phone").value
  const address = document.getElementById("address").value
  const city = document.getElementById("city").value
  const postalCode = document.getElementById("postal-code").value

  if (!firstName || !lastName || !email || !phone || !address || !city || !postalCode) {
    alert("Please fill in all required fields.")
    return false
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    alert("Please enter a valid email address.")
    return false
  }

  // Validate phone number (simple validation)
  const phoneRegex = /^\d{10,15}$/
  if (!phoneRegex.test(phone.replace(/\D/g, ""))) {
    alert("Please enter a valid phone number.")
    return false
  }

  return true
}

// Validate payment form
function validatePaymentForm() {
  const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value

  if (paymentMethod === "credit-card") {
    const cardName = document.getElementById("card-name").value
    const cardNumber = document.getElementById("card-number").value
    const expiryDate = document.getElementById("expiry-date").value
    const cvv = document.getElementById("cvv").value

    if (!cardName || !cardNumber || !expiryDate || !cvv) {
      alert("Please fill in all credit card details.")
      return false
    }

    // Validate card number (simple validation)
    const cardNumberRegex = /^\d{16}$/
    if (!cardNumberRegex.test(cardNumber.replace(/\D/g, ""))) {
      alert("Please enter a valid 16-digit card number.")
      return false
    }

    // Validate expiry date (MM/YY format)
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/
    if (!expiryRegex.test(expiryDate)) {
      alert("Please enter a valid expiry date in MM/YY format.")
      return false
    }

    // Validate CVV (3 or 4 digits)
    const cvvRegex = /^\d{3,4}$/
    if (!cvvRegex.test(cvv)) {
      alert("Please enter a valid CVV code.")
      return false
    }
  } else if (paymentMethod === "e-wallet") {
    const eWalletNumber = document.getElementById("e-wallet-number").value

    if (!eWalletNumber) {
      alert("Please enter your e-wallet number.")
      return false
    }

    // Validate e-wallet number (simple validation)
    const phoneRegex = /^\d{10,15}$/
    if (!phoneRegex.test(eWalletNumber.replace(/\D/g, ""))) {
      alert("Please enter a valid e-wallet number.")
      return false
    }
  }

  return true
}

// Initialize payment methods
function initPaymentMethods() {
  const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]')
  const creditCardDetails = document.getElementById("credit-card-details")
  const bankTransferDetails = document.getElementById("bank-transfer-details")
  const eWalletDetails = document.getElementById("e-wallet-details")

  if (paymentMethods.length > 0) {
    paymentMethods.forEach((method) => {
      method.addEventListener("change", function () {
        // Hide all payment details
        creditCardDetails.style.display = "none"
        bankTransferDetails.style.display = "none"
        eWalletDetails.style.display = "none"

        // Show selected payment details
        if (this.value === "credit-card") {
          creditCardDetails.style.display = "block"
        } else if (this.value === "bank-transfer") {
          bankTransferDetails.style.display = "block"
        } else if (this.value === "e-wallet") {
          eWalletDetails.style.display = "block"
        }
      })
    })
  }
}

// Go to specified checkout step
function goToStep(step) {
  // Hide all steps
  document.querySelectorAll(".checkout-step").forEach((stepElement) => {
    stepElement.classList.remove("active")
  })

  // Show specified step
  if (step === 1) {
    document.getElementById("shipping-step").classList.add("active")
  } else if (step === 2) {
    document.getElementById("payment-step").classList.add("active")
  } else if (step === 3) {
    document.getElementById("confirmation-step").classList.add("active")
  }

  // Update progress indicators
  document.querySelectorAll(".progress-step").forEach((indicator, index) => {
    if (index < step) {
      indicator.classList.add("active")
      indicator.classList.add("completed")
    } else if (index === step - 1) {
      indicator.classList.add("active")
      indicator.classList.remove("completed")
    } else {
      indicator.classList.remove("active")
      indicator.classList.remove("completed")
    }
  })

  // Scroll to top of the page
  window.scrollTo(0, 0)
}

// Create order
function createOrder() {
  // Generate order number
  const orderNumber = "AZ-" + Math.floor(100000 + Math.random() * 900000)

  // Get current date
  const orderDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Calculate estimated delivery date (3 days from now)
  const deliveryDate = new Date()
  deliveryDate.setDate(deliveryDate.getDate() + 3)
  const estimatedDeliveryDate = deliveryDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Get shipping info
  const shippingInfo = JSON.parse(sessionStorage.getItem("shippingInfo"))

  // Update confirmation page
  document.getElementById("confirmation-order-number").textContent = orderNumber
  document.getElementById("confirmation-order-date").textContent = orderDate
  document.getElementById("confirmation-email").textContent = shippingInfo.email
  document.getElementById("confirmation-address").textContent =
    `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postalCode}`
  document.getElementById("confirmation-delivery-date").textContent = estimatedDeliveryDate

  // Update order reference for bank transfer
  document.getElementById("order-reference").textContent = orderNumber

  // Create order object
  const order = {
    orderNumber: orderNumber,
    orderDate: orderDate,
    shippingInfo: shippingInfo,
    paymentInfo: JSON.parse(sessionStorage.getItem("paymentInfo")),
    items: JSON.parse(localStorage.getItem("cart")),
    total: sessionStorage.getItem("orderTotal"),
    status: "pending",
  }

  // Store order in localStorage
  const orders = JSON.parse(localStorage.getItem("orders")) || []
  orders.push(order)
  localStorage.setItem("orders", JSON.stringify(orders))

  // Clear cart
  localStorage.removeItem("cart")

  // Send order to server (in a real implementation)
  // This would be an API call to the Java backend
  console.log("Order created:", order)

  // In a real implementation, we would make an AJAX request to the Java backend
  // For example:
  /*
  fetch('http://localhost:8080/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(order)
  })
  .then(response => response.json())
  .then(data => {
    console.log('Order created successfully:', data);
  })
  .catch(error => {
    console.error('Error creating order:', error);
  });
  */
}

// Track order button
document.addEventListener("DOMContentLoaded", () => {
  const trackOrderBtn = document.getElementById("track-order-btn")

  if (trackOrderBtn) {
    trackOrderBtn.addEventListener("click", (e) => {
      e.preventDefault()

      // In a real implementation, this would redirect to an order tracking page
      alert("Order tracking functionality would be implemented here.")
    })
  }
})

//Dummy function to satisfy the updateCartCount call.  Replace with actual implementation.
function updateCartCount() {
  console.log("Cart count updated (dummy function)")
}

