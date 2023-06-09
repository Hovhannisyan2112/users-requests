async function getUsers () {
    const req = await fetch(`http://localhost:3000/users`, {
        method: 'GET',
        headers: {
            "Content-Type":  "application/json;charset=UTF-8"
        }
    });

    return await req.json();
}

async function createUserRequest () {
    const req = await fetch(`http://localhost:3000/users`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json;charset=UTF-8"
        },
        body: JSON.stringify(users)
    });

    return await req.json();
}

async function deletingUserRequest(id) {
    const req = await fetch(`http://localhost:3000/users/${id}`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json;charset=UTF-8"
        }
    });
    return await req.json();
}

async function updateUser (user) {
    const req = await fetch(`http://localhost:3000/users`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json;charset=UTF-8"
        },
        body: JSON.stringify(user)
    });

    return await req.json();
}