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
    user_id integer,
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
-- Name: comment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comment (
    id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone,
    user_id integer,
    post_id integer,
    parent_comment_id integer
);


ALTER TABLE public.comment OWNER TO postgres;

--
-- Name: comment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.comment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.comment_id_seq OWNER TO postgres;

--
-- Name: comment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.comment_id_seq OWNED BY public.comment.id;


--
-- Name: follower; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.follower (
    id integer NOT NULL,
    followed_at timestamp without time zone DEFAULT now() NOT NULL,
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
-- Name: like; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."like" (
    id integer NOT NULL,
    liked_at timestamp without time zone DEFAULT now() NOT NULL,
    user_id integer,
    post_id integer
);


ALTER TABLE public."like" OWNER TO postgres;

--
-- Name: like_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.like_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.like_id_seq OWNER TO postgres;

--
-- Name: like_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.like_id_seq OWNED BY public."like".id;


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
    user_id integer,
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
    role_id integer,
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
-- Name: comment id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comment ALTER COLUMN id SET DEFAULT nextval('public.comment_id_seq'::regclass);


--
-- Name: follower id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.follower ALTER COLUMN id SET DEFAULT nextval('public.follower_id_seq'::regclass);


--
-- Name: like id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."like" ALTER COLUMN id SET DEFAULT nextval('public.like_id_seq'::regclass);


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

COPY public.code (id, value, user_id, expired_at, is_used) FROM stdin;
3	345698	4	2025-03-26 11:47:03.26	t
\.


--
-- Data for Name: comment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.comment (id, created_at, updated_at, user_id, post_id, parent_comment_id) FROM stdin;
\.


--
-- Data for Name: follower; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.follower (id, followed_at, followed_id, following_id) FROM stdin;
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
-- Data for Name: like; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."like" (id, liked_at, user_id, post_id) FROM stdin;
1	2025-03-28 07:59:03.052637	4	12
3	2025-03-28 07:59:17.351067	4	14
4	2025-03-28 07:59:20.060505	4	16
6	2025-03-28 07:59:31.840293	4	19
11	2025-03-28 08:51:26.200013	4	13
18	2025-03-28 09:23:46.190112	4	20
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
10	1743133732132	Migration1743133732132
11	1743134151242	Migration1743134151242
\.


--
-- Data for Name: post; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.post (id, content, views, user_id, created_at, updated_at, is_private, image_url, thumbnail_url) FROM stdin;
8	JavaScript continues to evolve with powerful frameworks like React, Vue, Angular, Svelte, and Solid.js. Each offers unique benefits for modern web development	5	6	2025-03-26 04:37:37.999093	\N	f	https://storage.googleapis.com/study-project-a5e85.firebasestorage.app/istockphoto-172730312-612x612-1742963855801.jpg	https://storage.googleapis.com/study-project-a5e85.firebasestorage.app/istockphoto-172730312-612x612-1742963855801-thumbnail-1742964027958
9	Everyone’s been hyping this place up, so I had to check it out. Verdict? 10/10, best iced latte I’ve had in ages! ☕🔥	7	7	2025-03-26 04:40:32.078508	\N	f	https://storage.googleapis.com/study-project-a5e85.firebasestorage.app/istockphoto-172730312-612x612-1742964031537.jpg	https://storage.googleapis.com/study-project-a5e85.firebasestorage.app/istockphoto-172730312-612x612-1742964031537-thumbnail-1742964033221
22	The cancelQueries method can be used to cancel outgoing queries based on their query keys or any other functionally accessible property/state of the query.	0	4	2025-03-28 04:40:30.09752	\N	f	\N	\N
11	Nothing hits better than that first sip of coffee when you’re half-asleep. If coffee had a fan club, I’d be president. ☕❤️	10	7	2025-03-26 09:29:31.836936	\N	f	https://storage.googleapis.com/study-project-a5e85.firebasestorage.app/istockphoto-172730312-612x612-1742981369887.jpg	https://storage.googleapis.com/study-project-a5e85.firebasestorage.app/istockphoto-172730312-612x612-1742981369887-thumbnail-1742981372458
10	Bought one tiny plant. Now my room looks like a jungle, and I’m emotionally attached to a fern. 🌿💚	7	6	2025-03-27 09:27:10.077	\N	f	https://storage.googleapis.com/study-project-a5e85.firebasestorage.app/istockphoto-172730312-612x612-1742981228109.jpg	https://storage.googleapis.com/study-project-a5e85.firebasestorage.app/istockphoto-172730312-612x612-1742981228109-thumbnail-1742981230669
13	Perfect weather to stay in, drink some hot chocolate, and pretend my to-do list doesn’t exist. ☔🍫	7	7	2025-03-28 09:36:10.411	\N	f	https://storage.googleapis.com/study-project-a5e85.firebasestorage.app/istockphoto-172730312-612x612-1742981768095.jpg	https://storage.googleapis.com/study-project-a5e85.firebasestorage.app/istockphoto-172730312-612x612-1742981768095-thumbnail-1742981771017
14	Need a good movie to watch tonight! Something fun but not too serious. Any suggestions? 🍿🎬	5	8	2025-03-21 06:49:38.853	\N	f	\N	\N
17	Why do all my best ideas come at 2 AM? Debugging one bug just to find three more… send help. 🤯💻	24	4	2025-03-24 07:30:57.452	2025-03-27 14:36:03.53	t	https://storage.googleapis.com/study-project-a5e85.firebasestorage.app/pexels-deeonederer-1808329-1743060963530.jpg	https://storage.googleapis.com/study-project-a5e85.firebasestorage.app/pexels-deeonederer-1808329-1743060963530-thumbnail-1743060969637.jpg
15	Microservices offer scalability and flexibility, while monolithic architecture simplifies deployment. Choosing the right approach depends on your project's needs	20	4	2025-03-22 07:20:37.695	2025-03-27 14:27:27.011	t	https://storage.googleapis.com/study-project-a5e85.firebasestorage.app/pexels-deeonederer-1808329-1743060447011.jpg	https://storage.googleapis.com/study-project-a5e85.firebasestorage.app/pexels-deeonederer-1808329-1743060447011-thumbnail-1743060451228
19	12345	0	4	2025-03-28 04:10:40.27668	\N	f	https://storage.googleapis.com/study-project-a5e85.firebasestorage.app/istockphoto-172730312-612x612-1743135037865.jpg	\N
20	The invalidateQueries method can be used to invalidate and refetch single or multiple queries in the cache based on their query keys or any other functionally accessible property/state of the query. By default, all matching queries are immediately marked as invalid and active queries are refetched in the background.	0	4	2025-03-28 04:37:23.060112	\N	f	\N	\N
21	The refetchQueries method can be used to refetch queries based on certain conditions.	0	4	2025-03-28 04:39:12.139573	\N	f	https://storage.googleapis.com/study-project-a5e85.firebasestorage.app/istockphoto-172730312-612x612-1743136751282.jpg	\N
18		7	8	2025-03-28 10:10:33.481	2025-03-27 14:36:30.379	f	https://storage.googleapis.com/study-project-a5e85.firebasestorage.app/pexels-deeonederer-1808329-1743060990380.jpg	https://storage.googleapis.com/study-project-a5e85.firebasestorage.app/pexels-deeonederer-1808329-1743060990380-thumbnail-1743060994608.jpg
16	I swear, I can binge-watch TikToks for hours, but sitting through a full movie? Impossible. Anyone else? 😂📱	11	7	2025-03-24 07:20:52.851	\N	t	\N	\N
12	Either I’ve watched too many horror movies, or they’re just not scary anymore. Got any truly terrifying recommendations? 👀👻	20	8	2025-03-27 09:31:05.003	\N	f	https://storage.googleapis.com/study-project-a5e85.firebasestorage.app/istockphoto-172730312-612x612-1742981464083.jpg	https://storage.googleapis.com/study-project-a5e85.firebasestorage.app/istockphoto-172730312-612x612-1742981464083-thumbnail-1742981466139
7	Artificial intelligence is transforming how we live, work, and interact. From smart assistants to self-driving cars, AI is making our lives easier and more efficient.	2	4	2025-03-26 04:33:17.637236	\N	f	https://storage.googleapis.com/study-project-a5e85.firebasestorage.app/istockphoto-172730312-612x612-1742963596728.jpg	https://storage.googleapis.com/study-project-a5e85.firebasestorage.app/istockphoto-172730312-612x612-1742963596728-thumbnail-1742964026011
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

COPY public."user" (id, email, password, role_id, first_name, last_name, is_verified) FROM stdin;
5	anhkhoa2724@gmail.com	$2b$10$VEUGSYwAx3FMxxoYOtSOn.fF/6fisYV4Eqc5UHfn8ExRt1SamtGFC	1	Khoa	Le	t
6	minhhoang123@gmail.com	$2b$10$VEUGSYwAx3FMxxoYOtSOn.fF/6fisYV4Eqc5UHfn8ExRt1SamtGFC	2	Hoang	Tran	t
7	kimngan456@gmail.com	$2b$10$VEUGSYwAx3FMxxoYOtSOn.fF/6fisYV4Eqc5UHfn8ExRt1SamtGFC	2	Kim Ngan	Pham Thi	t
8	kyduyen6734@gmail.com	$2b$10$VEUGSYwAx3FMxxoYOtSOn.fF/6fisYV4Eqc5UHfn8ExRt1SamtGFC	2	Ky Duyen	Nguyen	t
4	vanthuan2004@gmail.com	$2b$10$VEUGSYwAx3FMxxoYOtSOn.fF/6fisYV4Eqc5UHfn8ExRt1SamtGFC	2	Thuan	Van	t
\.


--
-- Name: code_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.code_id_seq', 3, true);


--
-- Name: comment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.comment_id_seq', 1, false);


--
-- Name: follower_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.follower_id_seq', 8, true);


--
-- Name: like_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.like_id_seq', 18, true);


--
-- Name: migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.migrations_id_seq', 11, true);


--
-- Name: post_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.post_id_seq', 22, true);


--
-- Name: role_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.role_id_seq', 2, true);


--
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_id_seq', 8, true);


--
-- Name: comment PK_0b0e4bbc8415ec426f87f3a88e2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comment
    ADD CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY (id);


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
-- Name: like PK_eff3e46d24d416b52a7e0ae4159; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."like"
    ADD CONSTRAINT "PK_eff3e46d24d416b52a7e0ae4159" PRIMARY KEY (id);


--
-- Name: code REL_76c04a353b3639752b096e75ec; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.code
    ADD CONSTRAINT "REL_76c04a353b3639752b096e75ec" UNIQUE (user_id);


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
-- Name: code FK_2c4a681bc6a5fa9f5d4149f86bf; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.code
    ADD CONSTRAINT "FK_2c4a681bc6a5fa9f5d4149f86bf" FOREIGN KEY (user_id) REFERENCES public."user"(id);


--
-- Name: like FK_4356ac2f9519c7404a2869f1691; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."like"
    ADD CONSTRAINT "FK_4356ac2f9519c7404a2869f1691" FOREIGN KEY (user_id) REFERENCES public."user"(id);


--
-- Name: post FK_52378a74ae3724bcab44036645b; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post
    ADD CONSTRAINT "FK_52378a74ae3724bcab44036645b" FOREIGN KEY (user_id) REFERENCES public."user"(id);


--
-- Name: comment FK_8aa21186314ce53c5b61a0e8c93; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comment
    ADD CONSTRAINT "FK_8aa21186314ce53c5b61a0e8c93" FOREIGN KEY (post_id) REFERENCES public.post(id);


--
-- Name: comment FK_ac69bddf8202b7c0752d9dc8f32; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comment
    ADD CONSTRAINT "FK_ac69bddf8202b7c0752d9dc8f32" FOREIGN KEY (parent_comment_id) REFERENCES public.comment(id);


--
-- Name: comment FK_bbfe153fa60aa06483ed35ff4a7; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comment
    ADD CONSTRAINT "FK_bbfe153fa60aa06483ed35ff4a7" FOREIGN KEY (user_id) REFERENCES public."user"(id);


--
-- Name: follower FK_d2c4468e1264a8169609be8ac59; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.follower
    ADD CONSTRAINT "FK_d2c4468e1264a8169609be8ac59" FOREIGN KEY (followed_id) REFERENCES public."user"(id);


--
-- Name: like FK_d41caa70371e578e2a4791a88ae; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."like"
    ADD CONSTRAINT "FK_d41caa70371e578e2a4791a88ae" FOREIGN KEY (post_id) REFERENCES public.post(id);


--
-- Name: user FK_fb2e442d14add3cefbdf33c4561; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "FK_fb2e442d14add3cefbdf33c4561" FOREIGN KEY (role_id) REFERENCES public.role(id);


--
-- PostgreSQL database dump complete
--

