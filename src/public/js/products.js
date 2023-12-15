const botonesAgregar = document.querySelectorAll(".botonAgregar")
const cerrarSesion = document.querySelector(".cerrarSesion")
const carrito = document. querySelector(".carrito")

async function agregarAlCarrito(event){
    const botonClicado = event.target;
    const prodId = botonClicado.getAttribute('data-id');
    console.log("prodId: ", prodId)
    let cartId = localStorage.getItem("cartId");

    if (!cartId) {
        await fetch("/api/cart", {
            method: "POST",
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("data: ", data)
                cartId = data.info._id;
                console.log("cartId: ", cartId)
                localStorage.setItem("cartId", cartId);
            })
            .catch((error) => {
                console.error("Error al crear un nuevo carrito:", error);
                return;
            });
    }
    
    let method = "POST";

    try {
        const checkResponse = await fetch(`/api/cart/${cartId}`);
        console.log(checkResponse)
        if (!checkResponse.ok) {
            throw new Error('No se pudo obtener la información del carrito');
        }
        const cartData = await checkResponse.json();
        console.log("CartData: ", cartData)
        const productExists = cartData.info.products.some(productData => productData.product._id.toString() === prodId.toString());
        console.log(productExists)
        if (productExists) {
            method = "PUT"; // Cambiar a PUT si el producto ya está en el carrito
        }
    } catch (error) {
        console.error("Error al verificar el carrito:", error);
    }

    try {
        // const response = await fetch(`/api/cart/${cartId}/product/${prodId}`, {
        //     method: method,
        //     headers: {
        //         "Content-Type": "application/json",
        //     },
        //     body: {
        //         newQuantity: 1
        //     }
        // });

        let response;

        if(method == "POST"){
            response = await fetch(`/api/cart/${cartId}/product/${prodId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                }
            });
        } else {
            response = await fetch(`/api/cart/${cartId}/product/${prodId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    newQuantity: 1
                }),
            });
        }
    
        console.log("Producto agregado al carrito")
        const result = await response.json();
        console.log(result);    
    } catch (error) {
        console.error("Error al agregar el producto al carrito:", error);
    }
};

function carritoEntrar() {
    let cartId = localStorage.getItem("cartId")
    if (cartId){
        window.location.href = `/`,
        window.location.href = `/cart/${cartId}`
    }
}

carrito.addEventListener("click", carritoEntrar)

cerrarSesion.addEventListener("click", localStorage.removeItem("cartId"))

botonesAgregar.forEach(boton => {
    boton.addEventListener("click", agregarAlCarrito);
})