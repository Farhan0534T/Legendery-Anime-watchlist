function addAnime(){

    let input=document.getElementById("animeInput");
    let anime=input.value.trim();

    if(anime===""){
        alert("Enter an anime name!");
        return;
    }

    let li=document.createElement("li");

    li.innerHTML=`
    <span>${anime}</span>
    <button class="delete">Delete</button>
    `;

    li.querySelector("button").onclick=function(){
        li.remove();
    }

    document.getElementById("animeList").appendChild(li);

    input.value="";
}
