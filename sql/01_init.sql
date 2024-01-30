--
-- PostgreSQL database dump
--

-- Dumped from database version 16.0 (Debian 16.0-1.pgdg120+1)
-- Dumped by pg_dump version 16.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
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
-- Name: AccountKey; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public."AccountKey" (
    id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    encrypted_key character varying(255) NOT NULL,
    "PartnerAccountId" integer NOT NULL,
    secret_key character varying(255)
);


ALTER TABLE public."AccountKey" OWNER TO "user";

--
-- Name: AccountKey_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public."AccountKey_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."AccountKey_id_seq" OWNER TO "user";

--
-- Name: AccountKey_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
--

ALTER SEQUENCE public."AccountKey_id_seq" OWNED BY public."AccountKey".id;


--
-- Name: TravelInfo; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public."TravelInfo" (
    id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    client_email character varying(255) NOT NULL,
    language character varying(255),
    "countryOfOrigin" character varying(255),
    "countryOfDestination" character varying(255),
    "travelStartDate" date NOT NULL,
    "travelEndDate" date NOT NULL,
    "partnerAccountId" integer NOT NULL,
    hash character varying(255)
);


ALTER TABLE public."TravelInfo" OWNER TO "user";

--
-- Name: TravelInfo_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public."TravelInfo_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."TravelInfo_id_seq" OWNER TO "user";

--
-- Name: TravelInfo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
--

ALTER SEQUENCE public."TravelInfo_id_seq" OWNED BY public."TravelInfo".id;


--
-- Name: partnerAccount; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public."partnerAccount" (
    id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    name character varying(255) NOT NULL
);


ALTER TABLE public."partnerAccount" OWNER TO "user";

--
-- Name: partnerAccount_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public."partnerAccount_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."partnerAccount_id_seq" OWNER TO "user";

--
-- Name: partnerAccount_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
--

ALTER SEQUENCE public."partnerAccount_id_seq" OWNED BY public."partnerAccount".id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.users (
    id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    "partnerAccountId" integer
);


ALTER TABLE public.users OWNER TO "user";

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO "user";

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: AccountKey id; Type: DEFAULT; Schema: public; Owner: user
--

ALTER TABLE ONLY public."AccountKey" ALTER COLUMN id SET DEFAULT nextval('public."AccountKey_id_seq"'::regclass);


--
-- Name: TravelInfo id; Type: DEFAULT; Schema: public; Owner: user
--

ALTER TABLE ONLY public."TravelInfo" ALTER COLUMN id SET DEFAULT nextval('public."TravelInfo_id_seq"'::regclass);


--
-- Name: partnerAccount id; Type: DEFAULT; Schema: public; Owner: user
--

ALTER TABLE ONLY public."partnerAccount" ALTER COLUMN id SET DEFAULT nextval('public."partnerAccount_id_seq"'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: AccountKey AccountKey_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public."AccountKey"
    ADD CONSTRAINT "AccountKey_pkey" PRIMARY KEY (id);


--
-- Name: TravelInfo TravelInfo_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public."TravelInfo"
    ADD CONSTRAINT "TravelInfo_pkey" PRIMARY KEY (id);


--
-- Name: partnerAccount partnerAccount_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public."partnerAccount"
    ADD CONSTRAINT "partnerAccount_pkey" PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: "hash_unique"; Type: INDEX; Schema: public; Owner: user
--

CREATE UNIQUE INDEX """hash_unique""" ON public."TravelInfo" USING btree (hash);


--
-- Name: AccountKey AccountKey_relation_1; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public."AccountKey"
    ADD CONSTRAINT "AccountKey_relation_1" FOREIGN KEY ("PartnerAccountId") REFERENCES public."partnerAccount"(id);


--
-- Name: TravelInfo TravelInfo_relation_1; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public."TravelInfo"
    ADD CONSTRAINT "TravelInfo_relation_1" FOREIGN KEY ("partnerAccountId") REFERENCES public."partnerAccount"(id);


--
-- Name: users users_relation_1; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_relation_1 FOREIGN KEY ("partnerAccountId") REFERENCES public."partnerAccount"(id);


--
-- PostgreSQL database dump complete
--

