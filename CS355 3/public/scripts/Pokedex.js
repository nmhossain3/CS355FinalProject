export default class Pokedex {
  constructor(el) {
    this.root = document.querySelector(el)
    this.root.innerHTML = Pokedex.html()

    this.API_URL = 'https://pokeapi.co/api/v2/pokemon/?limit=150'
    this.IMAGE_URL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon'

    this.pokemonList = document.querySelector('.pokemon-list')

    this.getPokemon()
  }

  static html() {
    return `
    <div class="container">
      <div class="card">
        <h1 class="mb-md">Pokedex</h1>
        <p class="lead mb-lg">Pokemon data coming from the PokeAPI.</p>
        <div class="pokemon-list"></div>
      </div>
    </div>
    `
  }

  getPokemon() {
    fetch(`${this.API_URL}`)
      .then(response => response.json())
      .then(pokemonList => {
        for (const pokemon of pokemonList.results) {
          const splitted = pokemon.url.split('pokemon');
          const pokemonID = splitted[splitted.length - 1].replace(/\//g, '');
          const spriteURL = `${this.IMAGE_URL}/${pokemonID}.png`
          
          const pokemonDiv = document.createElement('div')
          pokemonDiv.classList.add('pokemon')
    
          const pokemonSprite = document.createElement('img')
          pokemonSprite.setAttribute('src', spriteURL)

          const pokemonInfo = document.createElement('div')
          pokemonInfo.classList.add('pokemon-info')

          const pokemonNumber = document.createElement('span')
          pokemonNumber.textContent = `No. ${pokemonID} ${pokemon.name}`

          pokemonInfo.appendChild(pokemonSprite)
          pokemonInfo.appendChild(pokemonNumber)
          pokemonDiv.appendChild(pokemonInfo)

          this.pokemonList.appendChild(pokemonDiv)
        }
      })
  }
}

new Pokedex('#pokedexApp')