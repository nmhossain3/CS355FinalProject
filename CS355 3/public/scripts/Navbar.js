export default class Navbar {
  constructor(el) {
    this.root = document.querySelector(el);
    this.root.innerHTML = Navbar.html();
  }

  static html() {
    return `
      <nav class="navbar">
        <div class="container">
          <ul>
            <li>
              <a>Home</a>
            </li>
            <li>
              <a href="budget-tracker.html">Budget Tracker</a>
            </li>
            <li>
              <a href="dad-jokes.html">Dad Jokes</a>
            </li>
            <li>
              <a href="movies.html">Movies</a>
            </li>
            <li>
              <a href="image-feed.html">Image Feed</a>
            </li>
            <li>
              <a href="todo-list.html">Todo List</a>
            </li>
            <li>
              <a href="pokedex.html">Pokedex</a>
            </li>
          </ul>
        </div>
      </nav>
    `
  }
}

new Navbar('#navbar')