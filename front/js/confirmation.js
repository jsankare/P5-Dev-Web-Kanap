function orderNumber() {
    // Get dom element
    const orderInput = document.getElementById('orderId')

    // Get current URL
    const url = new URL(window.location.href)

    // Get orderId parameter from URL
    const idNumber = url.searchParams.get(`orderId`)
    
    // Inject order number into html
    orderInput.innerHTML = `${idNumber}`
}
orderNumber()