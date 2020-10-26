const firebaseConfig = {
    apiKey: "AIzaSyAg0WswFD46t-CKooLnGyD46BIkL9NfZ5U",
    authDomain: "projeto-teste-26c88.firebaseapp.com",
    databaseURL: "https://projeto-teste-26c88.firebaseio.com",
    projectId: "projeto-teste-26c88",
    storageBucket: "projeto-teste-26c88.appspot.com",
    messagingSenderId: "374511580608",
    appId: "1:374511580608:web:5b049eefe2c3b130344425",
    measurementId: "G-QZRKVSRYVX"
};

firebase.initializeApp(firebaseConfig)


function login() {

    const email = document.getElementById("email").value
    const senha = document.getElementById("senha").value

    if(email.trim() == "" || senha.trim() == "") {

        abrirModalAlerta("Preencha os campos obrigatorios")
    } else {

        loginFirebase(email, senha)
    }
}


function loginFirebase(email, senha) {

    firebase.auth().signInWithEmailAndPassword(email, senha).then(function() {

        confirmarAdmin()

    }).catch(function(error) {
        
        const errorMessage = error.message;
        
        errorFirebase(errorMessage)
      });
}


function confirmarAdmin() {

    abrirModalProgress()

    firebase.firestore().collection("web").doc("admin").get().then(function(doc) {

        removerModalProgress()

        const uid = doc.data().uid
        const uidAdmin = firebase.auth().currentUser.uid//pegando o uid da pessoa que esta logando

        if(uid == uidAdmin) {
            
            window.location.href = "pedido.html"

        } else {

            firebase.auth().signOut()
            errorFirebase("não é admin")

        }
    })
}


function errorFirebase(error) {

    if(error.includes("The password is invalid")) {

        abrirModalAlerta("Senha inválida")

    } else if(error.includes("There is no user record")) {

        abrirModalAlerta("Email não cadastrado no sistema")

    } else if(error.includes("email address is badly")) {

        abrirModalAlerta("Este email não é um email válido.")

    } else if(error.includes("não é admin")){

        abrirModalAlerta("Usuário não autorizado.")
    } else {

        abrirModalAlerta(error)

    }
}

//Modal de Alerta

function abrirModalAlerta(mensagem) {
    $("#modalAlerta").modal();
    document.getElementById("alertaMensagem").innerText = mensagem;
  }
  
  //Modal de progressBar
  function abrirModalProgress() {
    $("#modalProgress").modal();
  }
  
  function removerModalProgress() {
    $("#modalProgress").modal("hide");
  
    window.setTimeout(function () {
      document.getElementById("modalProgress").click();
    }, 500);
  }