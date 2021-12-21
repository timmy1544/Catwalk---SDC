-- Table: public.reviews

-- DROP TABLE IF EXISTS public.reviews;

CREATE TABLE IF NOT EXISTS public.reviews
(
    id bigint NOT NULL DEFAULT nextval('reviews_id_seq'::regclass),
    product_id bigint NOT NULL,
    rating integer NOT NULL,
    date text COLLATE pg_catalog."default" NOT NULL,
    summary text COLLATE pg_catalog."default" NOT NULL,
    body text COLLATE pg_catalog."default" NOT NULL,
    recommend boolean NOT NULL,
    reported boolean NOT NULL DEFAULT false,
    reviewer_name character varying COLLATE pg_catalog."default" NOT NULL,
    reviewer_email character varying COLLATE pg_catalog."default" NOT NULL,
    response text COLLATE pg_catalog."default",
    helpfulness integer NOT NULL DEFAULT 0,
    CONSTRAINT reviews_pkey PRIMARY KEY (id)
)

-- Table: public.reviews_photos

-- DROP TABLE IF EXISTS public.reviews_photos;

CREATE TABLE IF NOT EXISTS public.reviews_photos
(
    id bigint NOT NULL DEFAULT nextval('reviews_photos_id_seq'::regclass),
    review_id bigint NOT NULL DEFAULT nextval('reviews_photos_review_id_seq'::regclass),
    url text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT reviews_photos_pkey PRIMARY KEY (id)
)

-- Table: public.characteristics

-- DROP TABLE IF EXISTS public.characteristics;

CREATE TABLE IF NOT EXISTS public.characteristics
(
    id bigint NOT NULL DEFAULT nextval('import_characteristics_id_seq'::regclass),
    product_id bigint NOT NULL DEFAULT nextval('import_characteristics_product_id_seq'::regclass),
    name text COLLATE pg_catalog."default",
    CONSTRAINT import_characteristics_pkey PRIMARY KEY (id)
)

-- Table: public.characteristic_review

-- DROP TABLE IF EXISTS public.characteristic_review;

CREATE TABLE IF NOT EXISTS public.characteristic_review
(
    id bigint NOT NULL DEFAULT nextval('characteristic_review_id_seq'::regclass),
    characteristic_id bigint NOT NULL DEFAULT nextval('characteristic_review_characteristic_id_seq'::regclass),
    review_id bigint NOT NULL DEFAULT nextval('characteristic_review_review_id_seq'::regclass),
    value integer NOT NULL,
    CONSTRAINT characteristic_review_pkey PRIMARY KEY (id)
)

ALTER TABLE "characteristic_reviews" ADD FOREIGN KEY ("characteristic_id") REFERENCES "characteristics" ("id");

ALTER TABLE "characteristic_reviews" ADD FOREIGN KEY ("review_id") REFERENCES "reviews" ("id");

ALTER TABLE "reviews_photos" ADD FOREIGN KEY ("review_id") REFERENCES "reviews" ("id");

SELECT setval('characteristic_review_id_seq', (SELECT MAX(id) FROM characteristic_review)+1);
SELECT setval('reviews_id_seq', (SELECT MAX(id) FROM reviews)+1);
SELECT setval('reviews_photos_id_seq', (SELECT MAX(id) FROM reviews_photos)+1);