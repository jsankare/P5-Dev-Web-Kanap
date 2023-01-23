function getUniqueIds(cart) {
  let ids = []

  for (const item of cart) {
    let found = false

    for (const id of ids) {
      if (item.id == id) {
        found = true
      }
    }

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

    let cart = JSON.parse(localStorage.getItem('cart'))
    const ids = getUniqueIds(cart)
    const products = await getProducts(ids)
    const cartSection = document.getElementById('cart__items')
    const totalQuantity = document.getElementById('totalQuantity')
    const totalPrice = document.getElementById('totalPrice')
    let totalQuantityValue = 0
    let totalPriceValue = 0
    let selectedProduct = []

    if (cart === null) {
        console.log('le panier est vide')
    }
    else {
        for (const item of cart) {
          for (const product of products) {
            if (product._id == item.id) {
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
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="42">
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Supprimer</p>
                    </div>
                  </div>
                </div>
              </article>
        `
        console.log('le panier n\'est pas vide')
        totalQuantityValue += +item.quantity 
        totalPriceValue += item.quantity * selectedProduct.price
        }
        
        totalPrice.innerHTML = `${totalPriceValue} €`
        totalQuantity.innerHTML = totalQuantityValue
    }
}
showCart()