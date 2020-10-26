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
let adicionalSelecionadaAlterar;
let adicionalSelecionadaRemover;

let tabela = document.getElementById("tabelaAdicional").getElementsByTagName("tbody")[0]

let bd = firebase.firestore().collection("adicionais");

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
}

//Botao de salvar da Modal
function buttonAdicionarValidarCampos() {

    const id = document.getElementById("adicionarId").value
    const nome = document.getElementById("adicionarNome").value
    const valor = document.getElementById("adicionarValor").value 

    if(keyLista.indexOf(id) > -1) {

        abrirModalAlerta("ID já cadastrado no sistema")
    }

    else if(nome.trim() == "" || id.trim() == "" || valor.trim() == "") {

        abrirModalAlerta("Preencha todos os campos.")
    } 
    else {

        abrirModalProgress()
        salvarDadosFirebase(id, nome, valor)
    }



//Salvar Dados no Firebae

    function salvarDadosFirebase(id, nome) {

        const dados = {
            id: id,
            nome: nome,
            valor: valor
        }

        //bd.collection("categorias").add(dados).then(function() {
        bd.doc(id).set(dados).then(function() {

            $("#modalAdicionar").modal("hide")
            removerModalProgress()
            limparCamposAdicionar()
            abrirModalAlerta("Sucesso ao salvar Dados")

        }).catch(function(error) {

            $("#modalProgress").modal("hide")

            removerModalProgress()
            abrirModalAlerta("Erro ao Salvar Dados: " + error)
        })
    }
    }




//Modal de alterar



//Abrir Modal
function abrirModalAlterar(dados) {
    $("#modalAlterar").modal()

    const id = document.getElementById("alterarId")
    const nome = document.getElementById("alterarNome")
    const valor = document.getElementById("alterarValor")

    id.innerText = dados.id
    nome.value = dados.nome
    valor.value = dados.valor


    adicionalSelecionadaAlterar = dados
}


function buttonAlterarValidarCampos() {

    const id = document.getElementById("alterarId").innerHTML
    const nome = document.getElementById("alterarNome").value
    const valor = document.getElementById("alterarValor").value

    if(adicionalSelecionadaAlterar.nome.trim() == nome.trim() && 
    adicionalSelecionadaAlterar.valor.trim() == valor.trim()) {

        abrirModalAlerta("Nenhuma informação foi alterada.")

    }
    else if(nome.trim() == "" || valor.trim() == "") {

        abrirModalAlerta("Preencha os campos obrigatórios.")

    }
    else { //vamos executar esse else se o usuario alterar somente o nome

        abrirModalProgress()
        alterarDadosFirebase(id, nome, valor)
        
    }
}


//Alterar dados Firebae

function alterarDadosFirebase(id, nome, valor) {

    const dados = {
        id: id,
        nome: nome,
        valor: valor
    }

    //bd.collection("categorias").add(dados).then(function() {
    bd.doc(id).update(dados).then(function() {

        $("#modalAlterar").modal("hide")
        removerModalProgress()
        abrirModalAlerta("Sucesso ao alterar Dados")

    }).catch(function(error) {

        $("#modalProgress").modal("hide")

        removerModalProgress()
        abrirModalAlerta("Erro ao alterar Dados: " + error)
    })
}




//Modal excluir

//Abrir Modal
function abrirModalRemover(dados) {
    $("#modalRemover").modal()

    adicionalSelecionadaRemover = dados

}

//Click em botao de Sim na modal remover
function removerAdicional() {

    abrirModalProgress()
    removerDadosFirebase();

}

//Remover dados Firebase

function removerDadosFirebase() {

    const id = adicionalSelecionadaRemover.id

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

        $("#tabelaAdicional tr:gt(0)").each(function() {

            if(i > (rows * numPage) || i <= (rows * numPage)- rows) {
                $(this).hide()
            } else {
                $(this).show()
            }

            i++
        })
    })
})


//Criar ordenação

let ordem = true;

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


