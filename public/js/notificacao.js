


//Validar Campos

function validarCamposNotificacao() {

    const titulo = document.getElementById("tituloNotificacao").value
    const mensagem = document.getElementById("mensagemNotificacao").value

    if(titulo.trim() == "" || mensagem.trim() == "") {

        abrirModalAlerta("Preencha os campos obrigatórios")
    } else {
        console.log("Ok!")

        obterDadosNotificacao(titulo, mensagem)
    }

}



//obter dados da notificacao

function obterDadosNotificacao(titulo, mensagem) {

    firebase.firestore().collection("app").doc("notificacao").get().then(function(documento) {

        const dados = documento.data()

        const key = dados.key
        const topico = dados.topico

        abrirModalProgress()
        post(titulo, mensagem, topico, key)
    }).catch(function (error) {

        abrirModalAlerta("Erro ao enviar Notificação " + error)
    })
}


//Enviar Notificacao

function post(titulo, mensagem, topico, key) {

    const xmlHttpRequest = new XMLHttpRequest()
    const url = "https://fcm.googleapis.com/fcm/send"

    xmlHttpRequest.open("POST", url, true)
    xmlHttpRequest.setRequestHeader("Content-Type", "application/json")
    xmlHttpRequest.setRequestHeader("Authorization", key)

    xmlHttpRequest.onreadystatechange = function() {

        removerModalProgress()

        if(xmlHttpRequest.status == 200) {

            limparCampos()
            abrirModalAlerta("Sucesso ao enviar notificação - Alguns clientes irão receber em 5 minutos.")
        } else {
            abrirModalAlerta("Falha ao enviar a notificação!")
        }
    }

    const parametros = {
        "to": topico,
        "data": {
            "titulo": titulo,
            "mensagem": mensagem
        }
    }

    const notificacao = JSON.stringify(parametros)

    xmlHttpRequest.send(notificacao)

    console.log(notificacao)

    //console.log("Titulo: " + titulo + "\nMensagem: " + mensagem + "\nTopico: " + topico + "\nChave: " + key)
}


//Limpar Campos

function limparCampos() {

    document.getElementById("tituloNotificacao").value = ""
    document.getElementById("mensagemNotificacao").value = ""
    
}




//Modal de Alerta

function abrirModalAlerta(mensagem) {

    $("#modalAlerta").modal()
            document.getElementById("alertaMensagem").innerText = mensagem
}


//Modal de progressBar
function abrirModalProgress() {

    $("#modalProgress").modal()
}

function removerModalProgress() {

    $("#modalProgress").modal("hide")

    window.setTimeout(function() {

        document.getElementById("modalProgress").click()
    },500)
}