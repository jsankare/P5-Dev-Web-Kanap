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

//need to add a function to delete items in cart

async function showCart() {

    // get the cart from local storage and parse it into a JavaScript object
    let cart = JSON.parse(localStorage.getItem('cart')) || []
    //get the unique ids of the items in cart
    const ids = getUniqueIds(cart)
    //get all the products details of the items in the cart
    const products = await getProducts(ids)
    //get the element where we will display the items in cart
    const cartSection = document.getElementById('cart__items')
    //get the elements where we will display the total Quantity and total Price
    const totalQuantity = document.getElementById('totalQuantity')
    const totalPrice = document.getElementById('totalPrice')
    let totalQuantityValue = 0
    let totalPriceValue = 0
    let selectedProduct = []

    //if the cart is empty 
    if (!cart || cart.length === 0) {
        console.log('le panier est vide')
    }
    else {
        //iterate through the cart items and display them
        for (const item of cart) {
          for (const product of products) {

            //get the product details of the current item
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
        //calculate the total Quantity and total Price
        totalQuantityValue += +item.quantity 
        totalPriceValue += item.quantity * selectedProduct.price
        }  
    }
    //display the total Quantity and total Price
    totalPrice.innerHTML = `${totalPriceValue}`
    totalQuantity.innerHTML = totalQuantityValue
}
showCart()

const inputs = { // create an object called inputs
  firstName : document.getElementById('firstName'), // stores the firstName input element in the inputs object
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
      // get all values from above and puts them in an object contact
      const contact = {
        firstName : inputs.firstName.value,
        lastName : inputs.lastName.value,
        address : inputs.address.value,
        city : inputs.city.value,
        email : inputs.email.value,
      }

      // get cart content
      const cart = JSON.parse(localStorage.getItem('cart'))

      // create order number (voir uuid doc ?)
      const currentDate  = new Date().toISOString().slice(0,22).replace(/\-/g,"").replace(/\:/g,"").replace(/\./g,"").replace(/T/g,"")
      console.log(currentDate)
      const randomNumber = Math.floor(Math.random() * 90000) + 10000
      console.log(randomNumber)
      const orderNumber = `${currentDate}${randomNumber}`
      console.log(orderNumber)

      // create an object with everything in it
      const order = {
        contact : contact,
        cart : cart,
        confirmationNumber : orderNumber,
      }

      alert(`Merci de votre commande, cliquez 'Ok' pour accéder à votre confirmation`)
      window.open('confirmation.html')
      // clear cart(panier items)
    }
  })
}
finishOrder()