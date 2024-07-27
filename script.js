const API_KEY = "6d46f1e70b8746cdae84f71e1cf940bf";

const url = "https://newsapi.org/v2/everything?q=";

window.addEventListener('load', () => fetchNews("India"));

function reload() {
    window.location.reload();
}
async function fetchNews(query) {
    // returns a promise (await is mandatory)
    const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
    const data = await res.json(); // converting res to json (also returns a promise)

    bindData(data.articles);
}

function bindData(articles) {
    const cardsContainer = document.getElementById('cards-container');
    const newsCardTemplate = document.getElementById('template-news-card');

    cardsContainer.innerHTML = '';
    const arr = articles;
    if (arr) {
        arr.forEach(article => {
            // if image is not available don't show
            if (!article.urlToImage) return;
            else {
                // creating a deep clone (all elements inside newsCardTemplate are cloned)
                const cardClone = newsCardTemplate.content.cloneNode(true);

                fillDataInCard(cardClone, article);

                // appending the template to the main card container
                cardsContainer.appendChild(cardClone);
            }
        });
    }
    else {
        return;
    }
}

function fillDataInCard(cardClone, article) {
    const newsImage = cardClone.querySelector('#news-img');
    const newsTitle = cardClone.querySelector('#news-title');
    const newsSource = cardClone.querySelector('#news-source');
    const newsDesc = cardClone.querySelector('#news-desc');

    newsImage.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description;

    const date = new Date(article.publishedAt).toLocaleString("en-US", { timeZone: "Asia/Jakarta" });

    newsSource.innerHTML = `${article.source.name} · ${date}`;

    cardClone.firstElementChild.addEventListener('click', () => {
        window.open(article.url, "_blank")
    })

}

let currSelectedNav = null;

function onNavItemClick(id) {
    fetchNews(id);
    const navItem = document.getElementById(id);
    // when you select a new nav item, remove the old nav item from active class
    currSelectedNav?.classList.remove('active');
    currSelectedNav = navItem;
    currSelectedNav.classList.add('active');

}

const searchButton = document.getElementById('search-button');
const searchText = document.getElementById('search-text');

searchButton.addEventListener('click', () => {
    const query = searchText.value;
    // if user hits the button without an input query
    if (!query) return;
    fetchNews(query);
    // when using the search bar, remove the selected nav item
    currSelectedNav?.classList.remove('active');
    currSelectedNav = null;
});


function handle(e) {
    const address = document.getElementById("search-text").value;
    if (e.keyCode === 13) {
        const query = address;
        // if user hits the button without an input query
        if (!query) return;
        fetchNews(query);
        // when using the search bar, remove the selected nav item
        currSelectedNav?.classList.remove('active');
        currSelectedNav = null;
    }
    return false;
}