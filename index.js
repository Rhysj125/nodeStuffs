let socket = io();

$(() => {

    $("#btnSend").click(() => {
        var message = {
            name: $("#name").val(),
            message: $("#message").val()
        };

        postMessage(message);
    });

    getMessage();

    $("#btnCreateProduct").click(() => {
        let product = {
            name: $("#productName").val(),
            price: $("#price").val(),
            type: $("#type").val()
        }

        postProduct(product);
    });

    getProducts();

});

socket.on('message', addMessages);
socket.on('product', addProduct);

function onFilterChange(sender){
    let filter = $(sender).attr("data-filter");
    let queryString = "";

    document.getElementById("products").innerHTML = "";

    switch(filter){
        case "1":
            queryString = "?type=Food";
            break;
        case "2":
            queryString = "?type=Drink";
            break
        default:
            queryString = "";
    }

    $.get("/product" + queryString, (data, err) => {
        data.forEach(addProduct);
    });
}

function productClicked(sender){
    let id = $(sender).attr("data");

    $.get('/product/' + id, (data, status) => {
        console.log(data, status)

        if(status == "success"){

            console.log(data[0]);
            let title = $(".modal-title");
            let content = $(".modal-body");

            console.log(title);
            console.log(content);

            title.innerHTML = "";
            content.innerHTML = "";

            title.innerHTML = "${data[0].name}";
            content.append(`</h4><br><h4>Price: ${data[0].price}</h4><br><h4>Product Type: ${data[0].type}</h4>`);
        }
    });
}

function addMessages(message){
    $("#messages").append(`<h4> ${message.name} </h4> <p> ${message.message} </p>`);
}

function addProduct(product){
    $("#products").append(`<button class="btn btn-success col-md-3 product" data-toggle="modal" data-target="#modalProduct" onclick="productClicked(this)" data=${product._id}> ${product.name}</button>`)
}

function getMessage(){
    $.get('/messages', (data) => {
        data.forEach(addMessages);
    });
}

function getProducts(){
    $.get('product', (data) => {
        data.forEach(addProduct);
    })
}

function postMessage(message){
    $.post('/messages', message);
}

function postProduct(product){
    $.post('/product', product);
}