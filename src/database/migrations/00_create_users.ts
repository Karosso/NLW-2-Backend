import Knex from 'knex';

export async function up(knex: Knex) {
    /* Criar tabelas e fazer alteraçõs no campo */
    return knex.schema.createTable('users', table => {
        table.increments('id').primary(); /* campo de alto encremento para o id do usuario */
        table.string('name').notNullable(); 
        table.string('avatar').notNullable();
        table.string('whatsapp').notNullable();
        table.string('bio').notNullable();
    });
}

export async function down(knex: Knex) {
    /* Fazer downgrade da tabela */
    return knex.schema.dropTable('users');
}
