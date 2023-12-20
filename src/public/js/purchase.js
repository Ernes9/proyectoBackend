const botonFinalizarCompra = document.querySelector(".finalizarCompra");
const botonesEliminar = document.querySelectorAll(".eliminarDelCarrito")
const cartId = botonFinalizarCompra.getAttribute("data-id")
const purchaseResults = document.getElementById('purchaseResults');
const purchasedProductsList = document.getElementById('purchasedProducts');
const Total = document.getElementById('total');



async function finalizarCompra(){
    try {
        let response = await fetch(`/api/cart/${cartId}/purchase`, {
            method: "POST"
        })
        console.log(response)
        if(response.ok) {
            const responseData = await response.json();
            Total.innerHTML= `$${responseData.ticket.amount} USD`;
            purchasedProductsList.innerHTML = '';

            responseData.purchasedProducts.forEach(product => {
                const listItem = document.createElement('li');
                listItem.textContent = `ID: ${product.product._id} - Titulo: ${product.product.title} - Cantidad: ${product.quantity} - Precio: ${product.product.price}`;
                purchasedProductsList.appendChild(listItem);
            });
            
            purchaseResults.style.display = 'block';
            let deleteResponse = await fetch(`/api/cart/${cartId}`, {
                method: "DELETE"
            })
        } else {
            console.error('Error al finalizar la compra:', response.statusText);
        }
    } catch (error) {
        console.error('Error al finalizar la compra:', error);
    }
}

async function eliminarDelCarrito(event){
    console.log("boton apretado")
    const botonClicado = event.target;
    const prodId = botonClicado.getAttribute('data-id');
    try {
        let response = await fetch(`/api/cart/${cartId}/product/${prodId}`, {
            method: "DELETE"
        })
        if(response.ok){
            location.reload();
        }
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
    }
}

botonesEliminar.forEach((boton) => {
    boton.addEventListener("click", eliminarDelCarrito);
})

botonFinalizarCompra.addEventListener("click", finalizarCompra)