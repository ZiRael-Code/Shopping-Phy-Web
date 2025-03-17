  
    document.addEventListener("DOMContentLoaded", function () {
        // Select all <a> inside .single-related-product
        const productLinks = document.querySelectorAll(".single-related-product a");
    
        productLinks.forEach((link, index) => {
            link.addEventListener("click", function (event) {
                event.preventDefault(); // Stop default <a> behavior
                goToProductDetails(index);
            });
        });
    });
    
    // Function to navigate to product details
    function goToProductDetails(index) {
        console.log("Navigating to product details for item at index:", index);
        // Replace this with your actual navigation logic
        window.location.href = `single-product.html?index=${index}`;
    }

    

// Attach event listeners to "View more" buttons
document.querySelectorAll(".lnr-move").forEach(button => {
  button.parentElement.addEventListener("click", function (event) {
      event.preventDefault(); // Prevent default link behavior

      // Get the car name from the closest product details section
      let carName = this.closest(".single-product").querySelector("h6").textContent.trim();

      // Find the car object in the array
      let foundCars = null;

      // Iterate over all brands and their car lists
      cars.forEach(brandObj => {
          Object.values(brandObj).forEach(brand => {
              brand.cars.forEach(car => {
                  if (car.name === carName) {
                      foundCar = car;

                  }
              });
          });
      });

      if (foundCar) {
          // Convert object to query string
          let queryParams = new URLSearchParams(foundCar).toString();
          window.location.href = `single-product.html?${queryParams}`;
      } else {
          alert("Car details not found!");
      }
  });
});


// Function to generate a random car description
function generateCarDescription(car) {
  return `The ${car.name} is a stylish and reliable ${car.year} model from ${car.make}, featuring a powerful ${car.engine} engine. With its elegant ${car.color} finish, this car combines performance and aesthetics for a premium driving experience.`;
}

// Function to update product details based on URL parameters
function updateProductDetails() {
  // Get URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const car = {
      name: urlParams.get("name"),
      make: urlParams.get("make"),
      year: urlParams.get("year"),
      color: urlParams.get("color"),
      engine: urlParams.get("engine"),
      imgLink: urlParams.get("imgLink"),
  };

  // Check if required data exists
  if (!car.name || !car.imgLink) {
      console.error("Car data is missing in URL parameters.");
      return;
  }

  // Update the image
  document.querySelectorAll(".s_Product_carousel .single-prd-item img").forEach(img => {
      img.src = car.imgLink;
      img.alt = car.name;
  });

  // Update the name
  document.querySelector(".s_product_text h3").textContent = car.name;

  // Generate and update the description
  document.querySelector(".s_product_text p").textContent = generateCarDescription(car);

  // Update category (assuming category refers to the car make)
  document.querySelector(".list li:first-child a").innerHTML = `<span>Category</span> : ${car.make}`;

  // Set availability (assuming the car is always in stock)
  document.querySelector(".list li:nth-child(2) a").innerHTML = `<span>Availability</span> : In Stock`;
}

// Call the function when the page loads
document.addEventListener("DOMContentLoaded", updateProductDetails);











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

















    var cars = [
        {
          "Toyota": {
            "cars": [
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
              }
            ]
          }
        },
        {
          "Mercedes-Benz": {
            "cars": [
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
              }
            ]
          }
        },
        {
          "Rolls-Royce": {
            "cars": [
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
              }
            ]
          }
        },
        {
          "Suzuki": {
              "cars": [
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
                  }
              ]
          }
      },
      {
        "Kia": {
    "cars": [
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
    ]
}

      }
      
      ]
      
    
    
    