async function showArticle() {
    // Get the current url
    const url = new URL(window.location.href);
    // Get the id parameter from the url
    const id = url.searchParams.get("id"); 

    // Make a request to the API endpoint to fetch the specific product using the id
    const response = await fetch(`http://localhost:3000/api/products/${id}`);
    // Parse the response to json
    const data = await response.json();

    // Access the DOM element where you want to display the product
    const itemSection = document.getElementsByClassName('item__img')[0];
    const title = document.getElementById('title');
    const price = document.getElementById('price');
    const description = document.getElementById('description');
    const colors = document.getElementById("colors");

    // Add the product details name, description, and image to the itemSection
    itemSection.innerHTML = `<img src="${data.imageUrl}" alt="${data.altTxt}">`;
    title.innerHTML = data.name;
    price.innerHTML = data.price;
    description.innerHTML = data.description;

    // Add the color
    data.colors.forEach(color => {
        let option = document.createElement('option');
        option.value = color;
        option.text = color;
        colors.appendChild(option);
    });

    // Get elements from the DOM
    const numberOfItems = document.getElementById('quantity');
    const color = document.getElementById('colors');
    const button = document.getElementById('addToCart');

    // Check if the cart exists in local storage, if not create an empty array
    let cart = JSON.parse(localStorage.getItem('cart'));
    if (cart === null) {
        cart = [];
    }

    // Add click event listener to the button
    button.addEventListener('click', function() {
        // Get quantity and color values
        let quantity = numberOfItems.value;
        let itemColor = color.value;
        const cartItem = {
            // create an object with properties quantity, color and id
            quantity : quantity,
            color : itemColor,
            id : id,
        }
        // check if the color is not empty
        if (itemColor === '') {
            alert('Veuillez selectionner une couleur');
            return
        }
        // check if quantity is between 1-100
        if (quantity < 1 || quantity > 100) {
            alert('Veuillez selectionner une quantité comprise entre 1 et 99');
            return
        }
        // if both conditions are valid
        else {
            //check if item with same id && color already present in cart
            //if yes, add quandtity to quantity in cart
            let itemIndex = -1

            for (let i = 0; i < cart.length; i++) {
                if (cart[i].id === id && cart[i].color === itemColor) {
                    itemIndex = i
                    break;
                }
            }

            if (itemIndex !== -1) {
                cart[itemIndex].quantity =  Number(cart[itemIndex].quantity) + Number(quantity)
                localStorage.setItem('cart', JSON.stringify(cart));
            }

            else {
                cart.push(cartItem);
                // save the cart in local storage
                localStorage.setItem('cart', JSON.stringify(cart));
                alert('Votre sélection a bien été ajoutée dans le panier');
            }
        }
    });
}
showArticle();