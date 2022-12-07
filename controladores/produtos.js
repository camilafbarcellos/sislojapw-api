const { pool } = require('../config');

// método para retornar todos os produtos: em caso de erro (400)
// retorna um json com o erro e a mensagem, caso sucesso (200)
// retorna as linhas da query
const getProdutos = (request, response) => {
    pool.query('SELECT * FROM produtos ORDER BY codigo',
        (error, results) => {
            if (error) {
                return response.status(400).json({
                    status: 'error',
                    message: 'Erro ao consultar a produto: ' + error
                })
            }
            response.status(200).json(results.rows);
        }
    )
}

// método para adicionar novos produtos na tabela que retorna
// um array que irá conter os valores dos parâmetros
const addProdutos = (request, response) => {
    const { estoque, nome, valor, fornecedor } = request.body;
    pool.query(`INSERT INTO produtos (estoque, nome, valor, fornecedor) 
    VALUES ($1, $2, $3, $4) RETURNING estoque, nome, valor, fornecedor`,
        [estoque, nome, valor, fornecedor],
        (error, results) => {
            if (error) {
                return response.status(400).json({
                    status: 'eror',
                    message: 'Erro ao inserir o produto: ' + error
                })
            }
            response.status(200).json({
                status: "success", message: "Produto criado",
                objeto: results.rows[0]
            })
        })
}

// método para alterar produtos na tabela com base em codigo que
// retorna um array que irá conter os valores dos parâmetros
const updateProdutos = (request, response) => {
    const { estoque, nome, valor, fornecedor, codigo } = request.body;
    pool.query(`UPDATE produtos SET estoque=$1, nome=$2, valor=$3, fornecedor=$4  
    WHERE codigo=$5 RETURNING codigo, estoque, nome, valor, fornecedor`,
        [estoque, nome, valor, fornecedor, codigo],
        (error, results) => {
            if (error) {
                return response.status(400).json({
                    status: 'eror',
                    message: 'Erro ao alterar o produto: ' + error
                })
            }
            response.status(200).json({
                status: "success", message: "Produto alterado",
                objeto: results.rows[0]
            })
        })
}

// método para deletar produtos na tabela com base em codigo que
// verifica se existe linha retornada na consulta e deleta
const deleteProduto = (request, response) => {
    const codigo = parseInt(request.params.codigo);
    pool.query(`DELETE FROM produtos WHERE codigo=$1`, [codigo],
        (error, results) => {
            if (error || results.rowCount == 0) {
                return response.status(400).json({
                    status: 'eror',
                    message: 'Erro ao remover o produto: ' +
                        (error ? error : 'Nenhuma linha removida')
                })
            }
            response.status(200).json({
                status: "success", message: "Produto removido"
            })
        })
}

// método para encontrar um fornecedor na tabela com base em codigo que
// verifica se existe linha retornada na consulta e retorna em json
const getProdutoPorCodigo = (request, response) => {
    const codigo = parseInt(request.params.codigo);
    pool.query(`SELECT * FROM produtos WHERE codigo=$1`, [codigo],
        (error, results) => {
            if (error || results.rowCount == 0) {
                return response.status(400).json({
                    status: 'eror',
                    message: 'Erro ao recuperar o produto: ' +
                        (error ? error : 'Nenhuma linha encontrada')
                })
            }
            response.status(200).json(results.rows[0]);
        })
}

module.exports = { getProdutos, addProdutos, updateProdutos, deleteProduto, getProdutoPorCodigo }