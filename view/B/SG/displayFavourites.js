document.addEventListener("DOMContentLoaded", function() {
    var favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    var countryId = localStorage.getItem("countryId");
    var htmlTxt = '';
    console.log(favorites);

    if (favorites.length > 0) {
        // Fetch details for each favorite SKU
        var fetchPromises = favorites.map(function(favorite) {
            var url;
            if (favorite.startsWith('F')) {
                url = "/api/getFurnitureBySku?sku=" + encodeURIComponent(favorite) + "&countryId=" + countryId;
            } else if (favorite.startsWith('R')) {
                url = "/api/getRetailProductBySku?sku=" + encodeURIComponent(favorite) + "&countryId=" + countryId;
            } else {
                console.log(`Unknown SKU type: ${favorite}`);
                return;
            }

            return fetch(url)
                .then((res) => {
                    if (!res.ok) {
                        throw new Error('Network response was not ok ' + res.statusText);
                    }
                    return res.json();
                })
                .then((data) => {
                    if (!data || data.length === 0) {
                        console.log(`No data returned for SKU: ${favorite}`);
                        return;
                    }
                    var item = data;
                    console.log(item);
                    if (!item || !item.sku) {
                        console.log(`Invalid data structure: ${JSON.stringify(data)}`);
                        return;
                    }

                    // Generate HTML for each item
                    htmlTxt += `
                        <li class="col-md-3 col-sm-6 col-xs-12 product" style="padding-bottom: 1%;padding-top: 2%;">
                            <span class="product-thumb-info">
                                <span class="product-thumb-info-image">
                                    <span class="product-thumb-info-act">
                                        <span class="product-thumb-info-act-left">
                                            <a href="${favorite.startsWith('F') ? 'furnitureProductDetails.html' : 'retailProductDetails.html'}?sku=${item.sku}" style="color: white"><em>View Details</em></a>
                                        </span>
                                    </span>
                                    <img alt="" class="img-responsive" src="${item.imageURL}">
                                </span>
                                <span class="product-thumb-info-content">
                                    <h4>${item.name}</h4>`;

                    if (favorite.startsWith('F')) {
                        htmlTxt += `
                                    <span class="product-thumb-info-act-left">
                                        <em>Height: ${item.height || 'N/A'}</em>
                                    </span><br/>
                                    <span class="product-thumb-info-act-left">
                                        <em>Length: ${item.length || 'N/A'}</em>
                                    </span><br/>
                                    <span class="product-thumb-info-act-left">
                                        <em>Width: ${item.width || 'N/A'}</em>
                                    </span><br/>
                                    <span class="product-thumb-info-act-left">
                                        <em>Price: $${item.price}.00</em>
                                    </span><br/>`;

                    }
                    if (favorite.startsWith('R')) {
                        htmlTxt += `
                                    <span class="product-thumb-info-act-left">
                                        <em>Category: ${item.category || 'N/A'}</em>
                                    </span><br/>
                                    <span class="product-thumb-info-act-left">
                                        <em>Price: $${item.price}.00</em>
                                    </span><br/>
                                    <span class="product-thumb-info-act-left">
                                        <em style="visibility:hidden;">Hidden</em>
                                    </span><br/>
                                    <span class="product-thumb-info-act-left">
                                        <em style="visibility:hidden;">Hidden</em>
                                    </span><br/>`;
                    }
                    htmlTxt += `
                                    <form class="more" action="${favorite.startsWith('F') ? 'furnitureProductDetails.html' : 'retailProductDetails.html'}">
                                        <input type="hidden" name="sku" value="${item.sku}"/>
                                        <input type="submit" class="btn btn-primary btn-block" value="More Details"/>
                                    </form>`;
                    var memberEmail = sessionStorage.getItem('memberEmail');
                    if (memberEmail) {
                        htmlTxt += `<button class="btn btn-primary btn-block" onclick="addToCart('${item.sku}', '${item.id}', ${item.price}, '${item.name}', '${item.imageURL}')">Add To Cart</button>`;
                    }
                    htmlTxt += `</span></span></li>`;
                })
                .catch((err) => console.log(err));
        });

        // Once all fetches are done, append the HTML to the document
        Promise.all(fetchPromises).then(() => {
            document.getElementById("favoritesDisplay").innerHTML = htmlTxt;
        });
    } else {
        document.getElementById("favoritesDisplay").innerHTML = "<p>No favorites yet.</p>";
    }
});

function addToCart(sku, id, price, name, imageURL) {
    fetch(new Request('/api/getItemQuantity?sku=' + sku + '&storeId=-1', { method: 'GET' }))
        .then(response => response.json())
        .then(data => {
            var quantity = data[0].sum;
            if (!quantity) {
                alert('Item not added to cart, not enough quantity available.');
            } else {
                var shoppingCart = JSON.parse(sessionStorage.getItem('shoppingCart')) || [];
                var cartItem = shoppingCart.find(item => item.sku === sku);

                if (cartItem) {
                    if (cartItem.quantity < quantity) {
                        cartItem.quantity += 1;
                    } else {
                        alert('Item not added to cart, not enough quantity available.');
                        return;
                    }
                } else {
                    shoppingCart.push({
                        id: id,
                        sku: sku,
                        price: price,
                        name: name,
                        imgURL: imageURL,
                        quantity: 1
                    });
                }

                sessionStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));
                alert('Successfully added to cart!');
            }
        })
        .catch(error => console.log(error));
}
