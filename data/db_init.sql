BEGIN;


DROP TABLE IF EXISTS "list", "card", "label", "card_has_label";

CREATE TABLE "list" (
    "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" TEXT NOT NULL DEFAULT '',
    "position" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE "card" (
    "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" TEXT NOT NULL DEFAULT '',
    "content" TEXT NOT NULL DEFAULT '',
    "position" INTEGER NOT NULL DEFAULT 0,
    "color" TEXT NOT NULL DEFAULT '#FFF',
    "list_id" INTEGER NOT NULL REFERENCES list("id") ON DELETE CASCADE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE "label" (
    "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" TEXT NOT NULL DEFAULT '',
    "color" TEXT NOT NULL DEFAULT '#FFF',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ
);

CREATE TABLE "card_has_label" (
    PRIMARY KEY ("card_id", "label_id"),
    "card_id" INTEGER NOT NULL REFERENCES card("id") ON DELETE CASCADE,
    "label_id" INTEGER NOT NULL REFERENCES label("id") ON DELETE CASCADE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO "list" ("name") VALUES ('First list');

INSERT INTO "card" ("name", "content", "color", "list_id")
VALUES ('Carte 1', 'My first card', '#fff696', 1),
    ('Carte 2', 'My second card', '#fff696', 1);

INSERT INTO "label" ("name", "color") VALUES ('Urgent', 'red');

INSERT INTO "card_has_label" ("card_id", "label_id") VALUES (1, 1);

COMMIT;