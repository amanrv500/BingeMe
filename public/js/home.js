const main = document.querySelector('.main');

const main2 = document.getElementById("main2");
const form = document.getElementById("form");
const search = document.getElementById("search");

fetch(genres_list_http + new URLSearchParams({
    api_key: api_key
}))
.then(res => res.json())
.then(data => {
    data.genres.forEach(item => {
        fetchMoviesListByGenres(item.id, item.name);
    })
});


const fetchMoviesListByGenres = (id,genres) => {
    fetch(movie_genres_http + new URLSearchParams({
        api_key: api_key,
        with_genres: id,
        page: Math.floor(Math.random() * 3) + 1
    }))
    .then(res => res.json())
    .then(data => {
        makeCategoryElement(`${genres}_movies`, data.results);
    })
    .catch(err =>  console.log(err));
}

const makeCategoryElement = (category, data) => {
    main.innerHTML += `
    <div class="movie-list">

        <button class="pre-btn"><img src="img/pre.png" alt=""></button>

        <h1 class="movie-category">${category.split("_").join(" ")}</h1>

        <div class="movie-container" id="${category}">

        </div>

        <button class="nxt-btn"><img src="img/nxt.png" alt=""></button>

    </div>
    `;
    makeCards(category, data);
}


const makeCards = (id, data) => {
    const movieContainer = document.getElementById(id);
    data.forEach((item, i) => {
        if(item.backdrop_path == null){
            item.backdrop_path = item.poster_path;
            if(item.backdrop_path == null){
                return;
            }
        }

        movieContainer.innerHTML += `
        
        <div class="movie" onclick="location.href = '/${item.id}'">
            <img src="${img_url}${item.backdrop_path}" alt="">
            <p class="movie-title">${item.title}</p>
        </div>
        `;

        if(i == data.length - 1){
            setTimeout(() => {
                setupScrolling();
            }, 100);
        }
    })
}





// search script


form.addEventListener("submit", (e) => {
    e.preventDefault();

    const searchTerm = search.value;

    if (searchTerm) {

      main.innerHTML = " "
      main2.innerHTML =" "
      
        getMovies(SEARCHAPI + searchTerm);

        search.value = "";
    }
});

async function getMovies(url) {
  const resp = await fetch(url);
  const respData = await resp.json();

  console.log(respData);

  showMovies(respData.results);
}

function showMovies(movies) {
  // clear main
  main.innerHTML = " ";
  main2.innerHTML = " ";

  movies.forEach((movie) => {
      const { poster_path, title, id} = movie;

      const movieEl = document.createElement("div");
      movieEl.classList.add("movie");

      movieEl.innerHTML = `
      
          <div class="movie-info2" onclick="location.href = '/${id}'">
          <img
          src="${IMGPATH + poster_path}"
          alt="${title}"
          />
          <h3>${title}</h3>
          </div>
      `;

      main2.appendChild(movieEl);
  });
}
