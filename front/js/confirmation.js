function orderNumber() {
    // get dom element
    const orderInput = document.getElementById('orderId')

    // create order number
    const currentDate  = new Date().toISOString().slice(0,22).replace(/\-/g,"").replace(/\:/g,"").replace(/\./g,"").replace(/T/g,"")
    const randomNumber = Math.floor(Math.random() * 90000) + 10000
    const orderNumber = `${currentDate}${randomNumber}`
    
    // inject order number into html
    orderInput.innerHTML = `${orderNumber}`
}
orderNumber()