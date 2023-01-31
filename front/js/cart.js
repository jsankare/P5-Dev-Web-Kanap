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
    let totalQuantityValue = 0
    let totalPriceValue = 0
    let selectedProduct = []

    // If the cart is empty 
    if (!cart || cart.length === 0) {
        console.log('le panier est vide')
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
                      <p>Qté : ${item.quantity}</p>
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
      const cartItem = event.target.parentElement.parentElement.parentElement
      // ? cartItem.innerHTML = "" ? garde les lignes blanches affichées entre les produits

      const idItem = cartItem.getAttribute('data-id')
      const colorItem = cartItem.getAttribute('data-color')

      // Get cart from localstorage and parses it
      let cart = JSON.parse(localStorage.getItem('cart')) || []

      cart = cart.filter(item => item.id !== idItem || item.color !== colorItem)
    
      localStorage.setItem('cart', JSON.stringify(cart))

      cartItem.remove()

      updateTotals()

      function updateTotals() {
        const totalQuantity = document.getElementById('totalQuantity')
        const totalPrice = document.getElementById('totalPrice')
        let totalQuantityValue = 0
        let totalPriceValue = 0

        const products = document.getElementsByClassName('cart_Item')

        for (const product of products) {
          const quantity = +product.querySelector('.itemQuantity').value
          const price = +product.querySelector('p:last-child').textContent.split(' ')[0]

          totalQuantityValue += quantity
          totalPriceValue += quantity * price
        }

        // Display the updated total Quantity and total Price
        totalQuantity.innerHTML = totalQuantityValue
        totalPrice.innerHTML = `${totalPriceValue}`

    }
    
}
showCart()


const inputs = { // Create an object called inputs
  firstName : document.getElementById('firstName'), // Stores the firstName input element in the inputs object
  lastName : document.getElementById('lastName'),
  address : document.getElementById('address'),
  city : document.getElementById('city'),
  email : document.getElementById('email'),
  button : document.getElementById('order'),
}

const errorMessages = {
  firstName : document.getElementById('firstNameErrorMsg'),
  lastName : document.getElementById('lastNameErrorMsg'),
  address : document.getElementById('addressErrorMsg'),
  city : document.getElementById('cityErrorMsg'),
  email : document.getElementById('emailErrorMsg'),
  button : document.getElementById('orderErrorMsg'),
}

const button = document.getElementById('order')

const finishOrder = () => {
  button.addEventListener('click', function() {
    let error = false

    // 'In' and not 'of' cause else it is not iterable
    // Iterate over the inputs obect and check if the value is empty
    for (let input in inputs) {
      if (!inputs[input].value) {
        // If the value is empty, innerHTML the <p> associated
        errorMessages[input].innerHTML = `Commande impossible, vous n'avez pas rempli votre ${input}`
        error = true
      }
    }

    // If there is no error
    if (!error) {
      // Get all values from above and puts them in an object contact
      const contact = {
        firstName : inputs.firstName.value,
        lastName : inputs.lastName.value,
        address : inputs.address.value,
        city : inputs.city.value,
        email : inputs.email.value,
      }

      // Get cart content
      const cart = JSON.parse(localStorage.getItem('cart'))

      // Create an object with contact, cart and confirmation number
      const order = {
        contact : contact,
        cart : cart,
      }

      // Get the existing orders from localStorage or if it doesn't exist, create an empty array
      const orders = JSON.parse(localStorage.getItem('orders')) ?? []

      alert(`Merci de votre commande, cliquez 'Ok' pour accéder à votre confirmation`)
      window.open('confirmation.html')

      // Add the current order to the orders array
      orders.push(order)
      // Save the updated orders array to localStorage
      localStorage.setItem('orders', JSON.stringify(orders))
      // Remove the cart from localStorage
      localStorage.removeItem('cart')
    }
  })
}
finishOrder()