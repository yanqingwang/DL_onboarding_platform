exports.up = async function(knex) {
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('email').notNullable().unique();
    table.string('password_hash').notNullable();
    table.string('role').notNullable().defaultTo('candidate');
    table.string('first_name');
    table.string('last_name');
    table.string('phone');
    table.boolean('is_active').notNullable().defaultTo(true);
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('candidates', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('first_name').notNullable();
    table.string('last_name').notNullable();
    table.string('email').notNullable();
    table.string('phone');
    table.string('address');
    table.string('city');
    table.string('state');
    table.string('zip_code');
    table.string('country').defaultTo('USA');
    table.date('date_of_birth');
    table.string('ssn_last_4');
    table.string('job_position');
    table.string('status').notNullable().defaultTo('pending');
    table.text('notes');
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('interviews', (table) => {
    table.increments('id').primary();
    table.integer('candidate_id').unsigned().notNullable().references('id').inTable('candidates').onDelete('CASCADE');
    table.integer('interviewer_id').unsigned().references('id').inTable('users');
    table.string('type').notNullable();
    table.string('status').notNullable().defaultTo('scheduled');
    table.datetime('scheduled_at').notNullable();
    table.integer('duration_minutes').defaultTo(60);
    table.text('notes');
    table.integer('rating');
    table.string('result');
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('documents', (table) => {
    table.increments('id').primary();
    table.integer('candidate_id').unsigned().notNullable().references('id').inTable('candidates').onDelete('CASCADE');
    table.string('type').notNullable();
    table.string('file_name').notNullable();
    table.string('file_path').notNullable();
    table.string('mime_type');
    table.integer('file_size');
    table.string('status').notNullable().defaultTo('pending');
    table.text('notes');
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('employees', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.integer('candidate_id').unsigned().references('id').inTable('candidates');
    table.string('employee_id').notNullable().unique();
    table.string('department');
    table.string('position');
    table.date('hire_date');
    table.decimal('salary', 10, 2);
    table.string('employment_type').defaultTo('full_time');
    table.string('status').notNullable().defaultTo('active');
    table.string('manager_name');
    table.text('emergency_contact');
    table.string('emergency_phone');
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('employees');
  await knex.schema.dropTableIfExists('documents');
  await knex.schema.dropTableIfExists('interviews');
  await knex.schema.dropTableIfExists('candidates');
  await knex.schema.dropTableIfExists('users');
};
