import knex from 'knex';
import path from 'path';

// Migrations - controlam a versão do banco de dados

const db = knex({
    client: 'sqlite3',
    connection: {
        filename: path.resolve(__dirname, 'database.sqlite') /* cria o arquivo database.sqlite no diretorio raiz do arquivo, neste caso na pasta database */
    },
    useNullAsDefault: true,
});

export default db;