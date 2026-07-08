// Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-database.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDH8Na-I0CPJoN-ElAi2sHfUt3Yv5iKSMg",
  authDomain: "legendary-anime-watchlist.firebaseapp.com",
  databaseURL: "https://legendary-anime-watchlist-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "legendary-anime-watchlist",
  storageBucket: "legendary-anime-watchlist.firebasestorage.app",
  messagingSenderId: "964225790114",
  appId: "1:964225790114:web:c2752650f9ac3b61e567fb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// HTML Elements
const input = document.getElementById("animeInput");
const list = document.getElementById("animeList");
const addBtn = document.getElementById("addBtn");

// Add Anime
addBtn.addEventListener("click", () => {

    const anime = input.value.trim();

    if (anime === "") {
        alert("Enter an anime name!");
        return;
    }

    push(ref(db, "watchlist"), {
        name: anime
    });

    input.value = "";

});

// Show Anime List
onValue(ref(db, "watchlist"), (snapshot) => {

    list.innerHTML = "";

    snapshot.forEach((child) => {

        const data = child.val();
        const key = child.key;

        const li = document.createElement("li");

        li.innerHTML = `
            <span>${data.name}</span>
            <button class="delete">Delete</button>
        `;

        li.querySelector(".delete").addEventListener("click", () => {
            remove(ref(db, "watchlist/" + key));
        });

        list.appendChild(li);

    });

});
