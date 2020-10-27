
window.onload = function() {

    firebase.auth().onAuthStateChanged(function(user) {

        if(user) {

        } else {

            alert("Usuário nao está logado")

            window.location.href = "index.html"
        }
    })
}


function deslogar() {

    firebase.auth().signOut().then(function() {

        window.location.href = "index.html"

    }).catch(function(error) {

        alert("Erro ao deslogar")
    })

    
}


