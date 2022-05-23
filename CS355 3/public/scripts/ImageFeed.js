export default class ImageFeed {
  constructor(el) {
    this.root = document.querySelector(el)
    this.root.innerHTML = ImageFeed.html()

    this.ACCESS_KEY = 'EPcuVtPuefJuv8Qf1LfZ4_97WKjcv4UnYhCsrauAIzo'
    this.SECRET_KEY = 'qNKIhf1T1cAqmD04ImTI-l_-z8aPVXjrRbhrWJQvaPo'
    this.API_URL = `https://api.unsplash.com/photos/?client_id=${this.ACCESS_KEY}`

    this.imageFeed = document.querySelector('.feed')

    // Selectors

    // Event Listeners

    this.getFeed()
  }

  static html() {
    return `
    <div class="container">
      <div class="card">
        <h1 class="mb-md">Image Feed</h1>
        <p class="lead mb-lg">This image feed comes from the Unsplash API.</p>
        <div class="feed"></div>
      </div>
    </div>
    `
  }

  getFeed() {
    fetch(`${this.API_URL}`)
      .then(response => response.json())
      .then(images => {
        for (const image of images) {
          const imageEl = document.createElement('img')
          imageEl.setAttribute('src', image.urls.thumb)
    
          this.imageFeed.appendChild(imageEl)
        }
    })
  }
}

new ImageFeed('#imageFeed')