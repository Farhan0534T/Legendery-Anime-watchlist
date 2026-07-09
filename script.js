alert("Script Loaded");
const animeInput = document.getElementById("animeInput");
const addBtn = document.getElementById("addBtn");
const animeList = document.getElementById("animeList");
const searchInput = document.getElementById("searchInput");

let animeData = [];

// Add Anime
addBtn.addEventListener("click", addAnime);

function addAnime(){

    let name = animeInput.value.trim();

    if(name === ""){
        alert("Enter anime name!");
        return;
    }

    let anime = {
        id: Date.now(),
        name: name,
        rating: "N/A",
        status: "Plan to Watch"
    };

    animeData.push(anime);

    showAnime(animeData);

    animeInput.value = "";

}


// Show Anime
function showAnime(data){

    animeList.innerHTML = "";

    data.forEach(anime => {

        let card = document.createElement("div");

        card.className = "card";

        card.innerHTML = `

        <div>
            <h3>🎌 ${anime.name}</h3>
            <p>⭐ Rating: ${anime.rating}</p>
            <p>📺 Status: ${anime.status}</p>
        </div>

        <div class="actions">

            <button class="editBtn">
                Edit
            </button>

            <button class="deleteBtn">
                Delete
            </button>

        </div>

        `;


        // Delete
        card.querySelector(".deleteBtn").onclick = function(){

            animeData = animeData.filter(
                item => item.id !== anime.id
            );

            showAnime(animeData);

        };


        // Edit
        card.querySelector(".editBtn").onclick = function(){

            let newName = prompt(
                "Edit anime name:",
                anime.name
            );

            if(newName){

                anime.name = newName;

                showAnime(animeData);

            }

        };


        animeList.appendChild(card);

    });

}


// Search
searchInput.addEventListener("input", function(){

    let value = searchInput.value.toLowerCase();


    let filtered = animeData.filter(anime =>
        anime.name.toLowerCase().includes(value)
    );


    showAnime(filtered);

});


// Enter key add
animeInput.addEventListener("keypress", function(e){

    if(e.key === "Enter"){
        addAnime();
    }

});
