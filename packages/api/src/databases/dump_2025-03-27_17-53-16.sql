PGDMP      5    
            }            study-project    17.4 (Debian 17.4-1.pgdg120+2)    17.4 (Debian 17.4-1.pgdg120+2) ;    o           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            p           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            q           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            r           1262    24577    study-project    DATABASE     z   CREATE DATABASE "study-project" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';
    DROP DATABASE "study-project";
                     postgres    false            �            1259    32769    code    TABLE     �   CREATE TABLE public.code (
    id integer NOT NULL,
    value character varying NOT NULL,
    "userId" integer,
    expired_at timestamp without time zone NOT NULL,
    is_used boolean DEFAULT false NOT NULL
);
    DROP TABLE public.code;
       public         heap r       postgres    false            �            1259    32768    code_id_seq    SEQUENCE     �   CREATE SEQUENCE public.code_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 "   DROP SEQUENCE public.code_id_seq;
       public               postgres    false    222            s           0    0    code_id_seq    SEQUENCE OWNED BY     ;   ALTER SEQUENCE public.code_id_seq OWNED BY public.code.id;
          public               postgres    false    221            �            1259    57345    follower    TABLE     �   CREATE TABLE public.follower (
    id integer NOT NULL,
    "followedAt" timestamp without time zone DEFAULT now() NOT NULL,
    followed_id integer,
    following_id integer
);
    DROP TABLE public.follower;
       public         heap r       postgres    false            �            1259    57344    follower_id_seq    SEQUENCE     �   CREATE SEQUENCE public.follower_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.follower_id_seq;
       public               postgres    false    229            t           0    0    follower_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.follower_id_seq OWNED BY public.follower.id;
          public               postgres    false    228            �            1259    40961 
   migrations    TABLE     �   CREATE TABLE public.migrations (
    id integer NOT NULL,
    "timestamp" bigint NOT NULL,
    name character varying NOT NULL
);
    DROP TABLE public.migrations;
       public         heap r       postgres    false            �            1259    40960    migrations_id_seq    SEQUENCE     �   CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.migrations_id_seq;
       public               postgres    false    224            u           0    0    migrations_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;
          public               postgres    false    223            �            1259    49155    post    TABLE     q  CREATE TABLE public.post (
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
    DROP TABLE public.post;
       public         heap r       postgres    false            �            1259    49154    post_id_seq    SEQUENCE     �   CREATE SEQUENCE public.post_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 "   DROP SEQUENCE public.post_id_seq;
       public               postgres    false    226            v           0    0    post_id_seq    SEQUENCE OWNED BY     ;   ALTER SEQUENCE public.post_id_seq OWNED BY public.post.id;
          public               postgres    false    225            �            1259    49166    refresh_token    TABLE     �   CREATE TABLE public.refresh_token (
    id character varying NOT NULL,
    value character varying NOT NULL,
    "userId" integer
);
 !   DROP TABLE public.refresh_token;
       public         heap r       postgres    false            �            1259    24579    role    TABLE     [   CREATE TABLE public.role (
    id integer NOT NULL,
    name character varying NOT NULL
);
    DROP TABLE public.role;
       public         heap r       postgres    false            �            1259    24578    role_id_seq    SEQUENCE     �   CREATE SEQUENCE public.role_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 "   DROP SEQUENCE public.role_id_seq;
       public               postgres    false    218            w           0    0    role_id_seq    SEQUENCE OWNED BY     ;   ALTER SEQUENCE public.role_id_seq OWNED BY public.role.id;
          public               postgres    false    217            �            1259    24590    user    TABLE       CREATE TABLE public."user" (
    id integer NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL,
    "roleId" integer,
    first_name character varying NOT NULL,
    last_name character varying,
    is_verified boolean DEFAULT false NOT NULL
);
    DROP TABLE public."user";
       public         heap r       postgres    false            �            1259    24589    user_id_seq    SEQUENCE     �   CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 "   DROP SEQUENCE public.user_id_seq;
       public               postgres    false    220            x           0    0    user_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;
          public               postgres    false    219            �           2604    32772    code id    DEFAULT     b   ALTER TABLE ONLY public.code ALTER COLUMN id SET DEFAULT nextval('public.code_id_seq'::regclass);
 6   ALTER TABLE public.code ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    221    222    222            �           2604    57348    follower id    DEFAULT     j   ALTER TABLE ONLY public.follower ALTER COLUMN id SET DEFAULT nextval('public.follower_id_seq'::regclass);
 :   ALTER TABLE public.follower ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    228    229    229            �           2604    40964    migrations id    DEFAULT     n   ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);
 <   ALTER TABLE public.migrations ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    223    224    224            �           2604    49158    post id    DEFAULT     b   ALTER TABLE ONLY public.post ALTER COLUMN id SET DEFAULT nextval('public.post_id_seq'::regclass);
 6   ALTER TABLE public.post ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    226    225    226            �           2604    24582    role id    DEFAULT     b   ALTER TABLE ONLY public.role ALTER COLUMN id SET DEFAULT nextval('public.role_id_seq'::regclass);
 6   ALTER TABLE public.role ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    217    218    218            �           2604    24593    user id    DEFAULT     d   ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);
 8   ALTER TABLE public."user" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    219    220    220            e          0    32769    code 
   TABLE DATA           H   COPY public.code (id, value, "userId", expired_at, is_used) FROM stdin;
    public               postgres    false    222            l          0    57345    follower 
   TABLE DATA           O   COPY public.follower (id, "followedAt", followed_id, following_id) FROM stdin;
    public               postgres    false    229            g          0    40961 
   migrations 
   TABLE DATA           ;   COPY public.migrations (id, "timestamp", name) FROM stdin;
    public               postgres    false    224            i          0    49155    post 
   TABLE DATA           z   COPY public.post (id, content, views, "userId", created_at, updated_at, is_private, image_url, thumbnail_url) FROM stdin;
    public               postgres    false    226            j          0    49166    refresh_token 
   TABLE DATA           <   COPY public.refresh_token (id, value, "userId") FROM stdin;
    public               postgres    false    227            a          0    24579    role 
   TABLE DATA           (   COPY public.role (id, name) FROM stdin;
    public               postgres    false    218            c          0    24590    user 
   TABLE DATA           c   COPY public."user" (id, email, password, "roleId", first_name, last_name, is_verified) FROM stdin;
    public               postgres    false    220            y           0    0    code_id_seq    SEQUENCE SET     9   SELECT pg_catalog.setval('public.code_id_seq', 3, true);
          public               postgres    false    221            z           0    0    follower_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.follower_id_seq', 8, true);
          public               postgres    false    228            {           0    0    migrations_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.migrations_id_seq', 9, true);
          public               postgres    false    223            |           0    0    post_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.post_id_seq', 18, true);
          public               postgres    false    225            }           0    0    role_id_seq    SEQUENCE SET     9   SELECT pg_catalog.setval('public.role_id_seq', 2, true);
          public               postgres    false    217            ~           0    0    user_id_seq    SEQUENCE SET     9   SELECT pg_catalog.setval('public.user_id_seq', 8, true);
          public               postgres    false    219            �           2606    32778 #   code PK_367e70f79a9106b8e802e1a9825 
   CONSTRAINT     c   ALTER TABLE ONLY public.code
    ADD CONSTRAINT "PK_367e70f79a9106b8e802e1a9825" PRIMARY KEY (id);
 O   ALTER TABLE ONLY public.code DROP CONSTRAINT "PK_367e70f79a9106b8e802e1a9825";
       public                 postgres    false    222            �           2606    57351 '   follower PK_69e733c097e58ee41a00ccb02d5 
   CONSTRAINT     g   ALTER TABLE ONLY public.follower
    ADD CONSTRAINT "PK_69e733c097e58ee41a00ccb02d5" PRIMARY KEY (id);
 S   ALTER TABLE ONLY public.follower DROP CONSTRAINT "PK_69e733c097e58ee41a00ccb02d5";
       public                 postgres    false    229            �           2606    40968 )   migrations PK_8c82d7f526340ab734260ea46be 
   CONSTRAINT     i   ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT "PK_8c82d7f526340ab734260ea46be" PRIMARY KEY (id);
 U   ALTER TABLE ONLY public.migrations DROP CONSTRAINT "PK_8c82d7f526340ab734260ea46be";
       public                 postgres    false    224            �           2606    24586 #   role PK_b36bcfe02fc8de3c57a8b2391c2 
   CONSTRAINT     c   ALTER TABLE ONLY public.role
    ADD CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY (id);
 O   ALTER TABLE ONLY public.role DROP CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2";
       public                 postgres    false    218            �           2606    49172 ,   refresh_token PK_b575dd3c21fb0831013c909e7fe 
   CONSTRAINT     l   ALTER TABLE ONLY public.refresh_token
    ADD CONSTRAINT "PK_b575dd3c21fb0831013c909e7fe" PRIMARY KEY (id);
 X   ALTER TABLE ONLY public.refresh_token DROP CONSTRAINT "PK_b575dd3c21fb0831013c909e7fe";
       public                 postgres    false    227            �           2606    49165 #   post PK_be5fda3aac270b134ff9c21cdee 
   CONSTRAINT     c   ALTER TABLE ONLY public.post
    ADD CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee" PRIMARY KEY (id);
 O   ALTER TABLE ONLY public.post DROP CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee";
       public                 postgres    false    226            �           2606    24597 #   user PK_cace4a159ff9f2512dd42373760 
   CONSTRAINT     e   ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY (id);
 Q   ALTER TABLE ONLY public."user" DROP CONSTRAINT "PK_cace4a159ff9f2512dd42373760";
       public                 postgres    false    220            �           2606    32782 #   code REL_76c04a353b3639752b096e75ec 
   CONSTRAINT     d   ALTER TABLE ONLY public.code
    ADD CONSTRAINT "REL_76c04a353b3639752b096e75ec" UNIQUE ("userId");
 O   ALTER TABLE ONLY public.code DROP CONSTRAINT "REL_76c04a353b3639752b096e75ec";
       public                 postgres    false    222            �           2606    32780 #   code UQ_3e1c48956cef893da35f54bcdea 
   CONSTRAINT     a   ALTER TABLE ONLY public.code
    ADD CONSTRAINT "UQ_3e1c48956cef893da35f54bcdea" UNIQUE (value);
 O   ALTER TABLE ONLY public.code DROP CONSTRAINT "UQ_3e1c48956cef893da35f54bcdea";
       public                 postgres    false    222            �           2606    24588 #   role UQ_ae4578dcaed5adff96595e61660 
   CONSTRAINT     `   ALTER TABLE ONLY public.role
    ADD CONSTRAINT "UQ_ae4578dcaed5adff96595e61660" UNIQUE (name);
 O   ALTER TABLE ONLY public.role DROP CONSTRAINT "UQ_ae4578dcaed5adff96595e61660";
       public                 postgres    false    218            �           2606    24599 #   user UQ_e12875dfb3b1d92d7d7c5377e22 
   CONSTRAINT     c   ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE (email);
 Q   ALTER TABLE ONLY public."user" DROP CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22";
       public                 postgres    false    220            �           2606    65563 '   follower FK_07301dde24966bb953f6749780d    FK CONSTRAINT     �   ALTER TABLE ONLY public.follower
    ADD CONSTRAINT "FK_07301dde24966bb953f6749780d" FOREIGN KEY (following_id) REFERENCES public."user"(id);
 S   ALTER TABLE ONLY public.follower DROP CONSTRAINT "FK_07301dde24966bb953f6749780d";
       public               postgres    false    220    229    3256            �           2606    49174 #   post FK_5c1cf55c308037b5aca1038a131    FK CONSTRAINT     �   ALTER TABLE ONLY public.post
    ADD CONSTRAINT "FK_5c1cf55c308037b5aca1038a131" FOREIGN KEY ("userId") REFERENCES public."user"(id);
 O   ALTER TABLE ONLY public.post DROP CONSTRAINT "FK_5c1cf55c308037b5aca1038a131";
       public               postgres    false    3256    220    226            �           2606    32784 #   code FK_76c04a353b3639752b096e75ec4    FK CONSTRAINT     �   ALTER TABLE ONLY public.code
    ADD CONSTRAINT "FK_76c04a353b3639752b096e75ec4" FOREIGN KEY ("userId") REFERENCES public."user"(id);
 O   ALTER TABLE ONLY public.code DROP CONSTRAINT "FK_76c04a353b3639752b096e75ec4";
       public               postgres    false    220    3256    222            �           2606    49179 ,   refresh_token FK_8e913e288156c133999341156ad    FK CONSTRAINT     �   ALTER TABLE ONLY public.refresh_token
    ADD CONSTRAINT "FK_8e913e288156c133999341156ad" FOREIGN KEY ("userId") REFERENCES public."user"(id);
 X   ALTER TABLE ONLY public.refresh_token DROP CONSTRAINT "FK_8e913e288156c133999341156ad";
       public               postgres    false    3256    220    227            �           2606    24600 #   user FK_c28e52f758e7bbc53828db92194    FK CONSTRAINT     �   ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "FK_c28e52f758e7bbc53828db92194" FOREIGN KEY ("roleId") REFERENCES public.role(id);
 Q   ALTER TABLE ONLY public."user" DROP CONSTRAINT "FK_c28e52f758e7bbc53828db92194";
       public               postgres    false    220    218    3252            �           2606    65558 '   follower FK_d2c4468e1264a8169609be8ac59    FK CONSTRAINT     �   ALTER TABLE ONLY public.follower
    ADD CONSTRAINT "FK_d2c4468e1264a8169609be8ac59" FOREIGN KEY (followed_id) REFERENCES public."user"(id);
 S   ALTER TABLE ONLY public.follower DROP CONSTRAINT "FK_d2c4468e1264a8169609be8ac59";
       public               postgres    false    229    3256    220            e   1   x�3�4615���4�4202�50�52S04�21�20�32�,����� ��=      l   {   x�U���0D�3TA����L-鿎`]�����5�b\��@˴�H��dU�U���9�V?j+��HZ�qbQ1�FRR�8����pp���˰qu7xt�U�OC?�����>���������_:�*"      g   {   x�e�;
1F�z��Hn�{��f*�FA�?BB���kN=ȥ�S���~=?��z�������ҘYUeIY������Y*mlfXg!\��lldxg��5�762b�`��tfdci�%<se3�q���K+      i   &  x�Ŗ�n�@���y&�xf��מ��M�Iڴ�@��ۯmB��=TS	�0�~���m.~�~�um?P��Pe�\MT#�@l)����C���y?��f�̺m׻�t��,�W��~Uݾ}Nˡj|o������鼤��Vo�/ݦ�
�2���=5�l�c`+�[�l5l�_ߚ��w` �rE,L��&����0;�Q�1�^�xE�'��d�x��ĜƼ&,3���bD�b�P�%��X,֖kƑ}n`��
B��,;�q�b�x���bMh�B�_�UV$��β����;ݓh/��a� ��ײs���eo����a�/`�%"�7lI�g6��cF@.Q���X�gt=\��Oz�/�D��G�<	q,����.}�]_�Rj��*�ӾBф�x�n�"�=����j^3�.�q�)��mDS��v�>1�I�d=�,J�߁o��V�ia=�����5]��2Dm�2ɚ6&�Fg��Ys�U1o�F�۬�N�����>筅)Cu>����:�Rn�5�?�c�,�,����׫      j      x������ � �      a      x�3�LL����2�,-N-����� : �      c   �   x����n�@��)(�	w��L�H�
`	)���DnQ�so�#���r�};�"iqE�<
�{�8��0�9%MV�O�����Ԗ�*��Ӈ��?�)H�.as�i��o�U�t�>�zEB1\��@[! �QL�c���An���AJ�0'����8�D��q]�(HAm�ȥ���@e�B���c�]�V�{�_��ݵ,�oA��     