async function showArticle() {
    // Get the current url
    const url = new URL(window.location.href);
    // Get the id parameter from the url
    const id = url.searchParams.get("id");

    console.log(id) // Test

    // Make a request to the API endpoint to fetch the specific article using the id
    const response = await fetch(`http://localhost:3000/api/products/${id}`);
    // Parse the response to json
    const data = await response.json();

    // Access the DOM element where you want to display the article
    const itemSection = document.getElementsByClassName('item__img')[0];
    const title = document.getElementById('title');
    const price = document.getElementById('price');
    const description = document.getElementById('description');
    const colors = document.getElementById("colors");

    // Add the product details such as name, description, and image to the articleSection
    itemSection.innerHTML = `<img src="${data.imageUrl}" alt="${data.altTxt}">`;
    title.innerHTML = data.name;
    price.innerHTML = data.price;
    description.innerHTML = data.description;

    // Add the color
    data.colors.forEach(color => {
        let option = document.createElement("option");
        option.value = color;
        option.text = color;
        colors.appendChild(option);
    });
}

// Call the function
showArticle();
