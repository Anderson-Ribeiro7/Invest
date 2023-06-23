const modal = document.querySelector('.modal-container')
const tbody = document.querySelector('tbody')
const sAtivo = document.querySelector('#m-ativo')
const sQuantidade = document.querySelector('#m-quantidade')
const sPrecoMedio = document.querySelector('#m-precoMedio')
const sPrecoAtual = document.querySelector('#m-precoAtual')



const btnSalvar = document.querySelector('#btnSalvar')

let itens
let id

function openModal(edit = false, index = 0) {
  modal.classList.add('active')

  modal.onclick = e => {
    if (e.target.className.indexOf('modal-container') !== -1) {
      modal.classList.remove('active')
    }
  }

  if (edit) {
    sAtivo.value = itens[index].ativo
    sQuantidade.value = itens[index].quantidade
    sPrecoMedio.value = itens[index].precomedio
    sPrecoAtual.value = itens[index].precoatual

    id = index
  } else {
    sAtivo.value = ''
    sQuantidade.value = ''
    sPrecoMedio.value = ''
    sPrecoAtual.value = ''
  }

}

function editItem(index) {

  openModal(true, index)
}

function deleteItem(index) {
  itens.splice(index, 1)
  setItensBD()
  loadItens()
}
function insertItem(item, index) {
  let tr = document.createElement('tr')
  

  tr.innerHTML = `
    <td>${item.ativo}</td>
    <td>${item.quantidade}</td>
    <td>R$ ${item.precomedio}</td>
    <td>R$ ${item.investCalculado }</td>
    <td>R$ ${item.precoatual}</td>
    <td>R$ ${item.lucroCalculado }</td>
    <td>${item.porcentagem}</td>
    <td class="acao">
      <button onclick="editItem(${index})"><i class='bx bx-edit' ></i></button>
    </td>
    <td class="acao">
      <button onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button>
    </td>
  `
  tbody.appendChild(tr)
}

function investimento(quantidade, precoCompra){
  var investResultado = (quantidade*precoCompra)
  return investResultado

}

function calculaLucro(quantidade, precoCompra, precoAtual) {
  var resultadoLucroPrejuizo = (precoAtual-precoCompra)*quantidade
  return resultadoLucroPrejuizo
}

function calcularpercentual(quantidade, precoCompra, precoAtual){
  var investimentoTotal = (quantidade*precoCompra)
  var lucroPrejuizo = (precoCompra - precoAtual) * 100
  var resultadoPorcentagem = (lucroPrejuizo*100)/investimentoTotal
  
  return resultadoPorcentagem
}

btnSalvar.onclick = e => {

  if (sAtivo.value == '' || sQuantidade.value == '' || sPrecoMedio.value == '' || sPrecoAtual.value == '') {
    return
  }

  e.preventDefault();

  var lucroCalculado = calculaLucro(sQuantidade.value, sPrecoMedio.value, sPrecoAtual.value)
  var investCalculado = investimento(sQuantidade.value, sPrecoMedio.value)
  var porcentagemCalculada = calcularpercentual(sQuantidade.value, sPrecoMedio.value, sPrecoAtual.value)  

  if (id !== undefined) {
    itens[id].ativo = sAtivo.value
    itens[id].quantidade = sQuantidade.value
    itens[id].precomedio = sPrecoMedio.value
    itens[id].precoatual = sPrecoAtual.value
    itens[id].investCalculado = investCalculado
    itens[id].lucroCalculado = lucroCalculado
    itens[id].porcentagemCalculada = porcentagemCalculada
    

  } else {
    itens.push({ 'ativo': sAtivo.value, 'quantidade': sQuantidade.value, 'precomedio': sPrecoMedio.value, 'precoatual': sPrecoAtual.value, 'lucroCalculado':  lucroCalculado,'investCalculado':investCalculado,'porcentagemCalculada':porcentagemCalculada})
  }

  setItensBD()

  modal.classList.remove('active')
  loadItens()
  id = undefined
}


function loadItens() {
  itens = getItensBD()
  tbody.innerHTML = ''
  itens.forEach((item, index) => {
    insertItem(item, index)
  })

}

const getItensBD = () => JSON.parse(localStorage.getItem('dbfunc')) ?? []
const setItensBD = () => localStorage.setItem('dbfunc', JSON.stringify(itens))

loadItens()