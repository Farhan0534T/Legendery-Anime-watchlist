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
const animeList = document.getElementById("animeList");
const universeResults = document.getElementById("universeResults");
const searchResults = document.getElementById("searchResults");
const universeList = document.getElementById("universeList");
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
let searchTimeout;

animeInput.addEventListener("input", () => {

    clearTimeout(searchTimeout);

    searchTimeout = setTimeout(async () => {

        const query = animeInput.value.trim();
        universeList.innerHTML = `
    <div class="universe-card">
        📁 ${query} Universe
    </div>
`;

if (query.length < 2) {
    searchResults.innerHTML = "";
    universeResults.innerHTML = "";
    return;
}

showUniverseCard(query);

        try {

            const response = await fetch(
                `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=5`
            );

            if (!response.ok) {
                console.log("Search Error:", response.status);
                return;
            }

            const result = await response.json();

            searchResults.innerHTML = "";

            if (!result.data || result.data.length === 0) {

                searchResults.innerHTML =
                    `<div class="result">No anime found</div>`;

                return;

            }

            result.data.forEach(anime => {

                const item = document.createElement("div");

                item.className = "result";

                item.innerHTML = `
                    <img src="${anime.images.jpg.image_url}" width="45">
                    <span>${anime.title}</span>
                `;

                item.onclick = async () => {
await testUniverse(anime.title);
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

    }, 400);

});
async function searchAniList(title) {

    const query = `
    query ($search: String) {
      Media(search: $search, type: ANIME) {
        id
        title {
          romaji
          english
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
            query,
            variables: {
                search: title
            }
        })
    });

    const result = await response.json();

    return result.data.Media;

}
async function testUniverse(name) {
alert("testUniverse called");
    try {

        const anime = await searchAniList(name);

        alert(
            `AniList Found:\n\n${
                anime.title.english || anime.title.romaji
            }\n\nID: ${anime.id}`
        );

    } catch (err) {

        console.log(err);

    }

}
function showUniverseCard(name){

    universeResults.innerHTML="";

    const card=document.createElement("div");

    card.className="universe-card";

    card.textContent=`📁 ${name} Universe`;

    card.onclick=async()=>{
alert("Universe Clicked");
        const universe=await getUniverse(name);

        console.log(universe);

        universeResults.innerHTML = "";

const title = document.createElement("h3");
title.textContent = "📁 " + (universe.title.english || universe.title.romaji);

universeResults.appendChild(title);

universe.relations.edges.forEach(edge => {

    if(edge.node.type !== "ANIME") return;

    const item = document.createElement("div");

    item.className = "result";

    item.textContent =
        `${edge.node.title.english || edge.node.title.romaji}
        (${edge.relationType})`;

    universeResults.appendChild(item);

});

    };

    universeResults.appendChild(card);

}
async function getUniverse(name) {

    const query = `
    query ($search:String){

      Media(search:$search,type:ANIME){

        id

        title{
          romaji
          english
        }

        relations{

          edges{

            relationType

            node{

              id

              title{
                romaji
                english
              }

              type

            }

          }

        }

      }

    }
    `;

    const response = await fetch("https://graphql.anilist.co",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            query,
            variables:{
                search:name
            }
        })
    });

    const result = await response.json();

    return result.data.Media;

}
async function getUniverse(name) {

    const query = `
    query ($search:String){

      Media(search:$search,type:ANIME){

        id

        title{
          romaji
          english
        }

        relations{

          edges{

            node{

              id
              type

              title{
                romaji
                english
              }

            }

          }

        }

      }

    }
    `;

    const response = await fetch("https://graphql.anilist.co",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            query,
            variables:{
                search:name
            }
        })
    });

    const result = await response.json();

    return result.data.Media;

}
