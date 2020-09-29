import Knex from 'knex';

export async function up(knex: Knex) {
    /* Criar tabelas e fazer alteraçõs no campo */
    return knex.schema.createTable('classes', table => {
        table.increments('id').primary(); /* campo de alto encremento para o id do usuario */
        table.string('subject').notNullable(); 
        table.decimal('cost').notNullable();

        table.integer('user_id') /* Cria uma relação com a tabela users - onde toda materia adicionada a tabela classes necessita uma id de professor */
            .notNullable()
            .references('id')
            .inTable('users')
            .onUpdate('CASCADE')
            .onDelete('CASCADE'); /* SE O PROFESSOSR FOR DELETADO, TODAS SUAS MATERIAS SÃO DELETADAS JUNTO */
    });
}

export async function down(knex: Knex) {
    /* Fazer downgrade da tabela */
    return knex.schema.dropTable('classes');
}