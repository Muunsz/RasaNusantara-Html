document.addEventListener("DOMContentLoaded", () => {
  // Initialize account page
  loadUserData()
  initAccountTabs()
  loadRecentOrders()
  loadAllOrders()
  loadAddresses()
  loadWishlist()

  // Initialize forms
  initAddressForm()
  initProfileForm()
  initPasswordForm()

  // Update cart count
  updateCartCount()
})

// Load user data
function loadUserData() {
  // In a real implementation, this would fetch user data from the server
  // For now, we'll use mock data
  const userData = {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "123-456-7890",
    birthday: "1990-01-01",
    gender: "male",
    avatar: "/placeholder.svg?height=100&width=100",
  }

  // Update user info in sidebar
  document.getElementById("user-name").textContent = `${userData.firstName} ${userData.lastName}`
  document.getElementById("user-email").textContent = userData.email

  // Populate profile form
  document.getElementById("profile-first-name").value = userData.firstName
  document.getElementById("profile-last-name").value = userData.lastName
  document.getElementById("profile-email").value = userData.email
  document.getElementById("profile-phone").value = userData.phone
  document.getElementById("profile-birthday").value = userData.birthday

  // Set gender radio button
  document.querySelector(`input[name="gender"][value="${userData.gender}"]`).checked = true
}

// Initialize account tabs
function initAccountTabs() {
  const tabLinks = document.querySelectorAll(".account-menu li[data-tab]")
  const viewAllLinks = document.querySelectorAll(".view-all[data-tab]")

  // Tab menu click handler
  tabLinks.forEach((link) => {
    link.addEventListener("click", function () {
      const tabId = this.getAttribute("data-tab")
      switchTab(tabId)
    })
  })

  // "View All" links click handler
  viewAllLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()
      const tabId = this.getAttribute("data-tab")
      switchTab(tabId)
    })
  })

  // Logout button
  const logoutBtn = document.getElementById("logout-btn")
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      // In a real implementation, this would call a logout API
      alert("You have been logged out successfully.")
      window.location.href = "index.html"
    })
  }
}

// Switch to specified tab
function switchTab(tabId) {
  // Update active tab in menu
  document.querySelectorAll(".account-menu li").forEach((item) => {
    item.classList.remove("active")
  })
  document.querySelector(`.account-menu li[data-tab="${tabId}"]`).classList.add("active")

  // Update active tab content
  document.querySelectorAll(".account-tab").forEach((tab) => {
    tab.classList.remove("active")
  })
  document.getElementById(`${tabId}-tab`).classList.add("active")
}

// Load recent orders for dashboard
function loadRecentOrders() {
  const recentOrdersTable = document.getElementById("recent-orders-table")

  // Get orders from localStorage or use mock data
  const orders = JSON.parse(localStorage.getItem("orders")) || getMockOrders()

  // Update orders count
  document.getElementById("orders-count").textContent = orders.length

  if (recentOrdersTable) {
    recentOrdersTable.innerHTML = ""

    // Show only the 3 most recent orders
    const recentOrders = orders.slice(0, 3)

    if (recentOrders.length === 0) {
      recentOrdersTable.innerHTML = `
        <tr>
          <td colspan="5" class="no-data">You haven't placed any orders yet.</td>
        </tr>
      `
    } else {
      recentOrders.forEach((order) => {
        const row = document.createElement("tr")

        row.innerHTML = `
          <td>${order.orderNumber}</td>
          <td>${order.orderDate}</td>
          <td><span class="order-status ${order.status}">${capitalizeFirstLetter(order.status)}</span></td>
          <td>Rp ${Number.parseInt(order.total).toLocaleString()}</td>
          <td>
            <button class="btn-sm view-order" data-order="${order.orderNumber}">View</button>
          </td>
        `

        recentOrdersTable.appendChild(row)
      })

      // Add event listeners to view order buttons
      document.querySelectorAll(".view-order").forEach((button) => {
        button.addEventListener("click", function () {
          const orderNumber = this.getAttribute("data-order")
          viewOrderDetails(orderNumber)
        })
      })
    }
  }
}

// Load all orders for orders tab
function loadAllOrders() {
  const ordersTable = document.getElementById("orders-table")

  // Get orders from localStorage or use mock data
  const orders = JSON.parse(localStorage.getItem("orders")) || getMockOrders()

  if (ordersTable) {
    ordersTable.innerHTML = ""

    if (orders.length === 0) {
      ordersTable.innerHTML = `
        <tr>
          <td colspan="5" class="no-data">You haven't placed any orders yet.</td>
        </tr>
      `
    } else {
      orders.forEach((order) => {
        const row = document.createElement("tr")

        row.innerHTML = `
          <td>${order.orderNumber}</td>
          <td>${order.orderDate}</td>
          <td><span class="order-status ${order.status}">${capitalizeFirstLetter(order.status)}</span></td>
          <td>Rp ${Number.parseInt(order.total).toLocaleString()}</td>
          <td>
            <button class="btn-sm view-order" data-order="${order.orderNumber}">View</button>
          </td>
        `

        ordersTable.appendChild(row)
      })

      // Add event listeners to view order buttons
      document.querySelectorAll(".view-order").forEach((button) => {
        button.addEventListener("click", function () {
          const orderNumber = this.getAttribute("data-order")
          viewOrderDetails(orderNumber)
        })
      })
    }
  }

  // Initialize order filters
  initOrderFilters()
}

// Initialize order filters
function initOrderFilters() {
  const statusFilter = document.getElementById("order-status-filter")
  const searchInput = document.getElementById("order-search")
  const searchBtn = document.getElementById("order-search-btn")

  if (statusFilter) {
    statusFilter.addEventListener("change", () => {
      filterOrders()
    })
  }

  if (searchInput && searchBtn) {
    searchBtn.addEventListener("click", () => {
      filterOrders()
    })

    searchInput.addEventListener("keyup", (e) => {
      if (e.key === "Enter") {
        filterOrders()
      }
    })
  }
}

// Filter orders based on status and search term
function filterOrders() {
  const statusFilter = document.getElementById("order-status-filter").value
  const searchTerm = document.getElementById("order-search").value.toLowerCase()
  const ordersTable = document.getElementById("orders-table")

  // Get orders from localStorage or use mock data
  const orders = JSON.parse(localStorage.getItem("orders")) || getMockOrders()

  if (ordersTable) {
    ordersTable.innerHTML = ""

    // Filter orders
    let filteredOrders = orders

    // Filter by status
    if (statusFilter !== "all") {
      filteredOrders = filteredOrders.filter((order) => order.status === statusFilter)
    }

    // Filter by search term
    if (searchTerm) {
      filteredOrders = filteredOrders.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(searchTerm) || order.orderDate.toLowerCase().includes(searchTerm),
      )
    }

    if (filteredOrders.length === 0) {
      ordersTable.innerHTML = `
        <tr>
          <td colspan="5" class="no-data">No orders match your filter criteria.</td>
        </tr>
      `
    } else {
      filteredOrders.forEach((order) => {
        const row = document.createElement("tr")

        row.innerHTML = `
          <td>${order.orderNumber}</td>
          <td>${order.orderDate}</td>
          <td><span class="order-status ${order.status}">${capitalizeFirstLetter(order.status)}</span></td>
          <td>Rp ${Number.parseInt(order.total).toLocaleString()}</td>
          <td>
            <button class="btn-sm view-order" data-order="${order.orderNumber}">View</button>
          </td>
        `

        ordersTable.appendChild(row)
      })

      // Add event listeners to view order buttons
      document.querySelectorAll(".view-order").forEach((button) => {
        button.addEventListener("click", function () {
          const orderNumber = this.getAttribute("data-order")
          viewOrderDetails(orderNumber)
        })
      })
    }
  }
}

// View order details
function viewOrderDetails(orderNumber) {
  // Get orders from localStorage or use mock data
  const orders = JSON.parse(localStorage.getItem("orders")) || getMockOrders()

  // Find the order
  const order = orders.find((o) => o.orderNumber === orderNumber)

  if (order) {
    // In a real implementation, this would open a modal or navigate to an order details page
    alert(
      `Order Details for ${orderNumber}\n\nDate: ${order.orderDate}\nStatus: ${capitalizeFirstLetter(order.status)}\nTotal: Rp ${Number.parseInt(order.total).toLocaleString()}`,
    )
  }
}

// Load addresses
function loadAddresses() {
  const addressesContainer = document.getElementById("addresses-container")

  // Get addresses from localStorage or use mock data
  const addresses = JSON.parse(localStorage.getItem("addresses")) || getMockAddresses()

  // Update addresses count
  document.getElementById("addresses-count").textContent = addresses.length

  if (addressesContainer) {
    addressesContainer.innerHTML = ""

    if (addresses.length === 0) {
      addressesContainer.innerHTML = `
        <div class="no-data-message">
          <p>You haven't added any addresses yet.</p>
        </div>
      `
    } else {
      addresses.forEach((address) => {
        const addressCard = document.createElement("div")
        addressCard.className = "address-card"

        if (address.isDefault) {
          addressCard.classList.add("default")
        }

        addressCard.innerHTML = `
          ${address.isDefault ? '<div class="default-badge">Default</div>' : ""}
          <h4>${address.name}</h4>
          <p><strong>${address.recipient}</strong></p>
          <p>${address.street}</p>
          <p>${address.city}, ${address.postalCode}</p>
          <p>Phone: ${address.phone}</p>
          ${address.notes ? `<p class="address-notes">Notes: ${address.notes}</p>` : ""}
          <div class="address-actions">
            <button class="btn-sm edit-address" data-id="${address.id}">Edit</button>
            <button class="btn-sm delete-address" data-id="${address.id}">Delete</button>
            ${!address.isDefault ? `<button class="btn-sm set-default-address" data-id="${address.id}">Set as Default</button>` : ""}
          </div>
        `

        addressesContainer.appendChild(addressCard)
      })

      // Add event listeners to address buttons
      document.querySelectorAll(".edit-address").forEach((button) => {
        button.addEventListener("click", function () {
          const addressId = this.getAttribute("data-id")
          editAddress(addressId)
        })
      })

      document.querySelectorAll(".delete-address").forEach((button) => {
        button.addEventListener("click", function () {
          const addressId = this.getAttribute("data-id")
          deleteAddress(addressId)
        })
      })

      document.querySelectorAll(".set-default-address").forEach((button) => {
        button.addEventListener("click", function () {
          const addressId = this.getAttribute("data-id")
          setDefaultAddress(addressId)
        })
      })
    }
  }
}

// Initialize address form
function initAddressForm() {
  const addAddressBtn = document.getElementById("add-address-btn")
  const cancelAddressBtn = document.getElementById("cancel-address-btn")
  const addressForm = document.getElementById("address-form")

  if (addAddressBtn) {
    addAddressBtn.addEventListener("click", () => {
      // Reset form
      addressForm.reset()
      document.getElementById("address-id").value = ""
      document.getElementById("address-form-title").textContent = "Add New Address"

      // Show form
      document.getElementById("address-form-container").style.display = "block"
      document.getElementById("addresses-container").style.display = "none"
      addAddressBtn.style.display = "none"
    })
  }

  if (cancelAddressBtn) {
    cancelAddressBtn.addEventListener("click", () => {
      // Hide form
      document.getElementById("address-form-container").style.display = "none"
      document.getElementById("addresses-container").style.display = "grid"
      addAddressBtn.style.display = "block"
    })
  }

  if (addressForm) {
    addressForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Get form values
      const addressId = document.getElementById("address-id").value
      const addressData = {
        id: addressId || generateId(),
        name: document.getElementById("address-name").value,
        recipient: document.getElementById("address-recipient").value,
        phone: document.getElementById("address-phone").value,
        street: document.getElementById("address-street").value,
        city: document.getElementById("address-city").value,
        postalCode: document.getElementById("address-postal").value,
        notes: document.getElementById("address-notes").value,
        isDefault: document.getElementById("address-default").checked,
      }

      // Get existing addresses
      const addresses = JSON.parse(localStorage.getItem("addresses")) || []

      if (addressId) {
        // Update existing address
        const index = addresses.findIndex((a) => a.id === addressId)

        if (index !== -1) {
          // If setting this address as default, unset others
          if (addressData.isDefault) {
            addresses.forEach((a) => {
              a.isDefault = false
            })
          }

          addresses[index] = addressData
        }
      } else {
        // Add new address

        // If setting this address as default, unset others
        if (addressData.isDefault) {
          addresses.forEach((a) => {
            a.isDefault = false
          })
        }

        // If this is the first address, make it default
        if (addresses.length === 0) {
          addressData.isDefault = true
        }

        addresses.push(addressData)
      }

      // Save addresses to localStorage
      localStorage.setItem("addresses", JSON.stringify(addresses))

      // Hide form
      document.getElementById("address-form-container").style.display = "none"
      document.getElementById("addresses-container").style.display = "grid"
      addAddressBtn.style.display = "block"

      // Reload addresses
      loadAddresses()

      // Show success message
      alert(addressId ? "Address updated successfully." : "Address added successfully.")
    })
  }
}

// Edit address
function editAddress(addressId) {
  // Get addresses from localStorage
  const addresses = JSON.parse(localStorage.getItem("addresses")) || []

  // Find the address
  const address = addresses.find((a) => a.id === addressId)

  if (address) {
    // Populate form
    document.getElementById("address-id").value = address.id
    document.getElementById("address-name").value = address.name
    document.getElementById("address-recipient").value = address.recipient
    document.getElementById("address-phone").value = address.phone
    document.getElementById("address-street").value = address.street
    document.getElementById("address-city").value = address.city
    document.getElementById("address-postal").value = address.postalCode
    document.getElementById("address-notes").value = address.notes || ""
    document.getElementById("address-default").checked = address.isDefault

    // Update form title
    document.getElementById("address-form-title").textContent = "Edit Address"

    // Show form
    document.getElementById("address-form-container").style.display = "block"
    document.getElementById("addresses-container").style.display = "none"
    document.getElementById("add-address-btn").style.display = "none"
  }
}

// Delete address
function deleteAddress(addressId) {
  if (confirm("Are you sure you want to delete this address?")) {
    // Get addresses from localStorage
    const addresses = JSON.parse(localStorage.getItem("addresses")) || []

    // Find the address
    const addressIndex = addresses.findIndex((a) => a.id === addressId)

    if (addressIndex !== -1) {
      // Check if it's the default address
      const isDefault = addresses[addressIndex].isDefault

      // Remove the address
      addresses.splice(addressIndex, 1)

      // If it was the default address and there are other addresses, make the first one default
      if (isDefault && addresses.length > 0) {
        addresses[0].isDefault = true
      }

      // Save addresses to localStorage
      localStorage.setItem("addresses", JSON.stringify(addresses))

      // Reload addresses
      loadAddresses()

      // Show success message
      alert("Address deleted successfully.")
    }
  }
}

// Set default address
function setDefaultAddress(addressId) {
  // Get addresses from localStorage
  const addresses = JSON.parse(localStorage.getItem("addresses")) || []

  // Update default status
  addresses.forEach((address) => {
    address.isDefault = address.id === addressId
  })

  // Save addresses to localStorage
  localStorage.setItem("addresses", JSON.stringify(addresses))

  // Reload addresses
  loadAddresses()

  // Show success message
  alert("Default address updated successfully.")
}

// Load wishlist
function loadWishlist() {
  const wishlistContainer = document.getElementById("wishlist-container")

  // Get wishlist from localStorage or use mock data
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || getMockWishlist()

  // Update wishlist count
  document.getElementById("wishlist-count").textContent = wishlist.length

  if (wishlistContainer) {
    wishlistContainer.innerHTML = ""

    if (wishlist.length === 0) {
      wishlistContainer.innerHTML = `
        <div class="no-data-message">
          <p>Your wishlist is empty.</p>
          <a href="products.html" class="btn">Browse Products</a>
        </div>
      `
    } else {
      wishlist.forEach((item) => {
        const wishlistItem = document.createElement("div")
        wishlistItem.className = "wishlist-item"

        wishlistItem.innerHTML = `
          <div class="wishlist-item-image">
            <img src="${item.image}" alt="${item.name}">
          </div>
          <div class="wishlist-item-details">
            <h4>${item.name}</h4>
            <p class="wishlist-item-price">${item.price}</p>
            <div class="wishlist-item-actions">
              <button class="btn-sm add-to-cart-from-wishlist" data-id="${item.id}">Add to Cart</button>
              <button class="btn-sm remove-from-wishlist" data-id="${item.id}">Remove</button>
            </div>
          </div>
        `

        wishlistContainer.appendChild(wishlistItem)
      })

      // Add event listeners to wishlist buttons
      document.querySelectorAll(".add-to-cart-from-wishlist").forEach((button) => {
        button.addEventListener("click", function () {
          const itemId = this.getAttribute("data-id")
          addToCartFromWishlist(itemId)
        })
      })

      document.querySelectorAll(".remove-from-wishlist").forEach((button) => {
        button.addEventListener("click", function () {
          const itemId = this.getAttribute("data-id")
          removeFromWishlist(itemId)
        })
      })
    }
  }
}

// Add to cart from wishlist
function addToCartFromWishlist(itemId) {
  // Get wishlist from localStorage
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || []

  // Find the item
  const item = wishlist.find((i) => i.id === itemId)

  if (item) {
    // Add to cart
    addToCart(item)

    // Show success message
    alert(`${item.name} has been added to your cart.`)
  }
}

// Remove from wishlist
function removeFromWishlist(itemId) {
  if (confirm("Are you sure you want to remove this item from your wishlist?")) {
    // Get wishlist from localStorage
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || []

    // Remove the item
    const updatedWishlist = wishlist.filter((item) => item.id !== itemId)

    // Save wishlist to localStorage
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist))

    // Reload wishlist
    loadWishlist()

    // Show success message
    alert("Item removed from wishlist.")
  }
}

// Initialize profile form
function initProfileForm() {
  const profileForm = document.getElementById("profile-form")

  if (profileForm) {
    profileForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Get form values
      const userData = {
        firstName: document.getElementById("profile-first-name").value,
        lastName: document.getElementById("profile-last-name").value,
        email: document.getElementById("profile-email").value,
        phone: document.getElementById("profile-phone").value,
        birthday: document.getElementById("profile-birthday").value,
        gender: document.querySelector('input[name="gender"]:checked').value,
      }

      // In a real implementation, this would call an API to update user data
      // For now, we'll just update the UI
      document.getElementById("user-name").textContent = `${userData.firstName} ${userData.lastName}`
      document.getElementById("user-email").textContent = userData.email

      // Show success message
      alert("Profile updated successfully.")
    })
  }
}

// Initialize password form
function initPasswordForm() {
  const passwordForm = document.getElementById("password-form")

  if (passwordForm) {
    passwordForm.addEventListener("submit", function (e) {
      e.preventDefault()

      // Get form values
      const currentPassword = document.getElementById("current-password").value
      const newPassword = document.getElementById("new-password").value
      const confirmPassword = document.getElementById("confirm-password").value

      // Validate passwords
      if (newPassword !== confirmPassword) {
        alert("New password and confirm password do not match.")
        return
      }

      // In a real implementation, this would call an API to update the password

      // Reset form
      this.reset()

      // Show success message
      alert("Password changed successfully.")
    })
  }
}

// Helper function to capitalize first letter
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

// Generate a random ID
function generateId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// Get mock orders data
function getMockOrders() {
  return [
    {
      orderNumber: "AZ-123456",
      orderDate: "March 5, 2025",
      status: "delivered",
      total: "350000",
      items: [
        {
          id: 1,
          name: "Chocolate Cake",
          price: "Rp 150.000",
          quantity: 1,
          size: "Medium",
        },
        {
          id: 2,
          name: "Strawberry Cheesecake",
          price: "Rp 180.000",
          quantity: 1,
          size: "Medium",
        },
      ],
    },
    {
      orderNumber: "AZ-123457",
      orderDate: "February 20, 2025",
      status: "delivered",
      total: "160000",
      items: [
        {
          id: 3,
          name: "Tiramisu",
          price: "Rp 160.000",
          quantity: 1,
          size: "Medium",
        },
      ],
    },
    {
      orderNumber: "AZ-123458",
      orderDate: "March 1, 2025",
      status: "shipped",
      total: "120000",
      items: [
        {
          id: 4,
          name: "Red Velvet Cupcakes",
          price: "Rp 120.000",
          quantity: 1,
          size: "Medium",
        },
      ],
    },
    {
      orderNumber: "AZ-123459",
      orderDate: "March 7, 2025",
      status: "processing",
      total: "140000",
      items: [
        {
          id: 5,
          name: "Vanilla Bean Cake",
          price: "Rp 140.000",
          quantity: 1,
          size: "Medium",
        },
      ],
    },
    {
      orderNumber: "AZ-123460",
      orderDate: "March 7, 2025",
      status: "pending",
      total: "80000",
      items: [
        {
          id: 6,
          name: "Chocolate Chip Cookies",
          price: "Rp 80.000",
          quantity: 1,
          size: "Medium",
        },
      ],
    },
  ]
}

// Get mock addresses data
function getMockAddresses() {
  return [
    {
      id: "addr1",
      name: "Home",
      recipient: "John Doe",
      phone: "123-456-7890",
      street: "123 Main Street",
      city: "Sweet City",
      postalCode: "12345",
      notes: "Near the park",
      isDefault: true,
    },
    {
      id: "addr2",
      name: "Office",
      recipient: "John Doe",
      phone: "123-456-7890",
      street: "456 Business Avenue",
      city: "Sweet City",
      postalCode: "12345",
      notes: "Building B, Floor 3",
      isDefault: false,
    },
  ]
}

// Get mock wishlist data
function getMockWishlist() {
  return [
    {
      id: "7",
      name: "Mango Mousse",
      price: "Rp 130.000",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "8",
      name: "Blueberry Muffins",
      price: "Rp 90.000",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "5",
      name: "Vanilla Bean Cake",
      price: "Rp 140.000",
      image: "/placeholder.svg?height=200&width=300",
    },
  ]
}

// Add to cart function (simplified version)
function addToCart(product, quantity = 1, size = "Medium") {
  // Get cart from localStorage
  const cart = JSON.parse(localStorage.getItem("cart")) || []

  // Check if product already exists in cart
  const existingProductIndex = cart.findIndex((item) => item.id === product.id && item.size === size)

  if (existingProductIndex !== -1) {
    // Update quantity if product already exists
    cart[existingProductIndex].quantity += quantity
  } else {
    // Add new product to cart
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity,
      size: size,
    })
  }

  // Save cart to localStorage
  localStorage.setItem("cart", JSON.stringify(cart))

  // Update cart count
  updateCartCount()
}

// Update cart count
function updateCartCount() {
  const cartCountElement = document.getElementById("cart-count")

  if (cartCountElement) {
    // Get cart from localStorage
    const cart = JSON.parse(localStorage.getItem("cart")) || []

    // Calculate total items in cart
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0)

    // Update cart count element
    cartCountElement.textContent = cartCount
  }
}

