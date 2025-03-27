--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4 (Debian 17.4-1.pgdg120+2)
-- Dumped by pg_dump version 17.4 (Debian 17.4-1.pgdg120+2)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: code; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.code (
    id integer NOT NULL,
    value character varying NOT NULL,
    "userId" integer,
    expired_at timestamp without time zone NOT NULL,
    is_used boolean DEFAULT false NOT NULL
);


ALTER TABLE public.code OWNER TO postgres;

--
-- Name: code_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.code_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.code_id_seq OWNER TO postgres;

--
-- Name: code_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.code_id_seq OWNED BY public.code.id;


--
-- Name: follower; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.follower (
    id integer NOT NULL,
    "followedAt" timestamp without time zone DEFAULT now() NOT NULL,
    followed_id integer,
    following_id integer
);


ALTER TABLE public.follower OWNER TO postgres;

--
-- Name: follower_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.follower_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.follower_id_seq OWNER TO postgres;

--
-- Name: follower_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.follower_id_seq OWNED BY public.follower.id;


--
-- Name: migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    "timestamp" bigint NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.migrations OWNER TO postgres;

--
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.migrations_id_seq OWNER TO postgres;

--
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;


--
-- Name: post; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.post (
    id integer NOT NULL,
    content text NOT NULL,
    views integer DEFAULT 0 NOT NULL,
    "userId" integer,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone,
    is_private boolean DEFAULT false NOT NULL,
    image_url character varying,
    thumbnail_url character varying
);


ALTER TABLE public.post OWNER TO postgres;

--
-- Name: post_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.post_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.post_id_seq OWNER TO postgres;

--
-- Name: post_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.post_id_seq OWNED BY public.post.id;


--
-- Name: refresh_token; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.refresh_token (
    id character varying NOT NULL,
    value character varying NOT NULL,
    "userId" integer
);


ALTER TABLE public.refresh_token OWNER TO postgres;

--
-- Name: role; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.role (
    id integer NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.role OWNER TO postgres;

--
-- Name: role_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.role_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.role_id_seq OWNER TO postgres;

--
-- Name: role_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.role_id_seq OWNED BY public.role.id;


--
-- Name: user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."user" (
    id integer NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL,
    "roleId" integer,
    first_name character varying NOT NULL,
    last_name character varying,
    is_verified boolean DEFAULT false NOT NULL
);


ALTER TABLE public."user" OWNER TO postgres;

--
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_id_seq OWNER TO postgres;

--
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;


--
-- Name: code id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.code ALTER COLUMN id SET DEFAULT nextval('public.code_id_seq'::regclass);


--
-- Name: follower id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.follower ALTER COLUMN id SET DEFAULT nextval('public.follower_id_seq'::regclass);


--
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- Name: post id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post ALTER COLUMN id SET DEFAULT nextval('public.post_id_seq'::regclass);


--
-- Name: role id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role ALTER COLUMN id SET DEFAULT nextval('public.role_id_seq'::regclass);


--
-- Name: user id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);


--
-- Data for Name: code; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.code (id, value, "userId", expired_at, is_used) FROM stdin;
3	345698	4	2025-03-26 11:47:03.26	t
\.


--
-- Data for Name: follower; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.follower (id, "followedAt", followed_id, following_id) FROM stdin;
1	2025-03-25 20:10:02.561	4	6
2	2025-03-20 18:27:02.613	7	6
3	2025-03-21 21:03:02.626	8	6
4	2025-03-22 14:45:02.646	6	4
5	2025-03-24 10:01:02.66	7	4
6	2025-03-21 13:12:02.68	8	4
7	2025-03-23 08:30:02.712	4	7
8	2025-03-24 12:18:02.799	6	8
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.migrations (id, "timestamp", name) FROM stdin;
2	1742371019418	Migration1742371019418
3	1742371360776	Migration1742371360776
4	1742662553494	Migration1742662553494
5	1742877734214	Migration1742877734214
6	1742884309140	Migration1742884309140
7	1742897532943	Migration1742897532943
8	1742897834518	Migration1742897834518
9	1742963308799	Migration1742963308799
\.


--
-- Data for Name: post; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.post (id, content, views, "userId", created_at, updated_at, is_private, image_url, thumbnail_url) FROM stdin;
7	Test post	0	4	2025-03-26 04:33:17.637236	\N	f	https://storage.googleapis.com/study-project-a5e85.firebasestorage.app/istockphoto-172730312-612x612-1742963596728.jpg	https://storage.googleapis.com/study-project-a5e85.firebasestorage.app/istockphoto-172730312-612x612-1742963596728-thumbnail-1742964026011
8	Test post	0	6	2025-03-26 04:37:37.999093	\N	f	https://storage.googleapis.com/study-project-a5e85.firebasestorage.app/istockphoto-172730312-612x612-1742963855801.jpg	https://storage.googleapis.com/study-project-a5e85.firebasestorage.app/istockphoto-172730312-612x612-1742963855801-thumbnail-1742964027958
9	Test post	0	7	2025-03-26 04:40:32.078508	\N	f	https://storage.googleapis.com/study-project-a5e85.firebasestorage.app/istockphoto-172730312-612x612-1742964031537.jpg	https://storage.googleapis.com/study-project-a5e85.firebasestorage.app/istockphoto-172730312-612x612-1742964031537-thumbnail-1742964033221
10	1234567	0	6	2025-03-26 09:27:10.077975	\N	f	https://storage.googleapis.com/study-project-a5e85.firebasestorage.app/istockphoto-172730312-612x612-1742981228109.jpg	https://storage.googleapis.com/study-project-a5e85.firebasestorage.app/istockphoto-172730312-612x612-1742981228109-thumbnail-1742981230669
11	1234567	0	7	2025-03-26 09:29:31.836936	\N	f	https://storage.googleapis.com/study-project-a5e85.firebasestorage.app/istockphoto-172730312-612x612-1742981369887.jpg	https://storage.googleapis.com/study-project-a5e85.firebasestorage.app/istockphoto-172730312-612x612-1742981369887-thumbnail-1742981372458
12	1234567	0	8	2025-03-26 09:31:05.003512	\N	f	https://storage.googleapis.com/study-project-a5e85.firebasestorage.app/istockphoto-172730312-612x612-1742981464083.jpg	https://storage.googleapis.com/study-project-a5e85.firebasestorage.app/istockphoto-172730312-612x612-1742981464083-thumbnail-1742981466139
13	1234567	0	8	2025-03-26 09:36:10.411085	\N	f	https://storage.googleapis.com/study-project-a5e85.firebasestorage.app/istockphoto-172730312-612x612-1742981768095.jpg	https://storage.googleapis.com/study-project-a5e85.firebasestorage.app/istockphoto-172730312-612x612-1742981768095-thumbnail-1742981771017
18	Edit post 3	0	4	2025-03-27 07:35:33.481183	2025-03-27 14:36:30.379	t	https://storage.googleapis.com/study-project-a5e85.firebasestorage.app/pexels-deeonederer-1808329-1743060990380.jpg	https://storage.googleapis.com/study-project-a5e85.firebasestorage.app/pexels-deeonederer-1808329-1743060990380-thumbnail-1743060994608.jpg
14	Test post	0	4	2025-03-27 06:49:38.853835	\N	f	\N	\N
16	Edit post	0	4	2025-03-27 07:20:52.851226	\N	t	\N	\N
15	Edit post 3	0	4	2025-03-27 07:20:37.695588	2025-03-27 14:27:27.011	t	https://storage.googleapis.com/study-project-a5e85.firebasestorage.app/pexels-deeonederer-1808329-1743060447011.jpg	https://storage.googleapis.com/study-project-a5e85.firebasestorage.app/pexels-deeonederer-1808329-1743060447011-thumbnail-1743060451228
17	Edit post 3	0	4	2025-03-27 07:30:57.452208	2025-03-27 14:36:03.53	t	https://storage.googleapis.com/study-project-a5e85.firebasestorage.app/pexels-deeonederer-1808329-1743060963530.jpg	https://storage.googleapis.com/study-project-a5e85.firebasestorage.app/pexels-deeonederer-1808329-1743060963530-thumbnail-1743060969637.jpg
\.


--
-- Data for Name: refresh_token; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.refresh_token (id, value, "userId") FROM stdin;
\.


--
-- Data for Name: role; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.role (id, name) FROM stdin;
1	admin
2	user
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."user" (id, email, password, "roleId", first_name, last_name, is_verified) FROM stdin;
4	vanthuan2004@gmail.com	$2b$10$VEUGSYwAx3FMxxoYOtSOn.fF/6fisYV4Eqc5UHfn8ExRt1SamtGFC	2	Thuan	Nguyen	t
5	anhkhoa2724@gmail.com	$2b$10$VEUGSYwAx3FMxxoYOtSOn.fF/6fisYV4Eqc5UHfn8ExRt1SamtGFC	1	Khoa	Le	t
6	minhhoang123@gmail.com	$2b$10$VEUGSYwAx3FMxxoYOtSOn.fF/6fisYV4Eqc5UHfn8ExRt1SamtGFC	2	Hoang	Tran	t
7	kimngan456@gmail.com	$2b$10$VEUGSYwAx3FMxxoYOtSOn.fF/6fisYV4Eqc5UHfn8ExRt1SamtGFC	2	Kim Ngan	Pham Thi	t
8	kyduyen6734@gmail.com	$2b$10$VEUGSYwAx3FMxxoYOtSOn.fF/6fisYV4Eqc5UHfn8ExRt1SamtGFC	2	Ky Duyen	Nguyen	t
\.


--
-- Name: code_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.code_id_seq', 3, true);


--
-- Name: follower_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.follower_id_seq', 8, true);


--
-- Name: migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.migrations_id_seq', 9, true);


--
-- Name: post_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.post_id_seq', 18, true);


--
-- Name: role_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.role_id_seq', 2, true);


--
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_id_seq', 8, true);


--
-- Name: code PK_367e70f79a9106b8e802e1a9825; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.code
    ADD CONSTRAINT "PK_367e70f79a9106b8e802e1a9825" PRIMARY KEY (id);


--
-- Name: follower PK_69e733c097e58ee41a00ccb02d5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.follower
    ADD CONSTRAINT "PK_69e733c097e58ee41a00ccb02d5" PRIMARY KEY (id);


--
-- Name: migrations PK_8c82d7f526340ab734260ea46be; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT "PK_8c82d7f526340ab734260ea46be" PRIMARY KEY (id);


--
-- Name: role PK_b36bcfe02fc8de3c57a8b2391c2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY (id);


--
-- Name: refresh_token PK_b575dd3c21fb0831013c909e7fe; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_token
    ADD CONSTRAINT "PK_b575dd3c21fb0831013c909e7fe" PRIMARY KEY (id);


--
-- Name: post PK_be5fda3aac270b134ff9c21cdee; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post
    ADD CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee" PRIMARY KEY (id);


--
-- Name: user PK_cace4a159ff9f2512dd42373760; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY (id);


--
-- Name: code REL_76c04a353b3639752b096e75ec; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.code
    ADD CONSTRAINT "REL_76c04a353b3639752b096e75ec" UNIQUE ("userId");


--
-- Name: code UQ_3e1c48956cef893da35f54bcdea; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.code
    ADD CONSTRAINT "UQ_3e1c48956cef893da35f54bcdea" UNIQUE (value);


--
-- Name: role UQ_ae4578dcaed5adff96595e61660; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT "UQ_ae4578dcaed5adff96595e61660" UNIQUE (name);


--
-- Name: user UQ_e12875dfb3b1d92d7d7c5377e22; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE (email);


--
-- Name: follower FK_07301dde24966bb953f6749780d; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.follower
    ADD CONSTRAINT "FK_07301dde24966bb953f6749780d" FOREIGN KEY (following_id) REFERENCES public."user"(id);


--
-- Name: post FK_5c1cf55c308037b5aca1038a131; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post
    ADD CONSTRAINT "FK_5c1cf55c308037b5aca1038a131" FOREIGN KEY ("userId") REFERENCES public."user"(id);


--
-- Name: code FK_76c04a353b3639752b096e75ec4; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.code
    ADD CONSTRAINT "FK_76c04a353b3639752b096e75ec4" FOREIGN KEY ("userId") REFERENCES public."user"(id);


--
-- Name: refresh_token FK_8e913e288156c133999341156ad; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_token
    ADD CONSTRAINT "FK_8e913e288156c133999341156ad" FOREIGN KEY ("userId") REFERENCES public."user"(id);


--
-- Name: user FK_c28e52f758e7bbc53828db92194; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "FK_c28e52f758e7bbc53828db92194" FOREIGN KEY ("roleId") REFERENCES public.role(id);


--
-- Name: follower FK_d2c4468e1264a8169609be8ac59; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.follower
    ADD CONSTRAINT "FK_d2c4468e1264a8169609be8ac59" FOREIGN KEY (followed_id) REFERENCES public."user"(id);


--
-- PostgreSQL database dump complete
--

