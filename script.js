import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue
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
const addBtn = document.getElementById("addBtn");
const animeList = document.getElementById("animeList");

addBtn.addEventListener("click", () => {

    const name = animeInput.value.trim();

    if(name === ""){
        alert("Enter anime name!");
        return;
    }

    push(ref(db,"watchlist"),{
        name:name,
        rating:"N/A",
        status:"Plan to Watch"
    });

    animeInput.value="";

});

onValue(ref(db,"watchlist"),(snapshot)=>{

    animeList.innerHTML="";

    snapshot.forEach((child)=>{

        const anime=child.val();

        animeList.innerHTML+=`
        <div class="card">
            <div>
                <h3>🎌 ${anime.name}</h3>
                <p>⭐ ${anime.rating}</p>
                <p>📺 ${anime.status}</p>
            </div>
        </div>
        `;

    });

});
