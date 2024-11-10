document.getElementById('registerForm')?.addEventListener('submit', async function (e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });
        const data = await response.json();

        if (!response.ok) {
            alert(data.error);
        } else {
            alert(data.message);
            window.location.href = "login.html";
        }
    } catch (error) {
        console.error("Erro no registro:", error);
        alert("Erro no registro. Verifique sua conexão com o servidor.");
    }
});

document.getElementById('loginForm')?.addEventListener('submit', async function (e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();

        if (!response.ok) {
            alert(data.error);
        } else {
            localStorage.setItem('token', data.token);
            alert(data.message);
            window.location.href = "add-movie.html";
        }
    } catch (error) {
        console.error("Erro no login:", error);
        alert("Erro no login. Verifique sua conexão com o servidor.");
    }
});

document.getElementById('addMovieForm')?.addEventListener('submit', async function (e) {
    e.preventDefault();
    const title = document.getElementById('movieTitle').value;
    const genre = document.getElementById('movieGenre').value;
    const token = localStorage.getItem('token');

    if (!title || !genre) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/movies', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({ title, genre })
        });
        const data = await response.json();

        if (!response.ok) {
            alert(data.error);
        } else {
            alert("Filme adicionado com sucesso!");
            fetchMovies();
            document.getElementById('addMovieForm').reset();
        }
    } catch (error) {
        console.error("Erro ao adicionar filme:", error);
        alert("Erro ao adicionar filme. Verifique sua conexão com o servidor.");
    }
});

async function fetchMovies() {
    const token = localStorage.getItem('token');

    const moviesList = document.getElementById('moviesList');
    if (!moviesList) return;

    try {
        const response = await fetch('http://localhost:3000/movies', {
            method: 'GET',
            headers: { 'Authorization': token }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Erro ao buscar filmes.");
        }

        const movies = await response.json();
        moviesList.innerHTML = '';

        movies.forEach(movie => {
            const listItem = document.createElement('li');
            listItem.textContent = `Título: ${movie.title} - Gênero: ${movie.genre}`;
            moviesList.appendChild(listItem);
        });
    } catch (error) {
        console.error("Erro ao buscar filmes:", error);
        alert("Erro ao buscar filmes: " + error.message);
    }
}

document.getElementById('goBackBtn')?.addEventListener('click', function () {
    window.location.href = "home.html";
});

if (document.getElementById('moviesList')) {
    fetchMovies();
}

function navigateTo(page) {
    switch(page) {
      case 'account':
        window.location.href = 'myaccount.html';
        break;
      case 'movies':
        window.location.href = 'mymovies.html';
        break;
      case 'top20':
        window.location.href = 'top20.html';
        break;
      case 'settings':
        window.location.href = 'settings.html';
        break;
      case 'preferences':
        window.location.href = 'preferences.html';
        break;
      case 'following':
        window.location.href = 'following.html';
        break;
      case 'followers':
        window.location.href = 'followers.html';
        break;
      case 'help':
        window.location.href = 'help.html';
        break;
      default:
        alert('Página não encontrada!');
    }
  }  