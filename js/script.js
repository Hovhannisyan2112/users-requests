/// task one /////////////////////////////////////////////////////////////

const container = document.getElementById('container');

/// input area //////////////////////////////////////////////////////////
const userName = container.querySelector('#user_name');
const surname = container.querySelector('#surname');
const userAge = container.querySelector('#user_age');
const userEmail = container.querySelector('#user_mail');


/// error elements //////////////////////////////////////////////////////
const globError = container.querySelector('.glob_error');
const emailError = container.querySelector('.email_error');

/// create users ///////////////////////////////////////////////////////
const newUsersList = container.querySelector('.new_users');

/// edite area ////////////////////////////////////////////////////////
const editeArea = container.querySelector('.create_edite');
const editeCont = container.querySelector('.users_table');
const editeName = container.querySelector('#rename_user_name');
const editeSurname = container.querySelector('#rename_user_surname');
const editeAge = container.querySelector('#rename_user_age');
const editeEmail = container.querySelector('#rename_user_mail');

/// search area //////////////////////////////////////////////////////
const searchNameInput = container.querySelector('.search_name');
const searchSurnameInput = container.querySelector('.search_surname');
const searchAgeInput = container.querySelector('.search_age');
const searchEmailInput = container.querySelector('.search_email');


let elemArr = [userName, surname, userAge, userEmail];

let checkInputs;
let checkEditeInputs = false;
let usersArr = [];
let searchResult = [];
let users;
let userId;

let editeIndex;

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



getUsers().then((data) => {
    usersArr = data;
    renderUsers(usersArr);
})


elemArr.map((e) => {
    e.onblur = function () {
        emptyAreasError(e);
    }
    e.onfocus = function () {
        clearError(e);
    }
})

function creatingUsers() {
    globalErrorValidation();
    
    if (checkInputs) {
        addUsers();
        clearInputs();
        clearSearch();

        createUserRequest().then(() => {
            return getUsers();
        }).then((data) => {
            usersArr = data;
            renderUsers(usersArr);
        });
    }
}

function deleteUser (i) {
    findUserId(i);

    deletingUserRequest(userId).then(() => {
        return getUsers();
    }).then((data) => {
        usersArr = data;
        renderUsers(usersArr);
    });

    clearErrorAfterDelete();
}

function editeUser (i) {
    findUserIndex(i)
    editeWindow('block', 'none');
    editeValues(filterUsers()[editeIndex]);
}

function saveEdite () {
    editeErrorValidation();

    if(checkEditeInputs) {
        editeWindow('none', 'block');
        SaveEditingValues();
    }
}

function cancelEdite () {
    editeWindow('none', 'block');
}

function searchUsers () {
    renderUsers(filterUsers());
}

/// display validation /////////////////////////////////////////////////
function clearSearch () {
    searchSurnameInput.value = '';
    searchAgeInput.value = '';
    searchNameInput.value = '';
    searchEmailInput.value = '';
}

//// editing users ///////////////////////////////////////////////
function findUserId(i) {
    userId = filterUsers()[i].id;
}

function findUserIndex (i) {
    editeIndex = i;
}

function editeWindow (open, close) {
    editeArea.style.display = open;
    editeCont.style.display = close;
}

function editeValues (userValue) {
    editeName.value = userValue.name;
    editeSurname.value = userValue.surname;
    editeAge.value = userValue.age;
    editeEmail.value = userValue.email;
}

function SaveEditingValues () {
    getUsers().then((data) => {
        data[editeIndex].name = editeName.value;
        data[editeIndex].surname = editeSurname.value;
        data[editeIndex].age = editeAge.value;
        data[editeIndex].email = editeEmail.value;
        usersArr = data;
        renderUsers(usersArr)
        console.log(data)
    })
}

//// searching users ///////////////////////////////////////////////////
function filterUsers () {
    let userNameValue = searchNameInput.value.toLowerCase();
    let userSurnameValue = searchSurnameInput.value.toLowerCase();
    let userAgeValue = searchAgeInput.value;
    let userEmailValue = searchEmailInput.value.toLowerCase();

    return usersArr.filter((e) => {
        let textName = e.name.toLowerCase();
        let textSurname = e.surname.toLowerCase();
        let textAge = e.age.toString();
        let textEmail = e.email.toLowerCase();

        return (
            (userNameValue === '' || textName.includes(userNameValue)) &&
            (userSurnameValue === '' || textSurname.includes(userSurnameValue)) &&
            (userAgeValue === '' || textAge.includes(userAgeValue)) && 
            (userEmailValue === '' || textEmail.includes(userEmailValue))
        );
    });
}

//// error validation //////////////////////////////////////////////////
function clearErrorAfterDelete () {
    userEmail.style.border = '2px solid black';
    globError.innerText = '';
}

function emptyAreasError (elem) {
    if (elem.value === '') {
        elem.style.border = '2px solid red';
        elem.placeholder = 'Fill in the field.';
    }
}

function clearError (elem) {
    elem.style.border = '2px solid black';
    elem.placeholder = '';
}

function globalErrorValidation () {
        if(userName.value === '' ||
           surname.value === '' ||
           userAge.value === '' ||
           userEmail.value === '') {
            globError.classList = 'glob_error_show';
            globError.innerText = 'Please fill in all fields.';
            emptyAreasError(userName);
            emptyAreasError(surname);
            emptyAreasError(userAge);
            emptyAreasError(userEmail);
            checkInputs = false;
        } else {
            globError.innerText = '';
            globError.classList = 'boo';
            clearError(userName);
            clearError(surname);
            clearError(userAge);
            clearError(userEmail);
            checkInputs = true;
            emailValidation(userEmail, usersArr);
        }
}

function editeErrorValidation () {
        if (editeName.value === '' ||
            editeSurname.value === '' ||
            editeAge.value === '' ||
            editeEmail.value === '') {
                emptyAreasError(editeName);
                emptyAreasError(editeSurname);
                emptyAreasError(editeAge);
                emptyAreasError(editeEmail);

                checkEditeInputs = false;
        } else {
            clearError(editeName);
            clearError(editeSurname);
            clearError(editeAge);
            clearError(editeEmail);

            checkEditeInputs = true;
            emailEditeValidation(usersArr, editeEmail);
        }
}

function emailValidation (email, elem) {
     elem.filter((e) => {
        if (email.value === e.email) {
            checkInputs = false;
            globError.classList = 'glob_error_show';
            globError.innerText = 'This mail already exists in the list.';
            userEmail.style.border = '2px solid red';
        }
    })
}

function emailEditeValidation (elem, email) {
    elem.filter((e) => {
        if (e.email === email.value) {
            if (e.id !== filterUsers()[editeIndex].id) {
                if (e.email !== filterUsers()[editeIndex].email) {
                    checkEditeInputs = false;
                    email.style.border = '2px solid red';
                    emailError.innerText = 'This mail already exists in the list.'
                }
            } else {
                checkEditeInputs = true;
            }
        }
        if (checkEditeInputs) {
            emailError.innerText = '';
        }
    })

}


//// add users ///////////////////////////////////////////////////////
function addUsers () {
    let user = {
        name: userName.value,
        surname: surname.value,
        age: userAge.value,
        email: userEmail.value
    };
    users = user;
}

function renderUsers (usersArr) {
    newUsersList.innerHTML = '';
    usersArr.map((e, i) => {
        return newUsersList.innerHTML += `<div class="new_list_title">
                                            <div id="users_number">${i + 1}</div>
                                            <div>${e.name}</div>
                                            <div>${e.surname}</div>
                                            <div>${e.age}</div>
                                            <div>${e.email}</div>
                                            <button class='del_user' onclick='deleteUser(${i})'>Del</button>
                                            <button class='del_user' onclick='editeUser(${i})'>Edite</button>
                                        </div>`
    });
}

function clearInputs () {
    userName.value = '';
    surname.value = '';
    userAge.value = '';
    userEmail.value = '';
}