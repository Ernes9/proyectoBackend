const botonAgregar = document.querySelector(".botonAgregar")

async function agregarAlCarrito(){
    const prodId = botonAgregar.getAttribute('data-id');
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
        if (!checkResponse.ok) {
            throw new Error('No se pudo obtener la información del carrito');
        }
        const cartData = await checkResponse.json();
        console.log("CartData: ", cartData)
        const productExists = cartData.info.products.some(product => product._id === prodId);
        
        if (productExists) {
            method = "PUT"; // Cambiar a PUT si el producto ya está en el carrito
        }
    } catch (error) {
        console.error("Error al verificar el carrito:", error);
    }

    try {
        const response = await fetch(`/api/cart/${cartId}/product/${prodId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            // body: "" ,
        });
    
        console.log("Producto agregado al carrito")
        const result = await response.json();
        console.log(result);    
    } catch (error) {
        console.error("Error al agregar el producto al carrito:", error);
    }
};

botonAgregar.addEventListener("click", agregarAlCarrito)