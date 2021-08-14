
const miFormulario = document.querySelector('form'); //solo hay 1
const divAlerta = document.querySelector('.alert');
divAlerta.style.display = 'none';


const url = (window.location.href.includes('localhost')) ? 
            'http://localhost:8080/api/auth/' 
            : 'https://rest-server-nhf.herokuapp.com/api/auth/';


miFormulario.addEventListener('submit', ev => {
    ev.preventDefault(); //-> evita hacer un refresh
    const formData = {};
    for(let el of miFormulario.elements){
        if(el.name.length){
            formData[el.name] = el.value;
        }
    }

    fetch(url + 'login', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: { 'Content-Type': 'application/json' }
    })
    .then(resp => resp.json())
    .then( ({msg, token, errors}) => {
        if(msg){
            divAlerta.classList.replace('alert-success','alert-danger');
            divAlerta.innerHTML = `<span>${msg}</span>`;
            divAlerta.style.display='';
            return console.error(msg);
        }
        if(errors){
            let htmlErrors = '';
            errors.forEach(element => {
                htmlErrors= htmlErrors + `<span>${element.msg}</span><br>`;
                //txtErrors = txtErrors + '<br>' + element.msg;
            });
            divAlerta.classList.replace('alert-success','alert-danger');
            divAlerta.innerHTML = htmlErrors;
            divAlerta.style.display='';
            return console.error('Error de parametros');
        }

        //console.log(msg, token);

        divAlerta.classList.replace('alert-danger','alert-success');
        divAlerta.innerHTML = '<span>Redireccionando</span>';
        divAlerta.style.display='';
        localStorage.setItem('token', token);
        window.location = 'chat.html';
    })
    .catch(err => {
        console.error(err);
    })


});

function onSignIn(googleUser) {

    var id_token = googleUser.getAuthResponse().id_token;
    const data = { id_token };

    fetch(url + 'google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(resp => resp.json())
    .then( ({token}) => {
        localStorage.setItem('token', token);
        sleep(2000).then(() => { window.location = 'chat.html'; });
        
    })
    .catch(console.log);

}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
    console.log('User signed out.');
    localStorage.removeItem('token');

    
    });
}