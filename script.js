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
const addBtn = document.getElementById("addBtn");
const animeList = document.getElementById("animeList");

addBtn.addEventListener("click", () => {

    const name = animeInput.value.trim();

    if(name === ""){
        alert("Enter anime name!");
        return;
    }

    push(ref(db,"watchlist"),{
    name: name,
    rating: "0",
    status: "Plan to Watch"
});

    animeInput.value="";

});

onValue(ref(db,"watchlist"),(snapshot)=>{

    animeList.innerHTML="";

    snapshot.forEach((child)=>{

        const anime=child.val();

       const key = child.key;

animeList.innerHTML += `
<div class="card">

<div>

<h3>🎌 ${anime.name}</h3>

<p>
Rating:
<select class="rating" data-key="${key}" data-value="${anime.rating}">
<option value="0">0</option>
<option value="0.5">0.5</option>
<option value="1">1</option>
<option value="1.5">1.5</option>
<option value="2">2</option>
<option value="2.5">2.5</option>
<option value="3">3</option>
<option value="3.5">3.5</option>
<option value="4">4</option>
<option value="4.5">4.5</option>
<option value="5">5</option>
<option value="5.5">5.5</option>
<option value="6">6</option>
<option value="6.5">6.5</option>
<option value="7">7</option>
<option value="7.5">7.5</option>
<option value="8">8</option>
<option value="8.5">8.5</option>
<option value="9">9</option>
<option value="9.5">9.5</option>
<option value="10">10</option>
</select>
</p>

<p>

Status:

<select class="status" data-key="${key}" data-value="${anime.status}">

<option>Plan to Watch</option>
<option>Watching</option>
<option>Completed</option>
<option>On Hold</option>
<option>Dropped</option>

</select>

</p>

<button class="deleteBtn" data-key="${key}">
Delete
</button>

</div>

</div>
`;

    });
  // Delete
document.querySelectorAll(".deleteBtn").forEach(btn => {

    btn.onclick = () => {

        remove(ref(db, "watchlist/" + btn.dataset.key));

    };

});
document.querySelectorAll(".rating").forEach(select=>{

    select.value = select.dataset.value;

    select.onchange=()=>{

        update(ref(db,"watchlist/"+select.dataset.key),{

            rating:select.value

        });

    };

});

document.querySelectorAll(".status").forEach(select=>{

    select.value = select.dataset.value;

    select.onchange=()=>{

        update(ref(db,"watchlist/"+select.dataset.key),{

            status:select.value

        });

    };

});

});
