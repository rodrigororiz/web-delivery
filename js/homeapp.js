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

let imagemSelecionada1;
let imagemSelecionada2;
let informativoRecuperadoBd;

let bd = firebase.firestore().collection("app").doc("homeapp")
let storage = firebase.storage().ref().child("app").child("homeapp")


//Ouvinte homeapp 


//forma direta
firebase.firestore().collection("app").doc("homeapp").onSnapshot(function(documento) {

    const dados = documento.data()//esta pegando os dados da pasta homeapp e colocando em dados.

    const imagem1 = document.getElementById("imagem1")
    const imagem2 = document.getElementById("imagem2")
    const informativo = document.getElementById("informativo")//esta atribuindo a variavel informativo o input referente ao informativo

    informativoRecuperadoBd = dados.informativo

    imagem1.src = dados.url_imagem1
    imagem2.src = dados.url_imagem2
    informativo.value = dados.informativo//esta pegando o informativo do banco de dados e colocando no input informativo que foi atribuido a variavel informativo
})




//Tratamento com Imagens

//Click em imagem1
function clickAdicionarImagem1() {
    $("#imagem1Upload").click()//este codigo serve para abrir a janela de escolha de imagens, ao invés de clicar no botao do input
}

$("#imagem1Upload").on("change", function(event) {

    const imagem = document.getElementById("imagem1")
    compactarImagem(event, imagem,1)
})


//Click em imagem2
function clickAdicionarImagem2() {
    $("#imagem2Upload").click()//este codigo serve para abrir a janela de escolha de imagens, ao invés de clicar no botao do input
}

$("#imagem2Upload").on("change", function(event) {

    const imagem = document.getElementById("imagem2")
    compactarImagem(event, imagem,2)
})



function compactarImagem(event, imagem, opcao) {

    const compress = new Compress()

    const files = [...event.target.files]
    compress.compress(files, {
        size: 4, // the max size in MB, defaults to 2MB
        quality: 0.35, // the quality of the image, max is 1,
        maxWidth: 1920, // the max width of the output image, defaults to 1920px
        maxHeight: 1920, // the max height of the output image, defaults to 1920px
        resize: true // defaults to true, set false if you do not want to resize the image width and height
    }).then((data) => {
        
        if(data[0] != null) {

            const image = data[0]
            const file = Compress.convertBase64ToFile(image.data, image.ext)

            if(opcao == 1) {
                imagemSelecionada1 = file
            } else {
                imagemSelecionada2 = file
            }
            
            inserirImagem(imagem, file)
        }
    })
}


//Funcoes para tratar a imagem
function inserirImagem(imagem, file) {

    imagem.file = file

    if(file != null) {

        const reader = new FileReader()
        reader.onload = (function(img) {
            return function(e) {
                img.src = e.target.result
             }
        })(imagem)

        reader.readAsDataURL(file)
    }
}


//Imagem 1

//Limpar campos imagem 1

function limparCamposImagem1() {

    $("#imagem1Upload").val("")

    imagemSelecionada1 = null
}

function validarImagem1() {

    if(imagemSelecionada1 == null) {
        abrirModalAlerta("Imagem continua a mesma")

        console.log("imagem continua a mesma")
    } else {
        abrirModalProgress()
        const nome = "imagem1"
        salvarImagem1Firebase(nome);
    }
}

//Salvar imagem firebase

function salvarImagem1Firebase(nome) {

    const nomeImagem = nome

    const upload = storage.child(nomeImagem).put(imagemSelecionada1)
    
    upload.on("state_changed", function(snapshot) {

    }, function(error) {

        abrirModalAlerta("Erro ao salvar imagem")
        removerModalProgress()

    }, function() {

        upload.snapshot.ref.getDownloadURL().then(function(url_imagem){
            
            salvarDadosImagem1Firebase(url_imagem)
        })
    })
}

//Salvar Dados no Firebae

function salvarDadosImagem1Firebase(url_imagem) {

    const dados = {
        url_imagem1: url_imagem
    }

    //bd.collection("categorias").add(dados).then(function() {
    bd.update(dados).then(function() {

        //$("#modalAdicionar").modal("hide")
        removerModalProgress()
        limparCamposImagem1()
        abrirModalAlerta("Sucesso ao salvar Imagem")

    }).catch(function(error) {

        $("#modalProgress").modal("hide")

        removerModalProgress()
        abrirModalAlerta("Erro ao Salvar Imagem: " + error)
    })
}




//Imagem 2

//Limpar campos imagem 2

function limparCamposImagem2() {

    $("#imagem2Upload").val("")

    imagemSelecionada2 = null
}

function validarImagem2() {

    if(imagemSelecionada2 == null) {
        abrirModalAlerta("Imagem continua a mesma")

        console.log("imagem continua a mesma")
    } else {
        abrirModalProgress()
        const nome = "imagem2"
        salvarImagem2Firebase(nome);
    }
}

//Salvar imagem firebase

function salvarImagem2Firebase(nome) {

    const nomeImagem = nome

    const upload = storage.child(nomeImagem).put(imagemSelecionada2)
    
    upload.on("state_changed", function(snapshot) {

    }, function(error) {

        abrirModalAlerta("Erro ao salvar imagem")
        removerModalProgress()

    }, function() {

        upload.snapshot.ref.getDownloadURL().then(function(url_imagem){
            
            salvarDadosImagem2Firebase(url_imagem)
        })
    })
}

//Salvar Dados no Firebae

function salvarDadosImagem2Firebase(url_imagem) {

    const dados = {
        url_imagem2: url_imagem
    }

    //bd.collection("categorias").add(dados).then(function() {
    bd.update(dados).then(function() {

        //$("#modalAdicionar").modal("hide")
        removerModalProgress()
        limparCamposImagem2()
        abrirModalAlerta("Sucesso ao salvar Imagem")

    }).catch(function(error) {

        $("#modalProgress").modal("hide")

        removerModalProgress()
        abrirModalAlerta("Erro ao Salvar Imagem: " + error)
    })
}





//Alterando informativo

function validarCampoInformativo() {

    const informativo = document.getElementById("informativo").value//a variavel informativo vai receber as informações que foram digitadas no input de id informativo

    if(informativo.trim() == "") {

        abrirModalAlerta("Preencha o campo")
    }
    else if(informativoRecuperadoBd == informativo) {

        abrirModalAlerta("Informação igual")
    } else {

        abrirModalProgress()
        salvarDadosFirebase(informativo)
    }
}

function salvarDadosFirebase(informativo) {

    const dados = {
        informativo: informativo
    }

    //bd.collection("categorias").add(dados).then(function() {
    bd.update(dados).then(function() {

        //$("#modalAdicionar").modal("hide")
        removerModalProgress()
        abrirModalAlerta("Sucesso ao salvar Informativo")

    }).catch(function(error) {

        removerModalProgress()
        abrirModalAlerta("Erro ao Salvar Informativo: " + error)
    })
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
