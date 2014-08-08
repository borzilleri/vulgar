# --- Created by Slick DDL
# To stop Slick DDL generation, remove this comment and start using Evolutions

# --- !Ups

create table "POSTS" ("id" BIGINT GENERATED BY DEFAULT AS IDENTITY(START WITH 1) NOT NULL PRIMARY KEY,"post_id" BIGINT NOT NULL,"user_id" BIGINT NOT NULL,"source" VARCHAR NOT NULL,"created_on" TIMESTAMP NOT NULL,"modified_by" BIGINT NOT NULL,"modified_on" TIMESTAMP NOT NULL);
create table "TOPICS" ("id" BIGINT GENERATED BY DEFAULT AS IDENTITY(START WITH 1) NOT NULL PRIMARY KEY,"title" VARCHAR NOT NULL,"slug" VARCHAR NOT NULL);
create table "USERS" ("id" BIGINT GENERATED BY DEFAULT AS IDENTITY(START WITH 1) NOT NULL PRIMARY KEY,"display_name" VARCHAR NOT NULL);
create table "USER_EMAILS" ("id" BIGINT GENERATED BY DEFAULT AS IDENTITY(START WITH 1) NOT NULL PRIMARY KEY,"user_id" BIGINT NOT NULL,"email" VARCHAR NOT NULL,"confirmed" BOOLEAN DEFAULT false NOT NULL);
create unique index "idx_unique_email " on "USER_EMAILS" ("email");
create table "USER_TOKENS" ("id" BIGINT GENERATED BY DEFAULT AS IDENTITY(START WITH 1) NOT NULL PRIMARY KEY,"user_id" BIGINT NOT NULL,"token" VARCHAR NOT NULL,"expiration" TIMESTAMP NOT NULL,"session_only" BOOLEAN DEFAULT false NOT NULL,"browser" VARCHAR DEFAULT 'unknown' NOT NULL,"alias" VARCHAR);

# --- !Downs

drop table "USER_TOKENS";
drop table "USER_EMAILS";
drop table "USERS";
drop table "TOPICS";
drop table "POSTS";
