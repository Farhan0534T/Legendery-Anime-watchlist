import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
  update
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDH8Na-I0CPJoN-ElAi2sHfUt3Yv5iKSMg",
  authDomain: "legendary-anime-watchlist.firebaseapp.com",
  databaseURL: "https://legendary-anime-watchlist-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "legendary-anime-watchlist",
  storageBucket: "legendary-anime-watchlist.firebasestorage.app",
  messagingSenderId: "964225790114",
  appId: "1:964225790114:web:c2752650f9ac3b61e567fb"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const animeInput = document.getElementById("animeInput");
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");

let universeMode = false;
let currentUniverse = [];
let currentUniverseName = "";
const animeList = document.getElementById("animeList");
const searchResults = document.getElementById("searchResults");
const statusList = [
  "Plan to watch",
  "Watching",
  "Releasing",
  "On hiatus",
  "Dropped",
  "Discontinued",
  "Finished"
];

function ratingOptions(current){

    let html="";

    for(let i=0;i<=20;i++){

        let value=(i*0.5).toString();

        html+=`<option value="${value}" ${value==current?"selected":""}>${value}</option>`;

    }

    return html;

}

function statusOptions(current){

    let html="";

    statusList.forEach(status=>{

        html+=`<option value="${status}" ${status==current?"selected":""}>${status}</option>`;

    });

    return html;

}

function render(search = "") {

    onValue(ref(db, "watchlist"), (snapshot) => {

        animeList.innerHTML = "";

        snapshot.forEach((child) => {

            const key = child.key;
            const anime = child.val();

            const searchText = search.trim().toLowerCase();

if (
    searchText !== "" &&
    !anime.name.toLowerCase().includes(searchText)
) {
    return;
}

            const card = document.createElement("div");
            card.className = "card";

            card.innerHTML = `
<img src="${anime.poster}" class="poster">

<h3>🎌 ${anime.name}</h3>

<p>⭐ MAL Score: ${anime.score ?? "N/A"}</p>

<p>📺 Episodes: ${anime.episodes ?? "?"}</p>

<p>📅 Year: ${anime.year ?? "Unknown"}</p>

<p>
⭐ My Rating
<select class="rating">
${ratingOptions(anime.rating)}
</select>
</p>

<p>
📺 Status
<select class="status">
${statusOptions(anime.status)}
</select>
</p>

<button class="edit">Edit</button>
<button class="delete">Delete</button>
`;

            // Rating
            card.querySelector(".rating").onchange = (e) => {

                update(ref(db, "watchlist/" + key), {
                    rating: e.target.value
                });

            };

            // Status
            card.querySelector(".status").onchange = (e) => {

                update(ref(db, "watchlist/" + key), {
                    status: e.target.value
                });

            };

            // Delete
            card.querySelector(".delete").onclick = () => {

                if (confirm("Delete this anime?")) {

                    remove(ref(db, "watchlist/" + key));

                }

            };

            // Edit
            card.querySelector(".edit").onclick = () => {

                const newName = prompt(
                    "Edit Anime Name",
                    anime.name
                );

                if (!newName) return;

                update(ref(db, "watchlist/" + key), {
                    name: newName.trim()
                });

            };

            animeList.appendChild(card);

        });

    });

}
searchInput.addEventListener("input", (e) => {
    render(e.target.value);
});


render();
animeInput.addEventListener("input", async () => {

    const query = animeInput.value.trim();

    if (query.length < 2) {
        searchResults.innerHTML = "";
        return;
    }

    try {

        const queryGraphQL = `
query ($search: String) {
  Page(page: 1, perPage: 5) {
    media(search: $search, type: ANIME) {
      id
      title {
        romaji
        english
      }
      coverImage {
        large
      }
      averageScore
      episodes
      seasonYear
    }
  }
}
`;

const response = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        query: queryGraphQL,
        variables: {
            search: query
        }
    })
});

const result = await response.json();

        searchResults.innerHTML = "";

        result.data.Page.media.forEach(anime=>{

            const item = document.createElement("div");

            item.className = "result";

            item.innerHTML = `
                <img src="${anime.images.jpg.image_url}" width="45">
                <span>${anime.title}</span>
            `;

            item.onclick = async () => {

    const relations = await getAnimeRelations(anime.mal_id);

    console.log(relations);

    push(ref(db, "watchlist"), {

        name: anime.title,
        poster: anime.images.jpg.image_url,
        score: anime.score,
        year: anime.year,
        episodes: anime.episodes,
        rating: "0",
        status: "Plan to Watch",
        favorite: false

    });

    animeInput.value = "";
    searchResults.innerHTML = "";

};

            searchResults.appendChild(item);

        });

    } catch (err) {

        console.log(err);

    }

});
async function getAnimeRelations(id){

    const response = await fetch(
        `https://api.jikan.moe/v4/anime/${id}/full`
    );

    const data = await response.json();

    return data.data.relations || [];

}
