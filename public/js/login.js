


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
        
            window.location.href = "pedido.html"

        
    }).catch(function(error) {

        removerModalProgress()
        firebase.auth().signOut()

        const errorMessage = error.message;
        errorFirebase(errorMessage)
    })
}


function errorFirebase(error) {

    if(error.includes("The password is invalid")) {

        abrirModalAlerta("Senha inválida")

    } else if(error.includes("There is no user record")) {

        abrirModalAlerta("Email não cadastrado no sistema")

    } else if(error.includes("email address is badly")) {

        abrirModalAlerta("Este email não é um email válido.")

    } else if(error.includes("insufficient permissions")){

        abrirModalAlerta("Usuário não autorizado.")
    } else {

        abrirModalAlerta(error)

    }
}

//revelar e ocultar senha
function revelarSenha() {

    const senha = document.getElementById("senha")
    const imagemRevelarSenha = document.getElementById("imagemRevelarSenha")

    if(senha.type == "password") {

        senha.type = "text"
        imagemRevelarSenha.setAttribute("class","fas fa-eye-slash")
    } else {
        senha.type = "password"
        imagemRevelarSenha.setAttribute("class","fas fa-eye")
    }
}


//Proximo campo com enter
function proximoInput(id, evento) {

    if(evento.keyCode == 13) {
        document.getElementById(id). focus()
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