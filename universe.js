const universeResults = document.getElementById("universeResults");
const universeList = document.getElementById("universeList");

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

window.showUniverse = async function(name){

    universeList.innerHTML="Loading...";

    const universe = await getUniverse(name);

    universeList.innerHTML="";

    universe.relations.edges.forEach(edge=>{

        if(edge.node.type!=="ANIME") return;

        const anime = edge.node;

const div = document.createElement("div");

div.className = "universe-item";

div.innerHTML = `
    <img src="${anime.coverImage.large}" class="universe-poster">

    <div class="universe-info">

        <h3>${anime.title.english || anime.title.romaji}</h3>

        <p>
            ${anime.format || "Unknown"}
            •
            ${anime.episodes || "?"} Episodes
        </p>

        <p>
            ⭐ ${anime.averageScore || "N/A"}
            •
            ${anime.seasonYear || ""}
        </p>

    </div>

    <button class="add-btn">
        ➕ Add
    </button>
`;

universeList.appendChild(div);

    });

}
