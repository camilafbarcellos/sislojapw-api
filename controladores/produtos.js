const { pool } = require('../config');
const { request, response } = require("express");

const getProdutos = (request, response) => {
    pool.query(`select p.codigo as codigo, p.estoque as estoque, 
        p.nome as nome, p.valor as valor, 
        p.fornecedor as fornecedor, f.nome as nomefornecedor
        from produtos p
        join fornecedores f on p.fornecedor = f.codigo
        order by p.codigo`,
        (error, results) => {
            if (error) {
                return response.status(400).json({
                    status: 'error',
                    message: 'Erro ao consultar os produtos: ' + error
                });
            }
            response.status(200).json(results.rows);
        })
}

const addProduto = (request, response) => {
    const { estoque, nome, valor, fornecedor } = request.body;
    pool.query(`insert into produtos (estoque, nome, valor, fornecedor) 
    values ($1, $2, $3, $4)
    returning codigo, estoque, nome, valor, fornecedor`,
        [estoque, nome, valor, fornecedor],
        (error, results) => {
            if (error) {
                return response.status(400).json({
                    status: 'error',
                    message: 'Erro ao inserir o produto!'
                });
            }
            response.status(200).json({
                status: 'success', message: "Produto criado!",
                objeto: results.rows[0]
            });
        })
}

const updateProduto = (request, response) => {
    const { codigo, estoque, nome, valor, fornecedor } = request.body;
    pool.query(`UPDATE produtos
	SET estoque=$1, nome=$2, valor=$3, fornecedor=$4
	WHERE codigo=$5
returning codigo, estoque, nome, valor, fornecedor`,
        [estoque, nome, valor, fornecedor, codigo],
        (error, results) => {
            if (error) {
                return response.status(400).json({
                    status: 'error',
                    message: 'Erro ao atualizar o produto!'
                });
            }
            response.status(200).json({
                status: 'success', message: "Produto atualizado!",
                objeto: results.rows[0]
            });
        })
}


const deleteProduto = (request, response) => {
    const codigo = parseInt(request.params.codigo);
    pool.query(`DELETE FROM produtos WHERE codigo=$1`,
        [codigo],
        (error, results) => {
            if (error || results.rowCount == 0) {
                return response.status(400).json({
                    status: 'error',
                    message: 'Erro ao remover o produto! ' + (error ? error : '')
                });
            }
            response.status(200).json({
                status: 'success', message: "Produto removido!"
            });
        })
}

const getProdutoPorCodigo = (request, response) => {
    const codigo = parseInt(request.params.codigo);
    pool.query(`SELECT * FROM produtos WHERE codigo=$1`,
        [codigo],
        (error, results) => {
            if (error || results.rowCount == 0) {
                return response.status(400).json({
                    status: 'error',
                    message: 'Erro ao recuperar o produto!'
                });
            }
            response.status(200).json(results.rows[0]);
        })
}

module.exports = {
    getProdutos, addProduto, updateProduto, deleteProduto,
    getProdutoPorCodigo
}