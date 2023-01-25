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

// function oder
// when user clicks on order:
// if input not good {display error message in p below} (declare id names as variables, loop for first three and 1 more for email, use regex to trim, use ids with ${} to innerhtml)
// else make a 'contact' object with the input from the form and an array of products

const inputs = {
  firstName : document.getElementById('firstName'),
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

    // 'in' and not 'of' cause else it is not iterable
    for (let input in inputs) {
      if (!inputs[input].value) {
        errorMessages[input].innerHTML = `Commande impossible, vous n'avez pas rempli de ${input}`
        error = true
      }
    }

    if (!error) {
      alert(`Votre commande a bien été passée`)
      //get all values from above
      //get cart content
      //create an object with everything in it
      //create order number
      window.open('confirmation.html')
    }
  })
}

finishOrder()

// const firstName = document.getElementById('firstName')
// const lastName = document.getElementById('lastName')
// const address = document.getElementById('address')
// const city = document.getElementById('city')
// const email = document.getElementById('email')
// const button = document.getElementById('order')
// const firstNameError = document.getElementById('firstNameErrorMsg')
// const lastNameError = document.getElementById('lastNameErrorMsg')
// const addressError = document.getElementById('addressErrorMsg')
// const cityError = document.getElementById('cityErrorMsg')
// const emailError = document.getElementById('emailErrorMsg')

// button.addEventListener('click', function() {
//   if (firstName.value == '') {
//     firstNameError.innerHTML = `Commande impossible, vous n'avez pas rempli de prénom`
//   }
//   if (lastName.value == '') {
//     lastNameError.innerHTML = `Commande impossible, vous n'avez pas rempli de nom`
//   }
//   if (address.value == '') {
//     addressError.innerHTML = `Commande impossible, vous n'avez pas rempli d'adresse`
//   }
//   if (city.value == '') {
//     cityError.innerHTML = `Commande impossible, vous n'avez pas rempli de ville`
//   }
//   if (email.value == '') {
//     emailError.innerHTML = `Commande impossible, vous n'avez pas rempli d'email`
//   }
//   if (firstName.value != '' && lastName.value != '' && address.value != '' && city.value != '' && email.value != '') {
//     alert('la commande est  passée')
//     window.open('confirmation.html')
//   }
// })