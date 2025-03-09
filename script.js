document.addEventListener("DOMContentLoaded", () => {
  // Initialize mobile menu
  initMobileMenu()

  // Initialize dark mode
  initDarkMode()

  // Initialize back to top button
  initBackToTop()

  // Initialize countdown timer
  initCountdown()

  // Initialize cart functionality
  initCart()

  // Initialize product sliders
  initSliders()

  // Initialize newsletter form
  initNewsletterForm()

  // Initialize testimonials slider
  initTestimonialsSlider()

  // Initialize product quick view
  initQuickView()

  // Initialize wishlist functionality
  initWishlist()

  // Initialize product filtering
  initProductFiltering()
})

// Mobile Menu
function initMobileMenu() {
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn")
  const menu = document.querySelector(".menu")

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", function () {
      menu.classList.toggle("active")
      this.querySelector("i").classList.toggle("fa-bars")
      this.querySelector("i").classList.toggle("fa-times")
    })
  }
}

// Dark Mode
function initDarkMode() {
  const darkModeToggle = document.getElementById("dark-mode-toggle")
  const body = document.body

  // Check for saved user preference
  const darkMode = localStorage.getItem("darkMode")

  // If dark mode was previously enabled, apply it
  if (darkMode === "enabled") {
    enableDarkMode()
  }

  if (darkModeToggle) {
    darkModeToggle.addEventListener("click", () => {
      // Check if dark mode is currently enabled
      const darkMode = localStorage.getItem("darkMode")

      // If it's not currently enabled, enable it
      if (darkMode !== "enabled") {
        enableDarkMode()
      } else {
        disableDarkMode()
      }
    })
  }

  function enableDarkMode() {
    body.classList.add("dark")
    localStorage.setItem("darkMode", "enabled")
    if (darkModeToggle) {
      darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>'
    }
  }

  function disableDarkMode() {
    body.classList.remove("dark")
    localStorage.setItem("darkMode", null)
    if (darkModeToggle) {
      darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>'
    }
  }
}

// Back to Top Button
function initBackToTop() {
  const backToTopButton = document.getElementById("back-to-top")

  if (backToTopButton) {
    // Show button when user scrolls down 300px
    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 300) {
        backToTopButton.classList.add("active")
      } else {
        backToTopButton.classList.remove("active")
      }
    })

    // Scroll to top when button is clicked
    backToTopButton.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    })
  }
}

// Countdown Timer
function initCountdown() {
  const countdownElement = document.getElementById("offer-countdown")

  if (countdownElement) {
    // Set the date we're counting down to (7 days from now)
    const countDownDate = new Date()
    countDownDate.setDate(countDownDate.getDate() + 7)

    // Update the countdown every 1 second
    const countdownInterval = setInterval(() => {
      // Get current date and time
      const now = new Date().getTime()

      // Find the distance between now and the countdown date
      const distance = countDownDate - now

      // Time calculations for days, hours, minutes and seconds
      const days = Math.floor(distance / (1000 * 60 * 60 * 24))
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)

      // Display the result
      document.querySelector(".days").textContent = days.toString().padStart(2, "0")
      document.querySelector(".hours").textContent = hours.toString().padStart(2, "0")
      document.querySelector(".minutes").textContent = minutes.toString().padStart(2, "0")
      document.querySelector(".seconds").textContent = seconds.toString().padStart(2, "0")

      // If the countdown is finished, clear interval and display message
      if (distance < 0) {
        clearInterval(countdownInterval)
        countdownElement.innerHTML = "<p>Offer has expired!</p>"
      }
    }, 1000)
  }
}

// Cart Functionality
function initCart() {
  // Load cart from localStorage
  const cart = JSON.parse(localStorage.getItem("cart")) || []

  // Update cart count
  updateCartCount()

  // Add to cart buttons
  const addToCartButtons = document.querySelectorAll(".add-to-cart")

  if (addToCartButtons.length > 0) {
    addToCartButtons.forEach((button) => {
      button.addEventListener("click", function (e) {
        e.preventDefault()

        const productId = this.getAttribute("data-id")
        const productCard = this.closest(".product-card")

        if (productCard) {
          const productName = productCard.querySelector(".product-title").textContent
          const productPrice = productCard.querySelector(".product-price").textContent.replace("$", "")
          const productImage = productCard.querySelector(".product-image img").getAttribute("src")

          // Check if product already exists in cart
          const existingProductIndex = cart.findIndex((item) => item.id === productId)

          if (existingProductIndex > -1) {
            // Product exists, increase quantity
            cart[existingProductIndex].quantity += 1
          } else {
            // Product doesn't exist, add new item
            cart.push({
              id: productId,
              name: productName,
              price: Number.parseFloat(productPrice),
              image: productImage,
              quantity: 1,
            })
          }

          // Save cart to localStorage
          localStorage.setItem("cart", JSON.stringify(cart))

          // Update cart count
          updateCartCount()

          // Show success toast
          showToast("Success", `${productName} added to cart!`, "success")
        }
      })
    })
  }

  // Update cart count function
  function updateCartCount() {
    const cartCountElement = document.getElementById("cart-count")

    if (cartCountElement) {
      const totalItems = cart.reduce((total, item) => total + item.quantity, 0)
      cartCountElement.textContent = totalItems
    }
  }
}

// Product Sliders
function initSliders() {
  // This would typically use a slider library like Swiper or Slick
  // For this example, we'll just implement a basic manual slider

  // Product thumbnails in product detail page
  const productThumbnails = document.querySelectorAll(".product-thumbnail")
  const mainImage = document.querySelector(".product-main-image img")

  if (productThumbnails.length > 0 && mainImage) {
    productThumbnails.forEach((thumbnail) => {
      thumbnail.addEventListener("click", function () {
        // Remove active class from all thumbnails
        productThumbnails.forEach((thumb) => thumb.classList.remove("active"))

        // Add active class to clicked thumbnail
        this.classList.add("active")

        // Update main image
        const newImageSrc = this.querySelector("img").getAttribute("src")
        mainImage.setAttribute("src", newImageSrc)
      })
    })
  }
}

// Newsletter Form
function initNewsletterForm() {
  const newsletterForm = document.querySelector(".newsletter-form")

  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault()

      const emailInput = this.querySelector('input[type="email"]')
      const email = emailInput.value.trim()

      if (email) {
        // In a real implementation, this would send the email to a server
        // For now, we'll just show a success message

        // Clear the input
        emailInput.value = ""

        // Show success toast
        showToast("Success", "Thank you for subscribing to our newsletter!", "success")
      }
    })
  }
}

// Testimonials Slider
function initTestimonialsSlider() {
  const testimonials = document.querySelectorAll(".testimonial")
  let currentTestimonial = 0

  if (testimonials.length > 1) {
    // Hide all testimonials except the first one
    testimonials.forEach((testimonial, index) => {
      if (index !== 0) {
        testimonial.style.display = "none"
      }
    })

    // Auto-rotate testimonials every 5 seconds
    setInterval(() => {
      // Hide current testimonial
      testimonials[currentTestimonial].style.display = "none"

      // Move to next testimonial
      currentTestimonial = (currentTestimonial + 1) % testimonials.length

      // Show next testimonial
      testimonials[currentTestimonial].style.display = "block"
    }, 5000)
  }
}

// Product Quick View
function initQuickView() {
  // This would typically open a modal with product details
  // For this example, we'll just redirect to the product detail page

  const quickViewButtons = document.querySelectorAll(".product-overlay-buttons a:first-child")

  if (quickViewButtons.length > 0) {
    quickViewButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        // In a real implementation, this would open a modal
        // For now, we'll just let the link navigate to the product detail page
      })
    })
  }
}

// Wishlist Functionality
function initWishlist() {
  // Load wishlist from localStorage
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || []

  // Add to wishlist buttons
  const addToWishlistButtons = document.querySelectorAll(".add-to-wishlist")

  if (addToWishlistButtons.length > 0) {
    addToWishlistButtons.forEach((button) => {
      button.addEventListener("click", function (e) {
        e.preventDefault()

        const productId = this.getAttribute("data-id")
        const productCard = this.closest(".product-card")

        if (productCard) {
          const productName = productCard.querySelector(".product-title").textContent
          const productPrice = productCard.querySelector(".product-price").textContent.replace("$", "")
          const productImage = productCard.querySelector(".product-image img").getAttribute("src")

          // Check if product already exists in wishlist
          const existingProductIndex = wishlist.findIndex((item) => item.id === productId)

          if (existingProductIndex > -1) {
            // Product exists, remove from wishlist
            wishlist.splice(existingProductIndex, 1)

            // Show info toast
            showToast("Info", `${productName} removed from wishlist!`, "info")
          } else {
            // Product doesn't exist, add to wishlist
            wishlist.push({
              id: productId,
              name: productName,
              price: Number.parseFloat(productPrice),
              image: productImage,
            })

            // Show success toast
            showToast("Success", `${productName} added to wishlist!`, "success")
          }

          // Save wishlist to localStorage
          localStorage.setItem("wishlist", JSON.stringify(wishlist))

          // Update wishlist icon
          this.querySelector("i").classList.toggle("fas")
          this.querySelector("i").classList.toggle("far")
        }
      })
    })
  }
}

// Product Filtering
function initProductFiltering() {
  const filterSelect = document.querySelector(".products-filter select")
  const productsGrid = document.querySelector(".products-grid")

  if (filterSelect && productsGrid) {
    filterSelect.addEventListener("change", function () {
      const filterValue = this.value

      // In a real implementation, this would filter products based on the selected value
      // For now, we'll just show a message

      showToast("Info", `Products filtered by: ${filterValue}`, "info")
    })
  }
}

// Toast Notifications
function showToast(title, message, type = "info") {
  const toastContainer = document.getElementById("toast-container")

  if (toastContainer) {
    // Create toast element
    const toast = document.createElement("div")
    toast.className = `toast ${type}`

    // Set toast content
    toast.innerHTML = `
      <i class="fas ${getToastIcon(type)}"></i>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
      </div>
      <i class="fas fa-times toast-close"></i>
    `

    // Add toast to container
    toastContainer.appendChild(toast)

    // Add event listener to close button
    toast.querySelector(".toast-close").addEventListener("click", () => {
      toast.classList.add("slide-out")

      // Remove toast after animation completes
      setTimeout(() => {
        toastContainer.removeChild(toast)
      }, 300)
    })

    // Auto-remove toast after 5 seconds
    setTimeout(() => {
      if (toastContainer.contains(toast)) {
        toast.classList.add("slide-out")

        // Remove toast after animation completes
        setTimeout(() => {
          if (toastContainer.contains(toast)) {
            toastContainer.removeChild(toast)
          }
        }, 300)
      }
    }, 5000)
  }

  // Helper function to get the appropriate icon for each toast type
  function getToastIcon(type) {
    switch (type) {
      case "success":
        return "fa-check-circle"
      case "error":
        return "fa-exclamation-circle"
      case "warning":
        return "fa-exclamation-triangle"
      case "info":
      default:
        return "fa-info-circle"
    }
  }
}

