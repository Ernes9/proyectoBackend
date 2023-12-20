const socket = io()

const addProductForm = document.getElementById('addProduct');
const deleteProductForm = document.getElementById('deleteProduct');
const modProductForm = document.getElementById('modProduct');

socket.on("renderProductos", async (data) => {
    let lista = document.getElementById("listaProductos");
    let productos = ''

    data.forEach((producto) => {
        productos = productos + `<tr>
        <td> ${producto._id}            </td>
        <td> ${producto.title}         </td>
        <td> ${producto.description}   </td>
        <td> ${producto.price} USD     </td>
        <td> ${producto.thumbnail}    </td>
        <td> ${producto.code}          </td>
        <td> ${producto.stock}         </td>
    </tr>`
    })

    lista.innerHTML = productos;
});



addProductForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const code = document.getElementById('code').value;
    const price = document.getElementById('price').value;
    const stock = document.getElementById('stock').value;
    const thumbnail = document.getElementById('thumbnail').value;
    const createBtn = document.getElementById('createBtn')
    const userEmail = createBtn.getAttribute('data-email');
    const userRole = createBtn.getAttribute('data-role');

    socket.emit('new_product', {title, description, code, price, stock, thumbnail})

    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('code').value = '';
    document.getElementById('price').value = '';
    document.getElementById('stock').value = '';
    document.getElementById('thumbnail').value = '';

    return false;
})

deleteProductForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const pid = document.getElementById('pid').value;
    const deletebtn = document.getElementById('deletebtn')
    const userEmail = deletebtn.getAttribute('data-email');
    const userRole = deletebtn.getAttribute('data-role');
    socket.emit('delete_product', {pid,userEmail,userRole})

    document.getElementById('pid').value = '';
    return false;
});

modProductForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('body').value;
    const description = document.getElementById('description2').value;
    const code = document.getElementById('code2').value;
    const price = document.getElementById('price2').value;
    const stock = document.getElementById('stock2').value;
    const thumbnail = document.getElementById('thumbnail2').value;
    const id=document.getElementById('pid2').value;
    const modbtn = document.getElementById('modbtn')
    const userEmail = modbtn.getAttribute('data-email');
    const userRole = modbtn.getAttribute('data-role');

    socket.emit('mod_product', {title,description, code, price, stock, thumbnail,id,userEmail,userRole})

    document.getElementById('body').value = '';
    document.getElementById('description2').value = '';
    document.getElementById('code2').value = '';
    document.getElementById('price2').value = '';
    document.getElementById('stock2').value = '';
    document.getElementById('thumbnail2').value = '';

    return false;
});




































// socket.on("renderProductos", (data) => {
//     let productsDiv = document.querySelector(".products")
//     data.forEach(prod => {
//         productsDiv.innerHTML += `<div class="card w-20 m-3 d-inline-block ">
//                                     <div class="card-body">
//                                         <h5 class="card-title">${prod.title}</h5>
//                                         <p class="card-text">${prod.description}</p>
//                                         <p class="card-text"><b>Price: </b>${prod.price}</p>
//                                     </div>
//                                 </div>`
//     });
// })