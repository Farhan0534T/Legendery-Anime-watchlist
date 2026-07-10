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

        const div=document.createElement("div");

        div.className="result";

        div.textContent=
            edge.node.title.english ||
            edge.node.title.romaji;

        universeList.appendChild(div);

    });

}
