// Importeer het npm pakket express uit de node_modules map
import express from "express";

// Importeer de zelfgemaakte functie fetchJson uit de ./helpers map
import fetchJson from "./helpers/fetch-json.js";

// // Stel het basis endpoint in
const apiUrl = "https://fdnd-agency.directus.app/items/";
const apiFamily = apiUrl + "oba_family";
const apiProfile = apiUrl + "oba_profile";
const apiItems = (apiUrl + '/oba_item')
const apiItem = apiUrl + "oba_item?fields=*,afbeelding.id,afbeelding.height,afbeelding.width";

// Maak een nieuwe express app aan
const app = express();

// Stel ejs in als template engine
app.set("view engine", "ejs");

// Stel de map met ejs templates in
app.set("views", "./views");

// Gebruik de map 'public' voor statische resources, zoals stylesheets, afbeeldingen en client-side JavaScript
app.use(express.static("public"));

// Zorg dat werken met request data makkelijker wordt
app.use(express.urlencoded({ extended: true }));

// app.get('/', function (request, response) {
//     fetchJson(apiFamily).then((apiFamily) => {
//         response.render('index',{
//             // apiUser: apiUser.data
//         })
//     })
// })


// Start express op, haal daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function () {
  // Toon een bericht in de console en geef het poortnummer door
  console.log(`Application started on http://localhost:${app.get('port')}`)
})



// Route voor individuele overview pagina.

// Route voor individuele overview pagina.

app.get('/user-overview/:id', function(request, response) {
    const userId = request.params.id;
    fetchJson(apiProfile + `/${userId}?fields=*,linked_item.oba_item_id.*`).then((userData) => {
        response.render('user-overview', { data: userData.data });
    });
});


// Route voor overview pagina voor de familie

app.get('/', function(request, response) {
    fetchJson(apiUrl + `/oba_profile?fields=id`).then((userData) => {
        const ids = userData.data.map(item => item.id);
        const users = [];
        ids.forEach(id => {
            users.push(fetchJson(apiProfile + `/${id}?fields=*,linked_item.oba_item_id.*`));
        });


        Promise.all(users)
            .then(linkedItemsArray => {
                linkedItemsArray.forEach(linkedItems => {
                });
                response.render('user-all', { data: linkedItemsArray });
            })
    })
});

app.get('/detail/:id', function(request, response){
    // console.log(request.params)
    const itemId = request.params.id;

     // Haal de details op van het item met het opgegeven ID
     fetchJson(apiUrl + '/oba_item/' + itemId).then((items) => {
        // Render de detailpagina en geef de nodige data mee
        response.render('detail', {
            items: items.data,
            id: itemId,
        });
    });
});

app.post('/detail/:id', function(request, response){

    const itemId = request.params.id;
  
    fetch(`${apiUrl}/oba_bookmarks/` , {
        method: 'POST',
        body: JSON.stringify({
          item: request.params.id
        }),
        headers: {
          'Content-Type': 'application/json; charset=UTF-8'
        }
      }).then((postResponse) => {
        // Redirect naar de persoon pagina
        if (request.body.enhanced) {
            response.render('detail', {added:true});
          } else {
          response.redirect(303, '/detail/' + itemId + '?added=true')
      }
    })
  });

// Stel het poortnummer in waar express op moet gaan luisteren

//Profile Page
app.get('/personal-page/:id', async function (request, response) {
    try {
        // Haal zowel de items als de gebruikersgegevens op
        const itemsPromise = fetchJson(apiItem);
        const familiesPromise = fetchJson(apiFamily);
        const profilesPromise = fetchJson(apiProfile);

        // Wacht tot beide fetch-aanroepen zijn voltooid
        const [items, families, profiles] = await Promise.all([itemsPromise, familiesPromise, profilesPromise]);

        // Controleer of de respons geldig is
        if (items && items.data && families && families.data && profiles && profiles.data) {
            // Rendert de 'personal-page' weergave met de opgehaalde gegevens
            response.render('personal-page', {
                items: items.data,
                families: families.data,
                profiles: profiles.data
            });
        } else {
            console.error("Invalid or unexpected API response format");
            response.status(500).send("Internal Server Error");
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        response.status(500).send("Internal Server Error");
    }
});

app.get('/books', function (request, response) {
    // console.log(request.params)

    // Haal de details op van het item met het opgegeven ID
    fetchJson(apiItem).then((items) => {
        // Render de detailpagina en geef de nodige data mee
        response.render('books', {
            items: items.data,
        });
    });
});



app.get("/favorites", function (request, response) {
  let leeslijstFetch = `${apiUrl}oba_bookmarks?fields=*.*`;

  fetchJson(leeslijstFetch)
    .then(({ data }) => {
      return data.map((bookmark) => {
        return bookmark.item;
      });
    })
    .then((itemsOpLeeslijst) => {
      if (itemsOpLeeslijst.length) {
        const reversedItems = itemsOpLeeslijst.reverse();
        response.render("favorites", {
          items: reversedItems, 
        });
      } else {
        // Render lege staat (empty state)
        response.render("favorites_empty");
      }
    });
});


app.post("/favorites/delete/:id", function (request, response) {
  const itemId = request.params.id;

  // Eerst ophalen van alle ID's die aan de filter voldoen
  fetch(
    `https://fdnd-agency.directus.app/items/oba_bookmarks?filter[item][_eq]=${itemId}&fields=id`
  )
    .then((response) => response.json())
    .then((data) => {
      // Verkrijg het ID van het eerste item (aannemend dat er slechts één item is)
      const foundId = data.data[0].id;

      // Verwijder het item met het gevonden ID
      fetch(`https://fdnd-agency.directus.app/items/oba_bookmarks/${foundId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
      })
        .then((deleteResponse) => {
          if (request.body.favoriteclient) {
            response.render("favorites", { added: true });
          } else {
            response.redirect(303, "/favorites");
          }
        })
        .catch((error) => {
          // Handel eventuele fouten af
          console.error("Fout bij het verwijderen van het item:", error);
          response
            .status(500)
            .send("Er is een fout opgetreden bij het verwijderen van het item");
        });
    })
    .catch((error) => {
      // Handel eventuele fouten af
      console.error("Fout bij het ophalen van het ID:", error);
      response
        .status(500)
        .send("Er is een fout opgetreden bij het ophalen van het ID");
    });
});

// Stel het poortnummer in waar express op moet gaan luisteren
app.set("port", process.env.PORT || 8002);

// Start express op, haal daarbij het zojuist ingestelde poortnummer op
app.listen(app.get("port"), function () {
  // Toon een bericht in de console en geef het poortnummer door
  console.log(`Application started on http://localhost:${app.get("port")}`);
});
