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
const addBtn = document.getElementById("addBtn");
const animeList = document.getElementById("animeList");

const statusList = [
  "Plan to Watch",
  "Watching",
  "Completed",
  "On Hold",
  "Dropped"
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

addBtn.onclick=()=>{

    let name=animeInput.value.trim();

    if(name===""){

        alert("Enter anime name");
        return;

    }

    push(ref(db,"watchlist"),{

        name,
        rating:"0",
        status:"Plan to Watch",
        favorite:false

    });

    animeInput.value="";

};
function render(search = "") {

    onValue(ref(db, "watchlist"), (snapshot) => {

        animeList.innerHTML = "";

        snapshot.forEach((child) => {

            const key = child.key;
            const anime = child.val();

            if (
                search &&
                !anime.name.toLowerCase().includes(search.toLowerCase())
            ) {
                return;
            }

            const card = document.createElement("div");
            card.className = "card";

            card.innerHTML = `
            <h3>🎌 ${anime.name}</h3>

            <p>
                ⭐ Rating
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

animeInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        addBtn.click();
    }
});

render();
