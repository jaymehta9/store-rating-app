import dotenv from "dotenv"
import { query } from "./db/index.js"

dotenv.config()

async function migrate() {
  await query(
    "create table if not exists users (id serial primary key,name varchar(60) not null,email varchar(160) not null unique,address varchar(400) not null,password_hash varchar(255) not null,role varchar(20) not null default 'USER',created_at timestamp not null default now())"
  )
  await query(
    "create table if not exists stores (id serial primary key,name varchar(60) not null,email varchar(160) not null,address varchar(400) not null,owner_id integer references users(id),created_at timestamp not null default now())"
  )
  await query(
    "create table if not exists ratings (id serial primary key,user_id integer not null references users(id) on delete cascade,store_id integer not null references stores(id) on delete cascade,rating integer not null,created_at timestamp not null default now(),updated_at timestamp not null default now(),unique(user_id,store_id))"
  )
  const adminEmail = process.env.ADMIN_EMAIL
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH
  if (adminEmail && adminPasswordHash) {
    await query(
      "insert into users (name,email,address,password_hash,role) values ($1,$2,$3,$4,$5) on conflict (email) do nothing",
      ["System Administrator Default", adminEmail, "Admin Address", adminPasswordHash, "ADMIN"]
    )
  }
}

migrate()
  .then(() => {
    console.log("migration complete")
    process.exit(0)
  })
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
