const botonAgregar = document.querySelector(".botonAgregar")

async function agregarAlCarrito(e){
    const prodId = botonAgregar.getAttribute('data-id');
    let cartId = localStorage.getItem("cartId");
    if (!cartId) {
        fetch("/api/carts", {
            method: "POST",
        })
            .then((response) => response.json())
            .then((data) => {
                cartId = data._id;
                localStorage.setItem("cartId", cartId);
            })
            .catch((error) => {
                console.error("Error al crear un nuevo carrito:", error);
                return;
            });
    }
    const response = await fetch(`/api/carts/${cartId}/product/${prodId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        // body: "" ,
    });
    const result = await response.json();
    console.log(result);
};