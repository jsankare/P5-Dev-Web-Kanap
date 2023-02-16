// Defining an async function to fetch and display the articles
async function getArticles() {
    // Making a request to the API endpoint to fetch the articles
    const response = await fetch('http://localhost:3000/api/products')
    // Parsing the response to json
    const data = await response.json()
    // Accessing the DOM element with id 'items'
    const itemSection = document.getElementById('items') 
    
    // Iterating through the products in the data 
    for (const product of data) {
        // Creating a new 'a' element
        const link = document.createElement('a')
        // Setting the 'href' attribute of the link to a product page with the product's id
        link.setAttribute("href", `product.html?id=${product._id}`) 
        // Adding an article element to the link, with product details such as name,description,image,and altText
        link.innerHTML =
        `<article>
        <img src="${product.imageUrl}" alt="${product.altTxt}">
        <h3 class="productName">${product.name}</h3>
        <p class="productDescription">${product.description}</p>
        </article>`

        // Appending the link element as a child of the itemSection
        itemSection.appendChild(link) 
    }
}

// Calling the function
getArticles()