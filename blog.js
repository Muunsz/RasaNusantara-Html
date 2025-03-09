document.addEventListener("DOMContentLoaded", () => {
  // Initialize blog functionality
  initSearch()
  initNewsletterForm()
  initCommentForm()
  loadRecentPosts()
  updateCartCount()

  // Initialize mobile menu
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn")
  const menu = document.querySelector(".menu")

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", function () {
      menu.classList.toggle("active")
      this.querySelector("i").classList.toggle("fa-bars")
      this.querySelector("i").classList.toggle("fa-times")
    })
  }
})

// Initialize search functionality
function initSearch() {
  const searchForm = document.querySelector(".search-form")

  if (searchForm) {
    searchForm.addEventListener("submit", function (e) {
      e.preventDefault()

      const searchTerm = this.querySelector("input").value.trim()

      if (searchTerm) {
        // In a real implementation, this would search the blog posts
        alert(`Searching for: ${searchTerm}`)

        // Redirect to search results page (in a real implementation)
        // window.location.href = `search-results.html?q=${encodeURIComponent(searchTerm)}`;
      }
    })
  }
}

// Initialize newsletter form
function initNewsletterForm() {
  const newsletterForm = document.querySelector(".newsletter-form")

  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault()

      const email = this.querySelector("input").value.trim()

      if (email) {
        // In a real implementation, this would subscribe the user to the newsletter
        alert(`Thank you for subscribing with: ${email}`)

        // Reset form
        this.reset()
      }
    })
  }
}

// Initialize comment form (for blog post page)
function initCommentForm() {
  const commentForm = document.getElementById("comment-form")

  if (commentForm) {
    commentForm.addEventListener("submit", function (e) {
      e.preventDefault()

      // Get form values
      const name = document.getElementById("comment-name").value.trim()
      const email = document.getElementById("comment-email").value.trim()
      const content = document.getElementById("comment-content").value.trim()

      if (name && email && content) {
        // In a real implementation, this would submit the comment to the server

        // Create new comment element
        const newComment = document.createElement("div")
        newComment.className = "comment"

        newComment.innerHTML = `
          <div class="comment-avatar">
            <img src="/placeholder.svg?height=60&width=60" alt="${name}">
          </div>
          <div class="comment-content">
            <div class="comment-meta">
              <h4>${name}</h4>
              <span class="comment-date">Just now</span>
            </div>
            <p>${content}</p>
            <a href="#" class="reply-link">Reply</a>
          </div>
        `

        // Add new comment to comments list
        const commentsList = document.querySelector(".comments-list")
        commentsList.appendChild(newComment)

        // Update comments count
        const commentsCount = document.querySelector(".comments-count")
        const currentCount = Number.parseInt(commentsCount.textContent)
        commentsCount.textContent = currentCount + 1

        // Reset form
        this.reset()

        // Show success message
        alert("Your comment has been submitted successfully.")
      }
    })
  }
}

// Load recent posts (for sidebar)
function loadRecentPosts() {
  const recentPostsList = document.querySelector(".recent-posts-list")

  if (recentPostsList) {
    // In a real implementation, this would fetch recent posts from the server
    // For now, we'll use the existing posts in the HTML
  }
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

