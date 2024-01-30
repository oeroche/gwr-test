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

--
-- Data for Name: partnerAccount; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public."partnerAccount" (id, created_at, name) FROM stdin;
1	2024-01-13 09:00:18.530157	Partner1
\.


--
-- Data for Name: AccountKey; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public."AccountKey" (id, created_at, encrypted_key, "PartnerAccountId", secret_key) FROM stdin;
130	2024-01-30 12:04:27.801474	$2b$10$T2.qHd2j0jHFizivRY0gAOIEySyK3D3s25UpVomnycPxlKiI3Q./i	1	MjAwMjI4
\.


--
-- Data for Name: TravelInfo; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public."TravelInfo" (id, created_at, client_email, language, "countryOfOrigin", "countryOfDestination", "travelStartDate", "travelEndDate", "partnerAccountId", hash) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.users (id, created_at, email, password, "partnerAccountId") FROM stdin;
1	2024-01-12 21:29:02.657295	user1@email.com	password	1
\.


--
-- Name: AccountKey_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public."AccountKey_id_seq"', 130, true);


--
-- Name: TravelInfo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public."TravelInfo_id_seq"', 5, true);


--
-- Name: partnerAccount_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public."partnerAccount_id_seq"', 1, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public.users_id_seq', 1, true);


--
-- PostgreSQL database dump complete
--

