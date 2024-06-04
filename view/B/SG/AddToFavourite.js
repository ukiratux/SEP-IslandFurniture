// document.addEventListener("DOMContentLoaded", function() {
//     var favicons = document.querySelectorAll(".unfavourited, .favourited"); 
//     favicons.forEach(function(favicon) { 
//         favicon.addEventListener("click", function() {
//             if (favicon.classList.contains("unfavourited")) {
//                 favicon.classList.add("favourited");
//                 favicon.classList.remove("unfavourited");
//             } else {
//                 favicon.classList.add("unfavourited");
//                 favicon.classList.remove("favourited");
//             }
//         });
//     });
// });


// document.addEventListener("DOMContentLoaded", function() {
//     var favContainers = document.querySelectorAll(".add-to-fav"); 
//     favContainers.forEach(function(container) { 
//         container.addEventListener("click", function() {
//             var favicon = container.querySelector("i.fa-heart");
//             if (favicon.classList.contains("unfavourited")) {
//                 favicon.classList.add("favourited");
//                 favicon.classList.remove("unfavourited");
//             } else {
//                 favicon.classList.add("unfavourited");
//                 favicon.classList.remove("favourited");
//             }
//         });
//     });
// });

document.addEventListener("DOMContentLoaded", function() {
    var sku = getQueryParam('sku'); // Get the SKU from the URL
    if (sku) {
        var favicon = document.querySelector("i.fa-heart");
        
        // Check if this SKU is already in the favorites list
        let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
        if (favorites.includes(sku)) {
            favicon.classList.add("favourited");
            favicon.classList.remove("unfavourited");
        }

        // Add event listener to toggle favorite state
        document.querySelector(".add-to-fav").addEventListener("click", function() {
            if (favicon.classList.contains("unfavourited")) {
                favicon.classList.add("favourited");
                favicon.classList.remove("unfavourited");
                addToFavorites(sku);
            } else {
                favicon.classList.add("unfavourited");
                favicon.classList.remove("favourited");
                removeFromFavorites(sku);
            }
        });
    }

    function addToFavorites(itemId) {
        let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
        if (!favorites.includes(itemId)) {
            favorites.push(itemId);
            localStorage.setItem("favorites", JSON.stringify(favorites));
        }
    }

    function removeFromFavorites(itemId) {
        let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
        favorites = favorites.filter(fav => fav !== itemId);
        localStorage.setItem("favorites", JSON.stringify(favorites));
    }

    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }
});


