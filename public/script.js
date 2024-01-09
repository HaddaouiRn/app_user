function deleteUser(userId) {
    fetch('/api/users/' + userId, {
        method: 'DELETE'
    }).then(response => {
        if (response.ok) {
            location.reload();
        } else {
            console.error('Erreur lors de la suppression de l utilisateur.');
        }
    });
}

// Fetch users from the server and display them
fetch('/api/users')
    .then(response => response.json())
    .then(users => {
        const userList = document.getElementById('users-list');
        users.forEach(user => {
            const li = document.createElement('li');
            li.innerHTML = `${user.nom} ${user.prenom}, ${user.email}, ${user.telephone} 
            <button onclick="deleteUser(${user.id})">Supprimer</button>`;
            userList.appendChild(li);
        });
    });

