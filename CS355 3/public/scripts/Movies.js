export default class Movies {
  constructor(el) {
    this.root = document.querySelector(el);
    this.root.innerHTML = Movies.html();

    this.API_URL = 'https://api.themoviedb.org/3/search/movie?api_key='
    this.imageURL = 'https://image.tmdb.org/t/p/original'
    this.API_KEY = 'bb82315fcde2f160329a49fb32f7cd46'

    // Selectors
    this.movieForm = document.querySelector('#movieForm')
    this.movieInput = document.querySelector('#movieInput')
    this.movieList = document.querySelector('#movieList')

    // Event Listeners
    this.movieForm.addEventListener('submit', this.getMovies.bind(this))
  }

  static html() {
    return `
      <div class="container">
        <div class="card">
          <h1 class="mb-md">Movies</h1>
          <p class="lead mb-lg">Search for any movie you like!</p>
          <form id="movieForm" class="mb-lg">
            <input id="movieInput" type="text" placeholder="Movie name" />
            <button type="submit" class="btn">Submit</button>
          </form>
          <div id="movieList" class="movie-list"></div>
        </div>
      </div>
    `
  }

  getMovies(e) {
    e.preventDefault()
    this.movieList.innerHTML = ""

    fetch(`${this.API_URL}${this.API_KEY}&query=${this.movieInput.value}`)
    .then(response => response.json())
    .then(data => {
      const { results } = data

      for (const movie of results) {
        if (!movie.poster_path) continue

        const movieCard = document.createElement('div')
        movieCard.classList.add('movie-card')

        const movieImage = document.createElement('img')
        movieImage.setAttribute('src', `${this.imageURL}/${movie.poster_path}`)
        movieImage.classList.add('movie-img')

        movieCard.appendChild(movieImage)

        this.movieList.appendChild(movieCard)
        this.movieInput.value = ""
      }
    })
  }
}

new Movies('#movies')