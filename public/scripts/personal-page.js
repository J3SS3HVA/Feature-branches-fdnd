// gsap animations
gsap.from('h1', {duration: 0.6, y: '100%', delay: 0.7, ease: 'ease-out'});

// timeline for the carousel animation
const carouselTimeline = gsap.timeline({defaults: { duration: 1 }});

carouselTimeline
    .from('.for-you', {duration: 0.5, x: '-200%', delay: 0.7, ease: 'ease-in'})
    .from('.favourites', {duration: 0.5, x: '200%', ease: 'ease-in'})
    .from('.borrowed', {duration: 0.5, x: '-200%', ease: 'ease-in'});

// detail active buttons
const forYouDetailsButton = document.getElementById('forYoudetailsButton');
const favoritesDetailsButton = document.getElementById('favoritesButton');
const borrowedBooksDetailsButton = document.getElementById('borrowedBooksButton');

// detail deactive buttons
const forYouDetailsCloseButton = document.getElementById('forYouDetailsCloseButton');
const favoritesDetailsCloseButton = document.getElementById('favoritesCloseButton');
const borrowedBooksDetailsCloseButton = document.getElementById('borrowedBooksCloseButton');

// elementen voor de detail functie
const forYouDetails = document.querySelector('.for-you-details');
const favoritesDetails = document.querySelector('.favorites-details');
const borrowedBooksDetails = document.querySelector('.borrowed-books-details');
const contentWrapperActive = document.querySelector('.content-wrapper');
const pageText = document.querySelector('.page');

// details active functions

// for you
function detailsForYouActive(){
    forYouDetails.classList.add('for-you-details-active');
    pageText.innerHTML = 'Voor Jou';
}

//favorites
function detailsFavoritesActive(){
    favoritesDetails.classList.add('favorites-details-active');
    pageText.innerHTML = 'Favorieten';
}

// borrowed books
function detailsBorrowedBooksActive(){
    borrowedBooksDetails.classList.add('borrowed-books-details-active');
    pageText.innerHTML = 'Geleende Boeken';
}

// content wrapper
function activeContentWrapper(){
    contentWrapperActive.classList.add('content-wrapper-active');
    console.log('wrapper');
}

// details deactive functions

// for you
function detailsForYouDeactive(){
    forYouDetails.classList.remove('for-you-details-active');
    pageText.innerHTML = 'Gebruikers Pagina';
    carouselTimeline.play();
    activeContentWrapperDeactive();
}

//favorites
function detailsFavoritesDeactive(){
    favoritesDetails.classList.remove('favorites-details-active');
    pageText.innerHTML = 'Gebruikers Pagina';
    carouselTimeline.play();
    activeContentWrapperDeactive();
}

// borrowed books
function detailsBorrowedBooksDeactive(){
    borrowedBooksDetails.classList.remove('borrowed-books-details-active');
    pageText.innerHTML = 'Gebruikers Pagina';
    carouselTimeline.play();
    activeContentWrapperDeactive();
}

// content wrapper
function activeContentWrapperDeactive(){
    contentWrapperActive.classList.remove('content-wrapper-active');
    console.log('wrapper');
}


// Alles weergeven functie

// Wacht tot de DOM volledig geladen is voordat de code wordt uitgevoerd
document.addEventListener('DOMContentLoaded', () => {
    // Event listener voor de Favorieten knop
    favoritesDetailsButton.addEventListener('click', (e) => {
        // Voorkom de standaardactie van de knop (bijv. form submission)
        e.preventDefault();
        // Log naar de console dat de Favorieten knop is ingedrukt
        console.log("Favorieten knop gedrukt");
        // Versnel de animatie van de carrousel
        carouselTimeline.timeScale(2);
        // Speel de animatie in omgekeerde volgorde af
        carouselTimeline.reverse().eventCallback("onReverseComplete", () => {
            // Activeer de details weergave voor Favorieten
            detailsFavoritesActive();
            // Activeer de content wrapper (waarschijnlijk om inhoud zichtbaar te maken)
            activeContentWrapper();
        });
    });

    // Event listener voor de Voor Jou knop
    forYouDetailsButton.addEventListener('click', (e) => {
        // Voorkom de standaardactie van de knop
        e.preventDefault();
        // Log naar de console dat de Voor Jou knop is ingedrukt
        console.log("Voor Jou knop gedrukt");
        // Versnel de animatie van de carrousel
        carouselTimeline.timeScale(2);
        // Speel de animatie in omgekeerde volgorde af
        carouselTimeline.reverse().eventCallback("onReverseComplete", () => {
            // Activeer de details weergave voor Voor Jou
            detailsForYouActive();
            // Activeer de content wrapper
            activeContentWrapper();
        });
    });

    // Event listener voor de Geleende Boeken knop
    borrowedBooksDetailsButton.addEventListener('click', (e) => {
        // Voorkom de standaardactie van de knop
        e.preventDefault();
        // Log naar de console dat de Geleende Boeken knop is ingedrukt
        console.log("Geleende Boeken knop gedrukt");
        // Versnel de animatie van de carrousel
        carouselTimeline.timeScale(2);
        // Speel de animatie in omgekeerde volgorde af
        carouselTimeline.reverse().eventCallback("onReverseComplete", () => {
            // Activeer de details weergave voor Geleende Boeken
            detailsBorrowedBooksActive();
            // Activeer de content wrapper
            activeContentWrapper();
        });
    });

    // Event listener voor de sluitknop van Voor Jou details
    forYouDetailsCloseButton.addEventListener('click', () => {
        // Deactiveer de details weergave voor Voor Jou
        detailsForYouDeactive();
        // Deactiveer de content wrapper
        activeContentWrapperDeactive();
    });

    // Event listener voor de sluitknop van Favorieten details
    favoritesDetailsCloseButton.addEventListener('click', () => {
        // Deactiveer de details weergave voor Favorieten
        detailsFavoritesDeactive();
        // Deactiveer de content wrapper
        activeContentWrapperDeactive();
    });

    // Event listener voor de sluitknop van Geleende Boeken details
    borrowedBooksDetailsCloseButton.addEventListener('click', () => {
        // Deactiveer de details weergave voor Geleende Boeken
        detailsBorrowedBooksDeactive();
        // Deactiveer de content wrapper
        activeContentWrapperDeactive();
    });
});
