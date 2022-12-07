const { pool } = require('../config');

// método para retornar todos os fornecedores: em caso de erro (400)
// retorna um json com o erro e a mensagem, caso sucesso (200)
// retorna as linhas da query
const getFornecedores = (request, response) => {
    pool.query('SELECT * FROM fornecedores ORDER BY codigo',
        (error, results) => {
            if (error) {
                return response.status(400).json({
                    status: 'error',
                    message: 'Erro ao consultar o fornecedor: ' + error
                })
            }
            response.status(200).json(results.rows);
        }
    )
}

// método para adicionar novos fornecedores na tabela que retorna
// um array que irá conter os valores dos parâmetros
const addFornecedores = (request, response) => {
    const { nome, cnpj, setor } = request.body;
    pool.query(`INSERT INTO fornecedores (nome, cnpj, setor) 
    VALUES ($1, $2, $3) RETURNING codigo, nome, cnpj, setor`,
        [nome, cnpj, setor],
        (error, results) => {
            if (error) {
                return response.status(400).json({
                    status: 'eror',
                    message: 'Erro ao inserir o fornecedor: ' + error
                })
            }
            response.status(200).json({
                status: "success", message: "Fornecedor criado",
                objeto: results.rows[0]
            })
        })
}

// método para alterar fornecedores na tabela com base em codigo que
// retorna um array que irá conter os valores dos parâmetros
const updateFornecedores = (request, response) => {
    const { nome, cnpj, setor, codigo } = request.body;
    pool.query(`UPDATE fornecedores SET nome=$1, cnpj=$2, setor=$3  
    WHERE codigo=$4 RETURNING codigo, nome, cnpj, setor`,
        [nome, cnpj, setor, codigo],
        (error, results) => {
            if (error) {
                return response.status(400).json({
                    status: 'eror',
                    message: 'Erro ao alterar o fornecedor: ' + error
                })
            }
            response.status(200).json({
                status: "success", message: "Fornecedor alterado",
                objeto: results.rows[0]
            })
        })
}

// método para deletar fornecedores na tabela com base em codigo que
// verifica se existe linha retornada na consulta e deleta
const deleteFornecedor = (request, response) => {
    const codigo = parseInt(request.params.codigo);
    pool.query(`DELETE FROM fornecedores WHERE codigo=$1`, [codigo],
        (error, results) => {
            if (error || results.rowCount == 0) {
                return response.status(400).json({
                    status: 'eror',
                    message: 'Erro ao remover o fornecedor: ' +
                        (error ? error : 'Nenhuma linha removida')
                })
            }
            response.status(200).json({
                status: "success", message: "Fornecedor removido"
            })
        })
}

// método para encontrar um fornecedor na tabela com base em codigo que
// verifica se existe linha retornada na consulta e retorna em json
const getFornecedorPorCodigo = (request, response) => {
    const codigo = parseInt(request.params.codigo);
    pool.query(`SELECT * FROM fornecedores WHERE codigo=$1`, [codigo],
        (error, results) => {
            if (error || results.rowCount == 0) {
                return response.status(400).json({
                    status: 'eror',
                    message: 'Erro ao recuperar o fornecedor: ' +
                        (error ? error : 'Nenhuma linha encontrada')
                })
            }
            response.status(200).json(results.rows[0]);
        })
}

module.exports = { getFornecedores, addFornecedores, updateFornecedores, deleteFornecedor, getFornecedorPorCodigo }