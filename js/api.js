// api.js
document.addEventListener("DOMContentLoaded", function () {
  fetchProducts();
});

async function fetchProducts() {
  try {
    const response = await fetch(
      "https://e-comerce-ws5c.onrender.com/products"
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const products = await response.json();
    displayProducts(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    // Fallback to some default products or show error message
  }
}

let cartCount = 0;
const cartCountSpan = document.querySelector(".fa-shopping-cart + span"); // selects the <span> next to the cart icon

// Load initial cart count
fetch("/api/cart")
  .then((res) => res.json())
  .then((data) => {
    cartCount = data.length;
    updateCartCount();
  });

function updateCartCount() {
  cartCountSpan.textContent = cartCount;
}

function addToCart(product) {
  const email = localStorage.getItem("userEmail");
  const data = {
    email: email,
    productId: product.id,
  };
  fetch(`https://e-comerce-ws5c.onrender.com/api/cart/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then(() => {
      cartCount++;
      updateCartCount();
    })
    .catch((err) => console.error("Error adding to cart:", err));
}

function displayProducts(products) {
  const productsContainer = document.querySelector(".products");

  if (!productsContainer || !products.length) return;

  productsContainer.innerHTML = ""; // Clear existing hardcoded products

  // products.forEach(product => {
  //   const productCard = document.createElement('div');
  //   productCard.className = 'product-card';

  //   // Add badge if needed (you can modify this based on your product data)
  //   if (product.discount) {
  //     productCard.innerHTML += `<div class="product-badge">Sale</div>`;
  //   } else if (product.isNew) {
  //     productCard.innerHTML += `<div class="product-badge">New</div>`;
  //   }

  //   productCard.innerHTML += `
  //     <div class="product-thumb">
  //       <img src="${product.url || 'https://via.placeholder.com/300'}" alt="${product.name}" />
  //     </div>
  //     <div class="product-details">
  //       <span class="product-category">${product.category || 'General'}</span>
  //       <h4 class="product-title">${product.name}</h4>
  //       <div class="product-bottom">
  //         <div class="product-price">
  //           $${product.price.toFixed(2)}
  //           ${product.price ? `<span>$${product.price.toFixed(2)}</span>` : ''}
  //         </div>
  //         <div class="product-links">
  //           <a href="#"><i class="far fa-heart"></i></a>
  //           <a href="#" onclick="event.preventDefault(); showCartAlert()">
  //             <i class="fas fa-shopping-cart"></i>
  //           </a>
  //         </div>
  //       </div>
  //     </div>
  //   `;

  //   productsContainer.appendChild(productCard);
  // });

  products.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.className = "product-card";

    if (product.discount) {
      productCard.innerHTML += `<div class="product-badge">Sale</div>`;
    } else if (product.isNew) {
      productCard.innerHTML += `<div class="product-badge">New</div>`;
    }

    productCard.innerHTML += `
        <div class="product-thumb">
          <img src="${product.url || "https://via.placeholder.com/300"}" alt="${
      product.name
    }" />
        </div>
        <div class="product-details">
          <span class="product-category">${product.category || "General"}</span>
          <h4 class="product-title">${product.name}</h4>
          <div class="product-bottom">
            <div class="product-price">
              $${product.price.toFixed(2)}
              ${
                product.price ? `<span>$${product.price.toFixed(2)}</span>` : ""
              }
            </div>
            <div class="product-links">
              <a href="#"><i class="far fa-heart"></i></a>
              <a href="#" onclick='event.preventDefault(); addToCart(${JSON.stringify(
                product
              )})'>
                <i class="fas fa-shopping-cart"></i>
              </a>
            </div>
          </div>
        </div>
      `;

    productsContainer.appendChild(productCard);
  });
}

// Make this function available globally
window.showCartAlert = function () {
  Swal.fire({
    title: "Added to cart!",
    text: "Your item has been successfully added.",
    icon: "success",
    confirmButtonText: "OK",
    timer: 2000,
    timerProgressBar: true,
  });
};
