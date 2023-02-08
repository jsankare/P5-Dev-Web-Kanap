// cart -------------------------------------
function getUniqueIds(cart) {
  let ids = []

  // Iterate through the cart items
  for (const item of cart) {
    let found = false

    // Check if the current item's ID is already in the list of unique IDs
    for (const id of ids) {
      if (item.id === id) {
        found = true
      }
    }

    // If the current item's ID is not in the list, add it
    if (found === false) {
      ids.push(item.id)
    }
  }
  return ids
}

async function getProducts(ids) {
  let products = []

  for (const id of ids) {
    const response = await fetch(`http://localhost:3000/api/products/${id}`)
    const product = await response.json()
    products.push(product)
  }

  return products
}

async function showCart() {

  // Get the cart from local storage and parse it into a JavaScript object
  let cart = JSON.parse(localStorage.getItem('cart')) || []
  // Get the unique ids of the items in cart
  const ids = getUniqueIds(cart)
  // Get all the products details of the items in the cart
  const products = await getProducts(ids)
  // Get the element where we will display the items in cart
  const cartSection = document.getElementById('cart__items')
  // Get the elements where we will display the total Quantity and total Price
  const totalQuantity = document.getElementById('totalQuantity')
  const totalPrice = document.getElementById('totalPrice')
  const cartTitle = document.querySelector('#cartAndFormContainer h1')
  let totalQuantityValue = 0
  let totalPriceValue = 0
  let selectedProduct = []

  // If the cart is empty 
  if (!cart || cart.length === 0) {
    cartTitle.innerHTML = `Votre panier est vide`
  }
  else {
      // Iterate through the cart items and display them
      for (const item of cart) {
        for (const product of products) {

          // Get the product details of the current item
          if (product._id === item.id) {
            selectedProduct = product
          }
        }
        cartSection.innerHTML += `
          <article class="cart__item" data-id="${item.id}" data-color="${item.color}">
              <div class="cart__item__img">
                <img src="${selectedProduct.imageUrl}" alt="${selectedProduct.altTxt}">
              </div>
              <div class="cart__item__content">
                <div class="cart__item__content__description">
                  <h2>${selectedProduct.name}</h2>
                  <p>${item.color}</p>
                  <p>${selectedProduct.price} €</p>
                </div>
                <div class="cart__item__content__settings">
                  <div class="cart__item__content__settings__quantity">
                    <p>Quantité : ${item.quantity}</p>
                    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${item.quantity}">
                  </div>
                  <div class="cart__item__content__settings__delete">
                    <p class="deleteItem">Supprimer</p>
                  </div>
                </div>
              </div>
            </article>
      `
      // Calculate the total Quantity and total Price
      totalQuantityValue += +item.quantity 
      totalPriceValue += item.quantity * selectedProduct.price
      }  
  }
  // Display the total Quantity and total Price
  totalPrice.innerHTML = `${totalPriceValue}`
  totalQuantity.innerHTML = totalQuantityValue

  // Delete and modify items from cart here
  const deleteButtons = document.getElementsByClassName('deleteItem')

  for (const deleteButton of deleteButtons) {
    // Add a click event listener to every delete button
    deleteButton.addEventListener('click', deleteItem)
  }

  function deleteItem(event) {

    // Get the parent element of the delete button (the cart item)
    const cartItem = event.target.parentElement.parentElement.parentElement.parentElement

    const idItem = cartItem.getAttribute('data-id')
    const colorItem = cartItem.getAttribute('data-color')

    // Get cart from localstorage and parses it
    let cart = JSON.parse(localStorage.getItem('cart')) || []

    cart = cart.filter(item => item.id !== idItem || item.color !== colorItem)
  
    localStorage.setItem('cart', JSON.stringify(cart))

    cartItem.remove()
    window.location.reload()
  }

  const modifyInputs = document.getElementsByClassName('itemQuantity')

  for (const modifyInput of modifyInputs) {
    modifyInput.addEventListener('change', changeItem)
  }
  
  function changeItem(event) {
    // Get the parent element of the input (the cart item)
    const cartItem = event.target.parentElement.parentElement.parentElement.parentElement
    
    const idItem = cartItem.getAttribute('data-id')
    const colorItem = cartItem.getAttribute('data-color')
  
    // Get cart from localstorage and parse it
    let cart = JSON.parse(localStorage.getItem('cart')) || []
  
    // Find the item with the matching id and color
    let item = cart.find(item => item.id === idItem && item.color === colorItem)
    
    // Update the item's quantity
    item.quantity = +event.target.value
    
    // Update the total quantity and total price
    let totalQuantityValue = 0
    let totalPriceValue = 0
    
    for (const item of cart) {
      totalQuantityValue += +item.quantity
      totalPriceValue += item.quantity * products.find(product => product._id === item.id).price
    }
    
    // Update the elements that display the total quantity and total price
    totalQuantity.innerHTML = totalQuantityValue
    totalPrice.innerHTML = totalPriceValue
    
    // Update the elements that display the quantity of each product -- doesn't update proprely
    const itemQuantities = document.getElementsByClassName('itemQuantity')
    for (const itemQuantity of itemQuantities) {
      if (itemQuantity.parentElement.parentElement.parentElement.parentElement.getAttribute('data-id') === idItem && itemQuantity.parentElement.parentElement.parentElement.parentElement.getAttribute('data-color') === colorItem) {
        itemQuantity.previousElementSibling.innerHTML = `Quantité : ${event.target.value}`
        itemQuantity.value = event.target.value;
      }
    }
    
    // Save the updated cart to localstorage
    localStorage.setItem('cart', JSON.stringify(cart))
  }
}
showCart()

const cart = JSON.parse(localStorage.getItem('cart')) || []
localStorage.setItem("cart", JSON.stringify(cart))
window.location.reload


// Form ----------------------------------

const errorMessageTexts = {
  firstName: "prénom",
  lastName: "nom",
  address: "adresse",
  city: "ville",
  email: "email",
  button: "bouton",
}

const inputs = {
  firstName: document.getElementById("firstName"),
  lastName: document.getElementById("lastName"),
  address: document.getElementById("address"),
  city: document.getElementById("city"),
  email: document.getElementById("email"),
  button: document.getElementById("order"),
};

const errorMessages = {
  firstName: document.getElementById("firstNameErrorMsg"),
  lastName: document.getElementById("lastNameErrorMsg"),
  address: document.getElementById("addressErrorMsg"),
  city: document.getElementById("cityErrorMsg"),
  email: document.getElementById("emailErrorMsg"),
  button: document.getElementById("orderErrorMsg"),
};

const button = document.getElementById("order")

// Regex

const nameRegex = /^[a-zA-Z]+$/
const addressRegex = /^[a-zA-Z0-9\s,'-]+$/
const cityRegex = /^[a-zA-Z\s]+$/
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

const finishOrder = () => {
  button.addEventListener("click", function () {
    let error = false;

    if (!nameRegex.test(inputs.firstName.value)) {
      errorMessages.firstName.innerHTML = "Veuillez entrer un prénom valide."
      error = true;
    } else {
      errorMessages.firstName.innerHTML = ""
    }

    if (!nameRegex.test(inputs.lastName.value)) {
      errorMessages.lastName.innerHTML = "Veuillez entrer un nom de famille valide."
      error = true;
    } else {
      errorMessages.lastName.innerHTML = ""
    }

    if (!addressRegex.test(inputs.address.value)) {
      errorMessages.address.innerHTML = "Veuillez entrer une adresse valide."
      error = true;
    } else {
      errorMessages.address.innerHTML = ""
    }

    if (!cityRegex.test(inputs.city.value)) {
      errorMessages.city.innerHTML = "Veuillez entrer une ville valide."
      error = true;
    } else {
      errorMessages.city.innerHTML = ""
    }

    if (!emailRegex.test(inputs.email.value)) {
      errorMessages.email.innerHTML = "Veuillez entrer un email valide."
      error = true;
    } else {
      errorMessages.email.innerHTML = ""
    }

    if (!error) {
      const contact = {
        firstName: inputs.firstName.value,
        lastName: inputs.lastName.value,
        address: inputs.address.value,
        city: inputs.city.value,
        email: inputs.email.value,
      };

      const cart = JSON.parse(localStorage.getItem("cart")) || [];

      const order = {
        contact: contact,
        cart: cart,
      };

      const orders = JSON.parse(localStorage.getItem("orders")) || [];

      orders.push(order);
      localStorage.setItem("orders", JSON.stringify(orders));
      localStorage.removeItem("cart");

      alert(`Merci de votre commande, cliquez 'Ok' pour accéder à votre confirmation`);
      window.open("confirmation.html");
    }
  });
};
finishOrder()