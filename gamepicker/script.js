let selectedItems = [];


function createItemInfo(item){
    const itemInfo = document.createElement('div');
    itemInfo.setAttribute("class","itemInfo");

    const name = document.createElement('label');
    name.setAttribute("class","title");
    name.setAttribute("for",item["title"]);
    name.textContent = item["title"];
    itemInfo.appendChild(name);

    const price = document.createElement('label');
    price.setAttribute("class","price");
    price.setAttribute("for",item["price"]);
    price.setAttribute("name",item["price"]);
    if (item["price"] > 0) {
        price.textContent = "$"+item["price"];
    } else {
        price.textContent = "FREE";
    }
    itemInfo.appendChild(price);

    const genre = document.createElement('label');
    genre.setAttribute("class","genre");
    genre.setAttribute("for",item["genre"]);
    genre.textContent = item["genre"];
    itemInfo.appendChild(genre);

    const rating = document.createElement('label');
    rating.setAttribute("class","rating");
    rating.setAttribute("name",item["rating"]);
    rating.setAttribute("for",item["rating"]);
    rating.textContent = item["rating"]+"*";
    itemInfo.appendChild(rating);

    return itemInfo
}


fetch('games.json')
    .then(response => response.json())
    .then(data => {
        const list = document.getElementById("Gameslist");
        const genreFilter = document.getElementById('filtergenres');

        const uniqueGenres = [...new Set(data.map(item => item.genre))];

        uniqueGenres.forEach(genre => {
            const option = document.createElement('option');
            option.value = genre;
            option.textContent = genre;
            genreFilter.appendChild(option);
        });

        data.forEach(item => {
            const listItem = document.createElement("li");

            const button = document.createElement("button");
            button.textContent = "Add to cart";
            button.setAttribute("type","button");
            button.setAttribute("id",item["title"]);
            button.setAttribute("class","unclicked");
            button.addEventListener('click', function(){
                const button = document.getElementById(item["title"]);
                if (button.className=="unclicked"){
                    button.textContent = "Remove from cart"
                    button.setAttribute("class","clicked");
                    selectedItems.push(item);
                } else {
                    button.textContent = "Add to cart"
                    button.setAttribute("class","unclicked");
                    selectedItems = selectedItems.filter(selectedItem => selectedItem !== item);
                }
            });

            const itemInfo = createItemInfo(item)

            listItem.appendChild(button);
            listItem.appendChild(itemInfo);
            list.appendChild(listItem);
        })
    });


function filterPrijs(){
    const prijs = document.getElementById("filterprijs").value;
    const gameprijzen = document.getElementsByClassName("price");
    
    Array.from(gameprijzen).forEach(gameprijs => {
        if (prijs >= parseInt(gameprijs.getAttribute("name"))){
            gameprijs.parentElement.parentElement.style.display = "block"
        }else {
            gameprijs.parentElement.parentElement.style.display = "none"
        }
    })
}

function filterGenre(){
    let genre = document.getElementById("filtergenres");
    genre = genre.options[genre.selectedIndex].text;
    const gamegenres = document.getElementsByClassName("genre");
    
    Array.from(gamegenres).forEach(gamegenre => {
        if (genre == "All genres"){
            gamegenre.parentElement.parentElement.style.display = "block"
        } else{
            if (genre == gamegenre.textContent){
                gamegenre.parentElement.parentElement.style.display = "block"
            }else {
                gamegenre.parentElement.parentElement.style.display = "none"
            }
        }
    })
}

function filterRating(){
    const rating = document.getElementById("filterrating").value;
    const gameratings = document.getElementsByClassName("rating");
    
    Array.from(gameratings).forEach(gamerating => {
        console.log(gamerating.getAttribute("name"), rating)
        if (rating <= parseInt(gamerating.getAttribute("name"))){
            gamerating.parentElement.parentElement.style.display = "block"
        }else {
            gamerating.parentElement.parentElement.style.display = "none"
        }
    })
}

function winkelmandje(){
    document.getElementById("overzicht").style.display = "none";
    const winkelmandje = document.getElementById("winkelmandje");
    winkelmandje.style.display = "block";

    const list = document.getElementById("winkelmandjeList");

    selectedItems.forEach(item => {
        const listItem = document.createElement("li");
        listItem.setAttribute("id",item["name"]);

        const button = document.createElement("button");
        button.textContent = "Remove from cart";
        button.setAttribute("type","button");
        button.setAttribute("class","clicked");
        button.addEventListener('click', function(){
            listItem.remove();
            selectedItems = selectedItems.filter(selectedItem => selectedItem !== item);
            
            document.getElementById("totaalprijs").textContent = berekenPrijs(selectedItems);
        });

        const itemInfo = createItemInfo(item);

        listItem.appendChild(button);
        listItem.appendChild(itemInfo);
        list.appendChild(listItem);
    })

    document.getElementById("totaalprijs").textContent = berekenPrijs(selectedItems);
}


function berekenPrijs(selectedItems){
    let totaal = 0

    selectedItems.forEach(item => {
        totaal += item["price"]
    })

    if (totaal > 0) {
        totaal = "$"+totaal;
    } else {
        totaal = "FREE";
    }

    return totaal
}