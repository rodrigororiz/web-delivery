const firebaseConfig = {
    apiKey: "AIzaSyAg0WswFD46t-CKooLnGyD46BIkL9NfZ5U",
    authDomain: "projeto-teste-26c88.firebaseapp.com",
    databaseURL: "https://projeto-teste-26c88.firebaseio.com",
    projectId: "projeto-teste-26c88",
    storageBucket: "projeto-teste-26c88.appspot.com",
    messagingSenderId: "374511580608",
    appId: "1:374511580608:web:5b049eefe2c3b130344425",
    measurementId: "G-QZRKVSRYVX",
};
  
  firebase.initializeApp(firebaseConfig);

  let tabela = document
  .getElementById("tabelaPedido")
  .getElementsByTagName("tbody")[0];

  let bd = firebase.firestore().collection("pedidos");
  let keyLista = []
  let pedidoSelecionadoCliente;
  let pedidoSelecionadoFinalizarPedido;

//Ouvinte

bd.where("pedido_status", "==", "em andamento").onSnapshot(function (documentos) {
    documentos.docChanges().forEach(function (changes) {
      if (changes.type === "added") {

        const doc = changes.doc;
        const dados = doc.data();

        keyLista.push(dados.pedido_id);

        criarItensTabala(dados);

      } else if (changes.type === "modified") {

        const doc = changes.doc;
        const dados = doc.data();
          
      } else if (changes.type === "removed") {

        const doc = changes.doc;
        const dados = doc.data();
  
        removerItensTabela(dados);
      }
    });
  });

  //Tabela

  //Adicionando itens tabela

function criarItensTabala(dados) {
    const linha = tabela.insertRow();

    const colunaClienteNome = linha.insertCell(0);
    const colunaPedidoDados = linha.insertCell(1);
    const colunaPedidoHora = linha.insertCell(2);

    const dados_pedido = dados.pedido_dados.substr(0,20) + " ..."
    
    colunaClienteNome.appendChild(document.createTextNode(dados.cliente_nome));
    colunaPedidoDados.appendChild(document.createTextNode(dados_pedido.replace(/<br>/g, "")));
    colunaPedidoHora.appendChild(document.createTextNode(dados.pedido_data));
  
    ordemDecrescente()
    criarBotoesTabela(linha, dados);
  }
  
  
  //Remover itens da tabela
  
  function removerItensTabela(dados) {
    const index = keyLista.indexOf(dados.pedido_id);
  
    tabela.rows[index].remove();
    keyLista.splice(index, 1);
  }
  
  //Criar botoes Tabela
  
  function criarBotoesTabela(linha, dados) {

    const colunaPedidoInf = linha.insertCell(3)
    const colunaClienteInf = linha.insertCell(4)
    const colunaPedidoImprimir = linha.insertCell(5)
    const colunaPedidoFinalizar = linha.insertCell(6)

    const buttonDetalhesPedido = document.createElement("button");
    buttonDetalhesPedido.innerHTML = `<i class="fas fa-eye"></i>`;
    buttonDetalhesPedido.className = "btn btn-success btn-xs";
  
    const buttonDetalhesCliente = document.createElement("button");
    buttonDetalhesCliente.innerHTML = `<i class="fas fa-eye"></i>`;
    buttonDetalhesCliente.className = "btn btn-success btn-xs";

    const buttonimprimir = document.createElement("button");
    buttonimprimir.innerHTML = `<i class="fas fa-print"></i>`;
    buttonimprimir.className = "btn btn-success btn-xs";

    const buttonFinalizar = document.createElement("button");
    buttonFinalizar.innerHTML = `<i class="fas fa-check"></i>`;
    buttonFinalizar.className = "btn btn-danger btn-xs";


  
    buttonDetalhesPedido.onclick = function () {
      clickDetalhePedido(dados)
      return false;
    };
  
    buttonDetalhesCliente.onclick = function () {
      
      clickDetalheCliente(dados)
      return false;
    };

    buttonimprimir.onclick = function () {
      
      clickImprimir(dados)
      return false;
    };

    buttonFinalizar.onclick = function () {
      
      clickFinalizarPedido(dados)
      return false;
    };
  
    colunaPedidoInf.appendChild(buttonDetalhesPedido);
    colunaClienteInf.appendChild(buttonDetalhesCliente);
    colunaPedidoImprimir.appendChild(buttonimprimir);
    colunaPedidoFinalizar.appendChild(buttonFinalizar);
  }




  //Click botao detalhes pedido

  function clickDetalhePedido(dados) {

    $("#modalPedido").modal()

    const id = document.getElementById("pedidoId")
    const pedido_dados = document.getElementById("pedidoDados")
    const pedido_pagamento = document.getElementById("pedidoPagamento")
    const pedido_data = document.getElementById("pedidoData")

    id.innerHTML = dados.pedido_id
    pedido_dados.innerHTML = dados.pedido_dados
    pedido_pagamento.innerHTML = dados.pedido_forma_pagamento
    pedido_data.innerHTML = dados.pedido_data
  }


  //Click botao detalhe cliente

  function clickDetalheCliente(dados) {

    $("#modalCliente").modal()


    const nome = document.getElementById("clienteNome")
    const endereco = document.getElementById("clienteEndereco")
    const contato = document.getElementById("clienteContato")

    nome.innerHTML = dados.cliente_nome
    endereco.innerHTML = dados.cliente_endereco
    contato.innerHTML = dados.cliente_contato

    pedidoSelecionadoCliente = dados
  }




  //Envio de notificação

  //Validar Campos notificacao

function validarCamposNotificacao() {

    const titulo = document.getElementById("clienteTituloNotificacao").value
    const mensagem = document.getElementById("clienteMensagemNotificacao").value

    if(titulo.trim() == "" || mensagem.trim() == "") {

        abrirModalAlerta("Preencha os campos obrigatórios")
    } else {
        
        obterDadosNotificacao(titulo, mensagem, pedidoSelecionadoCliente.token_msg)
    }

}



//obter dados da notificacao

function obterDadosNotificacao(titulo, mensagem, token) {

    firebase.firestore().collection("app").doc("notificacao").get().then(function(documento) {

        const dados = documento.data()

        const key = dados.key

        abrirModalProgress()
        post(titulo, mensagem, token, key)
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

    document.getElementById("clienteTituloNotificacao").value = ""
    document.getElementById("clienteMensagemNotificacao").value = ""
    
}

//Click botao Imprimir

function clickImprimir(dados) {

  
  const doc = new jsPDF("portrait", "mm", [597,410])
  console.log(doc)

  doc.setFont("helvetica")
  doc.setFontStyle("bold")
  doc.setFontSize(11)
  doc.text("Pedido Nº: " + dados.pedido_id, 20, 5)//o 20 refere a distancia da borda esquerda. O 5 refere a distancia da borda de cima.
  
  doc.setFont("times")
  doc.setFontStyle("normal")
  doc.text("Data e Hora Pedido: \n " + dados.pedido_data,20,20)
  doc.text("\nCliente: \n " + dados.cliente_nome,20,30)
  doc.text("Forma de Pagamento: \n " + dados.pedido_forma_pagamento,20,50)
  doc.text("\nValor Total: \n " + dados.pedido_valor,20,60)
  doc.text("Pedido: \n " + dados.pedido_dados.replace(/<br>/g, "\n"),20,80)
  
  doc.save("pedido: "+dados.pedido_id+".pdf")
  doc.autoPrint()
  doc.output("dataurlnewwindow")
  
}


//Botao finalizar 

function clickFinalizarPedido(dados) {

  $("#modalFinalizarPedido").modal()

  pedidoSelecionadoFinalizarPedido = dados
}

function finalizarPedido() {

  const dados = {
    pedido_status: "finalizado"
  }

  firebase.firestore().collection("pedidos").doc(pedidoSelecionadoFinalizarPedido.pedido_id).update(dados).then(function(){

    $("#modalFinalizarPedido").modal("hide")
    abrirModalAlerta("Sucesso ao finalizar pedido")

  }).catch(function(error) {

    console.log(error)
    abrirModalAlerta("Erro ao finalizar pedido " + error)
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

  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[opcao];

    if (td) {
      valorItemTabela = td.textContent.toUpperCase();

      if (valorItemTabela.indexOf(filtro) == -1) {
        tr[i].style.display = "none";
      } else {
        tr[i].style.display = "";
      }
    }
  }
}

//criar paginação

$("#maxRows").on("change", function () {
  let maxRows, tr, i;
  maxRows = parseInt($("#maxRows").val()) - 1;

  tr = tabela.getElementsByTagName("tr");

  for (i = 0; i < tr.length; i++) {
    if (i > maxRows) {
      tr[i].style.display = "none";
    } else {
      tr[i].style.display = "";
    }
  }

  //paginação inserindo botões

  $("#pagination").html("");

  let rows = parseInt($("#maxRows").val());
  let totalRows = tr.length;

  if (totalRows > rows) {
    let numPage = Math.ceil(totalRows / rows);

    for (let i = 1; i <= numPage; i++) {
      $("#pagination")
        .append(
          '<li class="page-item"> <a class="page-link" href="#">' +
            i +
            "</a></li>"
        )
        .show();
    }
  }

  //paginação click

  $("#pagination").on("click", function (e) {
    let numPage = parseInt(e.target.innerText);

    i = 1;

    $("#tabelaPedido tr:gt(0)").each(function () {
      if (i > rows * numPage || i <= rows * numPage - rows) {
        $(this).hide();
      } else {
        $(this).show();
      }

      i++;
    });
  });
});


//Ordem Decrescente

function ordemDecrescente() {
  let tr = tabela.getElementsByTagName("tr");

  for (let i = 0; i < tr.length - 1; i++) {
    for (let j = 0; j < tr.length - (i + 1); j++) {
      let informação1 = tr[j].getElementsByTagName("td")[2].textContent;
      let informação2 = tr[j + 1].getElementsByTagName("td")[2].textContent;

      if (Number(informação1.replace(/[^0-9\.]+/g, "")) < Number(informação2.replace(/[^0-9\.]+/g, ""))) {//o replace esta trocando qqualquer caracter que nao seja numero por vazio
        tabela.insertBefore(tr.item(j + 1), tr.item(j));

        let valor = keyLista[j + 1];
        keyLista[j + 1] = keyLista[j];
        keyLista[j] = valor;
      }
    }
  }
}


