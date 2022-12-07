const { Router } = require("express");

const controleFornecedores = require('./controladores/fornecedores');
const controleProdutos = require('./controladores/produtos');

const rotas = new Router();

rotas.route('/fornecedores')
    .get(controleFornecedores.getFornecedores)
    .post(controleFornecedores.addFornecedores)
    .put(controleFornecedores.updateFornecedores)

rotas.route('/fornecedores/:codigo')
    .delete(controleFornecedores.deleteFornecedor)
    .get(controleFornecedores.getFornecedorPorCodigo)

    rotas.route('/produtos')
    .get(controleProdutos.getProdutos)
    .post(controleProdutos.addProdutos)
    .put(controleProdutos.updateProdutos)

rotas.route('/produtos/:codigo')
    .delete(controleProdutos.deleteProduto)
    .get(controleProdutos.getProdutoPorCodigo)

module.exports = rotas;