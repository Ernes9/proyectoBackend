const socket = io()

socket.on("renderProductos", (data) => {
    let productsDiv = document.querySelector(".products")
    data.forEach(prod => {
        productsDiv.innerHTML += `<ul>
                                        <li><b>Title: </b>${prod.title}</li>
                                        <li><b>Description: </b>${prod.description}</li>
                                        <li><b>Price: </b>${prod.price}</li>
                                    </ul>`
    });
})