

// Function to retrieve product list from URL and update the HTML dynamically
function updateProductList() {
  console.log("updateProductList function called.");

  // Get URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const productsData = urlParams.get("objs");

  console.log("Raw URL parameter (res):", productsData);

  let products;

  // Check if products data exists in URL
  if (productsData) {
      try {
          products = JSON.parse(decodeURIComponent(productsData));
          console.log("Parsed products from URL:", products);
      } catch (error) {
          console.error("Error parsing product data from URL:", error);
          products = cars; // Use default if parsing fails
      }
  } else {
      console.warn("No products data in URL. Using default cars array.");
      products = cars; // Use default if URL parameter is empty
  }

  // Verify if products is an array
  if (!Array.isArray(products)) {
      console.error("Expected an array but got:", products);
      return;
  }

  // Get the row container where products will be inserted
  const productRow = document.querySelector(".lattest-product-area .row");

  if (!productRow) {
      console.error("Product row container not found!");
      return;
  }

  console.log("Clearing existing content in productRow.");
  productRow.innerHTML = "";

  // Loop through each product and dynamically generate the product HTML
  products.forEach((product, index) => {
      console.log(`Processing product ${index + 1}:`, product);

      if (!product.imgLink || !product.name) {
          console.warn("Skipping product due to missing data:", product);
          return;
      }

      let productHTML = `
      <div class="col-lg-4 col-md-6">
          <div class="single-product">
              <img class="img-fluid" src="${product.imgLink}" alt="${product.name}">
              <div class="product-details">
                  <h6>${product.name}</h6>
                  <p>${product.make} - ${product.year} - ${product.color}</p>
                  <p><strong>Engine:</strong> ${product.engine}</p>
                  <div class="prd-bottom">
                      <a href="#" class="social-info">
                          <span class="ti-bag"></span>
                          <p class="hover-text">Add to Bag</p>
                      </a>
                      <a href="#" class="social-info">
                          <span class="lnr lnr-heart"></span>
                          <p class="hover-text">Wishlist</p>
                      </a>
                      <a href="#" class="social-info">
                          <span class="lnr lnr-sync"></span>
                          <p class="hover-text">Compare</p>
                      </a>
                      <a href="#" class="social-info">
                          <span class="lnr lnr-move"></span>
                          <p class="hover-text">View More</p>
                      </a>
                  </div>
              </div>
          </div>
      </div>`;

      // Append the generated product HTML to the container
      productRow.innerHTML += productHTML;
  });

  console.log("Product list updated successfully.");
}

// Call the function when the page loads
document.addEventListener("DOMContentLoaded", updateProductList);

















// Call the function when the page loads
document.addEventListener("DOMContentLoaded", updateProductList);

    var cars = [
       
              {
                "name": "Toyota Camry",
                "make": "Toyota",
                "year": "2018",
                "color": "Silver",
                "engine": "2.5L 4-Cylinder",
                "imgLink": "./img/silver-camery-small.jpg"
              },
              {
                "name": "Toyota Sienna",
                "make": "Toyota",
                "year": "2023",
                "color": "White",
                "engine": "3.5L V6",
                "imgLink": "./img/toyota-sienna.png"
              },
              {
                "name": "Toyota Corolla",
                "make": "Toyota",
                "year": "2021",
                "color": "White",
                "engine": "1.8L 4-Cylinder",
                "imgLink": "./img/toyota-corrolla.png"
              },
              {
                "name": "Mercedes-Benz GLE",
                "make": "Mercedes-Benz",
                "year": "2021",
                "color": "Black",
                "engine": "3.0L Inline-6 Turbo",
                "imgLink": "./img/black-benz.png"
                            },
              {
                "name": "Mercedes-Benz C-Class",
                "make": "Mercedes-Benz",
                "year": "2019",
                "color": "White",
                "engine": "2.0L Turbocharged",
                "imgLink": "./img/white-benz.png"
              },
       
              {
                "name": "Rolls-Royce Ghost",
                "make": "Rolls-Royce",
                "year": "2019",
                "color": "Blue",
                "engine": "6.75L V12",
                "imgLink": "./img/royce-ghost.png"
               },
              {
                "name": "Rolls-Royce Phantom",
                "make": "Rolls-Royce",
                "year": "2021",
                "color": "Silver",
                "engine": "6.75L V12",
                "imgLink": "./img/royce-phantom.png"
              },
                  {
                      "name": "Suzuki Swift",
                      "make": "Suzuki",
                      "year": "2022",
                      "color": "Red",
                      "engine": "1.2L Inline-4",
                      "imgLink": "./img/suzuki-swift-red.png"
                  },
                  {
                      "name": "Suzuki Vitara",
                      "make": "Suzuki",
                      "year": "2021",
                      "color": "Blue",
                      "engine": "1.4L Turbo Inline-4",
                      "imgLink": "./img/suzuki-vitara-blue.png"
                  },
                  {
                      "name": "Suzuki Jimny",
                      "make": "Suzuki",
                      "year": "2021",
                      "color": "Green",
                      "engine": "1.5L Inline-4",
                      "imgLink": "./img/suzuki-jimny-green.png"
                  },
                  {
                      "name": "Suzuki Ciaz",
                      "make": "Suzuki",
                      "year": "2023",
                      "color": "White",
                      "engine": "1.5L Inline-4",
                      "imgLink": "./img/suzuki-ciaz-white.png"
                  },
          {
            "name": "Kia Sportage",
            "make": "Kia",
            "year": "2023",
            "color": "Black",
            "engine": "2.5L Inline-4",
            "imgLink": "./img/kia-sportage-black.png"
        },
        {
            "name": "Kia Sorento",
            "make": "Kia",
            "year": "2022",
            "color": "White",
            "engine": "2.5L Turbo Inline-4",
            "imgLink": "./img/kia-sorento-white.png"
        },
        {
            "name": "Kia Seltos",
            "make": "Kia",
            "year": "2023",
            "color": "Red",
            "engine": "1.6L Turbo Inline-4",
            "imgLink": "./img/kia-seltos-red.png"
        },
        {
            "name": "Kia Rio",
            "make": "Kia",
            "year": "2021",
            "color": "Blue",
            "engine": "1.6L Inline-4",
            "imgLink": "./img/kia-rio-blue.png"
        }
  
      
      ];
      
    
    
    
      
    
    
    