export default class DadJokes {
  constructor(el) {
    this.root = document.querySelector(el)
    this.root.innerHTML = DadJokes.html()

    // Selectors
    this.joke = document.querySelector('#joke')
    this.getJokeBtn = document.querySelector('#getJokeBtn')

    // Event Listeners
    this.getJokeBtn.addEventListener('click', this.getRandomJoke.bind(this))

    this.getRandomJoke()
  }

  static html() {
    return `
    <div class="container">
      <div class="card">
        <h1 class="mb-md">Dad Jokes</h1>
        <p class="lead mb-lg">Fetch a random dad joke by clicking on the button below!</p>
        <p id="joke" class="joke mb-lg"></p>
        <button id="getJokeBtn" class="btn">Fetch Random Dad Joke</button>
      </div>
    </div>
    `
  }

  getRandomJoke() {
    // https://icanhazdadjoke.com/
    fetch('https://icanhazdadjoke.com/', {
      headers: {
        Accept: "application/json",
      }
    })
      .then(response => response.json())
      .then(data => {
        this.joke.textContent = `"${data.joke}"`
      })

  }
}

new DadJokes('#dadJokes')