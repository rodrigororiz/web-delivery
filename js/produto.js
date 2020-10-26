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


let imagemSelecionada;
let produtoSelecionadoAlterar;
let produtoSelecionadoRemover;
let categoriasIds = new Map()
let categoriasNomes = new Map()

let tabela = document.getElementById("tabelaProduto").getElementsByTagName("tbody")[0]

let bd = firebase.firestore().collection("produtos");
let bdCategorias = firebase.firestore().collection("categorias");
let storage = firebase.storage().ref().child("produtos");

let keyLista = []


//tabela

//Ouvinte

//singleEventListener
/*bd.collection("categorias").doc("1").get().then(function(doc){
    if(doc.exists) {
        const dados = doc.data()
        const key = doc.id

        const id = dados.id
        const nome = dados.nome

        console.log("Nome Pasta: "+ key +"\nID: " +id + "\nNome: " + nome)

    } else {
        console.log("Não Existe")
    }
})*/


//eventListener - informa tudo o que acontece 
/*bd.collection("categorias").doc("1").get().onSnapshot(function(doc){
    if(doc.exists) {
        const dados = doc.data()
        const key = doc.id

        const id = dados.id
        const nome = dados.nome

        console.log("Nome Pasta: "+ key +"\nID: " +id + "\nNome: " + nome)

    } else {
        console.log("Não Existe")
    }
})*/

//Ouvinte Categoria

bdCategorias.onSnapshot(function(documentos) {

    documentos.docChanges().forEach(function(changes) {
        if(changes.type === "added") {
            const doc = changes.doc
            const dados = doc.data()

            criarItensDropdown(dados)
        }
    })
})

//Eibi categorias na modal de adicionar e de alterar

function criarItensDropdown(dados) {
    
    categoriasIds.set(dados.nome, dados.id)
    categoriasNomes.set(dados.id, dados.nome)

    const dropdownAdicionar = document.getElementById("adicionarDropdown")
    const dropdownAlterar = document.getElementById("alterarDropdown")

    const optionAdicionar = document.createElement("OPTION")
    optionAdicionar.innerHTML = dados.nome

    const optionAlterar = document.createElement("OPTION")
    optionAlterar.innerHTML = dados.nome
    

    dropdownAdicionar.options.add(optionAdicionar)
    dropdownAlterar.options.add(optionAlterar)
}



bd.onSnapshot(function(documentos) {

    documentos.docChanges().forEach(function(changes) {
        if(changes.type === "added") {
            const doc = changes.doc
            const dados = doc.data()
            keyLista.push(dados.id)
            criarItensTabala(dados)
        }

        else if(changes.type === "modified") {

            const doc = changes.doc
            const dados = doc.data()

            alterarItensTabela(dados)
        }

        else if(changes.type === "removed") {
            
            const doc = changes.doc
            const dados = doc.data()

            removerItensTabela(dados)
        }
    })
})

//Tabela

//Adicionando itens tabela


function criarItensTabala(dados) {

    const linha = tabela.insertRow();

    const colunaId = linha.insertCell(0)
    const colunaNome = linha.insertCell(1)
    const colunaValor = linha.insertCell(2)
    const colunaAcoes = linha.insertCell(3)

    const itemId = document.createTextNode(dados.id)
    const itemNome = document.createTextNode(dados.nome)
    const itemValor = document.createTextNode(dados.valor)

    colunaId.appendChild(itemId)
    colunaNome.appendChild(itemNome)
    colunaValor.appendChild(itemValor)

    criarBotoesTabela(colunaAcoes, dados)
    ordemCrescente()
}


//Alterando itens tabela
function alterarItensTabela(dados) {

    const index = keyLista.indexOf(dados.id)

    const row = tabela.rows[index]
    const cellId = row.cells[0]
    const cellNome = row.cells[1]
    const cellValor = row.cells[2]

    const acoes = row.cells[3]
    acoes.remove()

    const colunaAcoes = row.insertCell(3)

    cellId.innerText = dados.id
    cellNome.innerText = dados.nome
    cellValor.innerText = dados.valor

    criarBotoesTabela(colunaAcoes, dados)
}


//Remover itens da tabela

function removerItensTabela(dados) {

    const index = keyLista.indexOf(dados.id)

    tabela.rows[index].remove()
    keyLista.splice(index,1)
}





//Criar botoes Tabela

function criarBotoesTabela(colunaAcoes, dados) {

    const buttonAlterar = document.createElement("button")
    buttonAlterar.innerHTML = `<i class="fas fa-edit">`
    buttonAlterar.className = "btn btn-success btn-xs"

    const buttonRemover = document.createElement("button")
    buttonRemover.innerHTML = `<i class="fas fa-trash-alt">`
    buttonRemover.className = "btn btn-danger btn-xs"

    buttonAlterar.onclick = function() {

        abrirModalAlterar(dados);
        return false
    }

    buttonRemover.onclick = function() {

        abrirModalRemover(dados);
        return false
    }

    colunaAcoes.appendChild(buttonAlterar)
    colunaAcoes.appendChild(document.createTextNode(" "))
    colunaAcoes.appendChild(buttonRemover)
}


//Tratamento com Imagens

//Modal adicionar - click em imagem
function clickAdicionarImagem() {
    $("#imagemUploadAdicionar").click()
}

$("#imagemUploadAdicionar").on("change", function(event) {

    const imagem = document.getElementById("imagemAdicionar")
    compactarImagem(event, imagem)
})

//Modal alterar - click em imagem
function clickAlterarImagem() {
    $("#imagemUploadAlterar").click()
}

$("#imagemUploadAlterar").on("change", function(event) {

    const imagem = document.getElementById("imagemAlterar")
    compactarImagem(event, imagem)
})


function compactarImagem(event, imagem) {

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
            imagemSelecionada = file
            inserirImagem(imagem, file)
        }
    })
}


//Funcoes para tratar a imagem
function inserirImagem(imagem, file) {

    imagem.file = file

    if(imagemSelecionada != null) {

        const reader = new FileReader()
        reader.onload = (function(img) {
            return function(e) {
                img.src = e.target.result
             }
        })(imagem)

        reader.readAsDataURL(file)
    }
}






//Modal de adicionar

//Abrir Modal
function abrirModalAdicionar() {
    $("#modalAdicionar").modal()
}

//Limpar campos - usado pelo botao cancelar e pelobotao salvar
function limparCamposAdicionar() {
    document.getElementById("adicionarId").value = ""
    document.getElementById("adicionarNome").value = ""
    document.getElementById("adicionarValor").value = ""
    document.getElementById("adicionarDescricao").value = ""
    document.getElementById("imagemAdicionar").src = "#"

    $("#imagemUploadAdicionar").val("")

    imagemSelecionada = null
}

//Botao de salvar da Modal
function buttonAdicionarValidarCampos() {

    const id = document.getElementById("adicionarId").value
    const nome = document.getElementById("adicionarNome").value
    const valor = document.getElementById("adicionarValor").value
    const categoria = document.getElementById("adicionarDropdown").value
    const categoria_id = categoriasIds.get(categoria)
    const descricao = document.getElementById("adicionarDescricao").value

    const possui_adicional = document.getElementById("adicionarRadioSim").checked
    


    if(keyLista.indexOf(id) > -1) {

        abrirModalAlerta("ID já cadastrado no sistema")
    }

    else if(nome.trim() == "" || id.trim() == "" || valor.trim() == "" || descricao.trim() == "") {
        abrirModalAlerta("Preencha todos os campos.")
    } 
    else if( imagemSelecionada == null) {
        abrirModalAlerta("Inserir uma imagem.")
    }
    else {

        abrirModalProgress()
        console.log("Abriu modalProgress")

        salvarImagemFirebase(id, nome, valor, categoria_id, descricao, possui_adicional)
        console.log("chamou o salvarImagemFirebase")
    }

    //Salvar imagem firebase

    function salvarImagemFirebase(id, nome, valor, categoria_id, descricao, possui_adicional) {

        const nomeImagem = id

        const upload = storage.child(nomeImagem).put(imagemSelecionada)
        
        upload.on("state_changed", function(snapshot) {

        }, function(error) {

            abrirModalAlerta("Erro ao salvar imagem")
            removerModalProgress()

        }, function() {

            upload.snapshot.ref.getDownloadURL().then(function(url_imagem){
                salvarDadosFirebase(id, nome, valor, categoria_id, descricao, possui_adicional, url_imagem)
                console.log("chamou o salvarDadosFirebase")
            })
        })
    }



//Salvar Dados no Firebae

    function salvarDadosFirebase(id, nome, valor, categoria_id, descricao, possui_adicional, url_imagem) {

        const dados = {
            id: id,
            nome: nome,
            valor: valor,
            categoria_id: categoria_id,
            descricao: descricao,
            possui_adicional: possui_adicional,
            url_imagem: url_imagem
        }

        //bd.collection("categorias").add(dados).then(function() {
        bd.doc(id).set(dados).then(function() {

            //$("#modalAdicionar").modal("hide")
            removerModalProgress()
            console.log("chamou o removerModalProgress")
            limparCamposAdicionar()
            console.log("chamou o limparCamposAdicionar")
            abrirModalAlerta("Sucesso ao salvar Dados")
            console.log("chamou abrirModalAlerta de sucesso ao salvar dados")

        }).catch(function(error) {

            $("#modalProgress").modal("hide")

            removerModalProgress()
            abrirModalAlerta("Erro ao Salvar Dados: " + error)
        })
    }
    }




//Modal de alterar

//limpar campos - usado pelo botoa cancelar
function limparCamposAlterar() {
    
    $("#imagemUploadAlterar").val("")

    imagemSelecionada = null
}

//Abrir Modal
function abrirModalAlterar(dados) {
    $("#modalAlterar").modal()

    const id = document.getElementById("alterarId")
    const nome = document.getElementById("alterarNome")
    const valor = document.getElementById("alterarValor")
    const dropdown = document.getElementById("alterarDropdown")
    const descricao = document.getElementById("alterarDescricao")
    const radioButtonSim = document.getElementById("alterarRadioSim")
    const radioButtonNao = document.getElementById("alterarRadioNao")
    const imagem = document.getElementById("imagemAlterar")

    id.innerText = dados.id
    nome.value = dados.nome
    valor.value = dados.valor
    dropdown.value = categoriasNomes.get(dados.categoria_id)
    descricao.value = dados.descricao
    imagem.src = dados.url_imagem

    if(dados.possui_adicional) {
        radioButtonSim.checked = true
    } else {
        radioButtonNao.checked = true
    }

    produtoSelecionadoAlterar = dados
}


function buttonAlterarValidarCampos() {

    const id = document.getElementById("alterarId").innerHTML
    const nome = document.getElementById("alterarNome").value
    const valor = document.getElementById("alterarValor").value
    const categoria = document.getElementById("alterarDropdown").value
    const categoria_id = categoriasIds.get(categoria)
    const descricao = document.getElementById("alterarDescricao").value

    const possui_adicional = document.getElementById("alterarRadioSim").checked

    if(produtoSelecionadoAlterar.nome.trim() == nome.trim() && 
    produtoSelecionadoAlterar.valor.trim() == valor.trim() &&
    produtoSelecionadoAlterar.categoria_id.trim() == categoria_id.trim() &&
    produtoSelecionadoAlterar.descricao.trim() == descricao.trim() &&
    produtoSelecionadoAlterar.possui_adicional == possui_adicional &&
    imagemSelecionada == null) {

        abrirModalAlerta("Nenhuma informação foi alterada.")

    }
    else if(nome.trim() == "" || valor.trim() == "" || descricao.trim() == "") {

        abrirModalAlerta("Preencha os campos obrigatórios.")

    }
    else if(imagemSelecionada != null) { //vamos executar se o usuario alterar a imagem (nome)

        abrirModalProgress()
        alterarImagemFirebase(id, nome, valor, categoria_id, descricao, possui_adicional)

    } else { //vamos executar esse else se o usuario alterar somente o nome

        abrirModalProgress()
        alterarDadosFirebase(id, nome, valor, categoria_id, descricao, possui_adicional, produtoSelecionadoAlterar.url_imagem)
        
    }
}

//Alterar Imagem Firebase
function alterarImagemFirebase(id, nome, valor, categoria_id, descricao, possui_adicional) {

    const nomeImagem = id

    const upload = storage.child(nomeImagem).put(imagemSelecionada)
    
    upload.on("state_changed", function(snapshot) {

    }, function(error) {

        abrirModalAlerta("Erro ao alterar imagem")
        removerModalProgress()

    }, function() {

        upload.snapshot.ref.getDownloadURL().then(function(url_imagem){
            alterarDadosFirebase(id, nome, valor, categoria_id, descricao, possui_adicional, url_imagem)
        })
    })
}

//Alterar dados Firebae

function alterarDadosFirebase(id, nome, valor, categoria_id, descricao, possui_adicional, url_imagem) {

    const dados = {
        id: id,
        nome: nome,
        valor: valor,
        categoria_id: categoria_id,
        descricao: descricao,
        possui_adicional: possui_adicional,
        url_imagem: url_imagem
    }

    //bd.collection("categorias").add(dados).then(function() {
    bd.doc(id).update(dados).then(function() {

        $("#modalAlterar").modal("hide")
        removerModalProgress()
        limparCamposAlterar()
        abrirModalAlerta("Sucesso ao alterar Dados")

    }).catch(function(error) {

        $("#modalProgress").modal("hide")

        removerModalProgress()
        abrirModalAlerta("Erro ao alterar Dados: " + error)
    })
}







//Modal Remover

//Abrir Modal
function abrirModalRemover(dados) {
    $("#modalRemover").modal()

    produtoSelecionadoRemover = dados

}

//Click em botao de Sim na modal remover
function removerProduto() {

    abrirModalProgress()
    removerImagemFirebase();

}

//Remover Imagem Firebase

function removerImagemFirebase() {

    const nomeImagem = produtoSelecionadoRemover.id

    const imagem = storage.child(nomeImagem)

    imagem.delete().then(function() {

        removerDadosFirebase()

    }).catch(function(error) {

        removerModalProgress()
        abrirModalAlerta("Erro ao remover Imagem: " + error)

    })
}

//Remover dados Firebase

function removerDadosFirebase() {

    const id = produtoSelecionadoRemover.id

    bd.doc(id).delete().then(function() {

        $("#modalRemover").modal("hide")
        removerModalProgress()
        abrirModalAlerta("Sucesso ao remover Dados")

    }).catch(function(error) {

        $("#modalProgress").modal("hide")

        removerModalProgress()
        abrirModalAlerta("Erro ao remover Dados: " + error)
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




//Funções da tabela

//pesquisa por Id e Nome

function pesquisar(opcao) {

    let inputValor, filtro, tr, td, i, valorItemTabela;

    inputValor = document.getElementById("pesquisar" + opcao).value;
    filtro = inputValor.toUpperCase();
    tr = tabela.getElementsByTagName("tr");

    for(i=0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[opcao];

        if(td) {
            valorItemTabela = td.textContent.toUpperCase();

            if(valorItemTabela.indexOf(filtro) == -1) {
                tr[i].style.display = "none"
            } else {
                tr[i].style.display = ""
            }
            
        }
    }       
}

//criar paginação

$("#maxRows").on("change", function() {

    let maxRows, tr, i;
    maxRows = parseInt($("#maxRows").val()) - 1

    tr = tabela.getElementsByTagName("tr");

    for(i=0; i < tr.length; i++) {

        if(i > maxRows) {
            tr[i].style.display = "none"
        } else {
            tr[i].style.display = ""
        }
    }

    //paginação inserindo botões

    $("#pagination").html("")

    let rows = parseInt($("#maxRows").val());
    let totalRows = tr.length;

    if(totalRows > rows) {

        let numPage = Math.ceil(totalRows / rows);

        for(let i = 1; i <= numPage; i++) {

            $("#pagination").append('<li class="page-item"> <a class="page-link" href="#">'+ i +'</a></li>').show();
        }
    }

    //paginação click

    $("#pagination").on("click", function(e) {

        let numPage = parseInt(e.target.innerText)
        
        i=1

        $("#tabelaProduto tr:gt(0)").each(function() {

            if(i > (rows * numPage) || i <= (rows * numPage)- rows) {
                $(this).hide()
            } else {
                $(this).show()
            }

            i++
        })
    })
})


//Criar ordenação ID

let ordem = false;

function ordenarId() {

    //ordemDecrescente()
    if(ordem) {

        ordemDecrescente()
        ordem = false
    } else {
        ordemCrescente()
        ordem = true
    }
}

//Ordem Decrescente

function ordemDecrescente() {
    let tr = tabela.getElementsByTagName('tr')

    for(let i = 0; i < tr.length -1; i++) {
        for(let j = 0; j < tr.length - (i+1); j++) {
            let informação1 = tr[j].getElementsByTagName("td")[0].textContent
            let informação2 = tr[j + 1].getElementsByTagName("td")[0].textContent

            if(Number(informação1) < Number(informação2)) {
                tabela.insertBefore(tr.item(j+1), tr.item(j))

                let valor = keyLista[j+1]
                keyLista[j+1] = keyLista[j]
                keyLista[j] = valor
            } 
        }
    }
}

//Ordem Crescente
function ordemCrescente() {
    let tr = tabela.getElementsByTagName('tr')

    for(let i = 0; i < tr.length -1; i++) {
        for(let j = 0; j < tr.length - (i+1); j++) {
            let informação1 = tr[j].getElementsByTagName("td")[0].textContent
            let informação2 = tr[j + 1].getElementsByTagName("td")[0].textContent

            if(Number(informação1) > Number(informação2)) {
                tabela.insertBefore(tr.item(j+1), tr.item(j))

                let valor = keyLista[j+1]
                keyLista[j+1] = keyLista[j]
                keyLista[j] = valor
            }
        }
    }
}

//Criar ordenação NOME

let ordemNome = false;

function ordenarNome() {

    //ordemDecrescente()
    if(ordemNome) {

        ordemDecrescenteNome()
        ordemNome = false
    } else {
        ordemCrescenteNome()
        ordemNome = true
    }
}

//Ordem Decrescente

function ordemDecrescenteNome() {
    let tr = tabela.getElementsByTagName('tr')

    for(let i = 0; i < tr.length -1; i++) {
        for(let j = 0; j < tr.length - (i+1); j++) {
            let informação1 = tr[j].getElementsByTagName("td")[1].textContent
            let informação2 = tr[j + 1].getElementsByTagName("td")[1].textContent

            if(informação1 < informação2) {
                tabela.insertBefore(tr.item(j+1), tr.item(j))

                let valor = keyLista[j+1]
                keyLista[j+1] = keyLista[j]
                keyLista[j] = valor
            } 
        }
    }
}

//Ordem Crescente
function ordemCrescenteNome() {
    let tr = tabela.getElementsByTagName('tr')

    for(let i = 0; i < tr.length -1; i++) {
        for(let j = 0; j < tr.length - (i+1); j++) {
            let informação1 = tr[j].getElementsByTagName("td")[1].textContent
            let informação2 = tr[j + 1].getElementsByTagName("td")[1].textContent

            if(informação1 > informação2) {
                tabela.insertBefore(tr.item(j+1), tr.item(j))

                let valor = keyLista[j+1]
                keyLista[j+1] = keyLista[j]
                keyLista[j] = valor
            }
        }
    }
}


