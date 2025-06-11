--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9
-- Dumped by pg_dump version 16.5

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
-- Name: drizzle; Type: SCHEMA; Schema: -; Owner: neondb_owner
--

CREATE SCHEMA drizzle;


ALTER SCHEMA drizzle OWNER TO neondb_owner;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: __drizzle_migrations; Type: TABLE; Schema: drizzle; Owner: neondb_owner
--

CREATE TABLE drizzle.__drizzle_migrations (
    id integer NOT NULL,
    hash text NOT NULL,
    created_at bigint
);


ALTER TABLE drizzle.__drizzle_migrations OWNER TO neondb_owner;

--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE; Schema: drizzle; Owner: neondb_owner
--

CREATE SEQUENCE drizzle.__drizzle_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE drizzle.__drizzle_migrations_id_seq OWNER TO neondb_owner;

--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: drizzle; Owner: neondb_owner
--

ALTER SEQUENCE drizzle.__drizzle_migrations_id_seq OWNED BY drizzle.__drizzle_migrations.id;


--
-- Name: applications; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.applications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    display_name text,
    business_capabilities text,
    it_component_display_name text,
    active_from text,
    active_until text,
    cost_total_annual text,
    description text,
    obsolescence_risk_comment text,
    obsolescence_risk_status text,
    service_level text,
    technical_suitability text,
    gd_it_teams text,
    owned_by text,
    owning_function text,
    business_domain text,
    maturity_status text,
    main_area text,
    pace text,
    business_unit text,
    vendor text,
    lx_ps_wip text,
    region text,
    other_tags text,
    organizations text,
    cmdb_application_service_url text,
    cmdb_business_application_url text,
    functional_fit text,
    technical_fit text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.applications OWNER TO neondb_owner;

--
-- Name: business_capabilities; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.business_capabilities (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    display_name text,
    hierarchy text,
    parent_id uuid,
    level integer DEFAULT 1,
    mapped_level1_capability text,
    mapped_to_lifesciences_capabilities text,
    created_at timestamp without time zone DEFAULT now(),
    level1_capability text,
    level2_capability text,
    level3_capability text
);


ALTER TABLE public.business_capabilities OWNER TO neondb_owner;

--
-- Name: data_objects; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.data_objects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    display_name text,
    rel_data_object_to_interface text,
    rel_data_object_to_project text,
    tags_gd_it_teams text,
    tags_owned_by text,
    tags_owning_function text,
    tags_business_domain text,
    tags_main_area text,
    tags_business_unit text,
    tags_lx_ps_wip text,
    tags_region text,
    tags_other_tags text,
    rel_data_object_to_application text,
    rel_to_child text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.data_objects OWNER TO neondb_owner;

--
-- Name: initiatives; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.initiatives (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    description text,
    status text,
    start_date text,
    end_date text,
    business_capabilities text,
    applications text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.initiatives OWNER TO neondb_owner;

--
-- Name: interfaces; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.interfaces (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    source_application text,
    target_application text,
    data_flow text,
    frequency text,
    data_objects text,
    status text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.interfaces OWNER TO neondb_owner;

--
-- Name: it_components; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.it_components (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    display_name text,
    category text,
    vendor text,
    version text,
    status text,
    applications text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.it_components OWNER TO neondb_owner;

--
-- Name: users; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username text NOT NULL,
    password text NOT NULL
);


ALTER TABLE public.users OWNER TO neondb_owner;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO neondb_owner;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: __drizzle_migrations id; Type: DEFAULT; Schema: drizzle; Owner: neondb_owner
--

ALTER TABLE ONLY drizzle.__drizzle_migrations ALTER COLUMN id SET DEFAULT nextval('drizzle.__drizzle_migrations_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: __drizzle_migrations; Type: TABLE DATA; Schema: drizzle; Owner: neondb_owner
--

COPY drizzle.__drizzle_migrations (id, hash, created_at) FROM stdin;
\.


--
-- Data for Name: applications; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.applications (id, name, display_name, business_capabilities, it_component_display_name, active_from, active_until, cost_total_annual, description, obsolescence_risk_comment, obsolescence_risk_status, service_level, technical_suitability, gd_it_teams, owned_by, owning_function, business_domain, maturity_status, main_area, pace, business_unit, vendor, lx_ps_wip, region, other_tags, organizations, cmdb_application_service_url, cmdb_business_application_url, functional_fit, technical_fit, created_at) FROM stdin;
734ac33e-f1f4-48c3-98f5-935feedc3b80	CRF Annotation Interactive Automation	CRF Annotation Interactive Automation	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:35.73815
9adf1b80-1069-4bc6-9928-3dd6736e613c	CRF Annotation Interactive Automation	CRF Annotation Interactive Automation	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:35.755314
6ed6b5df-6052-43b2-b08c-cb4ca3328a18	CRF Annotation Interactive Automation	CRF Annotation Interactive Automation	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:35.774395
16bc5515-7f85-40f0-a002-4979ec2b36e6	CRF Annotation Interactive Automation	CRF Annotation Interactive Automation	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:35.791158
d95e4493-cd14-4a8c-a9ed-2b1cd30574e6	CT.gov Portal	CT.gov Portal	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:35.807175
afa6073a-5710-4021-a5bb-f82f7545bf39	CTIS (Clinical Trials Information System)	CTIS (Clinical Trials Information System)	\N	\N	\N	\N	\N	\N	\N	\N	\N	adequate	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:35.823621
ee0c584f-f729-4368-9c1f-04593706e6b2	CTMS Request Management	CTMS Request Management	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:35.839435
567e42bc-356a-40ba-931e-2afc956aab26	Custom Dashboards	Custom Dashboards	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:35.856591
46214f37-8bec-410c-aa60-8acfb2bdfd83	CVENT	CVENT	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	green	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:35.873535
f33c3cec-8bb3-4537-8214-395b81789cd0	CWI FAERS EVDAS Service	CWI FAERS EVDAS Service	\N	\N	\N	\N	\N	\N	\N	\N	\N	adequate	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:35.890171
fd4189c4-0b14-4b36-9691-21ead75064c4	DADS Intake	DADS Intake	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:35.906829
a6bbda56-ff66-4389-b1dc-f04e9fe26a51	DADS Intake	DADS Intake	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:35.923578
a4606fcc-d0de-41e7-9ef0-09948255ba99	Dash	Dash	\N	\N	\N	\N	\N	\N	\N	\N	\N	adequate	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:35.940778
407249ed-be33-4c23-9d00-014f70843c85	Data Historian Aveva PI @ REN	Data Historian Aveva PI @ REN	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:35.958436
58899f60-fa6a-4167-95b4-f51bc6a6caa2	Data Historian Aveva Pi @ RHN	Data Historian Aveva Pi @ RHN	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:35.975232
abd84c78-be5b-4449-9fc5-5d026baade08	Data Historian Aveva PI @ SAR	Data Historian Aveva PI @ SAR	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:35.991273
1feb565d-ecd9-465b-998c-289dd8c53475	Data Historian OSI Pi - RHN	Data Historian OSI Pi - RHN	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:36.007998
3ea39870-5e6f-4c36-81a3-6b4d62ba3ef2	Data Query System (DQS)	Data Query System (DQS)	\N	\N	\N	\N	\N	\N	\N	\N	\N	adequate	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:36.024542
b6dd9f14-44f8-488f-8be2-aa947c7c9fbf	Data Sheet Storage	Data Sheet Storage	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:36.041627
900fc118-67d2-4a37-be26-95056e31b36d	Databricks	Databricks	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:36.059393
58f51023-38d1-470a-9326-0df08e3f7760	Dataiku	Dataiku	\N	\N	\N	\N	\N	\N	\N	\N	\N	adequate	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:36.076087
d2f465be-bbbc-4f3b-84a3-c3ff487cbfce	Datavision - iEnvision	Datavision - iEnvision	\N	\N	\N	\N	\N	\N	\N	\N	\N	adequate	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:36.092949
94fe983b-ed99-4db5-9baf-1f4f42914807	Datavision - iEnvision	Datavision - iEnvision	\N	\N	\N	\N	\N	\N	\N	\N	\N	adequate	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:36.109794
f994d478-cd91-40c3-ba40-30ef544cd6f8	Datavision - iEnvision	Datavision - iEnvision	\N	\N	\N	\N	\N	\N	\N	\N	\N	adequate	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:36.126322
f790e784-0422-4762-8f3c-06f6c35d0708	Datavision - iEnvision	Datavision - iEnvision	\N	\N	\N	\N	\N	\N	\N	\N	\N	adequate	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:36.142988
30fd0f89-6f4a-4cb3-840a-20920c19b868	Datavision - iEnvision	Datavision - iEnvision	\N	\N	\N	\N	\N	\N	\N	\N	\N	adequate	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:36.161025
c22674ad-9af4-472c-aa45-1775452770d6	Decare Dental	Decare Dental	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	green	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:36.178258
d9211e25-78e1-47dd-b2a9-1ee49a7b1554	DeCare Eye Care	DeCare Eye Care	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	green	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:36.195266
46773cbc-e4ba-4a29-8881-1f9040273d90	DeepL Translation Service	DeepL Translation Service	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:36.216208
6109caa7-08d3-427a-af15-8f90d8498763	DeliveryPoD File Track	DeliveryPoD File Track	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:36.233144
f28c35c4-c67d-438e-a205-6f223168aadc	Delta Dental	Delta Dental	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	green	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:36.249743
0aaf8b9f-f5c7-4efb-b826-b0c4778e3c64	Digital Business Hub	Digital Business Hub	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:36.266694
e63132d8-0290-4d51-b28b-aafe8bcf9fab	Digital Immunity	Digital Immunity	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:36.28307
edd5429c-842f-45aa-b918-879198d25fdd	DirectEmployers	DirectEmployers	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	green	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:36.298156
7cb72707-ec0f-4109-beb3-e2ea4afcc655	Director's Desk	Director's Desk	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	green	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:36.31309
d0db9264-679b-4737-a055-028ef771a732	Directory Monitor	Directory Monitor	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:36.335782
d13aa4ef-d94f-4dd1-a3cb-c41a8a5c8942	Discover Study	Discover Study	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:36.360169
3c8cbc57-d202-47ca-a7f6-eeaacd6ce69b	Discoverant Raheen	Discoverant Raheen	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:36.376446
2dc98e73-73b3-48fc-9483-a8240ef61d3c	Discoverant Raheen (Non-GxP)	Discoverant Raheen (Non-GxP)	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:36.392825
ba06fba0-5e69-4ef8-89d8-15a250cc1668	Discoverant Raheen - Research	Discoverant Raheen - Research	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:36.409866
c27fc3af-7d32-426a-8faf-646f51922b8b	Discoverant Rensselaer	Discoverant Rensselaer	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:36.426452
df735492-e118-4bd9-8e01-b8e3cd0abccf	Discoverant Rensselaer (Non-GxP)	Discoverant Rensselaer (Non-GxP)	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:36.443612
ed47e744-fdd0-497a-b1f2-2e4645701e52	Discoverant Rensselaer - Research	Discoverant Rensselaer - Research	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:36.460148
1e5b7bb4-8bff-4f65-b96d-6557f1ae1ed5	Discovery Pipeline PPM	Discovery Pipeline PPM	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:36.476886
b31db083-7712-4523-b996-9a7e71d6e077	Doc Automation	Doc Automation	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:36.496216
a93af02a-1e0d-405f-90e3-2a7f8af56bcd	DOC Label	DOC Label	\N	\N	\N	\N	\N	\N	\N	\N	\N	adequate	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:36.514021
89ad9b0a-2e05-48c9-a8b2-85c525a1442f	DocuBridge	DocuBridge	\N	\N	\N	\N	\N	\N	\N	\N	\N	adequate	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:36.530951
8930034a-d95e-4826-bcc5-21d82e0c7b0a	DocuSign	DocuSign	\N	\N	\N	\N	\N	\N	\N	\N	\N	adequate	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:36.547432
6cbd4bb3-7fbf-4b81-9880-da6cc98ef6d2	DoseControl	DoseControl	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:36.564455
b957bba8-0355-411c-97f4-bdc88aaa96e5	Dotmatics	Dotmatics	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:36.580271
353f602f-ff85-4afd-88cc-a1b309b6c9a6	Dotmatics	Dotmatics	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:36.597139
0cabbe06-4106-42d3-a63f-ca80501275a6	Drug Product Component Reference	Drug Product Component Reference	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:36.613818
e942aed9-0566-475a-8c56-0a41cd82ad49	Drumbeat Database	Drumbeat Database	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:36.629158
b95dc107-eea4-4854-b1cc-631723aff5ef	Druva	Druva	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:36.64568
35eab069-b7a6-4369-86c7-d29b05ce4f65	DSI Enterprise Printing Platform (OPM)	DSI Enterprise Printing Platform (OPM)	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:36.661906
27447cea-b105-48e4-a214-17b5f5272dab	DSI Unibar Enterprise Labeling Software (ELS)	DSI Unibar Enterprise Labeling Software (ELS)	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:36.678675
6e06eaca-c2fd-4aa1-89fb-b78075dcbbc1	Dun and Bradstreet	Dun and Bradstreet	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	green	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:36.694804
97f0b99d-75d6-4008-84bb-199255264a44	Dupilumab Knowledge Center	Dupilumab Knowledge Center	\N	\N	\N	\N	\N	\N	\N	\N	\N	adequate	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:36.711008
f0017881-58f4-4ba9-b257-8cc9213d67fe	Dynochem - RAH	Dynochem - RAH	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:36.728132
3c8ef4f1-9f34-4241-89e8-db2908af4a7d	E-ConnX (Shift Handover)	E-ConnX (Shift Handover)	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:36.744283
89060b66-a746-47ca-8e9d-bca661b9fc0a	eAF	eAF	\N	\N	\N	\N	\N	\N	\N	\N	\N	adequate	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:36.766743
42d2db85-6c16-4042-aa3e-6a7228d5b0b2	East	East	\N	\N	\N	\N	\N	\N	\N	\N	\N	adequate	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:36.783103
ec702b3f-4453-46db-9cf5-7725ff91caa3	eCarma (Travelers.com)	eCarma (Travelers.com)	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	green	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:36.799649
a6183753-afae-478b-a037-a1fa702c03a9	ECD Site (SP)	ECD Site (SP)	\N	\N	\N	\N	\N	\N	\N	\N	\N	adequate	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:36.815826
4dd91e65-f083-4ca5-a367-866b30259ec5	EdAssist	EdAssist	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	green	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:36.832031
554af831-3035-4f7a-9a15-08a9dfb3b2af	EdAssist	EdAssist	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	green	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:36.848863
2d1adba0-d061-4c9a-9085-1daaf88ffb33	Edstrom Specialty Lab Watering System	Edstrom Specialty Lab Watering System	\N	\N	\N	\N	\N	\N	\N	\N	\N	fullyAppropriate	\N	\N	\N	\N	green	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:36.866055
de89b964-54f0-4f17-8335-766346820501	Educational Funding Management System (EFMS)	Educational Funding Management System (EFMS)	\N	\N	\N	\N	\N	\N	\N	\N	\N	adequate	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:36.881409
10077235-9e27-4292-b04b-34205857ed25	Educational Funding Management System (EFMS)	Educational Funding Management System (EFMS)	\N	\N	\N	\N	\N	\N	\N	\N	\N	adequate	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:36.898131
4fe60e9e-a210-4c6b-8986-9f3959542519	Educational Funding Management System (EFMS)	Educational Funding Management System (EFMS)	\N	\N	\N	\N	\N	\N	\N	\N	\N	adequate	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:36.914417
4fba2c67-2763-4ac3-847c-ed0126bc03c4	Educational Impact (SP)	Educational Impact (SP)	\N	\N	\N	\N	\N	\N	\N	\N	\N	adequate	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:36.931311
0937411d-0426-428a-a37a-ac381dba509d	Electrical Power Monitoring	Electrical Power Monitoring	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:36.948079
09c40a8f-fd3a-4eae-827e-439408a8c8f6	ellab Valsuite	ellab Valsuite	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:36.964236
437c2fea-4506-40fe-9d54-bffbf2ce3b59	EMA & NCAs Portal	EMA & NCAs Portal	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:36.980631
67b20d4c-f986-4f8d-9861-5432d211e1d7	EmployeeReferrals.com	EmployeeReferrals.com	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	white	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:36.996872
9286e968-b91d-45df-96ee-f8db17952b14	Empower	Empower	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:37.013114
5f57959c-6568-4dc9-a6a5-f536f7726b46	Empower 3 FR2	Empower 3 FR2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:37.030177
57cd88dc-86d7-4b55-ace0-c01e65d3691c	Empower 3 FR4	Empower 3 FR4	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:37.046551
78cf3b8f-6879-4dd5-b79d-1dcd8de05f49	Enablon (EHS Management System)	Enablon (EHS Management System)	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:37.064223
6cc6fd96-9d4f-4787-adba-55cb7510afbb	EndNote	EndNote	\N	\N	\N	\N	\N	\N	\N	\N	\N	adequate	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:37.080546
5d625e2c-a20e-4bb7-a4f7-172ed2aec32a	EndoScan	EndoScan	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:37.097162
6b8c40a6-73f4-4c30-aeb6-6a4c4de35bae	EndoScanV Enterprise	EndoScanV Enterprise	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:37.112222
5fd490fa-65e3-4a2f-a6ad-f36a5e19502c	Endpoint	Endpoint	\N	\N	\N	\N	\N	\N	\N	\N	\N	adequate	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:37.128159
28e34ee5-4f84-4db6-9856-cccb9e6edc5a	Engage	Engage	\N	\N	\N	\N	\N	\N	\N	\N	\N	adequate	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:37.145125
8447a20c-6502-4446-9cc9-d113176d2618	Enlighted Lighting Systems and controls	Enlighted Lighting Systems and controls	\N	\N	\N	\N	\N	\N	\N	\N	\N	fullyAppropriate	\N	\N	\N	\N	green	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:37.162008
02f674aa-732f-40a7-9b28-dc1a4d150efc	Enterprise Data Warehouse	Enterprise Data Warehouse	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	white	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:37.178676
12c72e0d-ed82-4076-aaf6-85418ad326c0	Enterprise Data Warehouse	Enterprise Data Warehouse	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	white	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:37.194898
afa1c319-3a57-4b7b-8c8a-1b4ad789bc1d	Enterprise Data Warehouse	Enterprise Data Warehouse	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	white	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:37.212644
e2bc506f-1361-4062-8247-7f8c2ba7739d	Equitrac Follow-Me-Print	Equitrac Follow-Me-Print	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:37.229515
3e6eceea-3129-4b40-863c-42ba99125986	Equity Edge (E*TRADE)	Equity Edge (E*TRADE)	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	green	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:37.245797
26ef6e9a-09f8-43df-87ad-28dd8fb0e8fa	ESG (Electronic Submissions Gateway)	ESG (Electronic Submissions Gateway)	\N	\N	\N	\N	\N	\N	\N	\N	\N	adequate	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:37.262142
34a98397-53f6-4594-9ea4-c6dc5d63e620	ETCD Express	ETCD Express	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:37.278309
3bcc9cee-640b-46a1-a07d-7812813fd15c	EthicsPoint	EthicsPoint	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	yellow	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:37.294692
c27e4476-babc-4e49-971d-9fc9797f1c19	EudraCT	EudraCT	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:37.311778
0d49926d-7666-41d7-b1de-542523a20d6b	Everbridge Mass Notification	Everbridge Mass Notification	\N	\N	\N	\N	\N	\N	\N	\N	\N	adequate	\N	\N	\N	\N	green	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:37.32979
f41c207a-bf53-4af9-9b59-6c7ca2119cdc	Everest	Everest	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:37.345985
8374bf9e-17d6-415b-9b66-54850ac94027	Eversana Techsol	Eversana Techsol	\N	\N	\N	\N	\N	\N	\N	\N	\N	adequate	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:37.363127
c0032a53-9f34-4576-ad40-7cbd096c9515	Eversana Techsol	Eversana Techsol	\N	\N	\N	\N	\N	\N	\N	\N	\N	adequate	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:37.379553
7a5c489f-7eb4-4275-af1b-6a40c7c98244	Evidence Tracker	Evidence Tracker	\N	\N	\N	\N	\N	\N	\N	\N	\N	fullyAppropriate	\N	\N	\N	\N	green	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:37.396031
1d75e527-7d19-4882-add6-04a27aad344d	EVWEB Portal - MLM	EVWEB Portal - MLM	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:37.41336
dfd8a208-2d1b-4f2c-98c9-b85b4f959a52	External Application	External Application	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:37.430282
3f5ba444-fcf6-4f03-a5d1-91c05cb13af5	EY Global Tax Platform	EY Global Tax Platform 1.0	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:37.446422
aa84a8af-8d1d-4e04-b546-43292a61ac69	EyeC Proofiler	EyeC Proofiler	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:37.462685
b2df0732-c833-4afe-8d8e-97ca0b75009d	Eylea - Ophthalmology Literature Portal	Eylea - Ophthalmology Literature Portal	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:37.478797
d4bbc3d3-d7a5-4aa5-a5ed-13277441fa29	Eylea - Unbranded ROP Site	Eylea - Unbranded ROP Site	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:37.49485
5e1a138e-7b76-4a79-89ab-de49a376f232	Factory Talk - Local PC	Factory Talk - Local PC	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:37.510865
baf70a91-a077-4112-b831-fc579db704d6	Factory Talk - Rensselaer - Mid Scale	Factory Talk - Rensselaer - Mid Scale	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:37.527179
4736c482-4f60-4ee5-a680-ebb1db1133df	Factory Talk Action Manager - Ren	Factory Talk Action Manager - Ren	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:37.543479
3d99df0e-3cab-4d45-82b4-b6667875cb65	Factory Talk AssetCentre @REN	Factory Talk AssetCentre @REN	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:37.559497
62a31bd3-a2ea-46ff-b8f4-63cd5d470bce	Factory Talk AssetCentre PA10 @RHN	Factory Talk AssetCentre PA10 @RHN	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:37.576496
0a4ae8de-b413-40e2-84e5-38df96eaab91	Factory Talk AssetCentre PA11 @RHN	Factory Talk AssetCentre PA11 @RHN	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:37.592856
e5e0e5fe-8918-47a5-ae87-2440ccb1fd72	Factory Talk AssetCentre PA8 @RHN	Factory Talk AssetCentre PA8 @RHN	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:37.609124
c8d894f6-5a83-4981-a322-7b3a7ce7b900	Factory Talk AssetCentre PA9 @RHN	Factory Talk AssetCentre PA9 @RHN	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:37.625412
5afb6670-ee21-49ad-84f5-790c1d689f6c	Factory Talk AssetCentre Utilities @RHN	Factory Talk AssetCentre Utilities @RHN	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:37.641502
6362e24c-0b70-4e4b-b812-4f57f7e5b546	Factory Talk Vantage Point	Factory Talk Vantage Point	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:37.657645
c922ee40-a4b1-4aaa-8ddf-acc62259c4d0	Factory Talk View PA10 @RHN	Factory Talk View PA10 @RHN	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:37.673758
b1284c61-3bd3-4a74-b538-dc470b916fb6	Factory Talk View PA11 @RHN	Factory Talk View PA11 @RHN	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:37.690064
e8bd00d6-304c-4dd0-b89d-58d12b8427a7	Factory Talk View PA8 @RHN	Factory Talk View PA8 @RHN	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:37.70518
a9201859-8e2c-4442-8f77-18c47da7f2ae	Factory Talk View PA9 @RHN	Factory Talk View PA9 @RHN	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:37.722577
b7b15427-3576-432b-b7ee-fc0788b3d500	Factory Talk View Utilities	Factory Talk View Utilities	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:37.738617
0e107cfd-7b33-4285-a672-5bbd1a87a298	FactoryTalk Asset Centre - PA5 - REN	FactoryTalk Asset Centre - PA5 - REN	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:37.75483
4f1ddb41-f822-4c17-9e07-4bf12ecc105e	FactoryTalk AssetCentre - FF - TL	FactoryTalk AssetCentre - FF - TL	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:37.770893
7310b8d2-841a-4c6a-b962-bc5395afba9a	FactoryTalk AssetCentre - FFEM - TL	FactoryTalk AssetCentre - FFEM - TL	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:37.788435
2b8a8f73-0def-456d-ad66-d1d7c2a7a4c5	FactoryTalk AssetCentre - FL01 - TL	FactoryTalk AssetCentre - FL01 - TL	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:37.804791
cb98e457-72b9-4378-9548-42b07166ba1b	FactoryTalk AssetCentre - FL02 - TL	FactoryTalk AssetCentre - FL02 - TL	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:37.82071
1ce47835-ed08-4302-b32d-023b508f737f	FactoryTalk AssetCentre - FL03 - TL	FactoryTalk AssetCentre - FL03 - TL	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:37.837344
42f3f2fc-eadb-482b-9524-ae28b4134b75	FactoryTalk AssetCentre - IA01 - TL	FactoryTalk AssetCentre - IA01 - TL	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:37.853733
26fbd444-f34a-4254-b0c5-5a083f73142c	FactoryTalk AssetCentre - IA02 - TL	FactoryTalk AssetCentre - IA02 - TL	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:37.869122
d27f799c-eeb4-4f7a-b78b-4d790c909420	FactoryTalk AssetCentre - IN01 - TL	FactoryTalk AssetCentre - IN01 - TL	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:37.88567
43581bd7-5cb2-4d95-8c92-88d490bf1e8b	FactoryTalk AssetCentre - IN02 - TL	FactoryTalk AssetCentre - IN02 - TL	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:37.902225
cd015bf0-7bb3-4e44-8e8e-7890c7b05b05	FactoryTalk AssetCentre - IN03 - TL	FactoryTalk AssetCentre - IN03 - TL	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:37.91876
b29c86d3-9c72-4b4c-a5ea-09c48d107034	FactoryTalk AssetCentre - PA2S - REN	FactoryTalk AssetCentre - PA2S - REN	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:37.93577
8428698e-6fcd-409e-8811-1ba686be639e	FactoryTalk AssetCentre - PA3S - REN	FactoryTalk AssetCentre - PA3S - REN	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:37.952762
296adf1e-33d8-40dd-91d2-ccbb882f25e4	FactoryTalk AssetCentre - PA6 - REN	FactoryTalk AssetCentre - PA6 - REN	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:37.968747
3d86f720-a5c6-458e-8203-c82e9bc00973	FactoryTalk AssetCentre - PA7 - REN	FactoryTalk AssetCentre - PA7 - REN	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:37.984128
a20f587c-aa8c-4d8b-8101-98cfd27b6f56	FactoryTalk AssetCentre - PAS - TL	FactoryTalk AssetCentre - PAS - TL	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:38.000252
6c37cf93-98cd-4532-8c6a-3d3a58f6ad24	FactoryTalk AssetCentre - PK01 - TL	FactoryTalk AssetCentre - PK01 - TL	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:38.016565
a30759d5-775a-44eb-a8bb-a5d2f5065db6	FactoryTalk AssetCentre - PK02 - TL	FactoryTalk AssetCentre - PK02 - TL	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:38.034732
48418266-7f2f-4c3f-b327-e17efb96e007	FactoryTalk AssetCentre - SA01 - TL	FactoryTalk AssetCentre - SA01 - TL	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:38.054715
80658f87-eec8-4a97-89f4-7f488adf61f7	FactoryTalk AssetCentre - UTIL - TL	FactoryTalk AssetCentre - UTIL - TL	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:38.074762
83c1a3cb-4f8e-4f6e-b8ef-07180e945b45	FactoryTalk AssetCentre - VHP - TL	FactoryTalk AssetCentre - VHP - TL	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:38.094211
e129c349-fcbc-45d9-8d6d-b2e54581302a	FactoryTalk ThinManager - FF - TL	FactoryTalk ThinManager - FF - TL	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:38.110733
50e03679-d784-44d4-ba9c-a73c78e4bf79	FactoryTalk ThinManager - PA6X - REN	FactoryTalk ThinManager - PA6X - REN	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:38.127247
599b72ad-8535-4379-916e-1f706de3e4a0	FactoryTalk ThinManager - PA7 - REN	FactoryTalk ThinManager - PA7 - REN	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:38.150619
11256b36-ac1b-4cd0-8fde-ddd115601128	FactoryTalk Transaction Manager - Ren	FactoryTalk Transaction Manager - Ren	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:38.167102
3759c85a-3fbd-4696-a0c1-85ec996e73b8	FactoryTalk Transaction Manager @RHN	FactoryTalk Transaction Manager @RHN	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:38.182187
2fd1f6a4-f65d-4dcc-822c-bf72c020d98f	FactoryTalk View SE - BC - REN	FactoryTalk View SE - BC - REN	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:38.198598
e628f7e0-3822-40b1-9b0b-cde7cdd7f6a5	FactoryTalk View SE - FF - TL	FactoryTalk View SE - FF - TL	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:38.214888
2213841e-62ff-4659-bdae-bddc07e97ad7	FactoryTalk View SE - FFEM - TL	FactoryTalk View SE - FFEM - TL	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:38.241514
3b37ef28-291f-46ee-a3f7-2405cfbb8839	FactoryTalk View SE - FL01 - TL	FactoryTalk View SE - FL01 - TL	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:38.257977
24f13327-1cb6-4a96-a580-40f72f3fb82b	FactoryTalk View SE - FL02 - TL	FactoryTalk View SE - FL02 - TL	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:38.274138
bc7ecf00-91f2-46bc-b484-64b7624885de	FactoryTalk View SE - FL03 - TL	FactoryTalk View SE - FL03 - TL	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:38.289203
ca11a6b3-84db-41ac-b02d-ab87a2f3cb7b	FactoryTalk View SE - IA01 - TL	FactoryTalk View SE - IA01 - TL	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:38.305346
150acad8-f411-4858-8cb8-df47334522c2	FactoryTalk View SE - IA02 - TL	FactoryTalk View SE - IA02 - TL	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:38.32148
dc20d493-4243-4f81-bc3a-994907dcbc53	FactoryTalk View SE - IN01 - TL	FactoryTalk View SE - IN01 - TL	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:38.337861
6f4927fb-eca2-42a8-a4e5-2448a60c0eee	FactoryTalk View SE - IN02 - TL	FactoryTalk View SE - IN02 - TL	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:38.354153
264b608e-1be2-48fa-8e50-b46fc7500499	FactoryTalk View SE - IN03 - TL	FactoryTalk View SE - IN03 - TL	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:38.37039
e96ab1c0-81ac-4978-b54f-902a8780d1ca	FactoryTalk View SE - PA6X - REN	FactoryTalk View SE - PA6X - REN	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:38.386592
a2da8a0d-0d67-4691-9489-bcb98758674f	FactoryTalk View SE - PA7 Downstream - REN	FactoryTalk View SE - PA7 Downstream - REN	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:38.402791
0e372fea-296d-4946-bb4c-adbb8f0f88b0	FactoryTalk View SE - PA7 Upstream - REN	FactoryTalk View SE - PA7 Upstream - REN	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:38.419534
cfd1f2e5-0cd9-4d8c-8eb8-1401af813b8c	FactoryTalk View SE - PAS - TL	FactoryTalk View SE - PAS - TL	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:38.435636
ba30659c-06dc-42eb-ae3d-14c83cfcd15e	FactoryTalk View SE - PK01 - TL	FactoryTalk View SE - PK01 - TL	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:38.452291
379b8f2c-9cb6-4284-95c5-8e77c326fcf7	FactoryTalk View SE - PK02 - TL	FactoryTalk View SE - PK02 - TL	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:38.468568
985b59ad-fdaa-497d-9e70-ab14598ecb55	FactoryTalk View SE - SA01- TL	FactoryTalk View SE - SA01- TL	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:38.484836
ced8bca2-4b81-4750-96b6-d7e57ec6afd9	FactoryTalk View SE - UTIL - TL	FactoryTalk View SE - UTIL - TL	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:38.501222
015d5100-c7b8-4285-91a4-7395260ba6ff	FactoryTalk View SE - VHP - TL	FactoryTalk View SE - VHP - TL	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:38.517699
7edda621-5aaa-4d77-afda-ac07446b6bb9	FactoryTalk View SE - WFI1 - REN	FactoryTalk View SE - WFI1 - REN	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:38.534127
050efb37-b510-4bf5-881c-91c2ef48e612	FactoryTalk View SE - WFI5 - REN	FactoryTalk View SE - WFI5 - REN	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:38.549063
76f6be10-ca79-4df7-bb77-bc5b9da9e90a	FDA Portal	FDA Portal	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:38.564916
24c779f8-4508-4ef0-bd73-c05a89bb52d5	Fidelity NetBenefits	Fidelity NetBenefits	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	green	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:38.581157
1576d43c-cce7-4769-aa0d-f43e197764ef	Fidelity PSW	Fidelity PSW	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:38.596345
8ddd2123-9b91-4687-bdf0-eed2f9bd974b	FileMaker Pro - IOPS	FileMaker Pro - IOPS	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:38.614721
e349824c-7787-40a2-a85e-08e6700166f4	FileMaker Server - IOPS	FileMaker Server - IOPS	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:38.631276
3d695a66-3e0b-45c3-b852-80480d409071	Firecrest	Firecrest	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:38.646172
9c65a009-be03-48bb-a36b-2a616ccf30b2	FitPro	FitPro	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	green	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:38.662412
005d6197-3ed0-4ef1-a2fa-73c8d60736d7	Flowmeter	Flowmeter	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:38.678411
41628e6b-86bc-4af2-9ecc-f971c995d6a5	Flowmeter Data Sender - PROD	Flowmeter Data Sender - PROD	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:38.694662
ea7357f1-5712-45ff-a958-a2ef928a020c	Flywheel.io	Flywheel.io	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:38.713568
eb7c05b0-9ca5-4d5e-8ab1-58be67aaac03	Flywheel.io	Flywheel.io	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:38.729747
bfb9ad59-8da4-489f-a824-e7aab9c8f4b0	Flywheel.io	Flywheel.io	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:38.746396
9ac5cb98-f459-48f5-9af7-4cdbeedd00e1	Forseti	Forseti	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:38.763254
8e827b1c-ee9b-43d9-8cc2-4d68f00fab64	FTP - TL	FTP - TL	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:38.779808
324c9b10-bab9-46cb-b800-5128c29bec21	Fusion BC (DR Management)	Fusion BC (DR Management)	\N	\N	\N	\N	\N	\N	\N	\N	\N	fullyAppropriate	\N	\N	\N	\N	green	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:38.795939
71b57387-abda-4909-8f20-b1b9bcb161eb	Future State EAMS	Future State EAMS	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:38.812054
a177bebe-852e-4326-901f-41a7fb736a1e	Future State ERP	Future State ERP	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:38.828118
731bc448-cf04-4e6d-b0eb-37f6fb0c5d39	Future State Placeholder	Future State Placeholder	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:38.84453
e23849ba-6659-42ef-91c1-9dce788c58bf	GandA IT Script Service	GandA IT Script Service	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:38.860579
ad4e0d0c-2e2f-452c-ae43-75d4bc72c9bb	GD-IT Time Tracking Tool	GD-IT Time Tracking Tool	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:38.876687
7b154573-4fca-43b2-ad8b-1c0c7e5b9c30	GD-IT Time Tracking Tool	GD-IT Time Tracking Tool	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:38.892928
323ed85b-1fbe-4f47-909a-d93c35ab21cb	GD-IT Time Tracking Tool	GD-IT Time Tracking Tool	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:38.909148
87f731da-1b42-4405-92e3-0639170329ab	GD-IT Time Tracking Tool	GD-IT Time Tracking Tool	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:38.925334
65428ff6-5acd-4b87-b9b2-f05b14ef1103	GD-IT Time Tracking Tool	GD-IT Time Tracking Tool	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:38.941622
45f04473-f8c3-40cb-bed0-4e483ca419e4	gDan	gDan	\N	\N	\N	\N	\N	\N	\N	\N	\N	adequate	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:38.958075
8846bb0c-1c90-4d6f-9ddb-661c93df9745	GDS Big Data Initiative (BDI)	GDS Big Data Initiative (BDI)	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:38.973179
2a1d337d-27df-4b47-b1a3-b69447063253	GDS Big Data Initiative (BDI)	GDS Big Data Initiative (BDI)	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:38.99018
3a783e43-7fbd-45a4-9a44-e499e647b190	GDT Operations - Timesheet	GDT Operations - Timesheet	\N	\N	\N	\N	\N	\N	\N	\N	\N	adequate	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:39.00687
158bbe57-2c02-4046-ac04-886f2c825515	GE Historian - Ren	GE Historian - Ren	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:39.023272
7df2449c-e3ee-4771-82f7-14c5a142c2f8	Genesis Playbook	Genesis Playbook	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:39.039943
3c9951e7-f626-4017-8fa7-1c59bf3355f8	Genetec VMS	Genetec VMS	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:39.056089
7ed7d815-99b4-42f1-aec7-3954c8f39c97	Glassdoor	Glassdoor	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	green	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:39.072396
b750002a-66ce-4a68-a060-08ed0f654548	Glassdoor	Glassdoor	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	green	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:39.089236
866c90b7-6aae-40c5-a4a3-a45d4e9b91f6	Glint	Glint	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	yellow	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:39.106153
e1d3647f-9492-42b9-8e96-ad68312df795	Glint	Glint	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	yellow	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:39.122684
b4e032c6-69e9-490d-bf9a-a87173f9cf5c	Glint	Glint	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	yellow	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:39.138777
81eaac9a-e16d-49de-8ccc-861c072c0847	Global Data Lake	Global Data Lake	\N	\N	\N	\N	\N	\N	\N	\N	\N	adequate	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:39.155054
7a3b6a7a-1541-4071-9d52-b3461f866db7	Global Equity Tracker	Global Equity Tracker	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:39.171095
5f94da6c-1bab-46d8-a256-e53949d32057	Global Medical Data Lake (non-GxP)	Global Medical Data Lake (non-GxP)	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:39.187644
42cc9d51-44d8-4a72-ab83-d5440460564d	Global Registration (gReg)	Global Registration (gReg)	\N	\N	\N	\N	\N	\N	\N	\N	\N	adequate	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:39.203706
9380a7cc-f0f4-493d-8d3c-5a7a7dcbe249	Global Seeq	Global Seeq	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:39.220192
0c52b130-277a-4b2f-b27d-bb9889bc8d67	GlobeSmart	GlobeSmart	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:39.23637
aeff0618-628c-4d6c-aacc-43042ef75bc9	GLPI	GLPI	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:39.252541
e20733dd-007c-4fad-b953-ce3cd483aa36	GMP Time Calculation System	GMP Time Calculation System	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:39.269162
d2713659-e182-4b63-9476-f093b2280620	GPS-Veeva-Safety Document Management System	GPS-Veeva-Safety Document Management System	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:39.285465
c8c2650b-ef59-4e7b-ae18-46912c5e5322	Graebel globalCONNECT	Graebel globalCONNECT	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:39.301539
6ad093ac-f464-48e9-9400-7238e1abcbcd	Grass Roots	Grass Roots	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	green	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:39.317676
8ed42d4d-11cc-4d6b-b35f-6143446803a1	GRITS	GRITS	\N	\N	\N	\N	\N	\N	\N	\N	\N	adequate	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:39.333821
3c13a6ec-2d20-4cba-9640-e9caba5f69d0	gShare	gShare	\N	\N	\N	\N	\N	\N	\N	\N	\N	adequate	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:39.349987
2942211d-725b-436c-ba34-c2db1d5bee93	GTO Data Ingestion Forms	GTO Data Ingestion Forms	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:39.366353
193eca62-2c3a-492b-95c8-f07dddbfc04f	Guava - Ren	Guava - Ren	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:39.383665
1aa9861b-7750-4f01-aae8-0e245a8ea1a6	HA Reporting Submission Gateway	HA Reporting Submission Gateway	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:39.399875
7ce8073f-4ecd-48f7-8036-17223b22510d	Hartford	Hartford	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	green	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:39.415794
d91b7aca-bf51-4f17-838d-a3322b22baa6	Head Count Tracker	Head Count Tracker	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:39.431855
ae48fc78-b2c7-4453-9c36-0e7d29ad2f79	Health Authority Correspondence	Health Authority Correspondence	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:39.448266
26b7210e-a023-40f1-b411-299a2193621e	Health Canada Portal	Health Canada Portal	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:39.464581
97097d18-f0b9-40f6-90be-9093685937c7	Heat Recovery System	Heat Recovery System	\N	\N	\N	\N	\N	\N	\N	\N	\N	fullyAppropriate	\N	\N	\N	\N	green	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:39.48188
e259c45e-197a-4be9-bf8f-04650bf54098	HighByte Intelligence Hub - PA16	HighByte Intelligence Hub - PA16	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:39.498065
e5fa16af-6651-4ed1-8aab-686e5193f745	HireEZ (Hiretual)	HireEZ (Hiretual)	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	yellow	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:39.513144
2715dbc5-2049-479e-aa3d-b7e5d7d617ca	HireEZ (Hiretual)	HireEZ (Hiretual)	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	yellow	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:39.528166
e3af1dc2-8d1b-49bc-b98e-3ccc778a2aa5	HireRight	HireRight	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	green	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:39.543216
009cc9d3-3507-4c6a-ab9d-a669a69a16c6	HireRight	HireRight	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	green	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:39.562023
6939cfb2-4675-44b4-a2c8-5a174cabdfb0	HireRight	HireRight	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	green	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:39.578157
fc677f91-8161-447b-be64-64d80eb08acf	HiveMQ - PA16	HiveMQ - PA16	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:39.594489
154ace54-1902-4867-bb61-4471f9b0df28	HMAA	HMAA	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	green	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:39.61097
dc1876dc-1efa-42ab-917e-26884cf7530d	HPC Cluster	HPC Cluster	\N	\N	\N	\N	\N	\N	\N	\N	\N	adequate	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:39.62621
249079d7-5c7a-48e1-8ed3-c248df8aba0e	HR4U [Platform]	HR4U [Platform]	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	yellow	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:39.642421
ed95c06f-ef34-4f3e-9120-8eb32d6332bb	3CLogic Call Center	HR4U [Platform] / 3CLogic Call Center	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	yellow	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:39.658486
b05a5e84-ad13-4e94-b6e2-010bc1947aea	HR Service Delivery (HR4U)	HR4U [Platform] / HR Service Delivery (HR4U)	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	green	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:39.674463
e56eb35c-7d04-43a2-86f8-41bae742f06b	HR Service Delivery (HR4U)	HR4U [Platform] / HR Service Delivery (HR4U)	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	green	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:39.692364
86890038-56fa-4ea9-af9c-c6e9d1defd18	HSM Portal	HSM Portal	\N	\N	\N	\N	\N	\N	\N	\N	\N	adequate	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:39.708078
e49971da-26a9-40d9-ad9a-be4c60dbf3ee	Hubble	Hubble	\N	\N	\N	\N	\N	\N	\N	\N	\N	fullyAppropriate	\N	\N	\N	\N	green	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:39.730704
c38a3cfc-317f-495a-a6ca-b9d85e733585	Human Sample Request	Human Sample Request	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:39.746996
407d92f5-7d63-4689-b6f6-d6fe8a619e1a	Human Sample Request	Human Sample Request	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:39.763567
404750c1-0bd5-4fa3-b7cc-65c9a7ff79a3	Human Sample Request	Human Sample Request	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:39.779984
4286a9da-c4b1-494b-8627-a3f25946dd34	Human Sample Request	Human Sample Request	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:39.795325
70fe2825-6297-42a2-8d54-760782d37dfe	Hunter Warfield	Hunter Warfield	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	grey	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:39.811455
07bb5809-861d-4763-a92f-6287b2696236	Hyland Onbase  [Platform]	Hyland Onbase  [Platform]	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	green	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:39.827872
6b9bab6c-b766-459a-8d82-bdcb273b2dca	Hyland Onbase  [Platform]	Hyland Onbase  [Platform]	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	green	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:39.844314
74e14857-6137-475a-bcb3-8670719e6681	Hyland Onbase EDM	Hyland Onbase  [Platform] / Hyland Onbase EDM	\N	\N	\N	\N	\N	\N	\N	\N	\N	fullyAppropriate	\N	\N	\N	\N	green	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:39.860793
72dc4e62-30a8-403d-a6c5-dafbd50c8f2d	Hyland Onbase EDM	Hyland Onbase  [Platform] / Hyland Onbase EDM	\N	\N	\N	\N	\N	\N	\N	\N	\N	fullyAppropriate	\N	\N	\N	\N	green	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:39.877226
b12c21a2-a3e8-4d7d-829b-8eb25c4cb48c	Hyland Onbase Shipping and Receiving	Hyland Onbase  [Platform] / Hyland Onbase Shipping and Receiving	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	green	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:39.893692
86956ea2-547e-4d29-9faf-2de62191d33a	Hyperion	Hyperion	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:39.916721
47eef925-12df-46b0-b829-07c4ac387503	I&AG Law Data Lake	I&AG Law Data Lake	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:39.932777
4da555ab-d115-4c7d-859a-a899c2bf4b69	I2Verify	I2Verify	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	green	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:39.948801
88e86dd4-c54c-4139-87a4-fb358869e371	iCE / Chrome Perfect	iCE / Chrome Perfect	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:39.964827
47ab5df2-1a15-4bc4-b851-6ae5becd6755	Icertis	Icertis	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	green	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:39.980912
71fe7bc6-91f5-4334-ab24-c5838b482a43	Icertis User Verification and Onboarding	Icertis User Verification and Onboarding	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:39.99618
8a9ceaf5-1597-47a7-ba9e-158b24ae4ca7	ICON Portal	ICON Portal	\N	\N	\N	\N	\N	\N	\N	\N	\N	adequate	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:40.012289
6072236f-e0a6-4c87-aa1b-6ca1ab1fa93a	IDEAS (DNA Core/MP)	IDEAS (DNA Core/MP)	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:40.033483
fb7f6fcb-8452-49f7-a608-7d3e8962a9d7	IGEL Universal Management Suite - UMS	IGEL Universal Management Suite - UMS	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:40.049926
75e5c02f-b93d-433b-89d3-912e5b8a7db3	Ignition - PA16	Ignition - PA16	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:40.065954
6c472df4-5c39-4359-bad5-ce4d1b7d0460	Ignition - PS - TL	Ignition - PS - TL	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:40.082168
5ff73dfd-0fe0-4af9-a6a7-9a2bd8fe7ba4	Illumina-Sequencer - PS - Ren	Illumina-Sequencer - PS - Ren	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:40.09984
cdbd1d48-8927-4f67-bc20-adb9314d21e3	IlluminaSequencer-PS	IlluminaSequencer-PS	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:40.116037
31bd6ec1-54f5-4c84-aa64-92b3c4a89b4b	ImageQuant TL	ImageQuant TL	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:40.132919
77d334f2-bbb6-496b-b7fd-4a18c427705a	iManage	iManage	\N	\N	\N	\N	\N	\N	\N	\N	\N	fullyAppropriate	\N	\N	\N	\N	yellow	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:40.149005
72e2ba7d-265d-43a7-9fc6-beee2dffbaac	Immerse	Immerse	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:40.171113
1e654109-42c0-4b6d-9693-6097022323fb	Indeed	Indeed	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	green	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:40.187685
e960df33-f007-4c49-a615-1ca33711fa1f	Indeed	Indeed	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	green	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:40.203735
11033135-d90f-41cf-a747-babb482082d0	InDesign	InDesign	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	green	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:40.219867
acf2e507-b4e7-4f5f-ada9-beff1c61afee	InfoDesk	InfoDesk	\N	\N	\N	\N	\N	\N	\N	\N	\N	adequate	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:40.236769
a68cd4d4-6fff-4bb0-a366-9811d252da53	InfoExchange (IEX)	InfoExchange (IEX)	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:40.254288
3ed04282-1d85-4765-8df2-d6e3957dd8aa	Informa Citeline	Informa Citeline	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:40.270473
868fbd2a-8b5e-4351-83d5-ec70192a074c	Informatica	Informatica	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:40.286803
c12574c0-70c7-4ae2-ac94-23fd13f8b332	Informed Consent Form (ICF) Management	Informed Consent Form (ICF) Management	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:40.302889
514b19e0-b6a1-472d-8b39-9010b01337cd	Informed Consent Form (ICF) Management	Informed Consent Form (ICF) Management	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:40.319083
3f22abd3-2454-482d-9a2f-275220860cff	Informed Consent Form (ICF) Management	Informed Consent Form (ICF) Management	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:40.335003
2e504f19-7739-4d04-a678-54c1812d5a00	Informed Consent Form (ICF) Management	Informed Consent Form (ICF) Management	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:40.351218
68b63cbf-ff15-4de7-8362-02cb24b0de8d	Insights RM	Insights RM	\N	\N	\N	\N	\N	\N	\N	\N	\N	adequate	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:40.367297
9a2504ac-ff01-4d28-a36b-030b92e218ef	Inspection Management Database	Inspection Management Database	\N	\N	\N	\N	\N	\N	\N	\N	\N	adequate	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:40.385094
370779c1-f892-4886-8a72-1dfb62bf2b82	Inspection Management System (IMS)	Inspection Management System (IMS)	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:40.401197
4742a72d-ce4d-49c6-beca-db719973f106	Instadose Companion Mobile App	Instadose Companion Mobile App	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:40.417203
d6b737d8-c318-4595-8f2b-c159f3a20cfa	Intela Global Tax Platform	Intela Global Tax Platform	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:40.433669
92322eda-1e48-4f34-9e98-ade7dce70e60	Intelligent Sensor Data Platform	Intelligent Sensor Data Platform	\N	\N	\N	\N	\N	\N	\N	\N	\N	adequate	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:40.450053
c0de0ea0-b4ee-470a-9ee2-f81515d77dff	Intelligent Sensor Data Platform	Intelligent Sensor Data Platform	\N	\N	\N	\N	\N	\N	\N	\N	\N	adequate	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:40.465244
71e66597-9255-402d-b739-c1d1ec11380d	InteractRx	InteractRx	\N	\N	\N	\N	\N	\N	\N	\N	\N	adequate	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:40.481457
eefefa98-1495-473a-84ba-8e7b48fb5708	International SOS	International SOS	\N	\N	\N	\N	\N	\N	\N	\N	\N	fullyAppropriate	\N	\N	\N	\N	green	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:40.497795
a8bb40c8-7f6b-4bd1-b9fc-064a86cd4a45	Intuition AE/PC LMS	Intuition AE/PC LMS	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:40.513938
28d943a4-dc5e-4f24-a2a5-2e253c008b3a	Invesco	Invesco	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	green	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:40.530016
efd65238-0502-480e-ae97-66e94cc9bab6	IOPS Adobe Suite	IOPS Adobe Suite	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:40.547125
5d56e26f-25f3-497f-ae3b-4fcadf758dfa	IOPS Adventitious Virus Detection NGS	IOPS Adventitious Virus Detection NGS	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:40.563718
12beea88-f51e-4c82-bda0-a9778a4d3340	IOPS Batch Data Load Automation Framework	IOPS Batch Data Load Automation Framework	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:40.580189
150ae747-acea-4499-b86b-474d013cbb09	IOPS Non-GMP SQL Server Integration Services	IOPS Non-GMP SQL Server Integration Services	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:40.596953
26dced83-410f-4f30-8e10-77ed475a4b7d	IOPS SharePoint-CMCRegSci	IOPS SharePoint-CMCRegSci	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:40.613703
77a2cd31-7b29-40f7-9153-84a740ea86c4	IOPS Veeva Vault QMS	IOPS Veeva Vault QMS	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:40.629813
ee46d4d8-4fb1-4985-9922-17fd0999fae2	IOPS-eSearch-Lucidworks-Fusion	IOPS-eSearch-Lucidworks-Fusion	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:40.645889
64e3b515-ae6e-4507-af5a-7012131b0a7a	32 Karat	32 Karat	IOPS Quality Control															IOPS							IOPS - QC					2025-06-10 04:55:54.776021
527ee56d-7bb5-447d-b328-4c5ae4569f47	3D Slicer for Imaging	3D Slicer for Imaging	Collaborations & Touchpoints / BDM;~Early Clinical Development (ECD) / Clinical Imaging / Image Analysis	Amazon.com / AWS EC2																ECD					Global Development					2025-06-10 04:55:54.792965
81fcdf43-1b4a-49c2-9f38-af8bf2a3fcf3	3D Slicer for Imaging	3D Slicer for Imaging	Collaborations & Touchpoints / BDM;~Early Clinical Development (ECD) / Clinical Imaging / Image Analysis	Okta SSO																ECD					Global Development					2025-06-10 04:55:54.808593
79906dab-21b9-44dc-8313-b39f759dce36	3E Material Safety Data Sheets	3E Material Safety Data Sheets	Real Estate & Facilities Management / Environmental, Health, and Safety (EHS) Management / EHS Compliance									fullyAppropriate					green	Real Estate & Facilities Mgmt							Real Estate & Facilities Mgmt	7c58310b6f5b3a806ea3d4a21c3ee47e		perfect	fullyAppropriate	2025-06-10 04:55:54.824231
91920e89-f274-45e1-90fd-8aeda12a6615	3M Detection Management Software	3M Detection Management Software	Real Estate & Facilities Management / Environmental, Health, and Safety (EHS) Management / EHS Compliance														green	Real Estate & Facilities Mgmt							Real Estate & Facilities Mgmt					2025-06-10 04:55:54.840103
4e4f1951-97c8-4068-97be-0ab7f4463e48	A Squared (A2)	A Squared (A2)	IOPS Supply Chain Management / Demand Planning;IOPS Supply Chain Management / Order Management;IOPS Supply Chain Management / Supply Planning;~Development Operations & Portfolio Management (DO & PM) / Study Execution and Tracking;~Development Operations & Portfolio Management (DO & PM) / Study Execution and Tracking / Clinical Drug Supply Management									adequate						IOPS		DO&PM			Global		Clinical Drug Supply and Logistics;IOPS - EM;IOPS - Mfg;IOPS - Supply Chain			appropriate	adequate	2025-06-10 04:55:54.863942
7ef63679-c860-46ed-a698-3f6ce0a05ee6	ABAC Risk Center KYBP	ABAC Risk Center KYBP	Maintain and Enhance Ethics & Compliance / Manage Third Party Risk	Okta SSO								adequate					green	Law							Law / Regulatory Compliance	5ccef5701b9ccc90d710c91e1e4bcb93		appropriate	adequate	2025-06-10 04:55:54.87986
b6be2aa2-e4fd-436a-91e7-78920354a5f7	ABC SLIMS	ABC SLIMS												R&pD Owned				R&pD IT												2025-06-10 04:55:54.895247
881a7f98-bbb4-4e53-aa25-a9b77d82d2d4	Academy Pages	Academy Pages	Foundational Capabilities / Training and Onboarding (GxP)									adequate		GD Owned	GD - GD/LCOE					DO&PM;ECD					Enterprise			appropriate	adequate	2025-06-10 04:55:54.910954
d1ada9c5-e7d1-43c0-95de-7d83b42f4e7f	Acceleration Point	Acceleration Point	Collaborations & Touchpoints / External Partners & Vendors;Foundational Capabilities / Data Modeling and Visualization;~Global Medical Affairs (GMA) / HCP engagement management / HCP Interaction & Insight Tracking	Okta SSO								adequate								MA	Accenture				Oncology, Immunology, Medical Affairs			appropriate	adequate	2025-06-10 04:55:54.926971
5a3c7257-f9cb-4742-b818-91e4c6dd9179	Acceleration Point	Acceleration Point	Collaborations & Touchpoints / External Partners & Vendors;Foundational Capabilities / Data Modeling and Visualization;~Global Medical Affairs (GMA) / HCP engagement management / HCP Interaction & Insight Tracking	PowerBI								adequate								MA	Accenture				Oncology, Immunology, Medical Affairs			appropriate	adequate	2025-06-10 04:55:54.942502
681935a7-86cb-441a-a841-ad99caede5e3	Access Workspace	Access Workspace		The Access Group Access Workspace SaaS Hosting																										2025-06-10 04:55:54.958445
823bab92-8522-4bfe-a162-d9cc8d267c7e	AccuraScience NGS - New Generation Sequencing	AccuraScience NGS - New Generation Sequencing	IOPS Quality Control / QC Virology															IOPS							IOPS - QC					2025-06-10 04:55:54.974671
9f235cb8-a408-44aa-9d01-fc7327b94464	AccuSEQ	AccuSEQ	IOPS Quality Control															IOPS							IOPS - QC					2025-06-10 04:55:54.990432
a618840c-7a31-4608-a326-70f2d7f78e65	Achievers	Achievers	Benefits Management;Talent Development / Employee Engagement	Achievers Achievers SaaS Hosting													yellow	G&A IT - Human Resources						Business Owned;G&A IT	Human Resources / Total Rewards	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_auto.do?sys_id=6fd13717db92db44c9dadda5ca96197e	https://regeneron.service-now.com/cmdb_ci_business_app.do?sys_id=97d47173871535141db8ca2acebb3593			2025-06-10 04:55:55.005726
803a9a2b-f985-4139-b602-5b2c158e5c9f	Achievers	Achievers	Benefits Management;Talent Development / Employee Engagement	Okta SSO													yellow	G&A IT - Human Resources						Business Owned;G&A IT	Human Resources / Total Rewards	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_auto.do?sys_id=6fd13717db92db44c9dadda5ca96197e	https://regeneron.service-now.com/cmdb_ci_business_app.do?sys_id=97d47173871535141db8ca2acebb3593			2025-06-10 04:55:55.021601
8003d415-8619-4e4d-97ec-01a1200056ce	ACL Audit	ACL Audit	Consolidations and External Reporting / Corporate Governance									adequate					green	G&A IT - Audit						G&A IT	Financial Services / Internal Audit	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_auto.do?sys_id=63d13717db92db44c9dadda5ca961980		perfect	adequate	2025-06-10 04:55:55.037328
ab8209ff-eb14-4cf8-9c5b-3c0fbe040061	Acquia DAM	Acquia DAM	~Development Operations & Portfolio Management (DO & PM) / Shared Services / Training	Okta SSO										GD Owned	GD - GD/LCOE					DO&PM	Acquia				Global Development Training					2025-06-10 04:55:55.053018
219b0053-2e02-48d4-89db-7375b07b9449	Acronym App [PowerApps]	Acronym App [PowerApps]																			In-House									2025-06-10 04:55:55.068516
7a0d7642-a540-456d-98be-be480f87cacf	Additional Risk Minimization Measures	Additional Risk Minimization Measures	Collaborations & Touchpoints / GPS;~Global Patient Safety (GPS) / Surveillance: Signal & Risk Management	Appian Appian																GPS;RA					Global Patient Safety;Regulatory					2025-06-10 04:55:55.084607
c79b7c14-43fc-4ff3-86bd-fdbdb8b97172	Additional Risk Minimization Measures	Additional Risk Minimization Measures	Collaborations & Touchpoints / GPS;~Global Patient Safety (GPS) / Surveillance: Signal & Risk Management	Okta SSO																GPS;RA					Global Patient Safety;Regulatory					2025-06-10 04:55:55.098937
64ae2161-1ede-4783-ac4c-1061519b93e1	Adobe Acrobat Sign	Adobe Acrobat Sign	Collaborations & Touchpoints / IOPS (GDS);Foundational Capabilities / IOPS (GDS)																	MA;Quality	Adobe				Oncology					2025-06-10 04:55:55.116031
fad6e9a7-aa00-4689-96bd-d2b46fa722e0	Adobe AEM Forms - IOPS	Adobe AEM Forms - IOPS																IOPS												2025-06-10 04:55:55.132227
d4b88282-e1ef-4318-96d5-b7533923d73c	Adobe Sign	Adobe Sign	IOPS Quality Assurance / Change Control;IOPS Quality Assurance / Deviation Management;IOPS Quality Assurance / Document Control															IOPS					Global			https://regeneron.service-now.com/now/nav/ui/classic/params/target/%2Fcmdb_ci_business_app.do%3Fsys_id%3D4ce4f173871535141db8ca2acebb3594%26sysparm_view%3Dbusiness_applications%26sysparm_record_target%3Dcmdb_ci_business_app%26sysparm_record_row%3D5%26sysparm_record_rows%3D6%26sysparm_record_list%3DnameSTARTSWITHadobe%5EORDERBYshort_description				2025-06-10 04:55:55.147813
47e036ec-e0af-4ce5-8f1d-52c3d3719b17	AdobeConnect	AdobeConnect	~Development Operations & Portfolio Management (DO & PM) / Shared Services / Training									adequate								DO&PM	Adobe				Global Development Training			appropriate	adequate	2025-06-10 04:55:55.163361
c067082d-b2c5-4e32-8f7c-9400e6112470	ADP	ADP	Payroll / Payroll Management									fullyAppropriate					green	G&A IT - Payroll, Time & Labor						Business Owned;G&A IT;SOX	Financial Services / Accounting	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_auto.do?sys_id=67d13717db92db44c9dadda5ca961982	https://regeneron.service-now.com/cmdb_ci_business_app.do?sys_id=00e4f173871535141db8ca2acebb3598	perfect	fullyAppropriate	2025-06-10 04:55:55.178591
8f8e37b0-e5d2-452e-9748-00e263a4f35a	Aetna	Aetna	Benefits Management	Aetna Aetna Application Hosting													green	G&A IT - Human Resources						Business Owned;G&A IT	Human Resources / Total Rewards	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_auto.do?sys_id=154fbc241b2bb410ba52baeedc4bcbc7	https://regeneron.service-now.com/cmdb_ci_business_app.do?sys_id=40e4f173871535141db8ca2acebb359a			2025-06-10 04:55:55.194292
d4a75b63-bc03-472c-b7af-a85ea15bded5	Aetna	Aetna	Benefits Management	Aetna Aetna SaaS Hosting													green	G&A IT - Human Resources						Business Owned;G&A IT	Human Resources / Total Rewards	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_auto.do?sys_id=154fbc241b2bb410ba52baeedc4bcbc7	https://regeneron.service-now.com/cmdb_ci_business_app.do?sys_id=40e4f173871535141db8ca2acebb359a			2025-06-10 04:55:55.210005
3b81fd8b-f949-4e7c-9a60-88e807b17765	Agency Question Tracker (AQT)	Agency Question Tracker (AQT)	IOPS Product Development / Regulatory Submission															IOPS							0717 - CMC Regulatory Sciences					2025-06-10 04:55:55.225213
04f72e71-eab8-4da1-a53f-5b3bc1172cbd	AGIS	AGIS	Accounting / Financial Accounting														green	G&A IT - Financial Services						G&A IT	Financial Services					2025-06-10 04:55:55.240412
35ca4e41-a4ef-4161-9c9d-5a5e50898de9	AI Assisted Systematic Literature Review	AI Assisted Systematic Literature Review	~Global Medical Affairs (GMA) / Health Economics and Outcomes Research (HEOR)																	MA										2025-06-10 04:55:55.255963
c043c279-6da3-4a0d-86b6-77e20d807227	Alation	Alation	Foundational Capabilities	Okta SSO																DO&PM;RA										2025-06-10 04:55:55.271511
2afd1ae7-7757-4311-a3b1-2a16117afeb5	ALR (Automated Literature Review)	ALR (Automated Literature Review)	~Development Operations & Portfolio Management (DO & PM) / Study Execution and Tracking / Study Execution	Amazon.com / AWS Amazon S3																DO&PM;MA					DO&PM					2025-06-10 04:55:55.287298
a82704cc-4184-477d-ac64-ec12edc4222a	ALR (Automated Literature Review)	ALR (Automated Literature Review)	~Development Operations & Portfolio Management (DO & PM) / Study Execution and Tracking / Study Execution	Okta SSO																DO&PM;MA					DO&PM					2025-06-10 04:55:55.30379
2a019e12-59ee-460f-9d55-6ae51a1be77a	ALR (Automated Literature Review)	ALR (Automated Literature Review)	~Development Operations & Portfolio Management (DO & PM) / Study Execution and Tracking / Study Execution	RDS MySQL																DO&PM;MA					DO&PM					2025-06-10 04:55:55.319259
239b8363-2e57-4030-9a3d-228485b077f9	AmberBox	AmberBox	Manage Corporate Security / Incident Management / Identify Incidents;Manage Corporate Security / Incident Management / Investigation Management;Manage Corporate Security / Incident Management / Monitor Incidents															Law												2025-06-10 04:55:55.336031
7988584c-20e2-45ad-ae39-e7aae92d9895	Ambient.ai	Ambient.ai	Manage Corporate Security / Incident Management / Identify Incidents;Manage Corporate Security / Incident Management / Investigation Management;Manage Corporate Security / Incident Management / Monitor Incidents															Law							Law / Legal Security					2025-06-10 04:55:55.351402
8ffa9f12-1dda-4639-a8d7-da0bb3e0a888	American Dynamics CCTV System	American Dynamics CCTV System	Manage Corporate Security / Physical Security / Location Security									fullyAppropriate					green	Law							Law / Legal Security	30fbb1836fdb3a806ea3d4a21c3ee4e6		appropriate	fullyAppropriate	2025-06-10 04:55:55.367575
88be3b8c-d2a0-46db-8c59-43feb53a23fa	Anaconda	Anaconda																IOPS												2025-06-10 04:55:55.386809
f0b1f41a-b53a-4568-8403-9b534aa074a7	Anaqua Annuities	Anaqua Annuities	Protect Intellectual Property / Manage Intellectual Property / Branding;Protect Intellectual Property / Manage Intellectual Property / Copyright Management;Protect Intellectual Property / Manage Intellectual Property / Trademark Management;Protect Intellectual Property / Patent Management	Ping One SSO								fullyAppropriate					green	Law							Law / Patent Management	e11d2dc06f2bf6c06ea3d4a21c3ee45d		perfect	fullyAppropriate	2025-06-10 04:55:55.403345
2fcda883-b072-4801-a0b1-560b35e6db80	ANSYS-CPD	ANSYS-CPD																IOPS												2025-06-10 04:55:55.419995
3cce893d-b474-4174-b95d-d89f42081969	ANSYS-PS	ANSYS-PS																IOPS												2025-06-10 04:55:55.435279
67126d60-30c0-42d0-adf2-70039eff7055	AON	AON	Benefits Management	AON AON Application Hosting								fullyAppropriate					green	IOPS						G&A IT	Human Resources / Total Rewards		https://regeneron.service-now.com/cmdb_ci_business_app.do?sys_id=d0e4f173871535141db8ca2acebb35a3	unreasonable	fullyAppropriate	2025-06-10 04:55:55.450612
9fc1e037-5c83-4c82-b188-844216f6bcb9	AON	AON	Benefits Management	Ping One SSO								fullyAppropriate					green	IOPS						G&A IT	Human Resources / Total Rewards		https://regeneron.service-now.com/cmdb_ci_business_app.do?sys_id=d0e4f173871535141db8ca2acebb35a3	unreasonable	fullyAppropriate	2025-06-10 04:55:55.4671
4cf6ee01-e1ad-40e5-8f5b-116e5953b0fc	Apigee	Apigee																												2025-06-10 04:55:55.482615
f12325ea-9140-41d1-aafb-e398e2988933	App - Electronic User Account Request	App - Electronic User Account Request																IOPS												2025-06-10 04:55:55.497904
49b58a3c-f03a-48b3-8924-8cbbc8c4f195	ArborXR	ArborXR	IOPS Quality Assurance / Technical Training (Learning Management)															IOPS												2025-06-10 04:55:55.513516
9b234002-eaa7-4cb7-82a1-0ff620f6c704	Argus	Argus	Collaborations & Touchpoints / GPS;~Global Patient Safety (GPS) / Case Evaluation and Reporting / Case Management / Global Safety Database;~Global Patient Safety (GPS) / Safety Planning, Compliance, Quality, and QPPV / GPS System Administration;~Global Patient Safety (GPS) / Safety Planning, Compliance, Quality, and QPPV / Quality and Compliance	Okta SSO								adequate								ECD;GPS;MA;Quality;RA	Oracle				Global Patient Safety;Medical Affairs;Quality;Regulatory			appropriate	adequate	2025-06-10 04:55:55.529052
1e6ec667-26b4-440d-b963-598f171937b9	Argus	Argus	Collaborations & Touchpoints / GPS;~Global Patient Safety (GPS) / Case Evaluation and Reporting / Case Management / Global Safety Database;~Global Patient Safety (GPS) / Safety Planning, Compliance, Quality, and QPPV / GPS System Administration;~Global Patient Safety (GPS) / Safety Planning, Compliance, Quality, and QPPV / Quality and Compliance	Oracle Argus								adequate								ECD;GPS;MA;Quality;RA	Oracle				Global Patient Safety;Medical Affairs;Quality;Regulatory			appropriate	adequate	2025-06-10 04:55:55.544324
558bef09-cfcf-4c63-acd7-6feee1c7cc7a	Aristotle 360	Aristotle 360	Manage Government & Industry Relationships / Manage Government Relations / Government Affairs															Law												2025-06-10 04:55:55.559382
a557ae25-71c7-47e0-83cb-6047ff453b9a	Aroma	Aroma	~Global Medical Affairs (GMA) / Health Economics and Outcomes Research (HEOR)	Okta SSO																MA					Medical Affairs;Strategic Planning					2025-06-10 04:55:55.574684
cc740e40-145d-4411-88a3-6778db7d507a	Array Studio	Array Studio																												2025-06-10 04:55:55.589994
41632e2f-031c-40bc-baca-d3cf7c84ca53	Articulate	Articulate	IOPS Quality Assurance / Technical Training (Learning Management)	Articulate Global Articulate SaaS Hosting																										2025-06-10 04:55:55.605291
1e1e3600-68ea-4387-b07b-ce60b7bdbe40	ArtiosCAD Design	ArtiosCAD Design																IOPS												2025-06-10 04:55:55.621559
714a6063-0ebb-426a-9d09-9fef165f2d12	ASAP (Antibody Sequence Analysis Program)	ASAP (Antibody Sequence Analysis Program)												R&pD Owned				R&pD IT												2025-06-10 04:55:55.637036
fb3d0d5d-d48a-4089-9e1b-44a68b469e72	ASIST	ASIST	~Development Operations & Portfolio Management (DO & PM) / Study Execution and Tracking;~Development Operations & Portfolio Management (DO & PM) / Study Execution and Tracking / Clinical Drug Supply Management	TE Excursion Bot								adequate								DO&PM					Clinical Drug Supply and Logistics			appropriate	adequate	2025-06-10 04:55:55.652428
c83f6ec0-bef7-4dbc-bc4f-4a353c26151e	Assay Provider Database (Excel)	Assay Provider Database (Excel)	~Early Clinical Development (ECD) / Precision Medicine / Assay Management / Assay Information Management									adequate								ECD					ECD			appropriate	adequate	2025-06-10 04:55:55.668387
7993bbd0-387e-4d84-ac18-b3af4901eb6c	Asset Center	Asset Center	IOPS Product Development / Device Specification Management																											2025-06-10 04:55:55.683901
ad61cb50-fcec-4ba2-88b3-55c212095664	ASTRA	ASTRA																IOPS												2025-06-10 04:55:55.700384
0d3a2a6a-65f7-45e5-89eb-e687b1d7716f	ASTRA 8 PROD Raheen	ASTRA 8 PROD Raheen																IOPS												2025-06-10 04:55:55.716367
3624c42e-de6f-4b70-a132-c3ecef88a061	Atlassian Confluence	Atlassian Confluence	IOPS Enterprise Support / Collaboration	Atlassian Atlassian Confluence SaaS Hosting																										2025-06-10 04:55:55.731522
4bb710ce-4e23-40e6-96c0-a242f5df26b6	Audit Board	Audit Board	Consolidations and External Reporting / Corporate Governance	Ping One SSO													green	G&A IT - Audit						Business Owned;G&A IT	Financial Services / Internal Audit;Financial Services / Treasury	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_auto.do?sys_id=831e21b1db8190149be32ad94b9619ca	https://regeneron.service-now.com/cmdb_ci_business_app.do?sys_id=89e47573871535141db8ca2acebb359f			2025-06-10 04:55:55.746884
01a7b01d-70ad-4876-b4d1-29209df030a4	Augmentir	Augmentir	IOPS Quality Assurance / Technical Training (Learning Management)															IOPS												2025-06-10 04:55:55.762811
8ef048b7-9b80-4ae0-a315-ed15c453c87a	AutoDesk Vault (RHN)	AutoDesk Vault (RHN)	IOPS Plant Management / Drawing Management															IOPS					IE							2025-06-10 04:55:55.778272
5d2da5e0-a3b7-438d-941e-2b17a36f93de	Automated Audit Workpapers and Tracking System (TeamMate)	Automated Audit Workpapers and Tracking System (TeamMate)	Consolidations and External Reporting / Corporate Governance									unreasonable					green	G&A IT - Audit						Business Owned;G&A IT	Financial Services / Internal Audit	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_auto.do?sys_id=f2e1b357db92db44c9dadda5ca9619b4	https://regeneron.service-now.com/cmdb_ci_business_app.do?sys_id=9553319f134d73c05a075ecf3244b04b	perfect	unreasonable	2025-06-10 04:55:55.794359
e20bf67d-b102-4010-8112-c7b05dbcd5f0	Automation Administration	Automation Administration																IOPS												2025-06-10 04:55:55.810395
c2d7bd93-c4a0-4ba8-bf9d-2913417bbebe	Automation Jumpbox	Automation Jumpbox																IOPS												2025-06-10 04:55:55.827505
22a7cd1c-1aa8-4f3a-80d0-beaa4b2a6ebd	Automation_Processes Contols	Automation_Processes Contols																IOPS												2025-06-10 04:55:55.841923
ee4d5664-816a-4ba2-86d3-20f7bd0f3b5e	Avature	Avature	Talent Acquisition / Recruiting	Avature Application Hosting								adequate					yellow	G&A IT - Human Resources						G&A IT	Human Resources / Talent Acquisition	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_auto.do?sys_id=46bea6b16f177e006ea3d4a21c3ee4ad		insufficient	adequate	2025-06-10 04:55:55.860062
5638dd22-969d-4eb0-b4af-c9f9f17ecb04	Avature	Avature	Talent Acquisition / Recruiting	Okta SSO								adequate					yellow	G&A IT - Human Resources						G&A IT	Human Resources / Talent Acquisition	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_auto.do?sys_id=46bea6b16f177e006ea3d4a21c3ee4ad		insufficient	adequate	2025-06-10 04:55:55.876623
07ac67d0-8c98-4a35-9a79-4174efa0357d	AVEVA PI Process Historian - PA16	AVEVA PI Process Historian - PA16																IOPS												2025-06-10 04:55:55.892888
27f9ea97-c00a-4303-b1b9-5499fe5a3289	Axway	Axway	Foundational Capabilities / External Data Transfer;~Global Patient Safety (GPS) / Case Evaluation and Reporting / Case Management / Safety E2B Interchange	Axway B2Bi								adequate								GPS;Quality;RA	Axway				BDM;Enterprise;Regulatory			appropriate	adequate	2025-06-10 04:55:55.908376
0c76fa43-77df-467f-a54e-caebc4031347	Axway	Axway	Foundational Capabilities / External Data Transfer;~Global Patient Safety (GPS) / Case Evaluation and Reporting / Case Management / Safety E2B Interchange	Okta SSO								adequate								GPS;Quality;RA	Axway				BDM;Enterprise;Regulatory			appropriate	adequate	2025-06-10 04:55:55.923842
138bc78b-a8a4-42a8-b765-8581cbe542cc	Azenta FreezerPro Raheen	Azenta FreezerPro Raheen																IOPS					IE							2025-06-10 04:55:55.939399
f9ac2652-78ca-4256-95b4-d46a30678239	B17 - Fill Finish Enviromental Monitoring	B17 - Fill Finish Enviromental Monitoring																IOPS												2025-06-10 04:55:55.955512
5acef18b-5bef-4c12-abd8-ff2915d85a94	B17 - PACKAGING LINE 02 SYSTEM	B17 - PACKAGING LINE 02 SYSTEM																IOPS												2025-06-10 04:55:55.971776
7c386803-018b-4e65-bf14-44cc1d1fb4e8	Bank of America (CashPro)	Bank of America (CashPro)	Treasury Management / Accounts Payable and Expense Reimbursement / Process accounts payable (AP);Treasury Management / Internal Controls / Compliance Reporting;Treasury Management / Internal Controls / Establish internal controls, policies, and procedures;Treasury Management / Internal Controls / Operate controls and monitor compliance;Treasury Management / Planning and Management Accounting / Manage transactions;Treasury Management / Revenue Accounting / Process accounts receivable (AR);Treasury Management / Treasury Operations / Manage cash;Treasury Management / Treasury Operations / Manage financial fraud/dispute cases;Treasury Management / Treasury Operations / Manage in-house bank accounts;Treasury Management / Treasury Operations / Manage treasury policies and procedures;Treasury Management / Treasury Operations / Monitor and execute risk and hedging transactions														green	G&A IT - Financial Services						Business Owned;G&A IT	Financial Services / Treasury;Financial Services / Treasury / Treasury OPS	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_auto.do?sys_id=35f99e1487e06518ed31bbff8bbb3542	https://regeneron.service-now.com/cmdb_ci_business_app.do?sys_id=29e4b573871535141db8ca2acebb3585			2025-06-10 04:55:55.987864
60e66a64-8de9-46c6-ab51-508a64dabe67	Bank of Ireland	Bank of Ireland	Treasury Management														green	G&A IT - Financial Services						Business Owned;G&A IT	Financial Services / Treasury	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_auto.do?sys_id=af1c1a9087246518ed31bbff8bbb356e	https://regeneron.service-now.com/cmdb_ci_business_app.do?sys_id=29e4b573871535141db8ca2acebb3586			2025-06-10 04:55:56.003926
773baaba-8b33-4189-8221-bded79f222db	BarTender Barcode and Label	BarTender Barcode and Label																IOPS												2025-06-10 04:55:56.02012
ef99fdf1-30f0-45db-8899-486b3db7bd68	Beamery Talent CRM	Beamery Talent CRM	Talent Acquisition;Talent Acquisition / Recruiting	Beamery Beamery SaaS Hosting													white	G&A IT - Human Resources						G&A IT	Human Resources / Talent Acquisition	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_auto.do?sys_id=82fecdbe87e265546a4e0e98cebb35a0	https://regeneron.service-now.com/cmdb_ci_business_app.do?sys_id=61e4b573871535141db8ca2acebb358a			2025-06-10 04:55:56.035759
a1f3d218-7028-48bd-a152-7203f34aee21	Beamery Talent CRM	Beamery Talent CRM	Talent Acquisition;Talent Acquisition / Recruiting	Beamery Chrome Extension													white	G&A IT - Human Resources						G&A IT	Human Resources / Talent Acquisition	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_auto.do?sys_id=82fecdbe87e265546a4e0e98cebb35a0	https://regeneron.service-now.com/cmdb_ci_business_app.do?sys_id=61e4b573871535141db8ca2acebb358a			2025-06-10 04:55:56.051521
df944fe2-2164-47e8-935f-79b9a52b429a	Beamery Talent CRM	Beamery Talent CRM	Talent Acquisition;Talent Acquisition / Recruiting	Microsoft Bookings with Me													white	G&A IT - Human Resources						G&A IT	Human Resources / Talent Acquisition	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_auto.do?sys_id=82fecdbe87e265546a4e0e98cebb35a0	https://regeneron.service-now.com/cmdb_ci_business_app.do?sys_id=61e4b573871535141db8ca2acebb358a			2025-06-10 04:55:56.066052
0bd0227e-3fe6-4964-af72-5a658be674c6	Beamery Talent CRM	Beamery Talent CRM	Talent Acquisition;Talent Acquisition / Recruiting	Okta SSO													white	G&A IT - Human Resources						G&A IT	Human Resources / Talent Acquisition	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_auto.do?sys_id=82fecdbe87e265546a4e0e98cebb35a0	https://regeneron.service-now.com/cmdb_ci_business_app.do?sys_id=61e4b573871535141db8ca2acebb358a			2025-06-10 04:55:56.081729
be65ca91-2d36-42ba-8350-968fca37bd3b	Beamery Talent CRM	Beamery Talent CRM	Talent Acquisition;Talent Acquisition / Recruiting	Sender Authentication													white	G&A IT - Human Resources						G&A IT	Human Resources / Talent Acquisition	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_auto.do?sys_id=82fecdbe87e265546a4e0e98cebb35a0	https://regeneron.service-now.com/cmdb_ci_business_app.do?sys_id=61e4b573871535141db8ca2acebb358a			2025-06-10 04:55:56.096854
d47eec21-71f7-4740-a45f-c4557260c7ce	Beeline	Beeline	Core HR / Contingent Worker;Core HR / Workforce Deployment;Foundational Capabilities / Resource Management;HR Operations Management	Beeline Application Hosting								fullyAppropriate					green	G&A IT - Human Resources		DO&PM				G&A IT	Human Resources / NEMO	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_auto.do?sys_id=fee1b357db92db44c9dadda5ca9619f4	https://regeneron.service-now.com/cmdb_ci_business_app.do?sys_id=e1e4b573871535141db8ca2acebb358b	appropriate	fullyAppropriate	2025-06-10 04:55:56.112261
ce4f9f0f-743f-49db-a095-4f42a6ea76d0	Beeline	Beeline	Core HR / Contingent Worker;Core HR / Workforce Deployment;Foundational Capabilities / Resource Management;HR Operations Management	Beeline Beeline SaaS Hosting								fullyAppropriate					green	G&A IT - Human Resources		DO&PM				G&A IT	Human Resources / NEMO	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_auto.do?sys_id=fee1b357db92db44c9dadda5ca9619f4	https://regeneron.service-now.com/cmdb_ci_business_app.do?sys_id=e1e4b573871535141db8ca2acebb358b	appropriate	fullyAppropriate	2025-06-10 04:55:56.133325
8b30b330-1e82-4b56-b876-c4e206477b5d	Beeline	Beeline	Core HR / Contingent Worker;Core HR / Workforce Deployment;Foundational Capabilities / Resource Management;HR Operations Management	Ping One SSO								fullyAppropriate					green	G&A IT - Human Resources		DO&PM				G&A IT	Human Resources / NEMO	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_auto.do?sys_id=fee1b357db92db44c9dadda5ca9619f4	https://regeneron.service-now.com/cmdb_ci_business_app.do?sys_id=e1e4b573871535141db8ca2acebb358b	appropriate	fullyAppropriate	2025-06-10 04:55:56.148754
5ad32c6e-21f6-4d05-aaf4-0e7993d9c1f0	Benchling - Research	Benchling - Research	IOPS Product Development / Technical Transfer									adequate		R&pD Owned				R&pD IT						R&pD IT	0193 - Viral Vector Technologies;0330 - Protein Expression Sciences;0340 - Therapeutic Antibodies;1212 - Preclin Mfg & Proc Dev				adequate	2025-06-10 04:55:56.164907
3248a1d9-a24a-42b4-9d0d-5ecbd34a78fd	BenefitSolver	BenefitSolver	Benefits Management	BenefitSolver Application Hosting								fullyAppropriate					green	G&A IT - Human Resources						Business Owned;G&A IT	Human Resources / Total Rewards	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_auto.do?sys_id=a2a999b71bd6b3402f3da8e82d4bcb51	https://regeneron.service-now.com/cmdb_ci_business_app.do?sys_id=61e4b573871535141db8ca2acebb358c	perfect	fullyAppropriate	2025-06-10 04:55:56.183621
21bd5ba6-5dea-4202-9b4a-19b22eda0c16	BenefitSolver	BenefitSolver	Benefits Management	Okta SSO								fullyAppropriate					green	G&A IT - Human Resources						Business Owned;G&A IT	Human Resources / Total Rewards	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_auto.do?sys_id=a2a999b71bd6b3402f3da8e82d4bcb51	https://regeneron.service-now.com/cmdb_ci_business_app.do?sys_id=61e4b573871535141db8ca2acebb358c	perfect	fullyAppropriate	2025-06-10 04:55:56.1991
67439340-9243-4297-af96-12f1bf30f6f4	Benevity ESR	Benevity ESR	~Global Medical Affairs (GMA) / Operations & Execution / Externally Sponsored Research	ESR Excel								adequate								MA					ESR			appropriate	adequate	2025-06-10 04:55:56.2148
cb366d77-ed73-42c8-a9ed-df3757f8bc75	Benevity ESR	Benevity ESR	~Global Medical Affairs (GMA) / Operations & Execution / Externally Sponsored Research	ESR SP								adequate								MA					ESR			appropriate	adequate	2025-06-10 04:55:56.230664
0a6829d5-7265-4e96-ad82-9bcda32173fe	Benevity ESR	Benevity ESR	~Global Medical Affairs (GMA) / Operations & Execution / Externally Sponsored Research	Okta SSO								adequate								MA					ESR			appropriate	adequate	2025-06-10 04:55:56.246041
7ab11af2-2432-4317-b5e2-c72d1d3907f7	BetterComp	BetterComp	Compensation Management															G&A IT - Human Resources						Business Owned;G&A IT	Human Resources / Compensation		https://regeneron.service-now.com/now/nav/ui/classic/params/target/cmdb_ci_business_app.do%3Fsys_id%3D4c10a30e2bc5a290f2a6fa45fe91bfaf			2025-06-10 04:55:56.267989
9af49181-e73f-4772-8975-632bffa0340c	Beyond Trust PRA	Beyond Trust PRA																IOPS												2025-06-10 04:55:56.285661
76f8ac9a-9089-406c-85e5-eb2058c1163c	BioRegistry	BioRegistry												R&pD Owned				R&pD IT						R&pD IT	0284 - Research Program Management;0330 - Protein Expression Sciences;0340 - Therapeutic Antibodies					2025-06-10 04:55:56.300122
739964bc-c6bd-41da-b3ac-f5273e5bd35e	BioRender	BioRender		BioRender BioRender SaaS Hosting										R&pD Owned				R&pD IT												2025-06-10 04:55:56.314947
63584f05-878e-49f4-b1f1-a75ba303e22b	Biovia One Lab ELN - GxP	Biovia One Lab ELN - GxP																IOPS												2025-06-10 04:55:56.330207
c54c6f8c-8913-48de-bd8c-33524b588845	Biovia OneLab ELN	Biovia OneLab ELN																												2025-06-10 04:55:56.345515
c4eef51e-469c-4642-9e17-bbf69c408924	BLAST (NCBI tool)	BLAST (NCBI tool)												R&pD Owned				R&pD IT												2025-06-10 04:55:56.361231
7e7f6cef-36b3-46c7-bee9-2bccc8a8c2de	BlauLabs Geo Track and Trace	BlauLabs Geo Track and Trace																IOPS												2025-06-10 04:55:56.37822
bc91e5f3-67d6-439e-a08d-b738d960edfb	Bloomberg	Bloomberg	Treasury Management / Fixed-Asset Project Accounting / Perform capital planning and project approval;Treasury Management / General Accounting and Reporting / Financial reporting;Treasury Management / Planning and Management Accounting / Manage financial performance;Treasury Management / Revenue Accounting / Process customer credit;Treasury Management / Treasury Operations / Manage cash;Treasury Management / Treasury Operations / Manage debt and investment;Treasury Management / Treasury Operations / Manage treasury policies and procedures														green	G&A IT - Financial Services						Business Owned;G&A IT	Financial Services / Treasury;Financial Services / Treasury / OPS Liquidity	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_auto.do?sys_id=d64ad29487e06518ed31bbff8bbb3543	https://regeneron.service-now.com/cmdb_ci_business_app.do?sys_id=7b504e52db7ca0103c9ec245059619bb			2025-06-10 04:55:56.393526
9c44425d-d858-43c3-adcf-91ee05f9a76e	Blue Mountain Regulatory Asset Manager (BMRAM)	Blue Mountain Regulatory Asset Manager (BMRAM)	IOPS Enterprise Support / Application Management;IOPS Enterprise Support / Infrastructure Management;IOPS Plant Management / Asset Accounting;IOPS Plant Management / Asset Management;IOPS Plant Management / Asset Performance;IOPS Plant Management / Calibration Management;IOPS Plant Management / Enterprise Recipe Mgmt;IOPS Plant Management / Plant Maintenance;IOPS Plant Management / Preventive Maintenance Scheduling;IOPS Plant Management / Work Order Management															IOPS					Global							2025-06-10 04:55:56.407959
2361e050-d758-49bb-b7b1-477061a859a8	Bluebeam	Bluebeam	Real Estate & Facilities Management / Engineering, Design and Construction Management / Engineering & Architecture														green	Real Estate & Facilities Mgmt							Real Estate & Facilities Mgmt	928d6fe6dbb024103c9ec24505961966				2025-06-10 04:55:56.423336
6dbfcd06-f8c2-4225-81ee-fee1881eb41e	Blueprint PWA	Blueprint PWA	~Development Operations & Portfolio Management (DO & PM) / Drug Development Project and Portfolio Management / Program and Project Management (Drug Development)	Power Apps																DO&PM	Microsoft				Global Development					2025-06-10 04:55:56.438593
3696b02c-68cf-4a44-9eef-a2b92ab5c0fc	Bluesheet Budget	Bluesheet Budget	Collaborations & Touchpoints / Finance									adequate								DO&PM					Global Development			appropriate	adequate	2025-06-10 04:55:56.454007
2e8ca60d-9622-406c-b446-281c728b7957	Body Techniques	Body Techniques	Benefits Management / Wellness															G&A IT - Human Resources						G&A IT	Human Resources / Total Rewards		https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_business_app.do?sys_id=e5e4b573871535141db8ca2acebb35cb			2025-06-10 04:55:56.469107
d93757f7-223a-4db3-b5a8-c7bb57aa2c88	Boomi	Boomi	Foundational Capabilities;Integration	Amazon.com / AWS EC2													yellow			Quality		Merged data			G&A IT;Quality	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_discovered.do?sys_id=dcf4d616db9d30509efa8a1848961968				2025-06-10 04:55:56.484314
8f411eaf-69bd-4e81-b3c0-c824846d3cd6	Boomi	Boomi	Foundational Capabilities;Integration	Okta SSO													yellow			Quality		Merged data			G&A IT;Quality	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_discovered.do?sys_id=dcf4d616db9d30509efa8a1848961968				2025-06-10 04:55:56.50036
b6002c0d-8e24-4bb6-90a2-701b8622ac15	BrassRing	BrassRing	Talent Acquisition / Recruiting														white	G&A IT - Human Resources						G&A IT	Human Resources / People Analytics and Reporting;Human Resources / Talent Acquisition	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_auto.do?sys_id=84d4169cf93bcd4481258999c9c26da5	https://regeneron.service-now.com/cmdb_ci_business_app.do?sys_id=31e4b573871535141db8ca2acebb35d0			2025-06-10 04:55:56.515656
03553362-bdb7-4e7c-99d9-aeec4a45c9b0	Bright Horizons	Bright Horizons	Benefits Management	Bright Horizon Bright Horizon Application Hosting													green	G&A IT - Human Resources						Business Owned;G&A IT	Human Resources / Total Rewards	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_auto.do?sys_id=d30e65371ba1245046a7da4cbc4bcb45	https://regeneron.service-now.com/cmdb_ci_business_app.do?sys_id=39e4b573871535141db8ca2acebb35d1			2025-06-10 04:55:56.530877
f2a44f16-a1f5-4f48-90ff-13e7a17f1084	Broadbean	Broadbean	Talent Acquisition / Recruiting	CareerBuilder CareerBuilder Application Hosting													green	G&A IT - Human Resources						G&A IT	Human Resources / Talent Acquisition	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_discovered.do?sys_id=3fd13b17db92db44c9dadda5ca96198b				2025-06-10 04:55:56.546224
31ff522b-96c0-4d61-9edd-806cbaa00583	Broadspire	Broadspire	Core HR / HR Absence Management	Broadspire Broadspire Application Hosting													green	G&A IT - Human Resources						Business Owned;G&A IT	Human Resources / HR Operations	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_auto.do?sys_id=967561731b61245046a7da4cbc4bcbf3	https://regeneron.service-now.com/cmdb_ci_business_app.do?sys_id=35e4b573871535141db8ca2acebb35d2			2025-06-10 04:55:56.562176
42c45360-f34b-4601-bbef-b473f8d56632	Brooks Expert Support Tool (Best)	Brooks Expert Support Tool (Best)	IOPS Plant Management / Plant Maintenance															IOPS												2025-06-10 04:55:56.577756
9b2217c7-969a-4422-8c0f-c1ffc77096b2	BSI LIMS	BSI LIMS	Collaborations & Touchpoints / Research									adequate								ECD								appropriate	adequate	2025-06-10 04:55:56.593425
5d5ddf4f-5b14-46af-a8aa-e5501e1e485c	Building Automation System JCI Metasys	Building Automation System JCI Metasys	IOPS Plant Management / Building Automation;Real Estate & Facilities Management / Facilities Operations and Maintenance / Heating and Cooling, Power, Lighting, Elevators, Plumbing									adequate					green	Real Estate & Facilities Mgmt							Real Estate & Facilities Mgmt	3ae1b357db92db44c9dadda5ca9619e2		perfect	adequate	2025-06-10 04:55:56.60956
548525de-b2ac-4e2e-a3e5-b9970c7ffcd2	Bulk Chemical Distribution System→FUT	Bulk Chemical Distribution System→FUT																IOPS												2025-06-10 04:55:56.624915
17740c86-13f8-4d19-8ef6-6ef3552a400d	C Technologies SoloVPE	C Technologies SoloVPE	IOPS Quality Control															IOPS												2025-06-10 04:55:56.640355
dae02160-c6bb-4b06-bfe1-340ab024552c	C Technologies SoloVPE - Manufacturing	C Technologies SoloVPE - Manufacturing																IOPS												2025-06-10 04:55:56.656112
69cde3fd-0f9a-4207-b45a-8f4153bb9419	Calyx IRT/RTSM	Calyx IRT/RTSM	~Biostatistics and Data Management (BDM) / Data Management / Clinical Data Acquisition;~Development Operations & Portfolio Management (DO & PM) / Study Execution and Tracking;~Development Operations & Portfolio Management (DO & PM) / Study Execution and Tracking / Clinical Drug Supply Management	PPD/IRT/ERT Report Integration to Data Lake Bot								adequate								BDM;DO&PM	Calyx				Clinical Drug Supply and Logistics			appropriate	adequate	2025-06-10 04:55:56.671982
44d1cbe0-f281-498b-9faa-1a2dcc442ec3	Candex Agency Portal	Candex Agency Portal	Talent Acquisition / Recruiting	Candex Application Hosting													yellow	G&A IT - Human Resources						Business Owned;G&A IT	Human Resources / Talent Acquisition	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_auto.do?sys_id=5a17e5771b61245046a7da4cbc4bcb02	https://regeneron.service-now.com/cmdb_ci_business_app.do?sys_id=79e4b573871535141db8ca2acebb35d6			2025-06-10 04:55:56.687702
4a3b462a-9522-41bd-9590-0fe5f7ad7947	Cantor Fitzgerald	Cantor Fitzgerald	Compensation Management														green	G&A IT - Human Resources						Business Owned;G&A IT	Human Resources / Total Rewards	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_auto.do?sys_id=ded749cedbb6a590c10db8f3f39619bf	https://regeneron.service-now.com/cmdb_ci_business_app.do?sys_id=f5e4b573871535141db8ca2acebb35d7			2025-06-10 04:55:56.702988
94991cea-6d3d-41ed-b5c0-1dc100118d50	Captivate	Captivate	Talent Development / Learning Management	Adobe Captivate													green	G&A IT - Human Resources						Business Owned;G&A IT	Human Resources / Talent Development	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_appl.do?sys_id=8eb7ed7f1b6acc108ef243b4bd4bcb74				2025-06-10 04:55:56.718984
b76b4a33-ffff-4461-b887-83adbf78db01	CCure	CCure	Manage Corporate Security / Physical Security / Location Security									fullyAppropriate					green	Law							Law / Legal Security	423f3d4b6f1f3a806ea3d4a21c3ee479		perfect	fullyAppropriate	2025-06-10 04:55:56.735418
02b64df7-d4ea-4bbf-8010-759763c0642d	CCURE 9000 Security Management System	CCURE 9000 Security Management System																IOPS												2025-06-10 04:55:56.750914
5e7e75f5-0d4d-4904-be87-ec8a3d9512d8	CDER Direct	CDER Direct	~Regulatory / Health authority content									adequate								RA					Regulatory			appropriate	adequate	2025-06-10 04:55:56.764944
29fec0bb-4ae6-4271-b6e3-48fe5982192c	CDER NextGen	CDER NextGen	~Regulatory / Health authority content									adequate								RA					Regulatory			appropriate	adequate	2025-06-10 04:55:56.78047
e0aa611d-fcbc-42c9-bdf4-d0a2f19ca873	CDPHP	CDPHP	Benefits Management	CDPHP CDPHP Application Hosting													green	G&A IT - Human Resources						Business Owned;G&A IT	Human Resources / Total Rewards	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_auto.do?sys_id=1dd18b101323b204be0b58222244b041	https://regeneron.service-now.com/cmdb_ci_business_app.do?sys_id=b5e4b573871535141db8ca2acebb35dd			2025-06-10 04:55:56.796454
b7259dc2-6bf3-4613-85ae-894c1f9c78f6	CEC Portal	CEC Portal	IOPS Plant Management / Environmental Health and Safety (EHS)															IOPS												2025-06-10 04:55:56.811958
60fcf55e-5d91-49b9-befc-d91b3552c02a	Cellario	Cellario	IOPS Quality Control															IOPS												2025-06-10 04:55:56.827493
cdd27b1e-dcdd-43f6-aa25-4fa984d59798	Centralized Sample Tracking	Centralized Sample Tracking	~Early Clinical Development (ECD) / Precision Medicine / Sample Management and Reconciliation																	ECD					ECD;Enterprise					2025-06-10 04:55:56.842942
53eb0cb2-df5f-4583-be71-aac760335099	CES Information Management tool	CES Information Management tool	~Development Operations & Portfolio Management (DO & PM) / Drug Development Project and Portfolio Management / Program and Project Management (Drug Development)																	DO&PM					Program Portfolio Operations					2025-06-10 04:55:56.858597
b81a21e8-1985-48e6-86f4-8cebd3c230fe	CETOL 6σ Tolerance Analysis Software	CETOL 6σ Tolerance Analysis Software																IOPS												2025-06-10 04:55:56.873862
e6744ac0-87b1-4867-8d29-4002baeb0e04	Charles River Axcess Database - RAH	Charles River Axcess Database - RAH	IOPS Quality Control															IOPS					IE							2025-06-10 04:55:56.891378
05bbeb03-4865-4c08-b168-7c2c2b62f322	Chemical Manager- RAH	Chemical Manager- RAH	IOPS Plant Management / Environmental Health and Safety (EHS)															IOPS					IE							2025-06-10 04:55:56.907171
d194d1f0-7b6e-4c3b-8836-8bff596d9e4e	Chromeleon	Chromeleon	IOPS Quality Control															IOPS												2025-06-10 04:55:56.922644
f1eaf16e-0595-4fd1-a5b7-840f67d9f6aa	Cigna	Cigna	Benefits Management	Cigna Cigna Application Hosting													green	G&A IT - Human Resources						Business Owned;G&A IT	Human Resources / Total Rewards	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_auto.do?sys_id=af0e65371ba1245046a7da4cbc4bcbd3	https://regeneron.service-now.com/cmdb_ci_business_app.do?sys_id=06e4f573871535141db8ca2acebb350d			2025-06-10 04:55:56.93863
a587b9cd-d8df-489d-8d66-b359a28cef91	Cintas Gemini Gowning Vending Machine (TL)	Cintas Gemini Gowning Vending Machine (TL)																IOPS					US							2025-06-10 04:55:56.953921
4b6e6114-1e10-4122-8b04-9d6f02491109	Clario ERT	Clario ERT	~Biostatistics and Data Management (BDM) / Data Management / Clinical Data Acquisition	PPD/IRT/ERT Report Integration to Data Lake Bot								adequate								BDM	Clario				BDM, DO&PM			appropriate	adequate	2025-06-10 04:55:56.969113
89f31b7a-cb41-4b8b-89c0-b2517b3a1829	Claroty Process Area Monitoring	Claroty Process Area Monitoring	IOPS Enterprise Support / IT Security															IOPS												2025-06-10 04:55:56.98459
8e8320fc-775f-445c-8b71-7733ed5a2985	Clearsight	Clearsight	Treasury Management / Treasury Operations / Manage cash														green	G&A IT - Financial Services						Business Owned;G&A IT	Financial Services / Treasury	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_auto.do?sys_id=8a88c36797c29910b88fbf2e6253afaa	https://regeneron.service-now.com/cmdb_ci_business_app.do?sys_id=58f14296db7ca0103c9ec24505961970			2025-06-10 04:55:57.001551
ef0bfe9d-6f00-4030-9565-5de5ecfc21a7	ClearTrial	ClearTrial	Collaborations & Touchpoints / Finance									adequate								DO&PM;MA	Oracle				Finance (GDS)			appropriate	adequate	2025-06-10 04:55:57.017001
f1eef0e2-0604-4ea8-ae1b-7446b19b6a5a	Clearwater - Treasury Partners	Clearwater - Treasury Partners	Treasury Management / General Accounting and Reporting / Financial reporting;Treasury Management / General Accounting and Reporting / Manage policies and procedures;Treasury Management / Internal Controls / Compliance Reporting;Treasury Management / Internal Controls / Establish internal controls, policies, and procedures;Treasury Management / Internal Controls / Operate controls and monitor compliance;Treasury Management / Planning and Management Accounting / Manage financial performance;Treasury Management / Treasury Operations / Manage cash;Treasury Management / Treasury Operations / Manage debt and investment;Treasury Management / Treasury Operations / Manage treasury policies and procedures														green	G&A IT - Financial Services						Business Owned;G&A IT;SOX	Financial Services / Treasury;Financial Services / Treasury / OPS Liquidity	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_discovered.do?sys_id=4fe1f357db92db44c9dadda5ca961945				2025-06-10 04:55:57.032431
2d2f8df0-7e72-40f5-987f-51a2933df6ab	Clinical Operational Repository (ODR)	Clinical Operational Repository (ODR)	Foundational Capabilities / Reporting and Analytics	Clinical ODR Performance Tracking Bot								adequate								DO&PM	Saama				Clinical Trial Management;Enterprise;Global Development;Regulatory			appropriate	adequate	2025-06-10 04:55:57.047844
20daaeac-4d6b-486b-991a-dbb2d3889e13	Clinical Trial Tracker/Phoenix Tracker	Clinical Trial Tracker/Phoenix Tracker	Collaborations & Touchpoints / Regulatory (GDS);~Regulatory / Submission development									adequate								RA					Clinical Trial Management;Regulatory			appropriate	adequate	2025-06-10 04:55:57.066072
49d574f5-a945-42f3-a1d3-80c5f32a66f1	Clinical Trials Site - Corporate	Clinical Trials Site - Corporate	~Global Medical Affairs (GMA) / Operations & Execution / Externally Sponsored Research / Research Collaboration Management	Alphabet / Google Analytics SaaS Hosting																MA										2025-06-10 04:55:57.082129
23df7259-5f67-448b-a5e8-0a60da1f0afb	Clinical Trials Site - Corporate	Clinical Trials Site - Corporate	~Global Medical Affairs (GMA) / Operations & Execution / Externally Sponsored Research / Research Collaboration Management	OneTrust OneTrust																MA										2025-06-10 04:55:57.099024
4a3317d4-ac7c-4c50-b06e-fa192f1464f9	Clinical Trials Site - Corporate	Clinical Trials Site - Corporate	~Global Medical Affairs (GMA) / Operations & Execution / Externally Sponsored Research / Research Collaboration Management	Salesforce																MA										2025-06-10 04:55:57.114888
e9340eff-60af-47f1-a80b-4968f82a8637	Clinical Trials Site - Libtayo	Clinical Trials Site - Libtayo	~Global Medical Affairs (GMA) / Operations & Execution / Externally Sponsored Research / Research Collaboration Management																	MA	Bioscript									2025-06-10 04:55:57.133419
b569df38-fc43-4fac-af15-5f5e732f3c3e	ClinPhone	ClinPhone	~Development Operations & Portfolio Management (DO & PM) / Study Execution and Tracking;~Development Operations & Portfolio Management (DO & PM) / Study Execution and Tracking / Clinical Drug Supply Management									adequate								DO&PM	Parexel Informatics				Clinical Drug Supply and Logistics			appropriate	adequate	2025-06-10 04:55:57.149561
ee8bde9e-5034-41ff-84dd-a26508c758ed	Cloudera Data Platform - IOPS	Cloudera Data Platform - IOPS																IOPS												2025-06-10 04:55:57.165402
b52fc360-3c12-4646-857e-bdc217959427	CloudIQ	CloudIQ	IOPS Enterprise Support / Infrastructure Management															IOPS												2025-06-10 04:55:57.181204
23c4ca5c-316f-4a46-8dea-110c863d310d	CluePoints RBQM	CluePoints RBQM	~Development Operations & Portfolio Management (DO & PM) / Shared Services / Central Monitoring;~Development Operations & Portfolio Management (DO & PM) / Study Execution and Tracking									adequate								DO&PM	CluePoints S.A.				Central Monitoring			appropriate	adequate	2025-06-10 04:55:57.196407
a7eec874-206b-48cf-afb7-62dd9b24771d	Commercial MDM	Commercial MDM	~Global Medical Affairs (GMA) / HCP engagement management																	MA										2025-06-10 04:55:57.211787
fb97fcd9-32ac-4463-bb36-669308b627c8	Compa Offers	Compa Offers	Compensation Management	Okta SSO														G&A IT - Human Resources						G&A IT	Human Resources / Compensation	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_auto.do?sys_id=f00c8e381b409214993dfd15cc4bcbfa	https://regeneron.service-now.com/cmdb_ci_business_app.do?sys_id=40a07530474c1294a6c9f4d7536d4333			2025-06-10 04:55:57.227197
4adfc5fd-84a6-40ad-8ae4-4c9c0dc89cbf	Compass	Compass	Collaborations & Touchpoints / DO&PM;IOPS Enterprise Support / Collaboration;IOPS Enterprise Support / Portfolio Mgmt;IOPS Supply Chain Management / Product Lifecycle Management;~Development Operations & Portfolio Management (DO & PM) / Drug Development Project and Portfolio Management;~Development Operations & Portfolio Management (DO & PM) / Drug Development Project and Portfolio Management / Program and Project Management (Drug Development)									adequate								DO&PM;ECD;MA;Quality;RA	CluePoints S.A.				Clinical Trial Management DO&PM;Clinical Trial Management,DO&PM Global Medical Affairs;ECD;Regulatory			appropriate	adequate	2025-06-10 04:55:57.243136
9a458ba8-40bb-4a82-b216-90f314b072a3	ComplianceBuilder	ComplianceBuilder																IOPS												2025-06-10 04:55:57.258264
627ea60f-ae38-418b-bed1-aad916bb8726	ComplianceWire - RegnU - IOPS	ComplianceWire - RegnU - IOPS																IOPS												2025-06-10 04:55:57.273831
edeeafce-2170-416f-a3f5-21a42ea1175c	Concur	Concur	Accounting / Travel & Expense Management;Foundational Capabilities / Resource Management	Okta SSO								fullyAppropriate					green	G&A IT - Financial Services		MA		Merged data		Business Owned;G&A IT;SOX	Financial Services / Global Procurement	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_auto.do?sys_id=fda8e3e1d1ed148060ec8c96e6adbc40	https://regeneron.service-now.com/cmdb_ci_business_app.do?sys_id=6ee43973871535141db8ca2acebb3515	perfect	fullyAppropriate	2025-06-10 04:55:57.289194
67972543-c567-44b7-b972-d805428b3dc4	Congress Planning Dashboard	Congress Planning Dashboard	~Global Medical Affairs (GMA) / Strategic Planning									adequate								MA					Medical Affairs (MA TAs, Med Ops, Publications, MA PM, Med Ed, HEOR, FMT);Strategic Planning			appropriate	adequate	2025-06-10 04:55:57.304927
f0fd8e93-1ac8-4fce-813d-15032acfeb40	Controlant	Controlant	IOPS Supply Chain Management / Cold Chain Tracking															IOPS												2025-06-10 04:55:57.320475
35338bcb-bf1f-4e20-9d95-dca96df9e98c	ConvergeHealth SRP	ConvergeHealth SRP	~Global Patient Safety (GPS) / Case Evaluation and Reporting / PV Planning;~Global Patient Safety (GPS) / Case Evaluation and Reporting / Safety Reporting;~Global Patient Safety (GPS) / Pharmacoepidemiology;~Global Patient Safety (GPS) / Safety Planning, Compliance, Quality, and QPPV / GPS System Administration;~Global Patient Safety (GPS) / Safety Planning, Compliance, Quality, and QPPV / Quality and Compliance;~Global Patient Safety (GPS) / Surveillance: Signal & Risk Management	ConvergeHealth Safety ETL								adequate								GPS								appropriate	adequate	2025-06-10 04:55:57.336004
b7c8251d-ed20-4fb2-930d-2f9a3b3b975c	ConvergeHealth SRP	ConvergeHealth SRP	~Global Patient Safety (GPS) / Case Evaluation and Reporting / PV Planning;~Global Patient Safety (GPS) / Case Evaluation and Reporting / Safety Reporting;~Global Patient Safety (GPS) / Pharmacoepidemiology;~Global Patient Safety (GPS) / Safety Planning, Compliance, Quality, and QPPV / GPS System Administration;~Global Patient Safety (GPS) / Safety Planning, Compliance, Quality, and QPPV / Quality and Compliance;~Global Patient Safety (GPS) / Surveillance: Signal & Risk Management	ConvergeHealth Safety Report Distribution								adequate								GPS								appropriate	adequate	2025-06-10 04:55:57.351491
80feda2c-cfa1-45a6-a334-031f0f3c1ac4	ConvergeHealth SRP	ConvergeHealth SRP	~Global Patient Safety (GPS) / Case Evaluation and Reporting / PV Planning;~Global Patient Safety (GPS) / Case Evaluation and Reporting / Safety Reporting;~Global Patient Safety (GPS) / Pharmacoepidemiology;~Global Patient Safety (GPS) / Safety Planning, Compliance, Quality, and QPPV / GPS System Administration;~Global Patient Safety (GPS) / Safety Planning, Compliance, Quality, and QPPV / Quality and Compliance;~Global Patient Safety (GPS) / Surveillance: Signal & Risk Management	ElevateSafety								adequate								GPS								appropriate	adequate	2025-06-10 04:55:57.366959
da2b47e1-28ae-4ec7-a2ec-63764825e2b8	ConvergeHealth SRP	ConvergeHealth SRP	~Global Patient Safety (GPS) / Case Evaluation and Reporting / PV Planning;~Global Patient Safety (GPS) / Case Evaluation and Reporting / Safety Reporting;~Global Patient Safety (GPS) / Pharmacoepidemiology;~Global Patient Safety (GPS) / Safety Planning, Compliance, Quality, and QPPV / GPS System Administration;~Global Patient Safety (GPS) / Safety Planning, Compliance, Quality, and QPPV / Quality and Compliance;~Global Patient Safety (GPS) / Surveillance: Signal & Risk Management	Okta SSO								adequate								GPS								appropriate	adequate	2025-06-10 04:55:57.382665
d613a655-d007-4a1c-ac65-361455ce8966	Core Country Committee	Core Country Committee	Collaborations & Touchpoints / DO&PM;~Development Operations & Portfolio Management (DO & PM) / Study Execution and Tracking;~Development Operations & Portfolio Management (DO & PM) / Study Execution and Tracking / Study Startup									adequate								DO&PM;RA					Global Trial Optimization			appropriate	adequate	2025-06-10 04:55:57.418702
65b0f967-7545-401b-bc5b-b9301fbf8ebc	CORE LIMS	CORE LIMS												R&pD Owned				R&pD IT						R&pD IT						2025-06-10 04:55:57.434827
52627f97-0a48-4ddb-8aeb-aef9a0223345	CoreHR - CorePay Raheen - IOPS	CoreHR - CorePay Raheen - IOPS																IOPS												2025-06-10 04:55:57.451033
ec5b3bc2-84fd-4ce0-829c-7697bc70ffa7	CorePay	CorePay	IOPS Enterprise Support / OTL Reporting;Payroll / Payroll Management	Ping One SSO								fullyAppropriate					green	G&A IT - Payroll, Time & Labor						G&A IT	Financial Services / Accounting;Financial Services / Payroll	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_discovered.do?sys_id=7f0e2260db687bc07dfc8c9239961994	https://regeneron.service-now.com/cmdb_ci_business_app.do?sys_id=f2e47973871535141db8ca2acebb3507	perfect	fullyAppropriate	2025-06-10 04:55:57.467631
9d15f4f6-e55b-40a9-a801-c96fc4674bdb	Cority Ergonomics	Cority Ergonomics																IOPS												2025-06-10 04:55:57.485709
b9478f89-ba89-4e56-84eb-33ff4fe94de7	Costar	Costar	Accounting / Lease Management	Ping One SSO								fullyAppropriate					green	G&A IT - Financial Services						Business Owned;G&A IT;SOX	Financial Services / Accounting	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_auto.do?sys_id=4dea71d5db1fa7c0b061cae3b9961978	https://regeneron.service-now.com/cmdb_ci_business_app.do?sys_id=76e47973871535141db8ca2acebb3509	perfect	fullyAppropriate	2025-06-10 04:55:57.502695
da081f5c-2377-4b24-abfa-02f2988a7400	Cotoha Translation Service	Cotoha Translation Service	Foundational Capabilities / Translation Service																	RA	NTT Communications				Commercial;Medical Affairs;Quality;Regulatory					2025-06-10 04:55:57.519467
df48f1fc-4e5e-47c6-9ef5-72ebf171cfcb	Credit Risk Monitor	Credit Risk Monitor	Treasury Management / Treasury Operations / Monitor and execute risk and hedging transactions														green	G&A IT - Financial Services						Business Owned;G&A IT	Financial Services / Treasury;Financial Services / Treasury / Corporate Risk	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_auto.do?sys_id=305a969487e06518ed31bbff8bbb3597	https://regeneron.service-now.com/cmdb_ci_business_app.do?sys_id=41228a96db7ca0103c9ec245059619de			2025-06-10 04:55:57.534915
33a9796e-a048-49fd-89db-07566f4bf64a	CRF Annotation Interactive Automation	CRF Annotation Interactive Automation	~Biostatistics and Data Management (BDM) / Statistical Programming / Clinical Data Review (2)	Amazon.com / AWS EC2																BDM	ClinChoice				Statistical Programming					2025-06-10 04:55:57.550462
0d05dd21-1d50-45b9-a0cc-88d1bfff663e	CRF Annotation Interactive Automation	CRF Annotation Interactive Automation	~Biostatistics and Data Management (BDM) / Statistical Programming / Clinical Data Review (2)	Apache Tomcat																BDM	ClinChoice				Statistical Programming					2025-06-10 04:55:57.56518
d3251067-8a2b-4164-9a65-f6413f9f2c3f	CRF Annotation Interactive Automation	CRF Annotation Interactive Automation	~Biostatistics and Data Management (BDM) / Statistical Programming / Clinical Data Review (2)	Java																BDM	ClinChoice				Statistical Programming					2025-06-10 04:55:57.581259
292ebf54-ec89-472d-901e-1277040d63df	CRF Annotation Interactive Automation	CRF Annotation Interactive Automation	~Biostatistics and Data Management (BDM) / Statistical Programming / Clinical Data Review (2)	Okta SSO																BDM	ClinChoice				Statistical Programming					2025-06-10 04:55:57.596792
f25f6606-22a4-4c5f-a34b-f6fb915231c2	CT.gov Portal	CT.gov Portal	~Global Patient Safety (GPS) / Case Evaluation and Reporting / Health Authority, License Partner, and Sponsor																	GPS					Global Patient Safety					2025-06-10 04:55:57.6123
c312fcca-33a4-447b-923c-2970062c0f9b	CTIS (Clinical Trials Information System)	CTIS (Clinical Trials Information System)	~Regulatory / Health authority content	CTIS Transcribing Information Bot								adequate								RA					Regulatory			appropriate	adequate	2025-06-10 04:55:57.627614
c80e9def-50d0-4528-9ad3-40c59bbe03dc	CTMS Request Management	CTMS Request Management	~Development Operations & Portfolio Management (DO & PM) / Study Execution and Tracking / Study Execution																	DO&PM										2025-06-10 04:55:57.64197
6001324b-751a-4144-8043-83da377e81df	Custom Dashboards	Custom Dashboards	IOPS Product Manufacturing / Operational Performance																											2025-06-10 04:55:57.657273
e71abbee-7e5f-428a-b247-cc112d33ab98	CVENT	CVENT	Accounting / Travel & Expense Management;~Global Medical Affairs (GMA) / Operations & Execution / GMA Administration & Business Ops	Okta SSO													green	G&A IT - Sourcing and Procurement		MA				Business Owned;G&A IT	Financial Services / Global Procurement	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_auto.do?sys_id=3ae1b357db92db44c9dadda5ca9619c7	https://regeneron.service-now.com/cmdb_ci_business_app.do?sys_id=cfe47973871535141db8ca2acebb350f			2025-06-10 04:55:57.672708
122657a1-27ee-4cf6-9d01-8f1c4112bc81	CWI FAERS EVDAS Service	CWI FAERS EVDAS Service	~Global Patient Safety (GPS) / Surveillance: Signal & Risk Management									adequate								GPS								appropriate	adequate	2025-06-10 04:55:57.688387
66d1d855-6e06-462c-9048-10938ccf2dc0	DADS Intake	DADS Intake	~Development Operations & Portfolio Management (DO & PM) / Shared Services / Program Management	Atlassian Jira Service Desk																DO&PM					Development Analytics & Data Science					2025-06-10 04:55:57.703845
27f06c01-2e45-4161-8e2e-cffd14e750e6	DADS Intake	DADS Intake	~Development Operations & Portfolio Management (DO & PM) / Shared Services / Program Management	Okta SSO																DO&PM					Development Analytics & Data Science					2025-06-10 04:55:57.731073
4d47542e-4a14-4a5b-b541-fcdd4321ad84	Dash	Dash	Collaborations & Touchpoints / Regulatory (GDS);IOPS Product Development / Regulatory Submission;IOPS Product Manufacturing / Regulatory Jurisdiction Planning;~Regulatory / Submission development									adequate						IOPS		RA					Regulatory			appropriate	adequate	2025-06-10 04:55:57.748612
111c75ea-9a72-4fe4-9c45-e9aaaa2a4407	Data Historian Aveva PI @ REN	Data Historian Aveva PI @ REN	IOPS Product Development / Process Characterization															IOPS					US							2025-06-10 04:55:57.76423
c9d1710f-b0b6-4f2a-9793-33bfc3c0b4a8	Data Historian Aveva Pi @ RHN	Data Historian Aveva Pi @ RHN																IOPS					IE							2025-06-10 04:55:57.779879
a8a5b3e1-5e6d-45b0-887c-b714c523b7dd	Data Historian Aveva PI @ SAR	Data Historian Aveva PI @ SAR	IOPS Product Development / Process Characterization															IOPS					US							2025-06-10 04:55:57.799006
2d650ac3-30e2-4f3b-a118-3adb1758c69d	Data Historian OSI Pi - RHN	Data Historian OSI Pi - RHN																IOPS												2025-06-10 04:55:57.814574
e1cb491d-17b8-4574-87ca-6aa123cb844d	Data Query System (DQS)	Data Query System (DQS)	~Development Operations & Portfolio Management (DO & PM) / Drug Development Project and Portfolio Management / Study Planning and Scheduling									adequate								DO&PM	IQVIA				Global Trial Optimization			appropriate	adequate	2025-06-10 04:55:57.829995
6354483e-ce72-4170-8fe7-64d6fc3525fe	Data Sheet Storage	Data Sheet Storage																IOPS												2025-06-10 04:55:57.845559
7bcd98e7-8acf-4870-8703-2b187abe5386	Databricks	Databricks	~Biostatistics and Data Management (BDM) / Statistical Programming / Clinical Data Review (2);~Global Medical Affairs (GMA) / Health Economics and Outcomes Research (HEOR)	Okta SSO																BDM;MA					Health Economics and Outcomes Research (HEOR);Medical Affairs					2025-06-10 04:55:57.866825
a3c6104c-2518-4408-b0cd-58e5faa34de3	Dataiku	Dataiku	Foundational Capabilities;Foundational Capabilities / Data Aggregation and Storage;Foundational Capabilities / Data Integration and Collaboration									adequate								DO&PM;MA	Dataiku							appropriate	adequate	2025-06-10 04:55:57.88272
8d606a48-d31a-4669-975e-5ccfe4c3db22	Datavision - iEnvision	Datavision - iEnvision	~Global Medical Affairs (GMA) / Medical Communications / Publications Management	Envision Pharma iEnvision								adequate								MA	Envision Pharma				Publications Management			appropriate	adequate	2025-06-10 04:55:57.901635
ffb32c19-6ddd-4961-bd9a-e98f9d354212	Datavision - iEnvision	Datavision - iEnvision	~Global Medical Affairs (GMA) / Medical Communications / Publications Management	JSF								adequate								MA	Envision Pharma				Publications Management			appropriate	adequate	2025-06-10 04:55:57.917336
467f845a-2afb-4a32-96f0-5d4323762402	Datavision - iEnvision	Datavision - iEnvision	~Global Medical Affairs (GMA) / Medical Communications / Publications Management	Microsoft SQL Server SaaS Hosting								adequate								MA	Envision Pharma				Publications Management			appropriate	adequate	2025-06-10 04:55:57.932817
c7a3ec87-d2e2-4b9e-8578-b34aa9423bb9	Datavision - iEnvision	Datavision - iEnvision	~Global Medical Affairs (GMA) / Medical Communications / Publications Management	Okta SSO								adequate								MA	Envision Pharma				Publications Management			appropriate	adequate	2025-06-10 04:55:57.94845
6110c760-f683-41fd-b88d-fe17c36d00ef	Datavision - iEnvision	Datavision - iEnvision	~Global Medical Affairs (GMA) / Medical Communications / Publications Management	Stateless EJBs								adequate								MA	Envision Pharma				Publications Management			appropriate	adequate	2025-06-10 04:55:57.963836
f708e34a-6fb5-45d9-b4d8-11c1931bbcc7	Decare Dental	Decare Dental	Benefits Management	Decare Dental Decare Dental Application Hosting													green	G&A IT - Human Resources						Business Owned;G&A IT	Human Resources / Total Rewards	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_auto.do?sys_id=eb0e65371ba1245046a7da4cbc4bcbe0	https://regeneron.service-now.com/cmdb_ci_business_app.do?sys_id=8fe47973871535141db8ca2acebb351c			2025-06-10 04:55:57.979983
63ff87b5-d077-4987-93ec-30e090ea4e41	DeCare Eye Care	DeCare Eye Care	Benefits Management														green	G&A IT - Human Resources						Business Owned;G&A IT	Human Resources / Total Rewards	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_auto.do?sys_id=63ff90871b20e55079027669cc4bcb2f	https://regeneron.service-now.com/cmdb_ci_business_app.do?sys_id=0be47973871535141db8ca2acebb351d	appropriate		2025-06-10 04:55:57.995526
7470e9e1-28cf-430e-98ba-77c5ae063d96	DeepL Translation Service	DeepL Translation Service	Foundational Capabilities / Translation Service	Okta SSO																RA	DeepL				Global Development;Regulatory					2025-06-10 04:55:58.017664
cef9f299-da3f-4894-8a0f-08d320aacfba	DeliveryPoD File Track	DeliveryPoD File Track																IOPS												2025-06-10 04:55:58.03376
71f67cb0-149e-46e5-b934-c79926dcc184	Delta Dental	Delta Dental	Benefits Management	Delta Dental Delta Dental Application Hosting													green	G&A IT - Human Resources						Business Owned;G&A IT	Human Resources / Total Rewards	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_auto.do?sys_id=bbd17b17db92db44c9dadda5ca96199d	https://regeneron.service-now.com/cmdb_ci_business_app.do?sys_id=8fe47973871535141db8ca2acebb351e			2025-06-10 04:55:58.049218
0f9b7255-3607-4be0-975e-86f55867d5bd	Digital Business Hub	Digital Business Hub	Accounting / Accounts Payable															G&A IT - Financial Services						G&A IT	Financial Services / Accounting;Financial Services / Tax					2025-06-10 04:55:58.064991
2a59e4af-0097-4eb3-8bc8-5a671af8131a	Digital Immunity	Digital Immunity	IOPS Enterprise Support / IT Security															IOPS												2025-06-10 04:55:58.080308
fdade089-4144-470f-aa10-edd05e96c933	DirectEmployers	DirectEmployers	Talent Acquisition / Recruiting	DirectEmployers DirectEmployers Application Hosting													green	G&A IT - Human Resources						Business Owned;G&A IT	Human Resources / Talent Acquisition	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_auto.do?sys_id=2b0e65371ba1245046a7da4cbc4bcbed	https://regeneron.service-now.com/cmdb_ci_business_app.do?sys_id=0be47973871535141db8ca2acebb352e			2025-06-10 04:55:58.095881
35473a21-ebed-4b90-89f8-bd2066435334	Director's Desk	Director's Desk	Consolidations and External Reporting / Corporate Governance;Manage Corporate Governance & Services / Manage Corporate Securities														green	Law							Financial Services / Accounting	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_discovered.do?sys_id=73d17b17db92db44c9dadda5ca9619ac				2025-06-10 04:55:58.172692
47f76989-4165-4805-8569-94dea48c427b	32 Karat	32 Karat	IOPS Quality Control															IOPS							IOPS - QC					2025-06-10 05:00:40.569312
7b9d3088-58ae-443a-b99d-2cc080972f01	3D Slicer for Imaging	3D Slicer for Imaging	Collaborations & Touchpoints / BDM;~Early Clinical Development (ECD) / Clinical Imaging / Image Analysis	Amazon.com / AWS EC2																ECD					Global Development					2025-06-10 05:00:40.587858
e66575f8-4c8f-4490-af09-c9e6ad33d129	3D Slicer for Imaging	3D Slicer for Imaging	Collaborations & Touchpoints / BDM;~Early Clinical Development (ECD) / Clinical Imaging / Image Analysis	Okta SSO																ECD					Global Development					2025-06-10 05:00:40.606669
33753a32-c27d-4c92-a48c-81ea813c4635	3E Material Safety Data Sheets	3E Material Safety Data Sheets	Real Estate & Facilities Management / Environmental, Health, and Safety (EHS) Management / EHS Compliance									fullyAppropriate					green	Real Estate & Facilities Mgmt							Real Estate & Facilities Mgmt	7c58310b6f5b3a806ea3d4a21c3ee47e		perfect	fullyAppropriate	2025-06-10 05:00:40.624861
1d1e2970-f706-4076-96d1-a7f6327d5e94	3M Detection Management Software	3M Detection Management Software	Real Estate & Facilities Management / Environmental, Health, and Safety (EHS) Management / EHS Compliance														green	Real Estate & Facilities Mgmt							Real Estate & Facilities Mgmt					2025-06-10 05:00:40.642044
90a48482-1876-43fc-a429-2d5b9ff0cc8a	A Squared (A2)	A Squared (A2)	IOPS Supply Chain Management / Demand Planning;IOPS Supply Chain Management / Order Management;IOPS Supply Chain Management / Supply Planning;~Development Operations & Portfolio Management (DO & PM) / Study Execution and Tracking;~Development Operations & Portfolio Management (DO & PM) / Study Execution and Tracking / Clinical Drug Supply Management									adequate						IOPS		DO&PM			Global		Clinical Drug Supply and Logistics;IOPS - EM;IOPS - Mfg;IOPS - Supply Chain			appropriate	adequate	2025-06-10 05:00:40.660448
d9d9cecd-df4f-4d4a-92fa-6ecd467dd519	ABAC Risk Center KYBP	ABAC Risk Center KYBP	Maintain and Enhance Ethics & Compliance / Manage Third Party Risk	Okta SSO								adequate					green	Law							Law / Regulatory Compliance	5ccef5701b9ccc90d710c91e1e4bcb93		appropriate	adequate	2025-06-10 05:00:40.678329
898a0ffc-3b16-4294-a4af-bf429548c878	ABC SLIMS	ABC SLIMS												R&pD Owned				R&pD IT												2025-06-10 05:00:40.69794
e0bccc2c-4395-498d-8527-997ea0d33a10	Academy Pages	Academy Pages	Foundational Capabilities / Training and Onboarding (GxP)									adequate		GD Owned	GD - GD/LCOE					DO&PM;ECD					Enterprise			appropriate	adequate	2025-06-10 05:00:40.716434
d28ed3b8-c816-4137-8791-6c9d4db622f1	Acceleration Point	Acceleration Point	Collaborations & Touchpoints / External Partners & Vendors;Foundational Capabilities / Data Modeling and Visualization;~Global Medical Affairs (GMA) / HCP engagement management / HCP Interaction & Insight Tracking	Okta SSO								adequate								MA	Accenture				Oncology, Immunology, Medical Affairs			appropriate	adequate	2025-06-10 05:00:40.734369
865d2e18-e58c-48fc-bb95-f12fcdcc351d	Acceleration Point	Acceleration Point	Collaborations & Touchpoints / External Partners & Vendors;Foundational Capabilities / Data Modeling and Visualization;~Global Medical Affairs (GMA) / HCP engagement management / HCP Interaction & Insight Tracking	PowerBI								adequate								MA	Accenture				Oncology, Immunology, Medical Affairs			appropriate	adequate	2025-06-10 05:00:40.758142
306fb1d1-c97d-4a35-b129-0d9381bbeb95	Access Workspace	Access Workspace		The Access Group Access Workspace SaaS Hosting																										2025-06-10 05:00:40.777764
914ced0b-ebc6-457c-8662-6b3b4a700ef9	AccuraScience NGS - New Generation Sequencing	AccuraScience NGS - New Generation Sequencing	IOPS Quality Control / QC Virology															IOPS							IOPS - QC					2025-06-10 05:00:40.796253
2ca56e47-d1ee-4ac9-a98e-5efb0309b708	AccuSEQ	AccuSEQ	IOPS Quality Control															IOPS							IOPS - QC					2025-06-10 05:00:40.814127
b8c3508d-1d7c-4760-be62-849da16493b1	Achievers	Achievers	Benefits Management;Talent Development / Employee Engagement	Achievers Achievers SaaS Hosting													yellow	G&A IT - Human Resources						Business Owned;G&A IT	Human Resources / Total Rewards	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_auto.do?sys_id=6fd13717db92db44c9dadda5ca96197e	https://regeneron.service-now.com/cmdb_ci_business_app.do?sys_id=97d47173871535141db8ca2acebb3593			2025-06-10 05:00:40.835214
60616831-7954-4cea-8c68-385e86dc8ddc	Achievers	Achievers	Benefits Management;Talent Development / Employee Engagement	Okta SSO													yellow	G&A IT - Human Resources						Business Owned;G&A IT	Human Resources / Total Rewards	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_auto.do?sys_id=6fd13717db92db44c9dadda5ca96197e	https://regeneron.service-now.com/cmdb_ci_business_app.do?sys_id=97d47173871535141db8ca2acebb3593			2025-06-10 05:00:40.853988
37eda837-af5f-483c-8dc8-af34965cf64f	ACL Audit	ACL Audit	Consolidations and External Reporting / Corporate Governance									adequate					green	G&A IT - Audit						G&A IT	Financial Services / Internal Audit	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_auto.do?sys_id=63d13717db92db44c9dadda5ca961980		perfect	adequate	2025-06-10 05:00:40.8732
bac7df02-a399-4297-9803-5df56529863c	Acquia DAM	Acquia DAM	~Development Operations & Portfolio Management (DO & PM) / Shared Services / Training	Okta SSO										GD Owned	GD - GD/LCOE					DO&PM	Acquia				Global Development Training					2025-06-10 05:00:40.891293
c00b24dd-459b-4baa-8311-f12ddaf9b63d	Acronym App [PowerApps]	Acronym App [PowerApps]																			In-House									2025-06-10 05:00:40.909995
664f3601-01c2-4d79-ad6c-5fac6b49d0d2	Additional Risk Minimization Measures	Additional Risk Minimization Measures	Collaborations & Touchpoints / GPS;~Global Patient Safety (GPS) / Surveillance: Signal & Risk Management	Appian Appian																GPS;RA					Global Patient Safety;Regulatory					2025-06-10 05:00:40.928043
1b06edd3-a45b-4b32-98ff-57593974e385	Additional Risk Minimization Measures	Additional Risk Minimization Measures	Collaborations & Touchpoints / GPS;~Global Patient Safety (GPS) / Surveillance: Signal & Risk Management	Okta SSO																GPS;RA					Global Patient Safety;Regulatory					2025-06-10 05:00:40.949337
f1d9830f-65e4-4583-b5ac-03da95e0b118	Adobe Acrobat Sign	Adobe Acrobat Sign	Collaborations & Touchpoints / IOPS (GDS);Foundational Capabilities / IOPS (GDS)																	MA;Quality	Adobe				Oncology					2025-06-10 05:00:40.967437
428648ca-198d-4c17-80d8-4efcda82e5da	Adobe AEM Forms - IOPS	Adobe AEM Forms - IOPS																IOPS												2025-06-10 05:00:40.986802
ff5dd336-c4a0-4b8b-abae-6df18539d82a	Adobe Sign	Adobe Sign	IOPS Quality Assurance / Change Control;IOPS Quality Assurance / Deviation Management;IOPS Quality Assurance / Document Control															IOPS					Global			https://regeneron.service-now.com/now/nav/ui/classic/params/target/%2Fcmdb_ci_business_app.do%3Fsys_id%3D4ce4f173871535141db8ca2acebb3594%26sysparm_view%3Dbusiness_applications%26sysparm_record_target%3Dcmdb_ci_business_app%26sysparm_record_row%3D5%26sysparm_record_rows%3D6%26sysparm_record_list%3DnameSTARTSWITHadobe%5EORDERBYshort_description				2025-06-10 05:00:41.00486
3fc139f9-5a66-4d75-87d5-a6837e3ddce5	AdobeConnect	AdobeConnect	~Development Operations & Portfolio Management (DO & PM) / Shared Services / Training									adequate								DO&PM	Adobe				Global Development Training			appropriate	adequate	2025-06-10 05:00:41.026938
d807e363-5504-4105-b7a2-e816b78fa1bd	ADP	ADP	Payroll / Payroll Management									fullyAppropriate					green	G&A IT - Payroll, Time & Labor						Business Owned;G&A IT;SOX	Financial Services / Accounting	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_auto.do?sys_id=67d13717db92db44c9dadda5ca961982	https://regeneron.service-now.com/cmdb_ci_business_app.do?sys_id=00e4f173871535141db8ca2acebb3598	perfect	fullyAppropriate	2025-06-10 05:00:41.045828
dad669e7-b879-447e-8f40-76c68a0be9d1	Aetna	Aetna	Benefits Management	Aetna Aetna Application Hosting													green	G&A IT - Human Resources						Business Owned;G&A IT	Human Resources / Total Rewards	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_auto.do?sys_id=154fbc241b2bb410ba52baeedc4bcbc7	https://regeneron.service-now.com/cmdb_ci_business_app.do?sys_id=40e4f173871535141db8ca2acebb359a			2025-06-10 05:00:41.063744
cd3513e2-2c8b-4209-8eaf-d05ada28d21f	Aetna	Aetna	Benefits Management	Aetna Aetna SaaS Hosting													green	G&A IT - Human Resources						Business Owned;G&A IT	Human Resources / Total Rewards	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_auto.do?sys_id=154fbc241b2bb410ba52baeedc4bcbc7	https://regeneron.service-now.com/cmdb_ci_business_app.do?sys_id=40e4f173871535141db8ca2acebb359a			2025-06-10 05:00:41.081651
53033372-c576-4fce-88ae-6e995f84339f	Agency Question Tracker (AQT)	Agency Question Tracker (AQT)	IOPS Product Development / Regulatory Submission															IOPS							0717 - CMC Regulatory Sciences					2025-06-10 05:00:41.099548
ff7b6d59-bfc2-421c-9874-824568fe96a0	AGIS	AGIS	Accounting / Financial Accounting														green	G&A IT - Financial Services						G&A IT	Financial Services					2025-06-10 05:00:41.11743
7a9f86e4-a3b3-4700-8a70-71ca02c42711	AI Assisted Systematic Literature Review	AI Assisted Systematic Literature Review	~Global Medical Affairs (GMA) / Health Economics and Outcomes Research (HEOR)																	MA										2025-06-10 05:00:41.13527
c519ba2a-44be-4854-8d94-3e0a81a90d50	Alation	Alation	Foundational Capabilities	Okta SSO																DO&PM;RA										2025-06-10 05:00:41.153189
5f23d93e-1019-40b7-88a0-f5664416588c	ALR (Automated Literature Review)	ALR (Automated Literature Review)	~Development Operations & Portfolio Management (DO & PM) / Study Execution and Tracking / Study Execution	Amazon.com / AWS Amazon S3																DO&PM;MA					DO&PM					2025-06-10 05:00:41.171322
7fe5603f-f57c-4ef7-837d-0995f19b462b	ALR (Automated Literature Review)	ALR (Automated Literature Review)	~Development Operations & Portfolio Management (DO & PM) / Study Execution and Tracking / Study Execution	Okta SSO																DO&PM;MA					DO&PM					2025-06-10 05:00:41.189534
c6c066a1-9ba9-4c50-9aa0-1a2d41b13495	ALR (Automated Literature Review)	ALR (Automated Literature Review)	~Development Operations & Portfolio Management (DO & PM) / Study Execution and Tracking / Study Execution	RDS MySQL																DO&PM;MA					DO&PM					2025-06-10 05:00:41.207577
e7f99e9c-a373-49a0-95c1-da3499349436	AmberBox	AmberBox	Manage Corporate Security / Incident Management / Identify Incidents;Manage Corporate Security / Incident Management / Investigation Management;Manage Corporate Security / Incident Management / Monitor Incidents															Law												2025-06-10 05:00:41.22548
a7604f2d-15f6-4017-89ea-5e2152d21e5b	Ambient.ai	Ambient.ai	Manage Corporate Security / Incident Management / Identify Incidents;Manage Corporate Security / Incident Management / Investigation Management;Manage Corporate Security / Incident Management / Monitor Incidents															Law							Law / Legal Security					2025-06-10 05:00:41.24356
8b7eda92-28fe-4c96-bcb2-7210a8759501	American Dynamics CCTV System	American Dynamics CCTV System	Manage Corporate Security / Physical Security / Location Security									fullyAppropriate					green	Law							Law / Legal Security	30fbb1836fdb3a806ea3d4a21c3ee4e6		appropriate	fullyAppropriate	2025-06-10 05:00:41.261706
3d10ff44-9180-4368-82db-81b5aece4974	Anaconda	Anaconda																IOPS												2025-06-10 05:00:41.27989
cdf08eef-2c0c-425e-9f7a-feeb1a1e94fc	Anaqua Annuities	Anaqua Annuities	Protect Intellectual Property / Manage Intellectual Property / Branding;Protect Intellectual Property / Manage Intellectual Property / Copyright Management;Protect Intellectual Property / Manage Intellectual Property / Trademark Management;Protect Intellectual Property / Patent Management	Ping One SSO								fullyAppropriate					green	Law							Law / Patent Management	e11d2dc06f2bf6c06ea3d4a21c3ee45d		perfect	fullyAppropriate	2025-06-10 05:00:41.300279
54946903-1e37-4cd3-951a-461f3ff6092e	ANSYS-CPD	ANSYS-CPD																IOPS												2025-06-10 05:00:41.32048
2030ebd1-06ec-4997-a4bf-d4dafe6a1d29	ANSYS-PS	ANSYS-PS																IOPS												2025-06-10 05:00:41.33846
8cf1446b-0a9e-49a4-a92f-8c89b541131f	AON	AON	Benefits Management	AON AON Application Hosting								fullyAppropriate					green	IOPS						G&A IT	Human Resources / Total Rewards		https://regeneron.service-now.com/cmdb_ci_business_app.do?sys_id=d0e4f173871535141db8ca2acebb35a3	unreasonable	fullyAppropriate	2025-06-10 05:00:41.35735
a6ad0326-5cbf-4034-aa74-fc4944d610f5	AON	AON	Benefits Management	Ping One SSO								fullyAppropriate					green	IOPS						G&A IT	Human Resources / Total Rewards		https://regeneron.service-now.com/cmdb_ci_business_app.do?sys_id=d0e4f173871535141db8ca2acebb35a3	unreasonable	fullyAppropriate	2025-06-10 05:00:41.375187
bf413af1-4f33-42f4-be8e-b589d9644042	Apigee	Apigee																												2025-06-10 05:00:41.393244
8e79faf6-ab8c-4f8c-89cc-2cde1e96b2a5	App - Electronic User Account Request	App - Electronic User Account Request																IOPS												2025-06-10 05:00:41.409854
af5cc62e-6129-406e-8169-9ea4c68eaf07	ArborXR	ArborXR	IOPS Quality Assurance / Technical Training (Learning Management)															IOPS												2025-06-10 05:00:41.427742
80cf07fa-8421-43df-885f-4ed310cfbbaa	Argus	Argus	Collaborations & Touchpoints / GPS;~Global Patient Safety (GPS) / Case Evaluation and Reporting / Case Management / Global Safety Database;~Global Patient Safety (GPS) / Safety Planning, Compliance, Quality, and QPPV / GPS System Administration;~Global Patient Safety (GPS) / Safety Planning, Compliance, Quality, and QPPV / Quality and Compliance	Okta SSO								adequate								ECD;GPS;MA;Quality;RA	Oracle				Global Patient Safety;Medical Affairs;Quality;Regulatory			appropriate	adequate	2025-06-10 05:00:41.445676
b3e98263-43aa-4a89-adf7-109ceb350c1f	Argus	Argus	Collaborations & Touchpoints / GPS;~Global Patient Safety (GPS) / Case Evaluation and Reporting / Case Management / Global Safety Database;~Global Patient Safety (GPS) / Safety Planning, Compliance, Quality, and QPPV / GPS System Administration;~Global Patient Safety (GPS) / Safety Planning, Compliance, Quality, and QPPV / Quality and Compliance	Oracle Argus								adequate								ECD;GPS;MA;Quality;RA	Oracle				Global Patient Safety;Medical Affairs;Quality;Regulatory			appropriate	adequate	2025-06-10 05:00:41.46558
a00348d1-7d79-4c75-b0c8-75b458d4cd91	Aristotle 360	Aristotle 360	Manage Government & Industry Relationships / Manage Government Relations / Government Affairs															Law												2025-06-10 05:00:41.483907
e0214491-fc79-412f-81d2-105e4fb3139c	Aroma	Aroma	~Global Medical Affairs (GMA) / Health Economics and Outcomes Research (HEOR)	Okta SSO																MA					Medical Affairs;Strategic Planning					2025-06-10 05:00:41.502403
3cc2766d-43d2-4003-a555-7e204671d97d	Array Studio	Array Studio																												2025-06-10 05:00:41.520264
978b2e8c-be66-4b9e-baba-ccc340749cbc	Articulate	Articulate	IOPS Quality Assurance / Technical Training (Learning Management)	Articulate Global Articulate SaaS Hosting																										2025-06-10 05:00:41.536942
95fd7eda-8149-4a02-a532-71a63c105f00	ArtiosCAD Design	ArtiosCAD Design																IOPS												2025-06-10 05:00:41.555841
b419915d-be0a-484b-9eb4-9260acff5efb	ASAP (Antibody Sequence Analysis Program)	ASAP (Antibody Sequence Analysis Program)												R&pD Owned				R&pD IT												2025-06-10 05:00:41.573503
fc2f6bc0-eee0-4b80-bf10-f533d523b448	ASIST	ASIST	~Development Operations & Portfolio Management (DO & PM) / Study Execution and Tracking;~Development Operations & Portfolio Management (DO & PM) / Study Execution and Tracking / Clinical Drug Supply Management	TE Excursion Bot								adequate								DO&PM					Clinical Drug Supply and Logistics			appropriate	adequate	2025-06-10 05:00:41.591433
33d8b451-184b-4e7d-a3c3-1cf95ebfb297	Assay Provider Database (Excel)	Assay Provider Database (Excel)	~Early Clinical Development (ECD) / Precision Medicine / Assay Management / Assay Information Management									adequate								ECD					ECD			appropriate	adequate	2025-06-10 05:00:41.610894
d5bfca04-c807-464a-b8d4-5a2a5e73cf54	Asset Center	Asset Center	IOPS Product Development / Device Specification Management																											2025-06-10 05:00:41.628917
24b2f5fd-fc18-43e3-985f-0019eb67e2ba	ASTRA	ASTRA																IOPS												2025-06-10 05:00:41.646575
2271371a-8497-4e19-8782-812032829e89	ASTRA 8 PROD Raheen	ASTRA 8 PROD Raheen																IOPS												2025-06-10 05:00:41.667144
71d39fcd-1452-43a4-8213-ac6d847ab461	Atlassian Confluence	Atlassian Confluence	IOPS Enterprise Support / Collaboration	Atlassian Atlassian Confluence SaaS Hosting																										2025-06-10 05:00:41.686161
4232afef-331f-4ba1-a212-b5e64a1fca25	Audit Board	Audit Board	Consolidations and External Reporting / Corporate Governance	Ping One SSO													green	G&A IT - Audit						Business Owned;G&A IT	Financial Services / Internal Audit;Financial Services / Treasury	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_auto.do?sys_id=831e21b1db8190149be32ad94b9619ca	https://regeneron.service-now.com/cmdb_ci_business_app.do?sys_id=89e47573871535141db8ca2acebb359f			2025-06-10 05:00:41.703928
8060734a-9197-4240-bd91-c9bae1464765	Augmentir	Augmentir	IOPS Quality Assurance / Technical Training (Learning Management)															IOPS												2025-06-10 05:00:41.722223
ef575cd0-67bd-4d17-b738-3e13a2598c39	AutoDesk Vault (RHN)	AutoDesk Vault (RHN)	IOPS Plant Management / Drawing Management															IOPS					IE							2025-06-10 05:00:41.740114
ff0004b0-cec0-4e15-b544-af53dc050761	Automated Audit Workpapers and Tracking System (TeamMate)	Automated Audit Workpapers and Tracking System (TeamMate)	Consolidations and External Reporting / Corporate Governance									unreasonable					green	G&A IT - Audit						Business Owned;G&A IT	Financial Services / Internal Audit	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_auto.do?sys_id=f2e1b357db92db44c9dadda5ca9619b4	https://regeneron.service-now.com/cmdb_ci_business_app.do?sys_id=9553319f134d73c05a075ecf3244b04b	perfect	unreasonable	2025-06-10 05:00:41.757978
c52904c8-e39a-474e-ac55-52690ae75073	Automation Administration	Automation Administration																IOPS												2025-06-10 05:00:41.77588
3552f2fc-e181-4356-8104-9552feae64d8	Automation Jumpbox	Automation Jumpbox																IOPS												2025-06-10 05:00:41.794863
7eef8616-bcb9-4d81-bcad-a6362725b0f6	Automation_Processes Contols	Automation_Processes Contols																IOPS												2025-06-10 05:00:41.813111
53fa77dc-ef2f-4a39-b63f-f75835380153	Avature	Avature	Talent Acquisition / Recruiting	Avature Application Hosting								adequate					yellow	G&A IT - Human Resources						G&A IT	Human Resources / Talent Acquisition	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_auto.do?sys_id=46bea6b16f177e006ea3d4a21c3ee4ad		insufficient	adequate	2025-06-10 05:00:41.832551
84067836-7ba0-469b-a49c-8baffb2ad98b	Avature	Avature	Talent Acquisition / Recruiting	Okta SSO								adequate					yellow	G&A IT - Human Resources						G&A IT	Human Resources / Talent Acquisition	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_auto.do?sys_id=46bea6b16f177e006ea3d4a21c3ee4ad		insufficient	adequate	2025-06-10 05:00:41.850808
7ac665c7-6b60-4f35-bef7-6b97ca65f113	AVEVA PI Process Historian - PA16	AVEVA PI Process Historian - PA16																IOPS												2025-06-10 05:00:41.868587
1efdecb6-8c72-465c-9fa4-ae5e370d61c6	Axway	Axway	Foundational Capabilities / External Data Transfer;~Global Patient Safety (GPS) / Case Evaluation and Reporting / Case Management / Safety E2B Interchange	Axway B2Bi								adequate								GPS;Quality;RA	Axway				BDM;Enterprise;Regulatory			appropriate	adequate	2025-06-10 05:00:41.886242
a0cbdac8-829c-445f-9e6f-bfa54cf4e661	Axway	Axway	Foundational Capabilities / External Data Transfer;~Global Patient Safety (GPS) / Case Evaluation and Reporting / Case Management / Safety E2B Interchange	Okta SSO								adequate								GPS;Quality;RA	Axway				BDM;Enterprise;Regulatory			appropriate	adequate	2025-06-10 05:00:41.902846
4d31764f-ba8c-490e-92d0-aebc13ba9a19	Azenta FreezerPro Raheen	Azenta FreezerPro Raheen																IOPS					IE							2025-06-10 05:00:41.920324
2173b32a-ca67-4aed-b946-46326f1a5f64	B17 - Fill Finish Enviromental Monitoring	B17 - Fill Finish Enviromental Monitoring																IOPS												2025-06-10 05:00:41.936923
9efb04cd-ed1b-4ba3-ab12-296d8680a5b0	B17 - PACKAGING LINE 02 SYSTEM	B17 - PACKAGING LINE 02 SYSTEM																IOPS												2025-06-10 05:00:41.955529
c99b805f-1a49-44c7-b11b-e69524118ee1	Bank of America (CashPro)	Bank of America (CashPro)	Treasury Management / Accounts Payable and Expense Reimbursement / Process accounts payable (AP);Treasury Management / Internal Controls / Compliance Reporting;Treasury Management / Internal Controls / Establish internal controls, policies, and procedures;Treasury Management / Internal Controls / Operate controls and monitor compliance;Treasury Management / Planning and Management Accounting / Manage transactions;Treasury Management / Revenue Accounting / Process accounts receivable (AR);Treasury Management / Treasury Operations / Manage cash;Treasury Management / Treasury Operations / Manage financial fraud/dispute cases;Treasury Management / Treasury Operations / Manage in-house bank accounts;Treasury Management / Treasury Operations / Manage treasury policies and procedures;Treasury Management / Treasury Operations / Monitor and execute risk and hedging transactions														green	G&A IT - Financial Services						Business Owned;G&A IT	Financial Services / Treasury;Financial Services / Treasury / Treasury OPS	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_auto.do?sys_id=35f99e1487e06518ed31bbff8bbb3542	https://regeneron.service-now.com/cmdb_ci_business_app.do?sys_id=29e4b573871535141db8ca2acebb3585			2025-06-10 05:00:41.975296
db4f0d00-3339-4088-89d6-9448f51cdef9	Bank of Ireland	Bank of Ireland	Treasury Management														green	G&A IT - Financial Services						Business Owned;G&A IT	Financial Services / Treasury	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_auto.do?sys_id=af1c1a9087246518ed31bbff8bbb356e	https://regeneron.service-now.com/cmdb_ci_business_app.do?sys_id=29e4b573871535141db8ca2acebb3586			2025-06-10 05:00:41.993117
3698886d-431b-4ca0-a71e-529cd3afe9b9	BarTender Barcode and Label	BarTender Barcode and Label																IOPS												2025-06-10 05:00:42.009946
d519cb76-1e6f-48e5-99e2-4b8e462fc4c2	Beamery Talent CRM	Beamery Talent CRM	Talent Acquisition;Talent Acquisition / Recruiting	Beamery Beamery SaaS Hosting													white	G&A IT - Human Resources						G&A IT	Human Resources / Talent Acquisition	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_auto.do?sys_id=82fecdbe87e265546a4e0e98cebb35a0	https://regeneron.service-now.com/cmdb_ci_business_app.do?sys_id=61e4b573871535141db8ca2acebb358a			2025-06-10 05:00:42.027437
51ddbbcf-de76-40e8-a384-1c7b5564fec2	Beamery Talent CRM	Beamery Talent CRM	Talent Acquisition;Talent Acquisition / Recruiting	Beamery Chrome Extension													white	G&A IT - Human Resources						G&A IT	Human Resources / Talent Acquisition	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_auto.do?sys_id=82fecdbe87e265546a4e0e98cebb35a0	https://regeneron.service-now.com/cmdb_ci_business_app.do?sys_id=61e4b573871535141db8ca2acebb358a			2025-06-10 05:00:42.045468
dd103304-8055-4e2d-80ea-b49ae0991a42	Beamery Talent CRM	Beamery Talent CRM	Talent Acquisition;Talent Acquisition / Recruiting	Microsoft Bookings with Me													white	G&A IT - Human Resources						G&A IT	Human Resources / Talent Acquisition	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_auto.do?sys_id=82fecdbe87e265546a4e0e98cebb35a0	https://regeneron.service-now.com/cmdb_ci_business_app.do?sys_id=61e4b573871535141db8ca2acebb358a			2025-06-10 05:00:42.063475
9ed2fb4d-161e-4440-bf87-37e7615d18fb	Beamery Talent CRM	Beamery Talent CRM	Talent Acquisition;Talent Acquisition / Recruiting	Okta SSO													white	G&A IT - Human Resources						G&A IT	Human Resources / Talent Acquisition	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_auto.do?sys_id=82fecdbe87e265546a4e0e98cebb35a0	https://regeneron.service-now.com/cmdb_ci_business_app.do?sys_id=61e4b573871535141db8ca2acebb358a			2025-06-10 05:00:42.081577
da26848e-21db-4d4f-bbb7-440a3c9c1879	Beamery Talent CRM	Beamery Talent CRM	Talent Acquisition;Talent Acquisition / Recruiting	Sender Authentication													white	G&A IT - Human Resources						G&A IT	Human Resources / Talent Acquisition	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_auto.do?sys_id=82fecdbe87e265546a4e0e98cebb35a0	https://regeneron.service-now.com/cmdb_ci_business_app.do?sys_id=61e4b573871535141db8ca2acebb358a			2025-06-10 05:00:42.099791
e7233657-1090-4441-812c-c49043ef6071	Beeline	Beeline	Core HR / Contingent Worker;Core HR / Workforce Deployment;Foundational Capabilities / Resource Management;HR Operations Management	Beeline Application Hosting								fullyAppropriate					green	G&A IT - Human Resources		DO&PM				G&A IT	Human Resources / NEMO	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_auto.do?sys_id=fee1b357db92db44c9dadda5ca9619f4	https://regeneron.service-now.com/cmdb_ci_business_app.do?sys_id=e1e4b573871535141db8ca2acebb358b	appropriate	fullyAppropriate	2025-06-10 05:00:42.117451
ad994ff0-7666-4484-aeda-ad47318a89a3	Beeline	Beeline	Core HR / Contingent Worker;Core HR / Workforce Deployment;Foundational Capabilities / Resource Management;HR Operations Management	Beeline Beeline SaaS Hosting								fullyAppropriate					green	G&A IT - Human Resources		DO&PM				G&A IT	Human Resources / NEMO	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_auto.do?sys_id=fee1b357db92db44c9dadda5ca9619f4	https://regeneron.service-now.com/cmdb_ci_business_app.do?sys_id=e1e4b573871535141db8ca2acebb358b	appropriate	fullyAppropriate	2025-06-10 05:00:42.138729
f3c3588e-c630-4619-a60f-2d11b8ef67bd	Beeline	Beeline	Core HR / Contingent Worker;Core HR / Workforce Deployment;Foundational Capabilities / Resource Management;HR Operations Management	Ping One SSO								fullyAppropriate					green	G&A IT - Human Resources		DO&PM				G&A IT	Human Resources / NEMO	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_auto.do?sys_id=fee1b357db92db44c9dadda5ca9619f4	https://regeneron.service-now.com/cmdb_ci_business_app.do?sys_id=e1e4b573871535141db8ca2acebb358b	appropriate	fullyAppropriate	2025-06-10 05:00:42.156689
b5c8e0cf-34c0-4c84-aabe-eaf7715a1b6f	Benchling - Research	Benchling - Research	IOPS Product Development / Technical Transfer									adequate		R&pD Owned				R&pD IT						R&pD IT	0193 - Viral Vector Technologies;0330 - Protein Expression Sciences;0340 - Therapeutic Antibodies;1212 - Preclin Mfg & Proc Dev				adequate	2025-06-10 05:00:42.174464
6a38f621-4843-4463-93c9-dfca9de8ed6a	BenefitSolver	BenefitSolver	Benefits Management	BenefitSolver Application Hosting								fullyAppropriate					green	G&A IT - Human Resources						Business Owned;G&A IT	Human Resources / Total Rewards	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_auto.do?sys_id=a2a999b71bd6b3402f3da8e82d4bcb51	https://regeneron.service-now.com/cmdb_ci_business_app.do?sys_id=61e4b573871535141db8ca2acebb358c	perfect	fullyAppropriate	2025-06-10 05:00:42.192553
11302d59-a8c1-4f4d-a2dc-afbd97184cb4	BenefitSolver	BenefitSolver	Benefits Management	Okta SSO								fullyAppropriate					green	G&A IT - Human Resources						Business Owned;G&A IT	Human Resources / Total Rewards	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_auto.do?sys_id=a2a999b71bd6b3402f3da8e82d4bcb51	https://regeneron.service-now.com/cmdb_ci_business_app.do?sys_id=61e4b573871535141db8ca2acebb358c	perfect	fullyAppropriate	2025-06-10 05:00:42.210165
f09b2632-b72e-47c0-ad13-7b44e9081a8a	Benevity ESR	Benevity ESR	~Global Medical Affairs (GMA) / Operations & Execution / Externally Sponsored Research	ESR Excel								adequate								MA					ESR			appropriate	adequate	2025-06-10 05:00:42.229452
03c2ae3e-89a0-4062-90de-a272ee04c0d9	Benevity ESR	Benevity ESR	~Global Medical Affairs (GMA) / Operations & Execution / Externally Sponsored Research	ESR SP								adequate								MA					ESR			appropriate	adequate	2025-06-10 05:00:42.247217
38dc2a99-c0a3-4089-a6fe-73dcefc867c0	Benevity ESR	Benevity ESR	~Global Medical Affairs (GMA) / Operations & Execution / Externally Sponsored Research	Okta SSO								adequate								MA					ESR			appropriate	adequate	2025-06-10 05:00:42.265656
87db1a04-875e-4d82-9d4d-87264ca5cdb1	BetterComp	BetterComp	Compensation Management															G&A IT - Human Resources						Business Owned;G&A IT	Human Resources / Compensation		https://regeneron.service-now.com/now/nav/ui/classic/params/target/cmdb_ci_business_app.do%3Fsys_id%3D4c10a30e2bc5a290f2a6fa45fe91bfaf			2025-06-10 05:00:42.284398
e27e68f6-2002-4b69-9194-a13dcadd7ec1	Beyond Trust PRA	Beyond Trust PRA																IOPS												2025-06-10 05:00:42.302821
4b812f72-b40f-4200-a6b8-5961de091336	BioRegistry	BioRegistry												R&pD Owned				R&pD IT						R&pD IT	0284 - Research Program Management;0330 - Protein Expression Sciences;0340 - Therapeutic Antibodies					2025-06-10 05:00:42.320579
57e9bb40-ccb4-46cb-aad7-7d487487123c	BioRender	BioRender		BioRender BioRender SaaS Hosting										R&pD Owned				R&pD IT												2025-06-10 05:00:42.339274
2f7942a6-9454-45bf-a3f2-4b0d5c93ca81	Biovia One Lab ELN - GxP	Biovia One Lab ELN - GxP																IOPS												2025-06-10 05:00:42.358879
8d26f4c5-1b68-41c6-ba12-b9590ac4f69e	Biovia OneLab ELN	Biovia OneLab ELN																												2025-06-10 05:00:42.376843
58fece8d-90f5-471d-af24-9ddee98073e4	BLAST (NCBI tool)	BLAST (NCBI tool)												R&pD Owned				R&pD IT												2025-06-10 05:00:42.396964
9f17e2b2-a35a-44d2-ab91-1050f1ea2266	BlauLabs Geo Track and Trace	BlauLabs Geo Track and Trace																IOPS												2025-06-10 05:00:42.414739
1a9107b0-2205-4de0-9aa4-fbaf6b30abac	Bloomberg	Bloomberg	Treasury Management / Fixed-Asset Project Accounting / Perform capital planning and project approval;Treasury Management / General Accounting and Reporting / Financial reporting;Treasury Management / Planning and Management Accounting / Manage financial performance;Treasury Management / Revenue Accounting / Process customer credit;Treasury Management / Treasury Operations / Manage cash;Treasury Management / Treasury Operations / Manage debt and investment;Treasury Management / Treasury Operations / Manage treasury policies and procedures														green	G&A IT - Financial Services						Business Owned;G&A IT	Financial Services / Treasury;Financial Services / Treasury / OPS Liquidity	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_auto.do?sys_id=d64ad29487e06518ed31bbff8bbb3543	https://regeneron.service-now.com/cmdb_ci_business_app.do?sys_id=7b504e52db7ca0103c9ec245059619bb			2025-06-10 05:00:42.43238
409d7d1b-f98a-4575-a45e-387597cff246	Blue Mountain Regulatory Asset Manager (BMRAM)	Blue Mountain Regulatory Asset Manager (BMRAM)	IOPS Enterprise Support / Application Management;IOPS Enterprise Support / Infrastructure Management;IOPS Plant Management / Asset Accounting;IOPS Plant Management / Asset Management;IOPS Plant Management / Asset Performance;IOPS Plant Management / Calibration Management;IOPS Plant Management / Enterprise Recipe Mgmt;IOPS Plant Management / Plant Maintenance;IOPS Plant Management / Preventive Maintenance Scheduling;IOPS Plant Management / Work Order Management															IOPS					Global							2025-06-10 05:00:42.450825
31a9eaa4-b0f6-401d-9f27-4fdc973f4000	Bluebeam	Bluebeam	Real Estate & Facilities Management / Engineering, Design and Construction Management / Engineering & Architecture														green	Real Estate & Facilities Mgmt							Real Estate & Facilities Mgmt	928d6fe6dbb024103c9ec24505961966				2025-06-10 05:00:42.468638
d1e7b2ee-9b21-4ed4-986a-fa42e5e9bf55	ALR (Automated Literature Review)	ALR (Automated Literature Review)	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:33.392155
fdd85b17-435f-4c1f-82bd-71b28dea6942	Blueprint PWA	Blueprint PWA	~Development Operations & Portfolio Management (DO & PM) / Drug Development Project and Portfolio Management / Program and Project Management (Drug Development)	Power Apps																DO&PM	Microsoft				Global Development					2025-06-10 05:00:42.486418
61b1ae5f-72d6-457c-8166-824c68de9605	Bluesheet Budget	Bluesheet Budget	Collaborations & Touchpoints / Finance									adequate								DO&PM					Global Development			appropriate	adequate	2025-06-10 05:00:42.505956
73360acf-845b-43f7-9e77-fd31bbdc2704	Body Techniques	Body Techniques	Benefits Management / Wellness															G&A IT - Human Resources						G&A IT	Human Resources / Total Rewards		https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_business_app.do?sys_id=e5e4b573871535141db8ca2acebb35cb			2025-06-10 05:00:42.523554
fb9939df-0066-4388-bc8c-39e7fe19da46	Boomi	Boomi	Foundational Capabilities;Integration	Amazon.com / AWS EC2													yellow			Quality		Merged data			G&A IT;Quality	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_discovered.do?sys_id=dcf4d616db9d30509efa8a1848961968				2025-06-10 05:00:42.541188
b35da755-8ffe-41be-9e57-1b163ea038d8	Boomi	Boomi	Foundational Capabilities;Integration	Okta SSO													yellow			Quality		Merged data			G&A IT;Quality	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_discovered.do?sys_id=dcf4d616db9d30509efa8a1848961968				2025-06-10 05:00:42.559167
223a6dfc-03e9-439f-8a11-83a651d201f5	BrassRing	BrassRing	Talent Acquisition / Recruiting														white	G&A IT - Human Resources						G&A IT	Human Resources / People Analytics and Reporting;Human Resources / Talent Acquisition	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_auto.do?sys_id=84d4169cf93bcd4481258999c9c26da5	https://regeneron.service-now.com/cmdb_ci_business_app.do?sys_id=31e4b573871535141db8ca2acebb35d0			2025-06-10 05:00:42.576802
9f5ac58d-4d22-4645-ae99-c225352c9b5c	Bright Horizons	Bright Horizons	Benefits Management	Bright Horizon Bright Horizon Application Hosting													green	G&A IT - Human Resources						Business Owned;G&A IT	Human Resources / Total Rewards	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_auto.do?sys_id=d30e65371ba1245046a7da4cbc4bcb45	https://regeneron.service-now.com/cmdb_ci_business_app.do?sys_id=39e4b573871535141db8ca2acebb35d1			2025-06-10 05:00:42.595985
cd844696-a82f-4331-b778-16f53982882c	Broadbean	Broadbean	Talent Acquisition / Recruiting	CareerBuilder CareerBuilder Application Hosting													green	G&A IT - Human Resources						G&A IT	Human Resources / Talent Acquisition	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_discovered.do?sys_id=3fd13b17db92db44c9dadda5ca96198b				2025-06-10 05:00:42.613748
2039ebe3-8c02-45fa-82ae-ed2eddb6808d	Broadspire	Broadspire	Core HR / HR Absence Management	Broadspire Broadspire Application Hosting													green	G&A IT - Human Resources						Business Owned;G&A IT	Human Resources / HR Operations	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_auto.do?sys_id=967561731b61245046a7da4cbc4bcbf3	https://regeneron.service-now.com/cmdb_ci_business_app.do?sys_id=35e4b573871535141db8ca2acebb35d2			2025-06-10 05:00:42.631125
3589fbd6-96dc-470b-a3ad-e5b01281db81	Brooks Expert Support Tool (Best)	Brooks Expert Support Tool (Best)	IOPS Plant Management / Plant Maintenance															IOPS												2025-06-10 05:00:42.648889
13348825-7c7b-452a-98f1-86e0415a2c9b	BSI LIMS	BSI LIMS	Collaborations & Touchpoints / Research									adequate								ECD								appropriate	adequate	2025-06-10 05:00:42.665908
4afdd3ec-e8a3-4489-a7fd-1e4c59c785d7	Building Automation System JCI Metasys	Building Automation System JCI Metasys	IOPS Plant Management / Building Automation;Real Estate & Facilities Management / Facilities Operations and Maintenance / Heating and Cooling, Power, Lighting, Elevators, Plumbing									adequate					green	Real Estate & Facilities Mgmt							Real Estate & Facilities Mgmt	3ae1b357db92db44c9dadda5ca9619e2		perfect	adequate	2025-06-10 05:00:42.684609
008277f0-9c3b-4840-a720-c4771e01115e	Bulk Chemical Distribution System→FUT	Bulk Chemical Distribution System→FUT																IOPS												2025-06-10 05:00:42.702415
a2a8abb6-57f4-4553-85e6-1389a84790cd	C Technologies SoloVPE	C Technologies SoloVPE	IOPS Quality Control															IOPS												2025-06-10 05:00:42.720849
eb9e0077-8e24-4179-b484-2697845a5e71	C Technologies SoloVPE - Manufacturing	C Technologies SoloVPE - Manufacturing																IOPS												2025-06-10 05:00:42.738117
d84450a9-fc1b-4095-998e-3b218146500f	Calyx IRT/RTSM	Calyx IRT/RTSM	~Biostatistics and Data Management (BDM) / Data Management / Clinical Data Acquisition;~Development Operations & Portfolio Management (DO & PM) / Study Execution and Tracking;~Development Operations & Portfolio Management (DO & PM) / Study Execution and Tracking / Clinical Drug Supply Management	PPD/IRT/ERT Report Integration to Data Lake Bot								adequate								BDM;DO&PM	Calyx				Clinical Drug Supply and Logistics			appropriate	adequate	2025-06-10 05:00:42.756138
151809df-c61e-4e8e-91c3-dc532fd567f3	Candex Agency Portal	Candex Agency Portal	Talent Acquisition / Recruiting	Candex Application Hosting													yellow	G&A IT - Human Resources						Business Owned;G&A IT	Human Resources / Talent Acquisition	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_auto.do?sys_id=5a17e5771b61245046a7da4cbc4bcb02	https://regeneron.service-now.com/cmdb_ci_business_app.do?sys_id=79e4b573871535141db8ca2acebb35d6			2025-06-10 05:00:42.77284
737fc0b8-8b08-4081-8d8a-8a033db9a50a	Cantor Fitzgerald	Cantor Fitzgerald	Compensation Management														green	G&A IT - Human Resources						Business Owned;G&A IT	Human Resources / Total Rewards	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_auto.do?sys_id=ded749cedbb6a590c10db8f3f39619bf	https://regeneron.service-now.com/cmdb_ci_business_app.do?sys_id=f5e4b573871535141db8ca2acebb35d7			2025-06-10 05:00:42.790761
bf716c98-08cc-45af-a545-430d7779be3f	Captivate	Captivate	Talent Development / Learning Management	Adobe Captivate													green	G&A IT - Human Resources						Business Owned;G&A IT	Human Resources / Talent Development	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_appl.do?sys_id=8eb7ed7f1b6acc108ef243b4bd4bcb74				2025-06-10 05:00:42.808575
77ef434e-4e63-41bd-83ca-d093b48a6fb7	CCure	CCure	Manage Corporate Security / Physical Security / Location Security									fullyAppropriate					green	Law							Law / Legal Security	423f3d4b6f1f3a806ea3d4a21c3ee479		perfect	fullyAppropriate	2025-06-10 05:00:42.826716
8370bae1-b2fe-4374-b7e2-c755695703c0	CCURE 9000 Security Management System	CCURE 9000 Security Management System																IOPS												2025-06-10 05:00:42.844607
ac5a0c6a-7efb-4570-83e6-4d7680f6283f	CDER Direct	CDER Direct	~Regulatory / Health authority content									adequate								RA					Regulatory			appropriate	adequate	2025-06-10 05:00:42.862886
61211f20-83a6-434a-913f-74fe8e78e401	CDER NextGen	CDER NextGen	~Regulatory / Health authority content									adequate								RA					Regulatory			appropriate	adequate	2025-06-10 05:00:42.880713
40f47fa7-9691-4271-bf06-dc3d2629112d	CDPHP	CDPHP	Benefits Management	CDPHP CDPHP Application Hosting													green	G&A IT - Human Resources						Business Owned;G&A IT	Human Resources / Total Rewards	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_auto.do?sys_id=1dd18b101323b204be0b58222244b041	https://regeneron.service-now.com/cmdb_ci_business_app.do?sys_id=b5e4b573871535141db8ca2acebb35dd			2025-06-10 05:00:42.898482
980698a7-32e8-484e-8eb2-4390fe6c049b	CEC Portal	CEC Portal	IOPS Plant Management / Environmental Health and Safety (EHS)															IOPS												2025-06-10 05:00:42.916293
997fde10-90eb-4da3-949d-967bda186dd8	Cellario	Cellario	IOPS Quality Control															IOPS												2025-06-10 05:00:42.934299
7538ba74-318a-4111-8876-4e60e5b6033f	Centralized Sample Tracking	Centralized Sample Tracking	~Early Clinical Development (ECD) / Precision Medicine / Sample Management and Reconciliation																	ECD					ECD;Enterprise					2025-06-10 05:00:42.952829
bbd31c6a-f354-4770-937a-49537ade9960	CES Information Management tool	CES Information Management tool	~Development Operations & Portfolio Management (DO & PM) / Drug Development Project and Portfolio Management / Program and Project Management (Drug Development)																	DO&PM					Program Portfolio Operations					2025-06-10 05:00:42.972987
db57a143-3312-43d9-b6c3-d8896d2534b2	CETOL 6σ Tolerance Analysis Software	CETOL 6σ Tolerance Analysis Software																IOPS												2025-06-10 05:00:42.991998
082a1d36-014c-4e93-848f-e071a6989991	Charles River Axcess Database - RAH	Charles River Axcess Database - RAH	IOPS Quality Control															IOPS					IE							2025-06-10 05:00:43.010763
308d0c9e-e923-4aae-89bd-5b1335a1a1f0	Chemical Manager- RAH	Chemical Manager- RAH	IOPS Plant Management / Environmental Health and Safety (EHS)															IOPS					IE							2025-06-10 05:00:43.028607
2a9a9aa0-78dc-4c1c-b0a6-b070d01ca863	Chromeleon	Chromeleon	IOPS Quality Control															IOPS												2025-06-10 05:00:43.046497
2a9f4268-2f4c-4d5c-a068-c54c5d948912	Cigna	Cigna	Benefits Management	Cigna Cigna Application Hosting													green	G&A IT - Human Resources						Business Owned;G&A IT	Human Resources / Total Rewards	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_auto.do?sys_id=af0e65371ba1245046a7da4cbc4bcbd3	https://regeneron.service-now.com/cmdb_ci_business_app.do?sys_id=06e4f573871535141db8ca2acebb350d			2025-06-10 05:00:43.064804
aab30279-5372-42ee-b570-943ee49c84b9	Cintas Gemini Gowning Vending Machine (TL)	Cintas Gemini Gowning Vending Machine (TL)																IOPS					US							2025-06-10 05:00:43.082675
693d571e-8497-455f-bb4b-7909b56bbf7d	Clario ERT	Clario ERT	~Biostatistics and Data Management (BDM) / Data Management / Clinical Data Acquisition	PPD/IRT/ERT Report Integration to Data Lake Bot								adequate								BDM	Clario				BDM, DO&PM			appropriate	adequate	2025-06-10 05:00:43.100442
52020a2e-532d-4aab-9cfa-fff2f69c04a7	Claroty Process Area Monitoring	Claroty Process Area Monitoring	IOPS Enterprise Support / IT Security															IOPS												2025-06-10 05:00:43.118595
a88d0aea-415d-4d98-9647-f63e4ed0e2e3	Clearsight	Clearsight	Treasury Management / Treasury Operations / Manage cash														green	G&A IT - Financial Services						Business Owned;G&A IT	Financial Services / Treasury	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_auto.do?sys_id=8a88c36797c29910b88fbf2e6253afaa	https://regeneron.service-now.com/cmdb_ci_business_app.do?sys_id=58f14296db7ca0103c9ec24505961970			2025-06-10 05:00:43.136346
f0878c9d-11c5-4794-83c1-f194658c85d1	ClearTrial	ClearTrial	Collaborations & Touchpoints / Finance									adequate								DO&PM;MA	Oracle				Finance (GDS)			appropriate	adequate	2025-06-10 05:00:43.152793
529d2cfa-171d-4f43-897b-84d29f6554d9	Clearwater - Treasury Partners	Clearwater - Treasury Partners	Treasury Management / General Accounting and Reporting / Financial reporting;Treasury Management / General Accounting and Reporting / Manage policies and procedures;Treasury Management / Internal Controls / Compliance Reporting;Treasury Management / Internal Controls / Establish internal controls, policies, and procedures;Treasury Management / Internal Controls / Operate controls and monitor compliance;Treasury Management / Planning and Management Accounting / Manage financial performance;Treasury Management / Treasury Operations / Manage cash;Treasury Management / Treasury Operations / Manage debt and investment;Treasury Management / Treasury Operations / Manage treasury policies and procedures														green	G&A IT - Financial Services						Business Owned;G&A IT;SOX	Financial Services / Treasury;Financial Services / Treasury / OPS Liquidity	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_discovered.do?sys_id=4fe1f357db92db44c9dadda5ca961945				2025-06-10 05:00:43.17059
b997e92c-ab88-42f2-ad3a-ff13fcc8be0d	Clinical Operational Repository (ODR)	Clinical Operational Repository (ODR)	Foundational Capabilities / Reporting and Analytics	Clinical ODR Performance Tracking Bot								adequate								DO&PM	Saama				Clinical Trial Management;Enterprise;Global Development;Regulatory			appropriate	adequate	2025-06-10 05:00:43.193972
f5b528b1-2945-4e83-9167-5b73d3cda739	Clinical Trial Tracker/Phoenix Tracker	Clinical Trial Tracker/Phoenix Tracker	Collaborations & Touchpoints / Regulatory (GDS);~Regulatory / Submission development									adequate								RA					Clinical Trial Management;Regulatory			appropriate	adequate	2025-06-10 05:00:43.21254
8dbc2714-e2a2-4ce6-95a8-281182e4a9fc	Clinical Trials Site - Corporate	Clinical Trials Site - Corporate	~Global Medical Affairs (GMA) / Operations & Execution / Externally Sponsored Research / Research Collaboration Management	Alphabet / Google Analytics SaaS Hosting																MA										2025-06-10 05:00:43.231233
91db3f26-6c09-4e9f-b7af-ae59852129fa	Clinical Trials Site - Corporate	Clinical Trials Site - Corporate	~Global Medical Affairs (GMA) / Operations & Execution / Externally Sponsored Research / Research Collaboration Management	OneTrust OneTrust																MA										2025-06-10 05:00:43.249119
0b7da6af-cff1-4a5f-9c3a-41b6f661f8c4	Clinical Trials Site - Corporate	Clinical Trials Site - Corporate	~Global Medical Affairs (GMA) / Operations & Execution / Externally Sponsored Research / Research Collaboration Management	Salesforce																MA										2025-06-10 05:00:43.267404
385a92f2-19fd-4036-903c-2b2df16870db	Clinical Trials Site - Libtayo	Clinical Trials Site - Libtayo	~Global Medical Affairs (GMA) / Operations & Execution / Externally Sponsored Research / Research Collaboration Management																	MA	Bioscript									2025-06-10 05:00:43.28514
b9ea815d-9163-425e-a5f1-a41277047c9d	ClinPhone	ClinPhone	~Development Operations & Portfolio Management (DO & PM) / Study Execution and Tracking;~Development Operations & Portfolio Management (DO & PM) / Study Execution and Tracking / Clinical Drug Supply Management									adequate								DO&PM	Parexel Informatics				Clinical Drug Supply and Logistics			appropriate	adequate	2025-06-10 05:00:43.302908
834db76e-6e4e-44af-8505-e75fd45addd5	Cloudera Data Platform - IOPS	Cloudera Data Platform - IOPS																IOPS												2025-06-10 05:00:43.320596
1c0e3691-f44f-4c92-a1fa-8aa8847dbc18	CloudIQ	CloudIQ	IOPS Enterprise Support / Infrastructure Management															IOPS												2025-06-10 05:00:43.338408
e14b129b-1e17-4427-b503-261da10856a4	CluePoints RBQM	CluePoints RBQM	~Development Operations & Portfolio Management (DO & PM) / Shared Services / Central Monitoring;~Development Operations & Portfolio Management (DO & PM) / Study Execution and Tracking									adequate								DO&PM	CluePoints S.A.				Central Monitoring			appropriate	adequate	2025-06-10 05:00:43.356577
c4fd379e-1a3a-47ad-a6b7-810c55fa8526	Commercial MDM	Commercial MDM	~Global Medical Affairs (GMA) / HCP engagement management																	MA										2025-06-10 05:00:43.377532
76cc54d9-3999-42ef-aade-70fc70967302	Compa Offers	Compa Offers	Compensation Management	Okta SSO														G&A IT - Human Resources						G&A IT	Human Resources / Compensation	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_auto.do?sys_id=f00c8e381b409214993dfd15cc4bcbfa	https://regeneron.service-now.com/cmdb_ci_business_app.do?sys_id=40a07530474c1294a6c9f4d7536d4333			2025-06-10 05:00:43.395472
e3e5a5fb-dba7-4234-8707-40fe3b3ff6e1	Compass	Compass	Collaborations & Touchpoints / DO&PM;IOPS Enterprise Support / Collaboration;IOPS Enterprise Support / Portfolio Mgmt;IOPS Supply Chain Management / Product Lifecycle Management;~Development Operations & Portfolio Management (DO & PM) / Drug Development Project and Portfolio Management;~Development Operations & Portfolio Management (DO & PM) / Drug Development Project and Portfolio Management / Program and Project Management (Drug Development)									adequate								DO&PM;ECD;MA;Quality;RA	CluePoints S.A.				Clinical Trial Management DO&PM;Clinical Trial Management,DO&PM Global Medical Affairs;ECD;Regulatory			appropriate	adequate	2025-06-10 05:00:43.413424
5bec0a15-7fd7-4d87-9808-ce965c63ea2c	ALR (Automated Literature Review)	ALR (Automated Literature Review)	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:33.37417
0ec0609c-cb87-489f-bc66-6e3f4c065e20	ComplianceBuilder	ComplianceBuilder																IOPS												2025-06-10 05:00:43.432158
2ca1d898-fd5d-4fa7-8051-a843682d28cf	ComplianceWire - RegnU - IOPS	ComplianceWire - RegnU - IOPS																IOPS												2025-06-10 05:00:43.450312
12606666-89c8-4ae6-a5ab-503fb9fc05d4	Concur	Concur	Accounting / Travel & Expense Management;Foundational Capabilities / Resource Management	Okta SSO								fullyAppropriate					green	G&A IT - Financial Services		MA		Merged data		Business Owned;G&A IT;SOX	Financial Services / Global Procurement	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_auto.do?sys_id=fda8e3e1d1ed148060ec8c96e6adbc40	https://regeneron.service-now.com/cmdb_ci_business_app.do?sys_id=6ee43973871535141db8ca2acebb3515	perfect	fullyAppropriate	2025-06-10 05:00:43.468036
5ce5c673-8df7-4c59-b704-305f9eeef691	Congress Planning Dashboard	Congress Planning Dashboard	~Global Medical Affairs (GMA) / Strategic Planning									adequate								MA					Medical Affairs (MA TAs, Med Ops, Publications, MA PM, Med Ed, HEOR, FMT);Strategic Planning			appropriate	adequate	2025-06-10 05:00:43.486793
26dd733b-f855-4296-8778-ee6b74e4e09d	Controlant	Controlant	IOPS Supply Chain Management / Cold Chain Tracking															IOPS												2025-06-10 05:00:43.505931
2048270e-3c33-4377-b6bc-d7cf538c5fa4	ConvergeHealth SRP	ConvergeHealth SRP	~Global Patient Safety (GPS) / Case Evaluation and Reporting / PV Planning;~Global Patient Safety (GPS) / Case Evaluation and Reporting / Safety Reporting;~Global Patient Safety (GPS) / Pharmacoepidemiology;~Global Patient Safety (GPS) / Safety Planning, Compliance, Quality, and QPPV / GPS System Administration;~Global Patient Safety (GPS) / Safety Planning, Compliance, Quality, and QPPV / Quality and Compliance;~Global Patient Safety (GPS) / Surveillance: Signal & Risk Management	ConvergeHealth Safety ETL								adequate								GPS								appropriate	adequate	2025-06-10 05:00:43.523621
aa91660a-568a-4a09-8ab7-38d87ca93195	ConvergeHealth SRP	ConvergeHealth SRP	~Global Patient Safety (GPS) / Case Evaluation and Reporting / PV Planning;~Global Patient Safety (GPS) / Case Evaluation and Reporting / Safety Reporting;~Global Patient Safety (GPS) / Pharmacoepidemiology;~Global Patient Safety (GPS) / Safety Planning, Compliance, Quality, and QPPV / GPS System Administration;~Global Patient Safety (GPS) / Safety Planning, Compliance, Quality, and QPPV / Quality and Compliance;~Global Patient Safety (GPS) / Surveillance: Signal & Risk Management	ConvergeHealth Safety Report Distribution								adequate								GPS								appropriate	adequate	2025-06-10 05:00:43.543904
2cd8e955-49fd-4a73-83eb-7672f1492037	ConvergeHealth SRP	ConvergeHealth SRP	~Global Patient Safety (GPS) / Case Evaluation and Reporting / PV Planning;~Global Patient Safety (GPS) / Case Evaluation and Reporting / Safety Reporting;~Global Patient Safety (GPS) / Pharmacoepidemiology;~Global Patient Safety (GPS) / Safety Planning, Compliance, Quality, and QPPV / GPS System Administration;~Global Patient Safety (GPS) / Safety Planning, Compliance, Quality, and QPPV / Quality and Compliance;~Global Patient Safety (GPS) / Surveillance: Signal & Risk Management	ElevateSafety								adequate								GPS								appropriate	adequate	2025-06-10 05:00:43.562273
8a4972d8-3a6f-4c11-8d37-bdedde9a881a	ConvergeHealth SRP	ConvergeHealth SRP	~Global Patient Safety (GPS) / Case Evaluation and Reporting / PV Planning;~Global Patient Safety (GPS) / Case Evaluation and Reporting / Safety Reporting;~Global Patient Safety (GPS) / Pharmacoepidemiology;~Global Patient Safety (GPS) / Safety Planning, Compliance, Quality, and QPPV / GPS System Administration;~Global Patient Safety (GPS) / Safety Planning, Compliance, Quality, and QPPV / Quality and Compliance;~Global Patient Safety (GPS) / Surveillance: Signal & Risk Management	Okta SSO								adequate								GPS								appropriate	adequate	2025-06-10 05:00:43.581021
4a6fab90-3690-4fa9-b3b2-c8073e83ab4c	Core Country Committee	Core Country Committee	Collaborations & Touchpoints / DO&PM;~Development Operations & Portfolio Management (DO & PM) / Study Execution and Tracking;~Development Operations & Portfolio Management (DO & PM) / Study Execution and Tracking / Study Startup									adequate								DO&PM;RA					Global Trial Optimization			appropriate	adequate	2025-06-10 05:00:43.598912
8c03e7c0-7b72-4c38-bcf4-c5d98f83cc4b	CORE LIMS	CORE LIMS												R&pD Owned				R&pD IT						R&pD IT						2025-06-10 05:00:43.616204
8ae3edce-5915-4cf9-aa68-38ef2fad5439	CoreHR - CorePay Raheen - IOPS	CoreHR - CorePay Raheen - IOPS																IOPS												2025-06-10 05:00:43.634759
4643e41e-c84d-4a33-b542-91e5104474f0	CorePay	CorePay	IOPS Enterprise Support / OTL Reporting;Payroll / Payroll Management	Ping One SSO								fullyAppropriate					green	G&A IT - Payroll, Time & Labor						G&A IT	Financial Services / Accounting;Financial Services / Payroll	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_discovered.do?sys_id=7f0e2260db687bc07dfc8c9239961994	https://regeneron.service-now.com/cmdb_ci_business_app.do?sys_id=f2e47973871535141db8ca2acebb3507	perfect	fullyAppropriate	2025-06-10 05:00:43.652634
8c1c6c8c-d237-4042-8557-a0da8965ec0f	Cority Ergonomics	Cority Ergonomics																IOPS												2025-06-10 05:00:43.67068
d124c35c-a2fa-4015-9613-8df1493b8b98	Costar	Costar	Accounting / Lease Management	Ping One SSO								fullyAppropriate					green	G&A IT - Financial Services						Business Owned;G&A IT;SOX	Financial Services / Accounting	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_auto.do?sys_id=4dea71d5db1fa7c0b061cae3b9961978	https://regeneron.service-now.com/cmdb_ci_business_app.do?sys_id=76e47973871535141db8ca2acebb3509	perfect	fullyAppropriate	2025-06-10 05:00:43.689292
d9e0219f-36b3-4229-b785-1ee9a0dc52fd	Cotoha Translation Service	Cotoha Translation Service	Foundational Capabilities / Translation Service																	RA	NTT Communications				Commercial;Medical Affairs;Quality;Regulatory					2025-06-10 05:00:43.70798
f70a843a-d24a-4199-bbfc-2e515aa55793	Credit Risk Monitor	Credit Risk Monitor	Treasury Management / Treasury Operations / Monitor and execute risk and hedging transactions														green	G&A IT - Financial Services						Business Owned;G&A IT	Financial Services / Treasury;Financial Services / Treasury / Corporate Risk	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_auto.do?sys_id=305a969487e06518ed31bbff8bbb3597	https://regeneron.service-now.com/cmdb_ci_business_app.do?sys_id=41228a96db7ca0103c9ec245059619de			2025-06-10 05:00:43.724939
86df7971-4b0e-45aa-a99d-009dc35893ed	CRF Annotation Interactive Automation	CRF Annotation Interactive Automation	~Biostatistics and Data Management (BDM) / Statistical Programming / Clinical Data Review (2)	Amazon.com / AWS EC2																BDM	ClinChoice				Statistical Programming					2025-06-10 05:00:43.743002
c3616fee-2c17-466d-99a1-92ddb3df1963	CRF Annotation Interactive Automation	CRF Annotation Interactive Automation	~Biostatistics and Data Management (BDM) / Statistical Programming / Clinical Data Review (2)	Apache Tomcat																BDM	ClinChoice				Statistical Programming					2025-06-10 05:00:43.761736
495f3f61-ac02-4a15-9de4-6ea0e3fa00cf	CRF Annotation Interactive Automation	CRF Annotation Interactive Automation	~Biostatistics and Data Management (BDM) / Statistical Programming / Clinical Data Review (2)	Java																BDM	ClinChoice				Statistical Programming					2025-06-10 05:00:43.779926
7aec3b63-34c9-4b0b-bc2c-a16d7ca70005	CRF Annotation Interactive Automation	CRF Annotation Interactive Automation	~Biostatistics and Data Management (BDM) / Statistical Programming / Clinical Data Review (2)	Okta SSO																BDM	ClinChoice				Statistical Programming					2025-06-10 05:00:43.798334
8e94a2de-3fd3-4fd7-a1b9-69be46b8c439	CT.gov Portal	CT.gov Portal	~Global Patient Safety (GPS) / Case Evaluation and Reporting / Health Authority, License Partner, and Sponsor																	GPS					Global Patient Safety					2025-06-10 05:00:43.814911
0c617019-5878-4a56-ba13-48d3f97dceed	CTIS (Clinical Trials Information System)	CTIS (Clinical Trials Information System)	~Regulatory / Health authority content	CTIS Transcribing Information Bot								adequate								RA					Regulatory			appropriate	adequate	2025-06-10 05:00:43.832946
a149b41a-aaab-4266-b83b-aaa45bfc6670	CTMS Request Management	CTMS Request Management	~Development Operations & Portfolio Management (DO & PM) / Study Execution and Tracking / Study Execution																	DO&PM										2025-06-10 05:00:43.850335
7875e0b2-9e84-4566-b4a5-dcd9b615fb19	Custom Dashboards	Custom Dashboards	IOPS Product Manufacturing / Operational Performance																											2025-06-10 05:00:43.868345
9ce512a2-4183-420c-b75d-ed2e85b20ac8	CVENT	CVENT	Accounting / Travel & Expense Management;~Global Medical Affairs (GMA) / Operations & Execution / GMA Administration & Business Ops	Okta SSO													green	G&A IT - Sourcing and Procurement		MA				Business Owned;G&A IT	Financial Services / Global Procurement	https://regeneron.service-now.com/nav_to.do?uri=cmdb_ci_service_auto.do?sys_id=3ae1b357db92db44c9dadda5ca9619c7	https://regeneron.service-now.com/cmdb_ci_business_app.do?sys_id=cfe47973871535141db8ca2acebb350f			2025-06-10 05:00:43.886402
8a5abb2b-27f1-4378-b9c2-98d7022f6492	CWI FAERS EVDAS Service	CWI FAERS EVDAS Service	~Global Patient Safety (GPS) / Surveillance: Signal & Risk Management									adequate								GPS								appropriate	adequate	2025-06-10 05:00:43.904695
ab0e6798-f947-4041-b2b2-49dd146bc8fe	DADS Intake	DADS Intake	~Development Operations & Portfolio Management (DO & PM) / Shared Services / Program Management	Atlassian Jira Service Desk																DO&PM					Development Analytics & Data Science					2025-06-10 05:00:43.922457
3b31090f-9355-4f09-9b56-62bcd0f21e49	DADS Intake	DADS Intake	~Development Operations & Portfolio Management (DO & PM) / Shared Services / Program Management	Okta SSO																DO&PM					Development Analytics & Data Science					2025-06-10 05:00:43.941811
05fa3f8d-e749-4658-a801-8b70d34b1969	Dash	Dash	Collaborations & Touchpoints / Regulatory (GDS);IOPS Product Development / Regulatory Submission;IOPS Product Manufacturing / Regulatory Jurisdiction Planning;~Regulatory / Submission development									adequate						IOPS		RA					Regulatory			appropriate	adequate	2025-06-10 05:00:43.96092
b88fd0ee-fde2-43c0-8eae-30f6dbdda616	Data Historian Aveva PI @ REN	Data Historian Aveva PI @ REN	IOPS Product Development / Process Characterization															IOPS					US							2025-06-10 05:00:43.980575
a65bc442-8556-476e-883a-b357a47e8811	Data Historian Aveva Pi @ RHN	Data Historian Aveva Pi @ RHN																IOPS					IE							2025-06-10 05:00:44.005096
3e188181-1d88-4483-94ab-f811be93fe63	3D Slicer for Imaging	3D Slicer for Imaging	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:32.835444
81cd9454-1399-4a69-a060-d73a85d6ef03	3D Slicer for Imaging	3D Slicer for Imaging	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:32.859781
3645e90d-57ea-480a-acf2-00239442d4d4	3E Material Safety Data Sheets	3E Material Safety Data Sheets	\N	\N	\N	\N	\N	\N	\N	\N	\N	fullyAppropriate	\N	\N	\N	\N	green	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:32.883511
f138ece6-8531-4a3f-8951-bd3326677a03	3M Detection Management Software	3M Detection Management Software	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	green	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:32.902809
deb0ccf6-cde3-4584-b7da-892c84b00733	A Squared (A2)	A Squared (A2)	\N	\N	\N	\N	\N	\N	\N	\N	\N	adequate	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:32.92083
fdf0ed6b-42e9-4b31-a9b5-2168d2d0b5fb	ABAC Risk Center KYBP	ABAC Risk Center KYBP	\N	\N	\N	\N	\N	\N	\N	\N	\N	adequate	\N	\N	\N	\N	green	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:32.937303
ad8b8e56-2421-4f43-bacd-14833742f63c	ABC SLIMS	ABC SLIMS	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:32.955718
fc708d18-43eb-468c-85b8-18bbe0499294	Academy Pages	Academy Pages	\N	\N	\N	\N	\N	\N	\N	\N	\N	adequate	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:32.97418
586968d2-0d88-42fd-8999-c0bcb7a8eff4	Acceleration Point	Acceleration Point	\N	\N	\N	\N	\N	\N	\N	\N	\N	adequate	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:32.990922
33c12b8b-8dbd-4c01-a3ba-4019fea51a3b	Acceleration Point	Acceleration Point	\N	\N	\N	\N	\N	\N	\N	\N	\N	adequate	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:33.006185
000ccf15-7c4f-458d-870d-0b297b86f51c	Access Workspace	Access Workspace	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:33.023759
b9d9ae59-8656-4505-810d-6c80cdacd4ad	AccuraScience NGS - New Generation Sequencing	AccuraScience NGS - New Generation Sequencing	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:33.042006
c32dd6b7-5d94-4320-aedb-6368e90b4f9b	AccuSEQ	AccuSEQ	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:33.059287
58b02741-ed72-4989-83a2-d8be4c27e557	Achievers	Achievers	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	yellow	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:33.07665
89779bf0-93df-4791-b24a-b51b5be0b961	Achievers	Achievers	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	yellow	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:33.09314
74de500a-ecf0-4dba-8d87-c431e4d7e159	ACL Audit	ACL Audit	\N	\N	\N	\N	\N	\N	\N	\N	\N	adequate	\N	\N	\N	\N	green	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:33.110116
5785dfec-4d0d-4036-821e-59878f8d1fc0	Acquia DAM	Acquia DAM	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:33.127841
3c155fb8-2e35-49bd-9aea-5324755cae0a	Acronym App [PowerApps]	Acronym App [PowerApps]	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:33.144734
b934358b-8b03-4c14-a1fe-066a3312a9a2	Additional Risk Minimization Measures	Additional Risk Minimization Measures	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:33.160952
78a995b3-c181-4b3a-aa4c-f326190bab1f	Additional Risk Minimization Measures	Additional Risk Minimization Measures	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:33.177607
f0dd2f09-be1b-411b-a03d-6a4f43c60dfe	Adobe Acrobat Sign	Adobe Acrobat Sign	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:33.194147
75ce3f4e-4c75-425c-8480-356eb22756e9	Adobe AEM Forms - IOPS	Adobe AEM Forms - IOPS	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:33.211177
5b6b9a4f-8144-4952-9d8c-fdafb538f2c9	Adobe Sign	Adobe Sign	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:33.227437
ed0fc534-e396-4544-85c4-e190422e006c	AdobeConnect	AdobeConnect	\N	\N	\N	\N	\N	\N	\N	\N	\N	adequate	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:33.243969
0052c420-63ad-484a-816b-dd89f6471a68	ADP	ADP	\N	\N	\N	\N	\N	\N	\N	\N	\N	fullyAppropriate	\N	\N	\N	\N	green	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:33.259117
06ae9119-19bb-4eec-94cc-2d214b3730e1	Aetna	Aetna	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	green	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:33.275725
2d640e87-7adf-4d3f-b7ed-9c97a0188b4f	Aetna	Aetna	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	green	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:33.292315
0b02ab3b-e1d0-42e6-8635-d6ce85957d96	Agency Question Tracker (AQT)	Agency Question Tracker (AQT)	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:33.308595
809a4303-c0d6-43ab-9180-ab3a8730d424	AGIS	AGIS	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	green	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:33.325259
4ce09375-9f6b-4106-b75c-362d267c2d52	AI Assisted Systematic Literature Review	AI Assisted Systematic Literature Review	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:33.341721
cc3aa2fd-2df9-49df-8c64-6e6ebf89ffc1	Alation	Alation	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:33.357224
0386f82b-f6b7-465a-a1cc-5c9d6c643540	ALR (Automated Literature Review)	ALR (Automated Literature Review)	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:33.409389
f30b4af5-fec3-4efb-8d8b-ef43018c8c93	AmberBox	AmberBox	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:33.426222
7a50abbf-ac90-4ea7-875f-dde5eaff3b23	Ambient.ai	Ambient.ai	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:33.442402
4b30a15a-cfbf-404e-8229-5b4d16e5b771	American Dynamics CCTV System	American Dynamics CCTV System	\N	\N	\N	\N	\N	\N	\N	\N	\N	fullyAppropriate	\N	\N	\N	\N	green	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:33.458862
43b700c1-7ea0-43ba-a46c-b74e5908f990	Anaconda	Anaconda	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:33.475167
22c25879-921b-4c00-9f2d-aa8321a3b849	Anaqua Annuities	Anaqua Annuities	\N	\N	\N	\N	\N	\N	\N	\N	\N	fullyAppropriate	\N	\N	\N	\N	green	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:33.491703
7fc4eca4-12b1-42e5-8fe3-58c86b785da6	ANSYS-CPD	ANSYS-CPD	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:33.508375
a4b39c46-f101-42b0-8f37-6408ea870617	ANSYS-PS	ANSYS-PS	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:33.525552
b4edd98d-fe39-4f8f-a4db-62756b8dee8d	AON	AON	\N	\N	\N	\N	\N	\N	\N	\N	\N	fullyAppropriate	\N	\N	\N	\N	green	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:33.542073
8acbc9b4-a36c-4d1e-ad38-4d2b26215167	AON	AON	\N	\N	\N	\N	\N	\N	\N	\N	\N	fullyAppropriate	\N	\N	\N	\N	green	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:33.557104
c748fa18-393d-409f-b734-0a6cf6d0f6c9	Apigee	Apigee	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:33.573734
02ea863a-6002-4bd2-913b-35d07f866757	App - Electronic User Account Request	App - Electronic User Account Request	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:33.591092
cacb0ea4-1661-4b31-882e-745dfd9ed1bc	ArborXR	ArborXR	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:33.6076
99b26dfe-8300-4bbc-9197-be5fa317bd0f	Argus	Argus	\N	\N	\N	\N	\N	\N	\N	\N	\N	adequate	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:33.624862
8d34e724-6a7e-4e3f-8755-456ca3340a27	Argus	Argus	\N	\N	\N	\N	\N	\N	\N	\N	\N	adequate	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:33.640183
3af4267b-bd55-41d4-a13a-e1576c5e070f	Aristotle 360	Aristotle 360	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:33.656473
c56867ce-6dff-4694-b252-544a767bb995	Aroma	Aroma	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:33.672427
d73c1a15-4137-40ba-91eb-c331cb447e0d	Array Studio	Array Studio	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:33.688403
fa1c3fed-1501-4763-b359-72d39b5bde6f	Articulate	Articulate	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:33.704463
9e32ddf2-9002-4ad4-a8d4-378b4347d789	ArtiosCAD Design	ArtiosCAD Design	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:33.720553
28bf3093-c57a-4398-b27a-b30bc1d710eb	ASAP (Antibody Sequence Analysis Program)	ASAP (Antibody Sequence Analysis Program)	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:33.73669
5a2f9f89-2f7b-40be-bd16-f52f572fa389	ASIST	ASIST	\N	\N	\N	\N	\N	\N	\N	\N	\N	adequate	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:33.752803
f47cacef-c0d2-4b0a-a95e-3480311f460a	Assay Provider Database (Excel)	Assay Provider Database (Excel)	\N	\N	\N	\N	\N	\N	\N	\N	\N	adequate	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:33.768624
cb53ce74-2be1-40ad-9280-5ea1e3e41dc3	Asset Center	Asset Center	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:33.784797
d1ad4c77-47fd-464f-8f41-5e54ccededd8	ASTRA	ASTRA	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:33.801006
10f459db-e089-473b-add8-44f7d9e31739	ASTRA 8 PROD Raheen	ASTRA 8 PROD Raheen	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:33.817021
df25b300-e051-4b0b-ae6e-d6002062e47f	Atlassian Confluence	Atlassian Confluence	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:33.852883
ffef43aa-9a8b-4e3d-8f02-d319903d3c25	Audit Board	Audit Board	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	green	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:33.869449
2d5aef82-4d0c-4d3d-8029-05b23de06671	Augmentir	Augmentir	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:33.886356
7eea984f-901b-4faa-aaed-6a131a543bf4	AutoDesk Vault (RHN)	AutoDesk Vault (RHN)	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:33.902544
5fb2bafa-6c8f-4c6f-aec7-b95131875dc5	Automated Audit Workpapers and Tracking System (TeamMate)	Automated Audit Workpapers and Tracking System (TeamMate)	\N	\N	\N	\N	\N	\N	\N	\N	\N	unreasonable	\N	\N	\N	\N	green	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:33.918842
cdca2fcc-6287-41e7-a2a3-6380faeaea33	Automation Administration	Automation Administration	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:33.936017
ffaa26a0-8694-44d6-bf1c-6a185fc95ed6	Automation Jumpbox	Automation Jumpbox	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:33.951419
b92635b6-1cd6-44b0-8e72-9b8c404e774f	Automation_Processes Contols	Automation_Processes Contols	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:33.967754
a14346ad-8490-4ba6-8c4f-cab315c421c0	Avature	Avature	\N	\N	\N	\N	\N	\N	\N	\N	\N	adequate	\N	\N	\N	\N	yellow	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:33.992842
5a9e125d-8a45-48d0-bef3-07a17f2f7301	Avature	Avature	\N	\N	\N	\N	\N	\N	\N	\N	\N	adequate	\N	\N	\N	\N	yellow	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:34.01102
e8a1df9d-1894-49c6-8350-f091837837dd	AVEVA PI Process Historian - PA16	AVEVA PI Process Historian - PA16	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:34.027218
2a84ad08-f17b-42a8-b62c-31640e88ab7b	Axway	Axway	\N	\N	\N	\N	\N	\N	\N	\N	\N	adequate	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:34.043822
c88b3a50-e680-46dd-a25f-6409c1744037	Axway	Axway	\N	\N	\N	\N	\N	\N	\N	\N	\N	adequate	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:34.059288
e8231aac-d667-40ba-874e-40beeadad7d9	Azenta FreezerPro Raheen	Azenta FreezerPro Raheen	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:34.076084
46b18e8e-4fda-4fd3-9ef6-547f20eba5e8	B17 - Fill Finish Enviromental Monitoring	B17 - Fill Finish Enviromental Monitoring	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:34.091142
15946a15-de27-4782-8416-2dcba450c15a	B17 - PACKAGING LINE 02 SYSTEM	B17 - PACKAGING LINE 02 SYSTEM	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:34.107578
f9b4b33c-be08-4b24-9c88-3b9d346237da	Bank of America (CashPro)	Bank of America (CashPro)	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	green	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:34.124167
a49eeb20-0f1a-42f0-9b88-8e07f343e29a	Bank of Ireland	Bank of Ireland	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	green	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:34.140333
7aca24f3-29f2-4026-8be4-938a0bb3aa70	BarTender Barcode and Label	BarTender Barcode and Label	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:34.156735
62d55b1d-a8af-47fe-a2b1-3f499c9f9c0a	Beamery Talent CRM	Beamery Talent CRM	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	white	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:34.173549
c182ac61-7fc3-4915-a029-09dca239352b	Beamery Talent CRM	Beamery Talent CRM	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	white	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:34.189774
227f87a1-2d85-4b03-90e1-5c7014f0a0db	Beamery Talent CRM	Beamery Talent CRM	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	white	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:34.206082
abd4605d-6bdd-4e15-822e-c87a9087cb62	Beamery Talent CRM	Beamery Talent CRM	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	white	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:34.222483
9cb48327-45aa-4e73-b64a-ec976d552ecc	Beamery Talent CRM	Beamery Talent CRM	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	white	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:34.238718
b2706283-7ab6-42d9-bb02-60fe52727913	Beeline	Beeline	\N	\N	\N	\N	\N	\N	\N	\N	\N	fullyAppropriate	\N	\N	\N	\N	green	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:34.25535
8424fabb-749c-47e2-a560-d5e43030fff9	Beeline	Beeline	\N	\N	\N	\N	\N	\N	\N	\N	\N	fullyAppropriate	\N	\N	\N	\N	green	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:34.271573
69192710-d91d-4815-965c-996f4a85cd3d	Beeline	Beeline	\N	\N	\N	\N	\N	\N	\N	\N	\N	fullyAppropriate	\N	\N	\N	\N	green	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:34.288128
16ba9322-0cc4-44f5-b764-4fbbd5304e4d	Benchling - Research	Benchling - Research	\N	\N	\N	\N	\N	\N	\N	\N	\N	adequate	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:34.303203
518569b4-414c-4db3-b68b-f79cdd40e764	BenefitSolver	BenefitSolver	\N	\N	\N	\N	\N	\N	\N	\N	\N	fullyAppropriate	\N	\N	\N	\N	green	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:34.320201
bfb62d76-1234-4d37-9947-1eec33ab20aa	BenefitSolver	BenefitSolver	\N	\N	\N	\N	\N	\N	\N	\N	\N	fullyAppropriate	\N	\N	\N	\N	green	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:34.336577
5b09125c-ff88-46aa-974e-67b5c3252b10	Benevity ESR	Benevity ESR	\N	\N	\N	\N	\N	\N	\N	\N	\N	adequate	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:34.352762
41b02b42-7081-45d8-a754-bf0c5fb5fa0d	Benevity ESR	Benevity ESR	\N	\N	\N	\N	\N	\N	\N	\N	\N	adequate	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:34.369113
90d46bc3-4dfc-41c8-88bd-c251db5a93ee	Benevity ESR	Benevity ESR	\N	\N	\N	\N	\N	\N	\N	\N	\N	adequate	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:34.384158
067b1fae-828e-4fa2-8598-09eaa13b87d1	BetterComp	BetterComp	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:34.400794
9f52a025-4a58-4211-984f-e1df9498fce7	Beyond Trust PRA	Beyond Trust PRA	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:34.417742
9129f136-72c0-450e-a74f-f4fe6442c3b1	BioRegistry	BioRegistry	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:34.43489
4b2aae31-6543-49b9-a5a3-a211ff3a00d2	BioRender	BioRender	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:34.451615
d8bdb552-9ea9-4af1-984e-e39937a740bb	Biovia One Lab ELN - GxP	Biovia One Lab ELN - GxP	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:34.468011
3db6e915-d5a9-4feb-ad43-e3dc5ebdfed1	Biovia OneLab ELN	Biovia OneLab ELN	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:34.484524
42ea71bb-4899-47bd-b85c-99f49551f466	BLAST (NCBI tool)	BLAST (NCBI tool)	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:34.501124
a2390887-5d45-439c-b827-27b2d2a5d93e	BlauLabs Geo Track and Trace	BlauLabs Geo Track and Trace	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:34.516209
2b3c620b-5743-475e-b860-89f39d1bfcbd	Bloomberg	Bloomberg	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	green	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:34.532305
8e2ea764-228c-4430-944b-4151c0bf107a	Blue Mountain Regulatory Asset Manager (BMRAM)	Blue Mountain Regulatory Asset Manager (BMRAM)	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:34.548713
eee36496-f279-45bd-9bf7-140fe2196beb	Bluebeam	Bluebeam	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	green	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:34.565023
bcec8841-6719-405f-b35b-be06c5166cd9	Blueprint PWA	Blueprint PWA	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:34.582361
5f19080a-19e7-45ad-8e0b-074dced324ce	Bluesheet Budget	Bluesheet Budget	\N	\N	\N	\N	\N	\N	\N	\N	\N	adequate	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:34.598924
52e8c62d-2102-42b6-966f-f06647dea512	Body Techniques	Body Techniques	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:34.618972
1377ece3-947b-449e-a870-87899ce22756	Boomi	Boomi	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	yellow	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:34.6358
6bef5def-1dca-427f-8a7e-1922813796af	Boomi	Boomi	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	yellow	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:34.651968
c842636b-c0ab-441d-ab5c-ef5d9c7884c9	BrassRing	BrassRing	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	white	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:34.66909
c3956f6c-7025-46b0-8cc0-167dc3ff4e37	Bright Horizons	Bright Horizons	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	green	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:34.685569
2c9fada7-6cdd-42b6-b86c-e0213c69686e	Broadbean	Broadbean	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	green	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:34.703422
94316a72-a7c6-458f-9a1d-ce7a17c29496	Broadspire	Broadspire	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	green	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:34.719825
9a626b5e-70f9-482a-915f-490d6c13dcd0	Brooks Expert Support Tool (Best)	Brooks Expert Support Tool (Best)	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:34.737418
48c1f32f-9af4-43db-9f97-6916acfccd76	BSI LIMS	BSI LIMS	\N	\N	\N	\N	\N	\N	\N	\N	\N	adequate	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:34.754489
af015ed1-8728-4368-a71d-42662354a286	Building Automation System JCI Metasys	Building Automation System JCI Metasys	\N	\N	\N	\N	\N	\N	\N	\N	\N	adequate	\N	\N	\N	\N	green	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:34.77106
30a0e768-5784-4780-b59f-e4f0d648833c	Bulk Chemical Distribution System→FUT	Bulk Chemical Distribution System→FUT	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:34.788022
38959f01-2809-4e87-8eb8-0e61ba233d57	C Technologies SoloVPE	C Technologies SoloVPE	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:34.804632
6a610ef7-78d1-45ce-b105-ddee5329f285	C Technologies SoloVPE - Manufacturing	C Technologies SoloVPE - Manufacturing	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:34.820176
432ff1fb-0e22-45c7-a021-a55b94b3c8b8	Calyx IRT/RTSM	Calyx IRT/RTSM	\N	\N	\N	\N	\N	\N	\N	\N	\N	adequate	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:34.837006
392bf01d-3011-417f-97c4-70b67fa64044	Candex Agency Portal	Candex Agency Portal	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	yellow	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:34.853425
4229aedd-94a9-4aee-991c-14f670f6dedc	Cantor Fitzgerald	Cantor Fitzgerald	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	green	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:34.870417
a3ef6b76-9c1c-45c0-9cda-6ff8203428ae	Captivate	Captivate	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	green	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:34.886791
d55a65d2-d388-4019-a056-6bd423fbadea	CCure	CCure	\N	\N	\N	\N	\N	\N	\N	\N	\N	fullyAppropriate	\N	\N	\N	\N	green	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:34.903687
2e17c3fa-18bd-4716-848d-5b9e5c6b7e04	CCURE 9000 Security Management System	CCURE 9000 Security Management System	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:34.920629
745405f5-4cf7-439f-8b88-d144bbccf196	CDER Direct	CDER Direct	\N	\N	\N	\N	\N	\N	\N	\N	\N	adequate	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:34.936931
7ae22962-dbf4-4467-a0f9-f031f82986f9	CDER NextGen	CDER NextGen	\N	\N	\N	\N	\N	\N	\N	\N	\N	adequate	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:34.953481
269cf997-7a52-4c46-b2c9-35726cd61134	CDPHP	CDPHP	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	green	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:34.971087
3f5730e4-51eb-4501-894c-704a40a48dda	CEC Portal	CEC Portal	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:34.988094
09e7cf07-156e-41d1-bcdf-fdd65db15fc8	Cellario	Cellario	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:35.004741
eb3b864a-db88-4049-a2a7-c7490987c8f1	Centralized Sample Tracking	Centralized Sample Tracking	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:35.021468
06ed85aa-8d22-4b0e-8545-e791672f81bf	CES Information Management tool	CES Information Management tool	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:35.037522
a08fe790-eb30-4ee1-9d6a-6fac67482688	CETOL 6σ Tolerance Analysis Software	CETOL 6σ Tolerance Analysis Software	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:35.053606
76a4f6ed-6859-4027-9372-a391735c989d	Charles River Axcess Database - RAH	Charles River Axcess Database - RAH	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:35.070007
219c2f94-4457-4fea-b4c8-fe57d335fa2f	Chemical Manager- RAH	Chemical Manager- RAH	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:35.08646
75c17bf3-d014-48da-aaba-975295e00fc1	Chromeleon	Chromeleon	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:35.103147
97d92800-adc4-4acd-b2c6-57f537ccb02c	Cigna	Cigna	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	green	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:35.119322
a207bee7-e731-443b-9d4c-44cb9ad85a01	Cintas Gemini Gowning Vending Machine (TL)	Cintas Gemini Gowning Vending Machine (TL)	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:35.135577
f252b775-fd9d-432d-b39b-22a12f709b5d	Clario ERT	Clario ERT	\N	\N	\N	\N	\N	\N	\N	\N	\N	adequate	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:35.151884
ec930f1c-28b9-4376-a26d-e1040c04a888	Claroty Process Area Monitoring	Claroty Process Area Monitoring	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:35.169897
70edfeb4-fe2a-4693-9c01-4649b84e4eb2	Clearsight	Clearsight	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	green	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:35.187041
03521693-1d9e-4eb3-aaee-8e01e990d418	ClearTrial	ClearTrial	\N	\N	\N	\N	\N	\N	\N	\N	\N	adequate	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:35.20338
f8ff96d9-eb3c-4d03-9a5d-04e7c67408d6	Clearwater - Treasury Partners	Clearwater - Treasury Partners	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	green	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:35.219719
3bad414f-8ae6-4eb7-9d82-e066e15e3a8a	Clinical Operational Repository (ODR)	Clinical Operational Repository (ODR)	\N	\N	\N	\N	\N	\N	\N	\N	\N	adequate	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:35.238634
4f27d06e-be2d-488f-bccb-1dd851ab4c25	Clinical Trial Tracker/Phoenix Tracker	Clinical Trial Tracker/Phoenix Tracker	\N	\N	\N	\N	\N	\N	\N	\N	\N	adequate	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:35.255847
6686ccf1-06d5-4a88-ab12-ff9b37043a76	Clinical Trials Site - Corporate	Clinical Trials Site - Corporate	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:35.277237
3687c059-4432-4398-b7a9-b0e95d879087	Clinical Trials Site - Corporate	Clinical Trials Site - Corporate	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:35.29457
8210175d-ec7e-417f-b6e6-15c54a258e5f	Clinical Trials Site - Corporate	Clinical Trials Site - Corporate	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:35.31072
48a7246d-257f-473a-af3c-ec749f0656f3	Clinical Trials Site - Libtayo	Clinical Trials Site - Libtayo	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:35.327273
0c1e35fb-3c5e-4c21-9993-70bc80046e3f	ClinPhone	ClinPhone	\N	\N	\N	\N	\N	\N	\N	\N	\N	adequate	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:35.342563
6f9fb292-7f70-4b11-8d05-f794799100b8	Cloudera Data Platform - IOPS	Cloudera Data Platform - IOPS	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:35.358884
e0127a3b-9b00-42c5-9b90-d2c26454f4b8	CloudIQ	CloudIQ	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:35.375164
8c0dcde7-a1cf-4d66-b327-ac2eae1ac577	CluePoints RBQM	CluePoints RBQM	\N	\N	\N	\N	\N	\N	\N	\N	\N	adequate	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:35.39156
9e3d07e9-e1a2-4890-9cc7-0d8354e39646	Commercial MDM	Commercial MDM	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:35.407931
31848296-cc9c-41c3-ac1d-1df210d327f3	Compa Offers	Compa Offers	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:35.423284
c76b6295-1016-4a2a-8491-b9bf28c58a94	Compass	Compass	\N	\N	\N	\N	\N	\N	\N	\N	\N	adequate	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:35.439761
c50ea570-a93b-4bea-bd30-1983125a32c3	ComplianceBuilder	ComplianceBuilder	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:35.456288
16832499-3ce6-4bba-a319-49b884de13d2	ComplianceWire - RegnU - IOPS	ComplianceWire - RegnU - IOPS	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:35.473076
be76e43d-e6e3-49ed-a705-5acfa22ced18	Concur	Concur	\N	\N	\N	\N	\N	\N	\N	\N	\N	fullyAppropriate	\N	\N	\N	\N	green	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:35.488161
40831744-be8b-4e98-a560-a76f56a2a0bd	Congress Planning Dashboard	Congress Planning Dashboard	\N	\N	\N	\N	\N	\N	\N	\N	\N	adequate	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:35.504246
2f86177f-95dd-41a6-bfc8-0c4f73c048ca	Controlant	Controlant	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:35.520636
ebd175bf-e7b4-4bfa-9eeb-9570790c45e0	ConvergeHealth SRP	ConvergeHealth SRP	\N	\N	\N	\N	\N	\N	\N	\N	\N	adequate	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:35.537129
574d1a1a-a20e-4cd0-8f5e-fcc9a3c145ea	ConvergeHealth SRP	ConvergeHealth SRP	\N	\N	\N	\N	\N	\N	\N	\N	\N	adequate	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:35.555176
9b471e65-53c1-4bae-bf12-4e502b41fc04	ConvergeHealth SRP	ConvergeHealth SRP	\N	\N	\N	\N	\N	\N	\N	\N	\N	adequate	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:35.571399
a5f30e70-3688-4d17-9e0c-936505006b14	ConvergeHealth SRP	ConvergeHealth SRP	\N	\N	\N	\N	\N	\N	\N	\N	\N	adequate	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:35.587717
f74f2e65-aac8-4cda-b008-4485e1e60950	Core Country Committee	Core Country Committee	\N	\N	\N	\N	\N	\N	\N	\N	\N	adequate	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:35.603899
dae6308c-8863-4303-bc40-3c3d3764fb52	CORE LIMS	CORE LIMS	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:35.620532
bda6bf2b-4762-4a28-b39d-b7b7326ae7e2	CoreHR - CorePay Raheen - IOPS	CoreHR - CorePay Raheen - IOPS	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:35.637646
7a43b404-075f-46a3-86c7-886b1f7d81fa	CorePay	CorePay	\N	\N	\N	\N	\N	\N	\N	\N	\N	fullyAppropriate	\N	\N	\N	\N	green	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:35.65409
aa5752c6-8c64-41f9-9752-bdc07eb41de9	Cority Ergonomics	Cority Ergonomics	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:35.670768
a1aa5a2c-a675-436b-9c53-844258a1d160	Costar	Costar	\N	\N	\N	\N	\N	\N	\N	\N	\N	fullyAppropriate	\N	\N	\N	\N	green	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:35.68799
0adf253e-d845-4538-8380-0625ba85bb32	Cotoha Translation Service	Cotoha Translation Service	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:35.704689
bf6be733-33b5-40fb-a238-e4a4409ca5e0	Credit Risk Monitor	Credit Risk Monitor	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	green	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:55:35.72156
\.


--
-- Data for Name: business_capabilities; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.business_capabilities (id, name, display_name, hierarchy, parent_id, level, mapped_level1_capability, mapped_to_lifesciences_capabilities, created_at, level1_capability, level2_capability, level3_capability) FROM stdin;
cad858cb-cd0f-4290-a5c0-8339f8e36ddf	Finance	Finance	Finance	\N	1	Finance		2025-06-10 05:00:36.074331	Finance	\N	\N
03b8ebf4-2f89-4797-ac5d-84e5e868d061	Human Resources	Human Resources	Human Resources	\N	1	Human Resources		2025-06-10 05:00:36.093013	Human Resources	\N	\N
9d4ec6ea-a5e6-4c0c-82cd-ec7c5db26324	Enterprise Strategy	Enterprise Strategy	Enterprise Strategy	\N	1	Enterprise Strategy		2025-06-10 05:00:36.111575	Enterprise Strategy	\N	\N
b346329c-09ec-4378-8c12-2cfd971bfa9d	Sourcing and Procurement	Sourcing and Procurement	Sourcing and Procurement	\N	1	Sourcing and Procurement		2025-06-10 05:00:36.131237	Sourcing and Procurement	\N	\N
67ae4376-c88f-4a21-8c70-a989af2527d0	Governance, Risk and Compliance	Governance, Risk and Compliance	Governance, Risk and Compliance	\N	1	Governance, Risk and Compliance		2025-06-10 05:00:36.149396	Governance, Risk and Compliance	\N	\N
e6b45cdf-6a74-442d-81a6-9392496125d1	Manufacturing	Manufacturing	Manufacturing	\N	1	Manufacturing		2025-06-10 05:00:36.168446	Manufacturing	\N	\N
f1eeb66f-9c96-4cdb-bfd9-5b9bca2dd2b4	Asset Management	Asset Management	Asset Management	\N	1	Asset Management		2025-06-10 05:00:36.186785	Asset Management	\N	\N
2edc5fe2-4f24-4857-9294-8e8a84dbf3e6	R&D and Engineering	R&D and Engineering	R&D and Engineering	\N	1	R&D and Engineering		2025-06-10 05:00:36.205208	R&D and Engineering	\N	\N
e89219b8-aca4-4b37-931a-c0f4f99204a6	Portfolio and Project Management	Portfolio and Project Management	Portfolio and Project Management	\N	1	Portfolio and Project Management		2025-06-10 05:00:36.223546	Portfolio and Project Management	\N	\N
363ca1f2-24a7-4c29-8a60-01c070a39da6	IOPS Quality Control	IOPS Quality Control	IOPS Quality Control	e6b45cdf-6a74-442d-81a6-9392496125d1	2	Manufacturing		2025-06-10 05:00:36.243448	Manufacturing	IOPS Quality Control	\N
12ba5e03-ec7d-4286-9515-cf791007d2ed	Collaborations & Touchpoints	Collaborations & Touchpoints	Collaborations & Touchpoints	9d4ec6ea-a5e6-4c0c-82cd-ec7c5db26324	2	Enterprise Strategy		2025-06-10 05:00:36.261933	Enterprise Strategy	Collaborations & Touchpoints	\N
0e781dc4-bbea-404b-8942-974a1a585ab6	BDM	BDM	Collaborations & Touchpoints / BDM	12ba5e03-ec7d-4286-9515-cf791007d2ed	3	Enterprise Strategy		2025-06-10 05:00:36.278912	Enterprise Strategy	Collaborations & Touchpoints	BDM
4715caa9-dec0-4aeb-a7a5-51442a72a2f9	Real Estate & Facilities Management	Real Estate & Facilities Management	Real Estate & Facilities Management	f1eeb66f-9c96-4cdb-bfd9-5b9bca2dd2b4	2	Asset Management		2025-06-10 05:00:36.297248	Asset Management	Real Estate & Facilities Management	\N
e3f4fb0e-960c-4907-87fc-e21c09a0a539	Environmental, Health, and Safety (EHS) Management	Environmental, Health, and Safety (EHS) Management	Real Estate & Facilities Management / Environmental, Health, and Safety (EHS) Management	4715caa9-dec0-4aeb-a7a5-51442a72a2f9	3	Asset Management		2025-06-10 05:00:36.31536	Asset Management	Real Estate & Facilities Management	Environmental, Health, and Safety (EHS) Management
00c9829c-9023-4a35-9af7-92a57f773f12	IOPS Supply Chain Management	IOPS Supply Chain Management	IOPS Supply Chain Management	e6b45cdf-6a74-442d-81a6-9392496125d1	2	Manufacturing		2025-06-10 05:00:36.333524	Manufacturing	IOPS Supply Chain Management	\N
03312227-e5bf-4df5-97e0-3face8519c89	Demand Planning	Demand Planning	IOPS Supply Chain Management / Demand Planning	00c9829c-9023-4a35-9af7-92a57f773f12	3	Manufacturing		2025-06-10 05:00:36.353289	Manufacturing	IOPS Supply Chain Management	Demand Planning
836012c8-065a-4c1c-98b6-2dce76764703	Order Management	Order Management	IOPS Supply Chain Management / Order Management	00c9829c-9023-4a35-9af7-92a57f773f12	3	Manufacturing		2025-06-10 05:00:36.371295	Manufacturing	IOPS Supply Chain Management	Order Management
b6f61731-dddd-4575-88e4-be2855a09606	Supply Planning	Supply Planning	IOPS Supply Chain Management / Supply Planning	00c9829c-9023-4a35-9af7-92a57f773f12	3	Manufacturing		2025-06-10 05:00:36.389463	Manufacturing	IOPS Supply Chain Management	Supply Planning
52d9a0ed-9018-459a-b532-2e3c3f59002b	Maintain and Enhance Ethics & Compliance	Maintain and Enhance Ethics & Compliance	Maintain and Enhance Ethics & Compliance	67ae4376-c88f-4a21-8c70-a989af2527d0	2	Governance, Risk and Compliance		2025-06-10 05:00:36.407808	Governance, Risk and Compliance	Maintain and Enhance Ethics & Compliance	\N
9670d43c-c7c1-4952-afe5-7ee3c309063d	Manage Third Party Risk	Manage Third Party Risk	Maintain and Enhance Ethics & Compliance / Manage Third Party Risk	52d9a0ed-9018-459a-b532-2e3c3f59002b	3	Governance, Risk and Compliance		2025-06-10 05:00:36.424813	Governance, Risk and Compliance	Maintain and Enhance Ethics & Compliance	Manage Third Party Risk
29dd0433-f8f7-4182-b258-6a72e0b0107f	Foundational Capabilities	Foundational Capabilities	Foundational Capabilities	9d4ec6ea-a5e6-4c0c-82cd-ec7c5db26324	2	Enterprise Strategy		2025-06-10 05:00:36.443024	Enterprise Strategy	Foundational Capabilities	\N
91831c43-f299-4b0f-92d0-d950288f6513	Training and Onboarding (GxP)	Training and Onboarding (GxP)	Foundational Capabilities / Training and Onboarding (GxP)	29dd0433-f8f7-4182-b258-6a72e0b0107f	3	Enterprise Strategy		2025-06-10 05:00:36.463347	Enterprise Strategy	Foundational Capabilities	Training and Onboarding (GxP)
5a7bf9c5-1097-4286-8ad6-2cafe21d5c1c	External Partners & Vendors	External Partners & Vendors	Collaborations & Touchpoints / External Partners & Vendors	12ba5e03-ec7d-4286-9515-cf791007d2ed	3	Enterprise Strategy		2025-06-10 05:00:36.481333	Enterprise Strategy	Collaborations & Touchpoints	External Partners & Vendors
6e909cee-b153-4af7-955e-6501ead4acd4	Data Modeling and Visualization	Data Modeling and Visualization	Foundational Capabilities / Data Modeling and Visualization	29dd0433-f8f7-4182-b258-6a72e0b0107f	3	Enterprise Strategy		2025-06-10 05:00:36.499263	Enterprise Strategy	Foundational Capabilities	Data Modeling and Visualization
2cde936a-f0b4-413a-8464-5140af12f1b7	QC Virology	QC Virology	IOPS Quality Control / QC Virology	363ca1f2-24a7-4c29-8a60-01c070a39da6	3	Manufacturing		2025-06-10 05:00:36.517466	Manufacturing	IOPS Quality Control	QC Virology
f2fab90d-fb87-4d41-b6be-5aac108becb6	Benefits Management	Benefits Management	Benefits Management	03b8ebf4-2f89-4797-ac5d-84e5e868d061	2	Human Resources		2025-06-10 05:00:36.53521	Human Resources	Benefits Management	\N
b4d2a3db-ff3b-4615-b09a-e7c25eee5cd2	Talent Development	Talent Development	Talent Development	03b8ebf4-2f89-4797-ac5d-84e5e868d061	2	Human Resources		2025-06-10 05:00:36.553244	Human Resources	Talent Development	\N
2bfdfdcd-554b-4400-b8b4-5a12266763a2	Employee Engagement	Employee Engagement	Talent Development / Employee Engagement	b4d2a3db-ff3b-4615-b09a-e7c25eee5cd2	3	Human Resources		2025-06-10 05:00:36.571501	Human Resources	Talent Development	Employee Engagement
e049697d-2f74-47d8-be4b-8f260f46b117	Consolidations and External Reporting	Consolidations and External Reporting	Consolidations and External Reporting	cad858cb-cd0f-4290-a5c0-8339f8e36ddf	2	Finance		2025-06-10 05:00:36.589207	Finance	Consolidations and External Reporting	\N
50aa04ef-f570-4b15-8603-368f07c8e17f	Corporate Governance	Corporate Governance	Consolidations and External Reporting / Corporate Governance	e049697d-2f74-47d8-be4b-8f260f46b117	3	Finance		2025-06-10 05:00:36.606931	Finance	Consolidations and External Reporting	Corporate Governance
72fff121-6207-4bdf-a314-b74ad251c378	GPS	GPS	Collaborations & Touchpoints / GPS	12ba5e03-ec7d-4286-9515-cf791007d2ed	3	Enterprise Strategy		2025-06-10 05:00:36.625117	Enterprise Strategy	Collaborations & Touchpoints	GPS
47fc06fb-f347-485e-b2b2-5884e4cb30fa	IOPS (GDS)	IOPS (GDS)	Collaborations & Touchpoints / IOPS (GDS)	12ba5e03-ec7d-4286-9515-cf791007d2ed	3	Enterprise Strategy		2025-06-10 05:00:36.645302	Enterprise Strategy	Collaborations & Touchpoints	IOPS (GDS)
e0983645-932d-4c94-9ed6-41a4b9ce1a3d	IOPS (GDS)	IOPS (GDS)	Foundational Capabilities / IOPS (GDS)	29dd0433-f8f7-4182-b258-6a72e0b0107f	3	Enterprise Strategy		2025-06-10 05:00:36.662045	Enterprise Strategy	Foundational Capabilities	IOPS (GDS)
864f9a15-009e-461b-acd5-7f37fbe7d9c5	IOPS Quality Assurance	IOPS Quality Assurance	IOPS Quality Assurance	e6b45cdf-6a74-442d-81a6-9392496125d1	2	Manufacturing		2025-06-10 05:00:36.679845	Manufacturing	IOPS Quality Assurance	\N
fd935f53-6397-46d3-9fb6-dc1a9220a167	Change Control	Change Control	IOPS Quality Assurance / Change Control	864f9a15-009e-461b-acd5-7f37fbe7d9c5	3	Manufacturing		2025-06-10 05:00:36.697904	Manufacturing	IOPS Quality Assurance	Change Control
0ee23ad4-2d70-4c8b-b76e-59b51d75fa06	Deviation Management	Deviation Management	IOPS Quality Assurance / Deviation Management	864f9a15-009e-461b-acd5-7f37fbe7d9c5	3	Manufacturing		2025-06-10 05:00:36.719609	Manufacturing	IOPS Quality Assurance	Deviation Management
aba99074-c5a9-4373-a754-d9eda0f62c2a	Document Control	Document Control	IOPS Quality Assurance / Document Control	864f9a15-009e-461b-acd5-7f37fbe7d9c5	3	Manufacturing		2025-06-10 05:00:36.737389	Manufacturing	IOPS Quality Assurance	Document Control
d11b44b8-6f27-49b8-8154-0c39e5fb97c3	Payroll	Payroll	Payroll	03b8ebf4-2f89-4797-ac5d-84e5e868d061	2	Human Resources		2025-06-10 05:00:36.755515	Human Resources	Payroll	\N
a1a3c46c-0db6-42c9-8bde-7e7f4e2843da	Payroll Management	Payroll Management	Payroll / Payroll Management	d11b44b8-6f27-49b8-8154-0c39e5fb97c3	3	Human Resources		2025-06-10 05:00:36.774202	Human Resources	Payroll	Payroll Management
695bc906-4fcf-4449-9523-066e847d0763	IOPS Product Development	IOPS Product Development	IOPS Product Development	e6b45cdf-6a74-442d-81a6-9392496125d1	2	Manufacturing		2025-06-10 05:00:36.792036	Manufacturing	IOPS Product Development	\N
ba676199-42b7-4b8d-9bc3-1a17c5dffbd6	Regulatory Submission	Regulatory Submission	IOPS Product Development / Regulatory Submission	695bc906-4fcf-4449-9523-066e847d0763	3	Manufacturing		2025-06-10 05:00:36.80877	Manufacturing	IOPS Product Development	Regulatory Submission
68b1488b-8711-451f-ad15-49ba4fee3b0e	Accounting	Accounting	Accounting	cad858cb-cd0f-4290-a5c0-8339f8e36ddf	2	Finance		2025-06-10 05:00:36.826548	Finance	Accounting	\N
63de9901-6528-4e04-bba5-1f6c3d0bc798	Financial Accounting	Financial Accounting	Accounting / Financial Accounting	68b1488b-8711-451f-ad15-49ba4fee3b0e	3	Finance		2025-06-10 05:00:36.844459	Finance	Accounting	Financial Accounting
7054bac1-14e6-4f0d-a6ea-c0f3cd05c0a9	Manage Corporate Security	Manage Corporate Security	Manage Corporate Security	67ae4376-c88f-4a21-8c70-a989af2527d0	2	Governance, Risk and Compliance		2025-06-10 05:00:36.862609	Governance, Risk and Compliance	Manage Corporate Security	\N
e6969091-8e2b-4a8a-8ebb-f04456e24baf	Incident Management	Incident Management	Manage Corporate Security / Incident Management	7054bac1-14e6-4f0d-a6ea-c0f3cd05c0a9	3	Governance, Risk and Compliance		2025-06-10 05:00:36.880408	Governance, Risk and Compliance	Manage Corporate Security	Incident Management
f1f33b33-0722-408c-a89b-71e3205635a3	Physical Security	Physical Security	Manage Corporate Security / Physical Security	7054bac1-14e6-4f0d-a6ea-c0f3cd05c0a9	3	Governance, Risk and Compliance		2025-06-10 05:00:36.89864	Governance, Risk and Compliance	Manage Corporate Security	Physical Security
a539c1cf-f81a-4361-b024-e5ac8249a78b	Protect Intellectual Property	Protect Intellectual Property	Protect Intellectual Property	67ae4376-c88f-4a21-8c70-a989af2527d0	2	Governance, Risk and Compliance		2025-06-10 05:00:36.91678	Governance, Risk and Compliance	Protect Intellectual Property	\N
f186019d-aab2-4c8f-973e-86f6a002573c	Manage Intellectual Property	Manage Intellectual Property	Protect Intellectual Property / Manage Intellectual Property	a539c1cf-f81a-4361-b024-e5ac8249a78b	3	Governance, Risk and Compliance		2025-06-10 05:00:36.93442	Governance, Risk and Compliance	Protect Intellectual Property	Manage Intellectual Property
63692239-4025-4439-a46a-20a13af5324d	Patent Management	Patent Management	Protect Intellectual Property / Patent Management	a539c1cf-f81a-4361-b024-e5ac8249a78b	3	Governance, Risk and Compliance		2025-06-10 05:00:36.953211	Governance, Risk and Compliance	Protect Intellectual Property	Patent Management
c10682d0-d810-4501-a883-92bbe27cdcc9	Technical Training (Learning Management)	Technical Training (Learning Management)	IOPS Quality Assurance / Technical Training (Learning Management)	864f9a15-009e-461b-acd5-7f37fbe7d9c5	3	Manufacturing		2025-06-10 05:00:36.970806	Manufacturing	IOPS Quality Assurance	Technical Training (Learning Management)
f2e21371-99d1-4a04-8be9-a14cc153bbcb	Global Patient Safety (GPS)	Global Patient Safety (GPS)	Global Patient Safety (GPS)	9d4ec6ea-a5e6-4c0c-82cd-ec7c5db26324	2	Enterprise Strategy		2025-06-10 05:00:36.988713	Enterprise Strategy	Global Patient Safety (GPS)	\N
cde10e82-16f1-4c99-8144-46d853bea16e	Case Evaluation and Reporting	Case Evaluation and Reporting	Global Patient Safety (GPS) / Case Evaluation and Reporting	f2e21371-99d1-4a04-8be9-a14cc153bbcb	3	Enterprise Strategy		2025-06-10 05:00:37.006619	Enterprise Strategy	Global Patient Safety (GPS)	Case Evaluation and Reporting
68aec87d-3886-4fd9-b3f7-6ad2d8405c16	Manage Government & Industry Relationships	Manage Government & Industry Relationships	Manage Government & Industry Relationships	67ae4376-c88f-4a21-8c70-a989af2527d0	2	Governance, Risk and Compliance		2025-06-10 05:00:37.024862	Governance, Risk and Compliance	Manage Government & Industry Relationships	\N
0584026f-f8c0-4c8a-b126-dc8a10e7569a	Manage Government Relations	Manage Government Relations	Manage Government & Industry Relationships / Manage Government Relations	68aec87d-3886-4fd9-b3f7-6ad2d8405c16	3	Governance, Risk and Compliance		2025-06-10 05:00:37.043109	Governance, Risk and Compliance	Manage Government & Industry Relationships	Manage Government Relations
5e756247-f64c-43f7-8586-145672fefa2f	Device Specification Management	Device Specification Management	IOPS Product Development / Device Specification Management	695bc906-4fcf-4449-9523-066e847d0763	3	Manufacturing		2025-06-10 05:00:37.061991	Manufacturing	IOPS Product Development	Device Specification Management
4407fd27-9db3-4fa7-b565-70c5aa4606eb	IOPS Enterprise Support	IOPS Enterprise Support	IOPS Enterprise Support	e6b45cdf-6a74-442d-81a6-9392496125d1	2	Manufacturing		2025-06-10 05:00:37.081816	Manufacturing	IOPS Enterprise Support	\N
ee140fca-2f7b-40cf-9aff-ec6c368374a6	Collaboration	Collaboration	IOPS Enterprise Support / Collaboration	4407fd27-9db3-4fa7-b565-70c5aa4606eb	3	Manufacturing		2025-06-10 05:00:37.100362	Manufacturing	IOPS Enterprise Support	Collaboration
c308521f-5a57-4dbc-bd03-f678c2d30e9f	IOPS Plant Management	IOPS Plant Management	IOPS Plant Management	e6b45cdf-6a74-442d-81a6-9392496125d1	2	Manufacturing		2025-06-10 05:00:37.118305	Manufacturing	IOPS Plant Management	\N
aefe3b8b-e06f-4311-b452-a413ca8688ed	Drawing Management	Drawing Management	IOPS Plant Management / Drawing Management	c308521f-5a57-4dbc-bd03-f678c2d30e9f	3	Manufacturing		2025-06-10 05:00:37.136096	Manufacturing	IOPS Plant Management	Drawing Management
c201642c-11c9-4a17-bf1e-fc791f94f99d	Talent Acquisition	Talent Acquisition	Talent Acquisition	03b8ebf4-2f89-4797-ac5d-84e5e868d061	2	Human Resources		2025-06-10 05:00:37.155848	Human Resources	Talent Acquisition	\N
dc10b7bc-5373-4e82-9ee8-dcb38281c2de	Recruiting	Recruiting	Talent Acquisition / Recruiting	c201642c-11c9-4a17-bf1e-fc791f94f99d	3	Human Resources		2025-06-10 05:00:37.173761	Human Resources	Talent Acquisition	Recruiting
b64cb762-4f52-4aa1-93eb-c61131e19186	External Data Transfer	External Data Transfer	Foundational Capabilities / External Data Transfer	29dd0433-f8f7-4182-b258-6a72e0b0107f	3	Enterprise Strategy		2025-06-10 05:00:37.191755	Enterprise Strategy	Foundational Capabilities	External Data Transfer
e5462d27-abbe-4f62-ae99-ea2d539f583d	Treasury Management	Treasury Management	Treasury Management	cad858cb-cd0f-4290-a5c0-8339f8e36ddf	2	Finance		2025-06-10 05:00:37.209781	Finance	Treasury Management	\N
465a96ca-0e22-401c-a082-fdd88a32ac46	Accounts Payable and Expense Reimbursement	Accounts Payable and Expense Reimbursement	Treasury Management / Accounts Payable and Expense Reimbursement	e5462d27-abbe-4f62-ae99-ea2d539f583d	3	Finance		2025-06-10 05:00:37.227414	Finance	Treasury Management	Accounts Payable and Expense Reimbursement
d6bf5015-8a89-471c-8dd1-e596e3b24d94	Internal Controls	Internal Controls	Treasury Management / Internal Controls	e5462d27-abbe-4f62-ae99-ea2d539f583d	3	Finance		2025-06-10 05:00:37.245412	Finance	Treasury Management	Internal Controls
fc44e10c-8582-495d-b481-0e181f4a0945	Planning and Management Accounting	Planning and Management Accounting	Treasury Management / Planning and Management Accounting	e5462d27-abbe-4f62-ae99-ea2d539f583d	3	Finance		2025-06-10 05:00:37.263685	Finance	Treasury Management	Planning and Management Accounting
8b1588f4-d2ab-470a-ba1b-febeb73cda0c	Revenue Accounting	Revenue Accounting	Treasury Management / Revenue Accounting	e5462d27-abbe-4f62-ae99-ea2d539f583d	3	Finance		2025-06-10 05:00:37.282213	Finance	Treasury Management	Revenue Accounting
dbd9d553-70c5-46d5-82f8-32aef2a8b8cd	Treasury Operations	Treasury Operations	Treasury Management / Treasury Operations	e5462d27-abbe-4f62-ae99-ea2d539f583d	3	Finance		2025-06-10 05:00:37.301187	Finance	Treasury Management	Treasury Operations
33a3a462-2a38-450d-b21f-32e15cf6e0c0	Core HR	Core HR	Core HR	03b8ebf4-2f89-4797-ac5d-84e5e868d061	2	Human Resources		2025-06-10 05:00:37.319276	Human Resources	Core HR	\N
46f2c049-62a1-42dc-b8b6-5f9f42deab2e	Contingent Worker	Contingent Worker	Core HR / Contingent Worker	33a3a462-2a38-450d-b21f-32e15cf6e0c0	3	Human Resources		2025-06-10 05:00:37.339213	Human Resources	Core HR	Contingent Worker
e0f62806-380a-44ef-9e62-1a80f0f44ed5	Workforce Deployment	Workforce Deployment	Core HR / Workforce Deployment	33a3a462-2a38-450d-b21f-32e15cf6e0c0	3	Human Resources		2025-06-10 05:00:37.357086	Human Resources	Core HR	Workforce Deployment
d2e0d725-1fbc-463a-9033-72a253cace15	Resource Management	Resource Management	Foundational Capabilities / Resource Management	29dd0433-f8f7-4182-b258-6a72e0b0107f	3	Enterprise Strategy		2025-06-10 05:00:37.375536	Enterprise Strategy	Foundational Capabilities	Resource Management
e2df61de-9240-4472-9e58-64c6f57ae794	HR Operations Management	HR Operations Management	HR Operations Management	03b8ebf4-2f89-4797-ac5d-84e5e868d061	2	Human Resources		2025-06-10 05:00:37.393557	Human Resources	HR Operations Management	\N
a44c6ab4-bf6b-4311-8389-ebd4480b0233	Technical Transfer	Technical Transfer	IOPS Product Development / Technical Transfer	695bc906-4fcf-4449-9523-066e847d0763	3	Manufacturing		2025-06-10 05:00:37.410982	Manufacturing	IOPS Product Development	Technical Transfer
37122cc1-8657-41bb-b2ab-4a91f260c6b0	Compensation Management	Compensation Management	Compensation Management	03b8ebf4-2f89-4797-ac5d-84e5e868d061	2	Human Resources		2025-06-10 05:00:37.429465	Human Resources	Compensation Management	\N
f8f5cb34-982d-41b0-914f-db5032f64814	Fixed-Asset Project Accounting	Fixed-Asset Project Accounting	Treasury Management / Fixed-Asset Project Accounting	e5462d27-abbe-4f62-ae99-ea2d539f583d	3	Finance		2025-06-10 05:00:37.447516	Finance	Treasury Management	Fixed-Asset Project Accounting
57f73f6a-39c8-41c2-9643-e63ff24498f0	General Accounting and Reporting	General Accounting and Reporting	Treasury Management / General Accounting and Reporting	e5462d27-abbe-4f62-ae99-ea2d539f583d	3	Finance		2025-06-10 05:00:37.465497	Finance	Treasury Management	General Accounting and Reporting
bd320dc9-3d6d-4e28-b662-8629be249507	Application Management	Application Management	IOPS Enterprise Support / Application Management	4407fd27-9db3-4fa7-b565-70c5aa4606eb	3	Manufacturing		2025-06-10 05:00:37.483505	Manufacturing	IOPS Enterprise Support	Application Management
d56ba7fa-500c-459e-8cd7-12182a6c68dd	Infrastructure Management	Infrastructure Management	IOPS Enterprise Support / Infrastructure Management	4407fd27-9db3-4fa7-b565-70c5aa4606eb	3	Manufacturing		2025-06-10 05:00:37.501332	Manufacturing	IOPS Enterprise Support	Infrastructure Management
2f23e346-d5f7-4d09-bb5c-b730d8439a88	IOPS Plant Management	IOPS Plant Management	IOPS Plant Management	cad858cb-cd0f-4290-a5c0-8339f8e36ddf	2	Finance		2025-06-10 05:00:37.520237	Finance	IOPS Plant Management	\N
baf28f94-235e-460f-8af7-5f41f4ad918c	Asset Accounting	Asset Accounting	IOPS Plant Management / Asset Accounting	2f23e346-d5f7-4d09-bb5c-b730d8439a88	3	Finance		2025-06-10 05:00:37.539457	Finance	IOPS Plant Management	Asset Accounting
203e3193-cd47-46c9-aacf-6d2e8debb27e	Asset Management	Asset Management	IOPS Plant Management / Asset Management	c308521f-5a57-4dbc-bd03-f678c2d30e9f	3	Manufacturing		2025-06-10 05:00:37.557622	Manufacturing	IOPS Plant Management	Asset Management
c1af2727-e596-4634-87a7-5cb1ac4fab15	Asset Performance	Asset Performance	IOPS Plant Management / Asset Performance	c308521f-5a57-4dbc-bd03-f678c2d30e9f	3	Manufacturing		2025-06-10 05:00:37.575625	Manufacturing	IOPS Plant Management	Asset Performance
61f0db60-0986-45b2-972c-6afb0076ad26	Calibration Management	Calibration Management	IOPS Plant Management / Calibration Management	c308521f-5a57-4dbc-bd03-f678c2d30e9f	3	Manufacturing		2025-06-10 05:00:37.593778	Manufacturing	IOPS Plant Management	Calibration Management
10e925c4-4116-4d56-bcac-4a1f87f1bedc	Enterprise Recipe Mgmt	Enterprise Recipe Mgmt	IOPS Plant Management / Enterprise Recipe Mgmt	c308521f-5a57-4dbc-bd03-f678c2d30e9f	3	Manufacturing		2025-06-10 05:00:37.612462	Manufacturing	IOPS Plant Management	Enterprise Recipe Mgmt
51e1acb5-c1de-4a1f-9de0-019348d6d46b	Plant Maintenance	Plant Maintenance	IOPS Plant Management / Plant Maintenance	c308521f-5a57-4dbc-bd03-f678c2d30e9f	3	Manufacturing		2025-06-10 05:00:37.630408	Manufacturing	IOPS Plant Management	Plant Maintenance
dbb422ef-1ec7-4285-aaef-94ef41cb4bcc	Preventive Maintenance Scheduling	Preventive Maintenance Scheduling	IOPS Plant Management / Preventive Maintenance Scheduling	c308521f-5a57-4dbc-bd03-f678c2d30e9f	3	Manufacturing		2025-06-10 05:00:37.649532	Manufacturing	IOPS Plant Management	Preventive Maintenance Scheduling
44fe7fab-170b-488d-a9b2-f89863a6e629	Work Order Management	Work Order Management	IOPS Plant Management / Work Order Management	c308521f-5a57-4dbc-bd03-f678c2d30e9f	3	Manufacturing		2025-06-10 05:00:37.667688	Manufacturing	IOPS Plant Management	Work Order Management
9af6f60c-6854-4585-aaf3-bee727799dcb	Engineering, Design and Construction Management	Engineering, Design and Construction Management	Real Estate & Facilities Management / Engineering, Design and Construction Management	4715caa9-dec0-4aeb-a7a5-51442a72a2f9	3	Asset Management		2025-06-10 05:00:37.685723	Asset Management	Real Estate & Facilities Management	Engineering, Design and Construction Management
1089d910-7b40-403a-a520-8121ca7a1d3a	Finance	Finance	Collaborations & Touchpoints / Finance	12ba5e03-ec7d-4286-9515-cf791007d2ed	3	Enterprise Strategy		2025-06-10 05:00:37.703762	Enterprise Strategy	Collaborations & Touchpoints	Finance
752ac7ff-cc43-428c-b3e0-a481532e4db8	Wellness	Wellness	Benefits Management / Wellness	f2fab90d-fb87-4d41-b6be-5aac108becb6	3	Human Resources		2025-06-10 05:00:37.722293	Human Resources	Benefits Management	Wellness
16d4318a-3255-4b86-8c66-97fc53de7d08	Integration	Integration	Integration	9d4ec6ea-a5e6-4c0c-82cd-ec7c5db26324	2	Enterprise Strategy		2025-06-10 05:00:37.740087	Enterprise Strategy	Integration	\N
e37fa52b-0e9e-4d10-b455-ce779aa46b04	HR Absence Management	HR Absence Management	Core HR / HR Absence Management	33a3a462-2a38-450d-b21f-32e15cf6e0c0	3	Human Resources		2025-06-10 05:00:37.756892	Human Resources	Core HR	HR Absence Management
1e793abc-722f-47fe-a5c3-8e33c38359a4	Research	Research	Collaborations & Touchpoints / Research	12ba5e03-ec7d-4286-9515-cf791007d2ed	3	Enterprise Strategy		2025-06-10 05:00:37.775437	Enterprise Strategy	Collaborations & Touchpoints	Research
2c429073-9b00-4817-bca2-2d2cd9575ca2	Building Automation	Building Automation	IOPS Plant Management / Building Automation	c308521f-5a57-4dbc-bd03-f678c2d30e9f	3	Manufacturing		2025-06-10 05:00:37.793287	Manufacturing	IOPS Plant Management	Building Automation
8e798dd9-b0f1-49e9-a42b-3ede37c55f1a	Facilities Operations and Maintenance	Facilities Operations and Maintenance	Real Estate & Facilities Management / Facilities Operations and Maintenance	4715caa9-dec0-4aeb-a7a5-51442a72a2f9	3	Asset Management		2025-06-10 05:00:37.810947	Asset Management	Real Estate & Facilities Management	Facilities Operations and Maintenance
5d78fa5d-e13f-4d0c-98d0-8aa160ddc649	Learning Management	Learning Management	Talent Development / Learning Management	b4d2a3db-ff3b-4615-b09a-e7c25eee5cd2	3	Human Resources		2025-06-10 05:00:37.829122	Human Resources	Talent Development	Learning Management
98c1f7dd-301f-4619-81ea-a363db5b875e	Environmental Health and Safety (EHS)	Environmental Health and Safety (EHS)	IOPS Plant Management / Environmental Health and Safety (EHS)	c308521f-5a57-4dbc-bd03-f678c2d30e9f	3	Manufacturing		2025-06-10 05:00:37.847979	Manufacturing	IOPS Plant Management	Environmental Health and Safety (EHS)
d5b34afb-77dd-4c90-8201-257b9ec3dac0	IT Security	IT Security	IOPS Enterprise Support / IT Security	4407fd27-9db3-4fa7-b565-70c5aa4606eb	3	Manufacturing		2025-06-10 05:00:37.866637	Manufacturing	IOPS Enterprise Support	IT Security
dd6910bf-34d2-4eb9-8efe-1e9e3024bb3b	Reporting and Analytics	Reporting and Analytics	Foundational Capabilities / Reporting and Analytics	29dd0433-f8f7-4182-b258-6a72e0b0107f	3	Enterprise Strategy		2025-06-10 05:00:37.88604	Enterprise Strategy	Foundational Capabilities	Reporting and Analytics
8e901c07-1111-4db1-a70c-a71ff1e176b2	Regulatory (GDS)	Regulatory (GDS)	Collaborations & Touchpoints / Regulatory (GDS)	12ba5e03-ec7d-4286-9515-cf791007d2ed	3	Enterprise Strategy		2025-06-10 05:00:37.903855	Enterprise Strategy	Collaborations & Touchpoints	Regulatory (GDS)
041c0f77-91b1-4eaf-a55a-648eae28fdda	DO&PM	DO&PM	Collaborations & Touchpoints / DO&PM	12ba5e03-ec7d-4286-9515-cf791007d2ed	3	Enterprise Strategy		2025-06-10 05:00:37.922338	Enterprise Strategy	Collaborations & Touchpoints	DO&PM
bbca66b2-a0a5-42a7-9536-a5b96d93f9be	Portfolio Mgmt	Portfolio Mgmt	IOPS Enterprise Support / Portfolio Mgmt	4407fd27-9db3-4fa7-b565-70c5aa4606eb	3	Manufacturing		2025-06-10 05:00:37.940037	Manufacturing	IOPS Enterprise Support	Portfolio Mgmt
36af656a-219b-4e27-b983-98b668019d74	Product Lifecycle Management	Product Lifecycle Management	IOPS Supply Chain Management / Product Lifecycle Management	00c9829c-9023-4a35-9af7-92a57f773f12	3	Manufacturing		2025-06-10 05:00:37.95886	Manufacturing	IOPS Supply Chain Management	Product Lifecycle Management
fb7b8f4b-6613-41f9-ae2d-afd83dbc042c	Travel & Expense Management	Travel & Expense Management	Accounting / Travel & Expense Management	68b1488b-8711-451f-ad15-49ba4fee3b0e	3	Finance		2025-06-10 05:00:37.975875	Finance	Accounting	Travel & Expense Management
2fb1f1c9-7f33-4cf5-8401-cb721d73da53	Cold Chain Tracking	Cold Chain Tracking	IOPS Supply Chain Management / Cold Chain Tracking	00c9829c-9023-4a35-9af7-92a57f773f12	3	Manufacturing		2025-06-10 05:00:37.994236	Manufacturing	IOPS Supply Chain Management	Cold Chain Tracking
37fd483b-3ae0-49c8-8e93-76afa4405957	OTL Reporting	OTL Reporting	IOPS Enterprise Support / OTL Reporting	4407fd27-9db3-4fa7-b565-70c5aa4606eb	3	Manufacturing		2025-06-10 05:00:38.012545	Manufacturing	IOPS Enterprise Support	OTL Reporting
aa2ce050-95a6-4111-a2f9-324289dd398d	Lease Management	Lease Management	Accounting / Lease Management	68b1488b-8711-451f-ad15-49ba4fee3b0e	3	Finance		2025-06-10 05:00:38.030346	Finance	Accounting	Lease Management
870738d3-a918-404a-8545-6814ee625e59	Translation Service	Translation Service	Foundational Capabilities / Translation Service	29dd0433-f8f7-4182-b258-6a72e0b0107f	3	Enterprise Strategy		2025-06-10 05:00:38.048935	Enterprise Strategy	Foundational Capabilities	Translation Service
f009de25-9586-4216-a89a-2bb695538822	IOPS Product Manufacturing	IOPS Product Manufacturing	IOPS Product Manufacturing	e6b45cdf-6a74-442d-81a6-9392496125d1	2	Manufacturing		2025-06-10 05:00:38.067985	Manufacturing	IOPS Product Manufacturing	\N
20f0f434-d318-461d-acf8-0c626619d653	Operational Performance	Operational Performance	IOPS Product Manufacturing / Operational Performance	f009de25-9586-4216-a89a-2bb695538822	3	Manufacturing		2025-06-10 05:00:38.086717	Manufacturing	IOPS Product Manufacturing	Operational Performance
fa10da29-d92b-4a46-a18e-685b8c083c18	Regulatory Jurisdiction Planning	Regulatory Jurisdiction Planning	IOPS Product Manufacturing / Regulatory Jurisdiction Planning	f009de25-9586-4216-a89a-2bb695538822	3	Manufacturing		2025-06-10 05:00:38.111232	Manufacturing	IOPS Product Manufacturing	Regulatory Jurisdiction Planning
6d1512eb-10cf-4029-87bd-94170a263771	Process Characterization	Process Characterization	IOPS Product Development / Process Characterization	695bc906-4fcf-4449-9523-066e847d0763	3	Manufacturing		2025-06-10 05:00:38.133695	Manufacturing	IOPS Product Development	Process Characterization
0702e1eb-717f-4e82-89f2-1ec46d8c27a4	Data Aggregation and Storage	Data Aggregation and Storage	Foundational Capabilities / Data Aggregation and Storage	29dd0433-f8f7-4182-b258-6a72e0b0107f	3	Enterprise Strategy		2025-06-10 05:00:38.151811	Enterprise Strategy	Foundational Capabilities	Data Aggregation and Storage
134fa164-e244-45a8-9900-dafd59647d34	Data Integration and Collaboration	Data Integration and Collaboration	Foundational Capabilities / Data Integration and Collaboration	29dd0433-f8f7-4182-b258-6a72e0b0107f	3	Enterprise Strategy		2025-06-10 05:00:38.170849	Enterprise Strategy	Foundational Capabilities	Data Integration and Collaboration
7209c00f-b6ce-4d69-9750-f3310d675498	Accounts Payable	Accounts Payable	Accounting / Accounts Payable	68b1488b-8711-451f-ad15-49ba4fee3b0e	3	Finance		2025-06-10 05:00:38.188991	Finance	Accounting	Accounts Payable
a28b4bce-4aa0-494c-ba29-aed0b621352c	Manage Corporate Governance & Services	Manage Corporate Governance & Services	Manage Corporate Governance & Services	67ae4376-c88f-4a21-8c70-a989af2527d0	2	Governance, Risk and Compliance		2025-06-10 05:00:38.208685	Governance, Risk and Compliance	Manage Corporate Governance & Services	\N
9625ab83-f0ba-4302-b9b3-b91c07114e0c	Manage Corporate Securities	Manage Corporate Securities	Manage Corporate Governance & Services / Manage Corporate Securities	a28b4bce-4aa0-494c-ba29-aed0b621352c	3	Governance, Risk and Compliance		2025-06-10 05:00:38.226637	Governance, Risk and Compliance	Manage Corporate Governance & Services	Manage Corporate Securities
81ad12c3-4adb-49bd-9a22-865a72a2c136	Data Entry, Collection and Verification	Data Entry, Collection and Verification	IOPS Product Development / Data Entry, Collection and Verification	695bc906-4fcf-4449-9523-066e847d0763	3	Manufacturing		2025-06-10 05:00:38.244509	Manufacturing	IOPS Product Development	Data Entry, Collection and Verification
1ea7e7a9-0a45-4c37-be6c-b97978f65589	In Process Control (IPC) Trending	In Process Control (IPC) Trending	IOPS Product Development / In Process Control (IPC) Trending	695bc906-4fcf-4449-9523-066e847d0763	3	Manufacturing		2025-06-10 05:00:38.262429	Manufacturing	IOPS Product Development	In Process Control (IPC) Trending
b2ac8772-46b3-4914-becc-a0570a9510e9	Process Monitoring	Process Monitoring	IOPS Product Development / Process Monitoring	695bc906-4fcf-4449-9523-066e847d0763	3	Manufacturing		2025-06-10 05:00:38.280404	Manufacturing	IOPS Product Development	Process Monitoring
236aaa42-4ee6-4d3a-873c-73847a0c926c	Process Sciences New Technology Development	Process Sciences New Technology Development	IOPS Product Development / Process Sciences New Technology Development	695bc906-4fcf-4449-9523-066e847d0763	3	Manufacturing		2025-06-10 05:00:38.298085	Manufacturing	IOPS Product Development	Process Sciences New Technology Development
3f8ddb14-df32-4879-8992-57befa9f7496	CMO Operations Management	CMO Operations Management	IOPS Product Manufacturing / CMO Operations Management	f009de25-9586-4216-a89a-2bb695538822	3	Manufacturing		2025-06-10 05:00:38.316216	Manufacturing	IOPS Product Manufacturing	CMO Operations Management
bdab0a48-463d-4df2-b552-05dffd49c7bb	Sourcing	Sourcing	Sourcing	b346329c-09ec-4378-8c12-2cfd971bfa9d	2	Sourcing and Procurement		2025-06-10 05:00:38.33427	Sourcing and Procurement	Sourcing	\N
522592c0-2a59-45cb-ad53-ef6d59b4b8e2	Downtime Reporting	Downtime Reporting	IOPS Plant Management / Downtime Reporting	c308521f-5a57-4dbc-bd03-f678c2d30e9f	3	Manufacturing		2025-06-10 05:00:38.352864	Manufacturing	IOPS Plant Management	Downtime Reporting
4bbacb75-bd3b-4c09-9562-03a2e964176e	Shift Handover	Shift Handover	IOPS Product Manufacturing / Shift Handover	f009de25-9586-4216-a89a-2bb695538822	3	Manufacturing		2025-06-10 05:00:38.371807	Manufacturing	IOPS Product Manufacturing	Shift Handover
ab3ae5c7-cf0a-4cbc-916c-ef12f477d8ae	Lab Chromatography	Lab Chromatography	IOPS Quality Control / Lab Chromatography	363ca1f2-24a7-4c29-8a60-01c070a39da6	3	Manufacturing		2025-06-10 05:00:38.389801	Manufacturing	IOPS Quality Control	Lab Chromatography
7f355e52-0979-4203-8b81-6f8dbcc1a488	Database	Database	Database	9d4ec6ea-a5e6-4c0c-82cd-ec7c5db26324	2	Enterprise Strategy		2025-06-10 05:00:38.407752	Enterprise Strategy	Database	\N
4e59e803-069c-41c9-9c0a-0f120b21bbff	Client Services	Client Services	IOPS Enterprise Support / Client Services	4407fd27-9db3-4fa7-b565-70c5aa4606eb	3	Manufacturing		2025-06-10 05:00:38.426567	Manufacturing	IOPS Enterprise Support	Client Services
2023e4dd-ca67-469d-856e-c68f64208191	Oversee Allegations & Investigations	Oversee Allegations & Investigations	Maintain and Enhance Ethics & Compliance / Oversee Allegations & Investigations	52d9a0ed-9018-459a-b532-2e3c3f59002b	3	Governance, Risk and Compliance		2025-06-10 05:00:38.444466	Governance, Risk and Compliance	Maintain and Enhance Ethics & Compliance	Oversee Allegations & Investigations
13890b88-b23a-414d-bb1a-c964b9a1fd8d	Tax	Tax	Tax	cad858cb-cd0f-4290-a5c0-8339f8e36ddf	2	Finance		2025-06-10 05:00:38.462655	Finance	Tax	\N
ef096326-bfd3-4706-995b-d501b92db898	Process Control	Process Control	IOPS Plant Management / Process Control	c308521f-5a57-4dbc-bd03-f678c2d30e9f	3	Manufacturing		2025-06-10 05:00:38.480609	Manufacturing	IOPS Plant Management	Process Control
75742ed6-4c0d-42d6-b6c6-97a3fa10641d	Badge and Access Management	Badge and Access Management	IOPS Plant Management / Badge and Access Management	c308521f-5a57-4dbc-bd03-f678c2d30e9f	3	Manufacturing		2025-06-10 05:00:38.498733	Manufacturing	IOPS Plant Management	Badge and Access Management
3b3fa7da-c757-46dc-a0e3-43e321b6a32d	Relocation	Relocation	Benefits Management / Relocation	f2fab90d-fb87-4d41-b6be-5aac108becb6	3	Human Resources		2025-06-10 05:00:38.516602	Human Resources	Benefits Management	Relocation
e6a2cada-6453-4666-8d17-d090f6976302	Financial Reporting	Financial Reporting	IOPS Enterprise Support / Financial Reporting	4407fd27-9db3-4fa7-b565-70c5aa4606eb	3	Manufacturing		2025-06-10 05:00:38.534566	Manufacturing	IOPS Enterprise Support	Financial Reporting
cc42a906-7b8e-4198-9d86-60ec9dbc8015	Capital Planning	Capital Planning	IOPS Enterprise Support / Capital Planning	4407fd27-9db3-4fa7-b565-70c5aa4606eb	3	Manufacturing		2025-06-10 05:00:38.552575	Manufacturing	IOPS Enterprise Support	Capital Planning
fc5f476e-91ba-46d8-b756-6ef729b115ee	Financial Forecasting & Budgeting	Financial Forecasting & Budgeting	IOPS Enterprise Support / Financial Forecasting & Budgeting	4407fd27-9db3-4fa7-b565-70c5aa4606eb	3	Manufacturing		2025-06-10 05:00:38.570347	Manufacturing	IOPS Enterprise Support	Financial Forecasting & Budgeting
dfc60de3-2351-4368-b8cd-a706f37eef04	Enable Business Transactions	Enable Business Transactions	Enable Business Transactions	9d4ec6ea-a5e6-4c0c-82cd-ec7c5db26324	2	Enterprise Strategy		2025-06-10 05:00:38.58676	Enterprise Strategy	Enable Business Transactions	\N
4f50ec08-2ca6-48f4-8dfa-68d3b95bdcc5	Manage Contracts	Manage Contracts	Enable Business Transactions / Manage Contracts	dfc60de3-2351-4368-b8cd-a706f37eef04	3	Enterprise Strategy		2025-06-10 05:00:38.604573	Enterprise Strategy	Enable Business Transactions	Manage Contracts
85a69503-cac2-43ec-801c-16892132739a	Finance	Finance	Foundational Capabilities / Finance	29dd0433-f8f7-4182-b258-6a72e0b0107f	3	Enterprise Strategy		2025-06-10 05:00:38.622326	Enterprise Strategy	Foundational Capabilities	Finance
0fff0070-c65d-4065-9a63-2b2345cc284d	Contract Management	Contract Management	IOPS Enterprise Support / Contract Management	4407fd27-9db3-4fa7-b565-70c5aa4606eb	3	Manufacturing		2025-06-10 05:00:38.640226	Manufacturing	IOPS Enterprise Support	Contract Management
6608dce8-d443-435b-80f8-b29c58f7daa5	Monitor Intellectual Property	Monitor Intellectual Property	Protect Intellectual Property / Monitor Intellectual Property	a539c1cf-f81a-4361-b024-e5ac8249a78b	3	Governance, Risk and Compliance		2025-06-10 05:00:38.659248	Governance, Risk and Compliance	Protect Intellectual Property	Monitor Intellectual Property
743458f8-47cc-4227-96ca-3f88b5184e0f	Inspection Management	Inspection Management	IOPS Quality Assurance / Inspection Management	864f9a15-009e-461b-acd5-7f37fbe7d9c5	3	Manufacturing		2025-06-10 05:00:38.677104	Manufacturing	IOPS Quality Assurance	Inspection Management
d5ca91fd-885f-4f45-b02c-eda9a6a0dda3	Global Procurement	Global Procurement	IOPS Enterprise Support / Global Procurement	4407fd27-9db3-4fa7-b565-70c5aa4606eb	3	Manufacturing		2025-06-10 05:00:38.695559	Manufacturing	IOPS Enterprise Support	Global Procurement
a159f54f-4144-444e-a7d5-f247b7d68082	Supplier Management	Supplier Management	IOPS Enterprise Support / Supplier Management	4407fd27-9db3-4fa7-b565-70c5aa4606eb	3	Manufacturing		2025-06-10 05:00:38.713088	Manufacturing	IOPS Enterprise Support	Supplier Management
8b1fea15-986c-4ba2-a58b-acb6fa5afaeb	Inventory Management	Inventory Management	IOPS Supply Chain Management / Inventory Management	00c9829c-9023-4a35-9af7-92a57f773f12	3	Manufacturing		2025-06-10 05:00:38.730966	Manufacturing	IOPS Supply Chain Management	Inventory Management
f5b450d8-90b6-4560-ad86-c94564a5f63b	Vendor Management	Vendor Management	Vendor Management	b346329c-09ec-4378-8c12-2cfd971bfa9d	2	Sourcing and Procurement		2025-06-10 05:00:38.748415	Sourcing and Procurement	Vendor Management	\N
5a76d888-a3d2-4125-992f-e431062b5842	Power Management	Power Management	Power Management	9d4ec6ea-a5e6-4c0c-82cd-ec7c5db26324	2	Enterprise Strategy		2025-06-10 05:00:38.766373	Enterprise Strategy	Power Management	\N
3a08a16f-3023-4311-b657-67724c144dd5	Support and Maintenance	Support and Maintenance	Foundational Capabilities / Support and Maintenance	29dd0433-f8f7-4182-b258-6a72e0b0107f	3	Enterprise Strategy		2025-06-10 05:00:38.784096	Enterprise Strategy	Foundational Capabilities	Support and Maintenance
7ad3355b-1d6b-4a32-9b15-18d6e14add99	Data & Statistical Analysis	Data & Statistical Analysis	IOPS Enterprise Support / Data & Statistical Analysis	4407fd27-9db3-4fa7-b565-70c5aa4606eb	3	Manufacturing		2025-06-10 05:00:38.802318	Manufacturing	IOPS Enterprise Support	Data & Statistical Analysis
44cbc1c9-a416-441d-a76e-8739493638b0	Inventory and Spare Parts Management	Inventory and Spare Parts Management	IOPS Plant Management / Inventory and Spare Parts Management	c308521f-5a57-4dbc-bd03-f678c2d30e9f	3	Manufacturing		2025-06-10 05:00:38.820769	Manufacturing	IOPS Plant Management	Inventory and Spare Parts Management
cb55004b-0281-4465-ad13-3dba8d8fd20e	Clinical Drug Supply and Logistics	Clinical Drug Supply and Logistics	Collaborations & Touchpoints / Clinical Drug Supply and Logistics	12ba5e03-ec7d-4286-9515-cf791007d2ed	3	Enterprise Strategy		2025-06-10 05:00:38.838401	Enterprise Strategy	Collaborations & Touchpoints	Clinical Drug Supply and Logistics
5c91aa8a-3639-408c-8889-5f089f9529e7	Master Data Management	Master Data Management	IOPS Enterprise Support / Master Data Management	4407fd27-9db3-4fa7-b565-70c5aa4606eb	3	Manufacturing		2025-06-10 05:00:38.856421	Manufacturing	IOPS Enterprise Support	Master Data Management
c9bf9027-1a7b-4201-ac7f-e3b4a1c55d93	Capacity Planning	Capacity Planning	IOPS Supply Chain Management / Capacity Planning	00c9829c-9023-4a35-9af7-92a57f773f12	3	Manufacturing		2025-06-10 05:00:38.875517	Manufacturing	IOPS Supply Chain Management	Capacity Planning
716e5297-890b-4215-846a-0c0fb2a48ea9	Sales Inventory and Operations Planning (SIOP)	Sales Inventory and Operations Planning (SIOP)	IOPS Supply Chain Management / Sales Inventory and Operations Planning (SIOP)	00c9829c-9023-4a35-9af7-92a57f773f12	3	Manufacturing		2025-06-10 05:00:38.893271	Manufacturing	IOPS Supply Chain Management	Sales Inventory and Operations Planning (SIOP)
f40fc2af-0a13-4019-a770-9f8b3c9c485e	New Modalities Lab Operation	New Modalities Lab Operation	IOPS Product Development / New Modalities Lab Operation	695bc906-4fcf-4449-9523-066e847d0763	3	Manufacturing		2025-06-10 05:00:38.911128	Manufacturing	IOPS Product Development	New Modalities Lab Operation
d5fe7993-37ba-4df1-b631-90946028058b	Environmental Monitoring	Environmental Monitoring	IOPS Quality Control / Environmental Monitoring	363ca1f2-24a7-4c29-8a60-01c070a39da6	3	Manufacturing		2025-06-10 05:00:38.929087	Manufacturing	IOPS Quality Control	Environmental Monitoring
bc2520da-6ade-4dcd-9a81-5ab7680ea8d0	IOPS Enterprise Architecture	IOPS Enterprise Architecture	IOPS Enterprise Support / IOPS Enterprise Architecture	4407fd27-9db3-4fa7-b565-70c5aa4606eb	3	Manufacturing		2025-06-10 05:00:38.946819	Manufacturing	IOPS Enterprise Support	IOPS Enterprise Architecture
6ea0e1e4-afe1-4644-af23-ca571483b37a	IT Enterprise Architecture	IT Enterprise Architecture	IT Enterprise Architecture	9d4ec6ea-a5e6-4c0c-82cd-ec7c5db26324	2	Enterprise Strategy		2025-06-10 05:00:38.964816	Enterprise Strategy	IT Enterprise Architecture	\N
81e0f4c0-3d9e-4040-a3cd-8c97635c2e25	Batch Disposition Management	Batch Disposition Management	IOPS Quality Assurance / Batch Disposition Management	864f9a15-009e-461b-acd5-7f37fbe7d9c5	3	Manufacturing		2025-06-10 05:00:38.982691	Manufacturing	IOPS Quality Assurance	Batch Disposition Management
40472cf3-62dd-4b9d-82e7-21c506c6d61a	Batch Record Management	Batch Record Management	IOPS Product Manufacturing / Batch Record Management	f009de25-9586-4216-a89a-2bb695538822	3	Manufacturing		2025-06-10 05:00:39.000532	Manufacturing	IOPS Product Manufacturing	Batch Record Management
b78c5bc7-50dd-425b-b6e7-8376878a249a	Accounts Payable & Receivable	Accounts Payable & Receivable	IOPS Enterprise Support / Accounts Payable & Receivable	4407fd27-9db3-4fa7-b565-70c5aa4606eb	3	Manufacturing		2025-06-10 05:00:39.018086	Manufacturing	IOPS Enterprise Support	Accounts Payable & Receivable
29663c17-8e4d-418a-99dd-27e67252daa8	Touchpoints & Collaborations	Touchpoints & Collaborations	Touchpoints & Collaborations	9d4ec6ea-a5e6-4c0c-82cd-ec7c5db26324	2	Enterprise Strategy		2025-06-10 05:00:39.03551	Enterprise Strategy	Touchpoints & Collaborations	\N
396fd63a-307f-4007-9f3f-f598536fc87b	Global Transparency and Expansion	Global Transparency and Expansion	Maintain and Enhance Ethics & Compliance / Global Transparency and Expansion	52d9a0ed-9018-459a-b532-2e3c3f59002b	3	Governance, Risk and Compliance		2025-06-10 05:00:39.053552	Governance, Risk and Compliance	Maintain and Enhance Ethics & Compliance	Global Transparency and Expansion
32648133-f231-443c-9d80-16a4cf7688fe	Headcount Planning	Headcount Planning	Headcount Planning	03b8ebf4-2f89-4797-ac5d-84e5e868d061	2	Human Resources		2025-06-10 05:00:39.071202	Human Resources	Headcount Planning	\N
21ee8f93-cf67-48ca-8278-6252e7415fef	IT Risk Management	IT Risk Management	IOPS Enterprise Support / IT Risk Management	4407fd27-9db3-4fa7-b565-70c5aa4606eb	3	Manufacturing		2025-06-10 05:00:39.090019	Manufacturing	IOPS Enterprise Support	IT Risk Management
07444c62-5988-45a0-9a07-289b4e2e1c45	Workforce Planning	Workforce Planning	IOPS Enterprise Support / Workforce Planning	4407fd27-9db3-4fa7-b565-70c5aa4606eb	3	Manufacturing		2025-06-10 05:00:39.107029	Manufacturing	IOPS Enterprise Support	Workforce Planning
d8e54c1b-db59-40cb-b669-99d9dd3a19a5	Finite Scheduling	Finite Scheduling	IOPS Product Manufacturing / Finite Scheduling	f009de25-9586-4216-a89a-2bb695538822	3	Manufacturing		2025-06-10 05:00:39.123816	Manufacturing	IOPS Product Manufacturing	Finite Scheduling
128e1328-0ca6-4899-a642-c82f3d866b17	Personnel Management (Shift Scheduling)	Personnel Management (Shift Scheduling)	IOPS Product Manufacturing / Personnel Management (Shift Scheduling)	f009de25-9586-4216-a89a-2bb695538822	3	Manufacturing		2025-06-10 05:00:39.14148	Manufacturing	IOPS Product Manufacturing	Personnel Management (Shift Scheduling)
8150eafa-3d3e-4d10-b40f-0ec10ad8dfa4	Distribution Compliance	Distribution Compliance	IOPS Quality Assurance / Distribution Compliance	864f9a15-009e-461b-acd5-7f37fbe7d9c5	3	Manufacturing		2025-06-10 05:00:39.15942	Manufacturing	IOPS Quality Assurance	Distribution Compliance
9b0ac86e-e09c-4cdf-a59e-9576f2c5f4de	Lab Scheduling	Lab Scheduling	IOPS Quality Control / Lab Scheduling	363ca1f2-24a7-4c29-8a60-01c070a39da6	3	Manufacturing		2025-06-10 05:00:39.177254	Manufacturing	IOPS Quality Control	Lab Scheduling
1a703e89-5556-4234-830c-368f5c74d423	Global Trade Management	Global Trade Management	IOPS Supply Chain Management / Global Trade Management	00c9829c-9023-4a35-9af7-92a57f773f12	3	Manufacturing		2025-06-10 05:00:39.194977	Manufacturing	IOPS Supply Chain Management	Global Trade Management
f4e55d45-bad7-4175-a142-41307cc7c2df	Warehouse Management	Warehouse Management	IOPS Supply Chain Management / Warehouse Management	00c9829c-9023-4a35-9af7-92a57f773f12	3	Manufacturing		2025-06-10 05:00:39.212825	Manufacturing	IOPS Supply Chain Management	Warehouse Management
3fe23ac8-fb12-43a9-a099-6fa5bbd96382	GD Quality	GD Quality	Collaborations & Touchpoints / GD Quality	12ba5e03-ec7d-4286-9515-cf791007d2ed	3	Enterprise Strategy		2025-06-10 05:00:39.230796	Enterprise Strategy	Collaborations & Touchpoints	GD Quality
a1291ef1-4c9b-40d4-9825-b982b16d7776	In-Process and Product Release Testing	In-Process and Product Release Testing	IOPS Quality Control / In-Process and Product Release Testing	363ca1f2-24a7-4c29-8a60-01c070a39da6	3	Manufacturing		2025-06-10 05:00:39.248399	Manufacturing	IOPS Quality Control	In-Process and Product Release Testing
4e332e73-60f3-4659-9f38-015fe43792ca	Lab Inventory Mgmt	Lab Inventory Mgmt	IOPS Quality Control / Lab Inventory Mgmt	363ca1f2-24a7-4c29-8a60-01c070a39da6	3	Manufacturing		2025-06-10 05:00:39.266047	Manufacturing	IOPS Quality Control	Lab Inventory Mgmt
e8ab5b32-b114-4341-b9c3-c0a96e779f15	Non-routine testing	Non-routine testing	IOPS Quality Control / Non-routine testing	363ca1f2-24a7-4c29-8a60-01c070a39da6	3	Manufacturing		2025-06-10 05:00:39.28277	Manufacturing	IOPS Quality Control	Non-routine testing
8e101fa9-690c-4620-b2da-e63a35aa650d	Raw Materials Testing	Raw Materials Testing	IOPS Quality Control / Raw Materials Testing	363ca1f2-24a7-4c29-8a60-01c070a39da6	3	Manufacturing		2025-06-10 05:00:39.300716	Manufacturing	IOPS Quality Control	Raw Materials Testing
19bfef0a-d74e-45c4-b32e-cd3d94f41579	Reference Standards and Reagent Mgmt	Reference Standards and Reagent Mgmt	IOPS Quality Control / Reference Standards and Reagent Mgmt	363ca1f2-24a7-4c29-8a60-01c070a39da6	3	Manufacturing		2025-06-10 05:00:39.318539	Manufacturing	IOPS Quality Control	Reference Standards and Reagent Mgmt
3b996b0f-1109-4b67-91a8-eb2cad91c511	Sample Management	Sample Management	IOPS Quality Control / Sample Management	363ca1f2-24a7-4c29-8a60-01c070a39da6	3	Manufacturing		2025-06-10 05:00:39.336025	Manufacturing	IOPS Quality Control	Sample Management
8dfd153b-9862-4278-83d5-865cae497416	Stability Management	Stability Management	IOPS Quality Control / Stability Management	363ca1f2-24a7-4c29-8a60-01c070a39da6	3	Manufacturing		2025-06-10 05:00:39.352894	Manufacturing	IOPS Quality Control	Stability Management
6e62d5c6-df6a-4e29-b797-86af0b78a016	Test & Result Management	Test & Result Management	IOPS Quality Control / Test & Result Management	363ca1f2-24a7-4c29-8a60-01c070a39da6	3	Manufacturing		2025-06-10 05:00:39.370635	Manufacturing	IOPS Quality Control	Test & Result Management
4415a347-6c2b-49f9-b030-e33a6108aff9	Lab Data Capture & Mgmt	Lab Data Capture & Mgmt	IOPS Quality Control / Lab Data Capture & Mgmt	363ca1f2-24a7-4c29-8a60-01c070a39da6	3	Manufacturing		2025-06-10 05:00:39.388439	Manufacturing	IOPS Quality Control	Lab Data Capture & Mgmt
aabc2e2a-0a88-45d8-b8a1-8dcd40dfb727	Manage Data Privacy	Manage Data Privacy	Manage Data Privacy	67ae4376-c88f-4a21-8c70-a989af2527d0	2	Governance, Risk and Compliance		2025-06-10 05:00:39.406247	Governance, Risk and Compliance	Manage Data Privacy	\N
9423bc80-69d8-45ec-bc80-81193db30c47	Privacy Risk Assessment	Privacy Risk Assessment	Manage Data Privacy / Privacy Risk Assessment	aabc2e2a-0a88-45d8-b8a1-8dcd40dfb727	3	Governance, Risk and Compliance		2025-06-10 05:00:39.422862	Governance, Risk and Compliance	Manage Data Privacy	Privacy Risk Assessment
881ab01e-956d-43ea-89a3-c6b2f0c93b06	Privacy Risk Prevention	Privacy Risk Prevention	Manage Data Privacy / Privacy Risk Prevention	aabc2e2a-0a88-45d8-b8a1-8dcd40dfb727	3	Governance, Risk and Compliance		2025-06-10 05:00:39.440624	Governance, Risk and Compliance	Manage Data Privacy	Privacy Risk Prevention
ea8cb392-f409-46f6-a31c-9b0fa5a74fb9	Record Retention Management	Record Retention Management	IOPS Quality Assurance / Record Retention Management	864f9a15-009e-461b-acd5-7f37fbe7d9c5	3	Manufacturing		2025-06-10 05:00:39.458711	Manufacturing	IOPS Quality Assurance	Record Retention Management
e6e46a01-75c1-4059-9d43-2ae5db40d74b	Manage Records	Manage Records	Manage Records	67ae4376-c88f-4a21-8c70-a989af2527d0	2	Governance, Risk and Compliance		2025-06-10 05:00:39.47682	Governance, Risk and Compliance	Manage Records	\N
6d512f40-7411-4762-98c9-32d7854445ae	Store and Maintain Records	Store and Maintain Records	Manage Records / Store and Maintain Records	e6e46a01-75c1-4059-9d43-2ae5db40d74b	3	Governance, Risk and Compliance		2025-06-10 05:00:39.494958	Governance, Risk and Compliance	Manage Records	Store and Maintain Records
009cf01d-3757-4b14-b8d7-ea4eaa9720e9	Product Serialization	Product Serialization	IOPS Product Manufacturing / Product Serialization	f009de25-9586-4216-a89a-2bb695538822	3	Manufacturing		2025-06-10 05:00:39.513092	Manufacturing	IOPS Product Manufacturing	Product Serialization
b79c4217-ce0e-46ed-9cdf-d7cd92c06c20	Inbound	Inbound	IOPS Supply Chain Management / Inbound	00c9829c-9023-4a35-9af7-92a57f773f12	3	Manufacturing		2025-06-10 05:00:39.530836	Manufacturing	IOPS Supply Chain Management	Inbound
cd6dce18-061e-4280-bf4c-57e09f57080c	Revenue Management	Revenue Management	Accounting / Revenue Management	68b1488b-8711-451f-ad15-49ba4fee3b0e	3	Finance		2025-06-10 05:00:39.548549	Finance	Accounting	Revenue Management
56fcd5c1-1548-483e-949e-6f77fff2a2e7	Fixed Assets and PP&E	Fixed Assets and PP&E	Accounting / Fixed Assets and PP&E	68b1488b-8711-451f-ad15-49ba4fee3b0e	3	Finance		2025-06-10 05:00:39.566264	Finance	Accounting	Fixed Assets and PP&E
6825b971-8cd5-457c-b05c-5d20ad8062ea	Purchasing	Purchasing	Purchasing	b346329c-09ec-4378-8c12-2cfd971bfa9d	2	Sourcing and Procurement		2025-06-10 05:00:39.58414	Sourcing and Procurement	Purchasing	\N
67503277-5541-4e0c-ba3b-57108adc07a0	IOPS Enterprise Support	IOPS Enterprise Support	IOPS Enterprise Support	cad858cb-cd0f-4290-a5c0-8339f8e36ddf	2	Finance		2025-06-10 05:00:39.600773	Finance	IOPS Enterprise Support	\N
e5f65063-fe8b-4ada-bb69-01644e26bada	Accounting	Accounting	IOPS Enterprise Support / Accounting	67503277-5541-4e0c-ba3b-57108adc07a0	3	Finance		2025-06-10 05:00:39.618428	Finance	IOPS Enterprise Support	Accounting
5c213c07-911b-4373-bc36-814936d7cacd	Cost Mgmt	Cost Mgmt	IOPS Enterprise Support / Cost Mgmt	4407fd27-9db3-4fa7-b565-70c5aa4606eb	3	Manufacturing		2025-06-10 05:00:39.636045	Manufacturing	IOPS Enterprise Support	Cost Mgmt
6a1d907f-c704-40f7-9c3f-906d2a53aebd	Raw Material Disposition	Raw Material Disposition	IOPS Quality Assurance / Raw Material Disposition	864f9a15-009e-461b-acd5-7f37fbe7d9c5	3	Manufacturing		2025-06-10 05:00:39.653603	Manufacturing	IOPS Quality Assurance	Raw Material Disposition
2bd46188-82cb-40d1-bdbb-1931256e32c5	Supplier Quality Management	Supplier Quality Management	IOPS Quality Assurance / Supplier Quality Management	864f9a15-009e-461b-acd5-7f37fbe7d9c5	3	Manufacturing		2025-06-10 05:00:39.672235	Manufacturing	IOPS Quality Assurance	Supplier Quality Management
87642148-f429-4c3a-84bb-7ad9ca713841	Management Reporting	Management Reporting	Accounting / Management Reporting	68b1488b-8711-451f-ad15-49ba4fee3b0e	3	Finance		2025-06-10 05:00:39.688788	Finance	Accounting	Management Reporting
8be555c7-a42b-4982-86c5-13f8b1d09c4a	Absence Management	Absence Management	Payroll / Absence Management	d11b44b8-6f27-49b8-8154-0c39e5fb97c3	3	Human Resources		2025-06-10 05:00:39.70617	Human Resources	Payroll	Absence Management
bb1d588d-7de7-414d-92f3-8b9002e99d23	Time and Attendance	Time and Attendance	Payroll / Time and Attendance	d11b44b8-6f27-49b8-8154-0c39e5fb97c3	3	Human Resources		2025-06-10 05:00:39.724994	Human Resources	Payroll	Time and Attendance
0b9e134a-eb1f-42e7-bdec-7ea02eb3be53	Master Data Management	Master Data Management	Consolidations and External Reporting / Master Data Management	e049697d-2f74-47d8-be4b-8f260f46b117	3	Finance		2025-06-10 05:00:39.743457	Finance	Consolidations and External Reporting	Master Data Management
0063f68f-820d-412f-b88d-223053471802	Financial Planning & Analytics	Financial Planning & Analytics	Financial Planning & Analytics	cad858cb-cd0f-4290-a5c0-8339f8e36ddf	2	Finance		2025-06-10 05:00:39.761335	Finance	Financial Planning & Analytics	\N
eceafe8d-9d20-450c-bcd1-dc21f51e6601	Budgeting & Forecasting	Budgeting & Forecasting	Financial Planning & Analytics / Budgeting & Forecasting	0063f68f-820d-412f-b88d-223053471802	3	Finance		2025-06-10 05:00:39.780154	Finance	Financial Planning & Analytics	Budgeting & Forecasting
2fe0fc2b-ab1e-4b10-ac0f-0dc00f3e47e2	BOD Reporting	BOD Reporting	Consolidations and External Reporting / BOD Reporting	e049697d-2f74-47d8-be4b-8f260f46b117	3	Finance		2025-06-10 05:00:39.798298	Finance	Consolidations and External Reporting	BOD Reporting
918a7d3a-7ea2-4e01-b545-de140757d0c8	External Reporting	External Reporting	Consolidations and External Reporting / External Reporting	e049697d-2f74-47d8-be4b-8f260f46b117	3	Finance		2025-06-10 05:00:39.818253	Finance	Consolidations and External Reporting	External Reporting
e1bff863-4285-439e-b096-64a7a80559c0	Management Accounting	Management Accounting	Accounting / Management Accounting	68b1488b-8711-451f-ad15-49ba4fee3b0e	3	Finance		2025-06-10 05:00:39.836345	Finance	Accounting	Management Accounting
184e4928-8095-40cb-b2a1-f29d885ff2a2	Allocation Management	Allocation Management	Financial Planning & Analytics / Allocation Management	0063f68f-820d-412f-b88d-223053471802	3	Finance		2025-06-10 05:00:39.854715	Finance	Financial Planning & Analytics	Allocation Management
43482fa3-9b55-4d37-ae2f-d2a06a82f750	Assay Development	Assay Development	IOPS Quality Control / Assay Development	363ca1f2-24a7-4c29-8a60-01c070a39da6	3	Manufacturing		2025-06-10 05:00:39.874932	Manufacturing	IOPS Quality Control	Assay Development
608f60d2-14b7-498e-8261-8ecf602303b8	Contract Lab Management	Contract Lab Management	IOPS Quality Control / Contract Lab Management	363ca1f2-24a7-4c29-8a60-01c070a39da6	3	Manufacturing		2025-06-10 05:00:39.892586	Manufacturing	IOPS Quality Control	Contract Lab Management
54ae0288-e42e-4eaf-ac3f-ae569acdc3c7	Lab Notebook Mgmt	Lab Notebook Mgmt	IOPS Quality Control / Lab Notebook Mgmt	363ca1f2-24a7-4c29-8a60-01c070a39da6	3	Manufacturing		2025-06-10 05:00:39.910227	Manufacturing	IOPS Quality Control	Lab Notebook Mgmt
6042bd82-3646-4fd1-8f06-164f4f035a3b	Lab Specification Mgmt	Lab Specification Mgmt	IOPS Quality Control / Lab Specification Mgmt	363ca1f2-24a7-4c29-8a60-01c070a39da6	3	Manufacturing		2025-06-10 05:00:39.927823	Manufacturing	IOPS Quality Control	Lab Specification Mgmt
a9a0d317-81d6-47a9-9622-fcb67a865d86	QC Logbook Mgmt	QC Logbook Mgmt	IOPS Quality Control / QC Logbook Mgmt	363ca1f2-24a7-4c29-8a60-01c070a39da6	3	Manufacturing		2025-06-10 05:00:39.945572	Manufacturing	IOPS Quality Control	QC Logbook Mgmt
69cd4983-f8e2-4fe6-9b29-bdee3d0053bc	Test Execution	Test Execution	IOPS Quality Control / Test Execution	363ca1f2-24a7-4c29-8a60-01c070a39da6	3	Manufacturing		2025-06-10 05:00:39.964111	Manufacturing	IOPS Quality Control	Test Execution
f8344610-0397-4b3b-8e05-f5cee7c6bf3a	Absence Mgmt	Absence Mgmt	IOPS Enterprise Support / Absence Mgmt	4407fd27-9db3-4fa7-b565-70c5aa4606eb	3	Manufacturing		2025-06-10 05:00:39.982097	Manufacturing	IOPS Enterprise Support	Absence Mgmt
c96a90f3-8ed1-4a50-9036-9beb56614937	Approved Supplier List (ASL) Management	Approved Supplier List (ASL) Management	IOPS Enterprise Support / Approved Supplier List (ASL) Management	4407fd27-9db3-4fa7-b565-70c5aa4606eb	3	Manufacturing		2025-06-10 05:00:40.00041	Manufacturing	IOPS Enterprise Support	Approved Supplier List (ASL) Management
3c59e25e-df69-4f82-a6b0-8985c6eac1d8	Product Specification Management	Product Specification Management	IOPS Product Development / Product Specification Management	695bc906-4fcf-4449-9523-066e847d0763	3	Manufacturing		2025-06-10 05:00:40.0183	Manufacturing	IOPS Product Development	Product Specification Management
e95aba4c-306f-4ea6-8c1f-8c060b45c6cd	IOPS Quality Assurance	IOPS Quality Assurance	IOPS Quality Assurance	67ae4376-c88f-4a21-8c70-a989af2527d0	2	Governance, Risk and Compliance		2025-06-10 05:00:40.037653	Governance, Risk and Compliance	IOPS Quality Assurance	\N
d8d8020e-82f1-47c1-a683-0dd8ea4365d0	Internal Audits/Self-Inspections	Internal Audits/Self-Inspections	IOPS Quality Assurance / Internal Audits/Self-Inspections	e95aba4c-306f-4ea6-8c1f-8c060b45c6cd	3	Governance, Risk and Compliance		2025-06-10 05:00:40.055518	Governance, Risk and Compliance	IOPS Quality Assurance	Internal Audits/Self-Inspections
5722c32d-10ec-4826-905f-be7ae18bd5e7	Product Quality Reviews	Product Quality Reviews	IOPS Quality Assurance / Product Quality Reviews	864f9a15-009e-461b-acd5-7f37fbe7d9c5	3	Manufacturing		2025-06-10 05:00:40.073302	Manufacturing	IOPS Quality Assurance	Product Quality Reviews
720653b5-61cf-4b9b-b68f-783c88c3bebf	Quality Management Review	Quality Management Review	IOPS Quality Assurance / Quality Management Review	864f9a15-009e-461b-acd5-7f37fbe7d9c5	3	Manufacturing		2025-06-10 05:00:40.091201	Manufacturing	IOPS Quality Assurance	Quality Management Review
cda9b7bb-4a5f-4a64-8db8-4050f7e951ef	Quality Risk Management	Quality Risk Management	IOPS Quality Assurance / Quality Risk Management	864f9a15-009e-461b-acd5-7f37fbe7d9c5	3	Manufacturing		2025-06-10 05:00:40.109348	Manufacturing	IOPS Quality Assurance	Quality Risk Management
701d5419-9de4-4a39-9fb6-6b51cd8c86a3	Validation	Validation	IOPS Quality Assurance / Validation	864f9a15-009e-461b-acd5-7f37fbe7d9c5	3	Manufacturing		2025-06-10 05:00:40.127345	Manufacturing	IOPS Quality Assurance	Validation
2a82a1bf-567c-44e9-bacb-e249da39b15a	Complaints Management	Complaints Management	IOPS Quality Assurance / Complaints Management	864f9a15-009e-461b-acd5-7f37fbe7d9c5	3	Manufacturing		2025-06-10 05:00:40.148645	Manufacturing	IOPS Quality Assurance	Complaints Management
e9d73d84-ada4-4f78-8a50-1aa20a013e83	Signal Monitoring	Signal Monitoring	IOPS Quality Assurance / Signal Monitoring	864f9a15-009e-461b-acd5-7f37fbe7d9c5	3	Manufacturing		2025-06-10 05:00:40.166242	Manufacturing	IOPS Quality Assurance	Signal Monitoring
738d5bf4-db7c-4f40-947f-c2825120f20e	Process Analytical Technology and automated process control	Process Analytical Technology and automated process control	IOPS Product Development / Process Analytical Technology and automated process control	695bc906-4fcf-4449-9523-066e847d0763	3	Manufacturing		2025-06-10 05:00:40.184596	Manufacturing	IOPS Product Development	Process Analytical Technology and automated process control
084eaa86-84a8-4cb8-a375-0ca479f41f27	Leave of Absence	Leave of Absence	Benefits Management / Leave of Absence	f2fab90d-fb87-4d41-b6be-5aac108becb6	3	Human Resources		2025-06-10 05:00:40.202763	Human Resources	Benefits Management	Leave of Absence
13ac7ee6-5624-4206-b2d7-c11544ccb9e1	B2B Collaboration	B2B Collaboration	IOPS Supply Chain Management / B2B Collaboration	00c9829c-9023-4a35-9af7-92a57f773f12	3	Manufacturing		2025-06-10 05:00:40.220523	Manufacturing	IOPS Supply Chain Management	B2B Collaboration
42514d54-b45c-4267-995f-64bbde674697	Knowledge and Content Management	Knowledge and Content Management	Foundational Capabilities / Knowledge and Content Management	29dd0433-f8f7-4182-b258-6a72e0b0107f	3	Enterprise Strategy		2025-06-10 05:00:40.238777	Enterprise Strategy	Foundational Capabilities	Knowledge and Content Management
6e9dfa9e-3ea0-4d90-a92d-9dd642fbad14	Talent Mgmt	Talent Mgmt	IOPS Enterprise Support / Talent Mgmt	4407fd27-9db3-4fa7-b565-70c5aa4606eb	3	Manufacturing		2025-06-10 05:00:40.257002	Manufacturing	IOPS Enterprise Support	Talent Mgmt
8962949a-7ee9-4fe9-8a3e-d7ac77de01bc	Performance Management	Performance Management	IOPS Enterprise Support / Performance Management	4407fd27-9db3-4fa7-b565-70c5aa4606eb	3	Manufacturing		2025-06-10 05:00:40.275205	Manufacturing	IOPS Enterprise Support	Performance Management
f99b11c3-a1ae-48b7-9026-aa3e96e0e925	Performance Management	Performance Management	Talent Development / Performance Management	b4d2a3db-ff3b-4615-b09a-e7c25eee5cd2	3	Human Resources		2025-06-10 05:00:40.293321	Human Resources	Talent Development	Performance Management
e4928c1a-63b7-4427-8bd5-1781380d2593	Project Management	Project Management	Core HR / Project Management	33a3a462-2a38-450d-b21f-32e15cf6e0c0	3	Human Resources		2025-06-10 05:00:40.312574	Human Resources	Core HR	Project Management
674337c8-e051-46eb-8d1c-0828a1029a21	Resource Management	Resource Management	Core HR / Resource Management	33a3a462-2a38-450d-b21f-32e15cf6e0c0	3	Human Resources		2025-06-10 05:00:40.330296	Human Resources	Core HR	Resource Management
86d44aeb-1230-4baa-a6ac-3e09964df540	Manage Outside Counsel	Manage Outside Counsel	Protect Intellectual Property / Manage Outside Counsel	a539c1cf-f81a-4361-b024-e5ac8249a78b	3	Governance, Risk and Compliance		2025-06-10 05:00:40.348174	Governance, Risk and Compliance	Protect Intellectual Property	Manage Outside Counsel
9fb3fa95-6d1a-4238-b8b3-d3c2a1b71295	Key Management	Key Management	IOPS Plant Management / Key Management	c308521f-5a57-4dbc-bd03-f678c2d30e9f	3	Manufacturing		2025-06-10 05:00:40.364874	Manufacturing	IOPS Plant Management	Key Management
f5e6ca42-f580-4add-9614-a2b949a6f877	GMA	GMA	Collaborations & Touchpoints / GMA	12ba5e03-ec7d-4286-9515-cf791007d2ed	3	Enterprise Strategy		2025-06-10 05:00:40.383434	Enterprise Strategy	Collaborations & Touchpoints	GMA
d9c0198f-1269-451d-bfd8-73de2b935e4b	Capital Expenditure Requests	Capital Expenditure Requests	Capital Expenditure Requests	cad858cb-cd0f-4290-a5c0-8339f8e36ddf	2	Finance		2025-06-10 05:00:40.401479	Finance	Capital Expenditure Requests	\N
ef675f08-4570-4d73-b104-0d1fd68c4d3a	Workspace Management	Workspace Management	IOPS Plant Management / Workspace Management	c308521f-5a57-4dbc-bd03-f678c2d30e9f	3	Manufacturing		2025-06-10 05:00:40.420416	Manufacturing	IOPS Plant Management	Workspace Management
8f3c20f2-3fb7-4940-b256-1daf9fe2d6d4	Continuous Improvement	Continuous Improvement	Real Estate & Facilities Management / Continuous Improvement	4715caa9-dec0-4aeb-a7a5-51442a72a2f9	3	Asset Management		2025-06-10 05:00:40.438278	Asset Management	Real Estate & Facilities Management	Continuous Improvement
6cad2f7c-90cd-4baa-9314-1ef2865acbd1	Record Retention Policies	Record Retention Policies	Manage Records / Record Retention Policies	e6e46a01-75c1-4059-9d43-2ae5db40d74b	3	Governance, Risk and Compliance		2025-06-10 05:00:40.456513	Governance, Risk and Compliance	Manage Records	Record Retention Policies
7c7ebe9f-0e67-4ead-a038-413db4613dd8	Work in Process (WIP) Management	Work in Process (WIP) Management	IOPS Product Manufacturing / Work in Process (WIP) Management	f009de25-9586-4216-a89a-2bb695538822	3	Manufacturing		2025-06-10 05:00:40.477314	Manufacturing	IOPS Product Manufacturing	Work in Process (WIP) Management
4119cba6-c74a-42fa-b88e-323900409738	Human Capital Management (HCM)	Human Capital Management (HCM)	IOPS Enterprise Support / Human Capital Management (HCM)	4407fd27-9db3-4fa7-b565-70c5aa4606eb	3	Manufacturing		2025-06-10 05:00:40.49506	Manufacturing	IOPS Enterprise Support	Human Capital Management (HCM)
1904342c-d78c-4a5e-be73-02bf4a6e2630	Procurement	Procurement	Collaborations & Touchpoints / Procurement	12ba5e03-ec7d-4286-9515-cf791007d2ed	3	Enterprise Strategy		2025-06-10 05:00:40.513151	Enterprise Strategy	Collaborations & Touchpoints	Procurement
fad1a31c-8bfd-400e-9fef-123ec00569f8	Manage Discovery & Legal Hold	Manage Discovery & Legal Hold	Manage Records / Manage Discovery & Legal Hold	e6e46a01-75c1-4059-9d43-2ae5db40d74b	3	Governance, Risk and Compliance		2025-06-10 05:00:40.530972	Governance, Risk and Compliance	Manage Records	Manage Discovery & Legal Hold
\.


--
-- Data for Name: data_objects; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.data_objects (id, name, display_name, rel_data_object_to_interface, rel_data_object_to_project, tags_gd_it_teams, tags_owned_by, tags_owning_function, tags_business_domain, tags_main_area, tags_business_unit, tags_lx_ps_wip, tags_region, tags_other_tags, rel_data_object_to_application, rel_to_child, created_at) FROM stdin;
08b1061a-eb2e-41d8-9b7f-c47a439e86d6	Absence	Absence	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	G&A IT	\N	\N	2025-06-10 04:59:01.414462
5467b86d-2cfb-4ab9-a62e-70a7c827b41d	Account data	Account data	IQVIA to Veeva CRM Global OneKey Integration - Account Data;Ultmarc to Veeva CRM Japan instance MDM Integration - Account Data	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:01.440643
b904a7ed-a23f-4964-807f-bde9ccbdae82	Accounting	Accounting	Legacy PBCS to Oracle eBS - GL, AP, PO;Oracle Finance to Data Warehouse	\N	\N	\N	\N	\N	\N	\N	\N	\N	G&A IT	\N	\N	2025-06-10 04:59:01.461161
1b764829-a6b0-4ca1-a829-25938441c042	Activities	Activities	Insights RM to ODL - Insights	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:01.484806
646f3d7d-f336-4afc-8e41-41165c6c46d3	Actual Hours	Actual Hours	Beeline to Insights RM - Actual Hours	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:01.503351
6350eeab-90f9-4282-a917-5125443dc83d	Actuals	Actuals	Insights RM to ODL - Insights	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:01.521852
fa5b98ab-be2b-4da0-a8f3-0007b77f206a	ADaM	ADaM	Multi Edit 2008 Lite  to Veeva Vault RIM Submissions - SDTM, ADaM, TLFs;PC SAS to Veeva Vault RIM Submissions - SDTM, ADaM, TLFs;SAS Grid to Veeva Vault RIM Submissions - SDTM, ADam, TLFs	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:01.540636
c3dcb8cf-f8d8-426f-ad6b-0c7c5adf799e	AE/SAE Case Data	AE/SAE Case Data	Argus to Axway - Case Data;Axway to Converge Health SRP - Case Data;Clinical EDC to PVIT - Case Data;Eversana/TechSol to PVIT - Case Data;Medical Safety Mailbox to PVIT - Case Data;Partner Safety DBs to Axway - Case Data;Partner Safety DBs to PVIT - Case Data;PV Case Management to Argus - Case Data;Vendor CIOMS to PVIT - Case Data	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:01.559326
e0dc6759-14f6-4dde-8da7-d3eeff4ff39d	Anti-Bribery Anti-Corruption Due Diligence	Anti-Bribery Anti-Corruption Due Diligence	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:01.576666
0c74ee5a-8cff-4ecf-9357-eb66de4ccc0f	Application Defect Data	Application Defect Data	Jira to OMS - Application Defect and Enhancement Data;ServiceNow (GD) to OMS - Application Defect data	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:01.59551
2428388b-079d-4f83-be9f-5e7c2134cc05	Application Enhancement Data	Application Enhancement Data	Jira to OMS - Application Defect and Enhancement Data	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:01.614045
99a5d39d-b5a4-4b5f-9843-e4e90b4fd2d2	Artwork	Artwork	Veeva RIM Registrations to LATIS - Document drafts, Artwork, Labeling requirements	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:01.631786
be87302d-3131-41df-bdfa-dac39f9798de	Assessment	Assessment	INT218_-_Business_Process_Transactions_-_Data_Warehouse__Qlik__Assessment_Data;INT218_-_Job_Applications_-_Data_Warehouse__Qlik__Interview_Data	\N	\N	\N	\N	\N	G&A IT	\N	\N	\N	G&A IT	\N	\N	2025-06-10 04:59:01.648646
8f68c13f-3816-4cd6-b1ca-5c2ad4a2cdee	Assignments	Assignments	Insights RM to ODL - Insights	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:01.66692
8a111a67-6a47-4945-b57c-552b9b1a4719	Audit Data	Audit Data	CRO to ODR - eTMF Document, Non CRF Data;ODR to QlikView/QlikSense - Audit Data, Metrics, Studies, Sites, Enrollments	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:01.685373
f34a2895-1a87-4c4d-b72a-b9494047872e	Base Unit of Measure (List enhanced by new UOMs)	Base Unit of Measure (List enhanced by new UOMs)	OPM to MES - Material Master (Item Master) (RAH);OPM to MES - Material Master (Item Master) (REN)	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:01.703244
01de9dbb-d334-40b4-ac34-7dd60921849f	Batch no.	Batch no.	MES to OPM - BRR Approval (RAH);MES to OPM - BRR Approval (REN);MES to OPM - Outgoing Transport (RAH);MES to OPM - Outgoing Transport (REN);MES to OPM - Permanent Inventory (RAH);MES to OPM - Permanent Inventory (REN);MES to OPM - Stock Creation on Manufacturing Order (RAH);MES to OPM - Take-Out (On Cost Center and Scrapping) (RAH);MES to OPM - Take-Out (On Cost Center and Scrapping) (REN);MES to OPM - Take-Out on Manufacturing Order (RAH);MES to OPM - Take-Out on Manufacturing Order (REN);MES to OPM - Transport Order (RAH);MES to OPM - Transport Order (REN);OPM to MES - Batch Master Data (Lot Generation) (RAH);OPM to MES - Batch Master Data (Lot Generation) (REN);OPM to MES - Incoming Transport (Intern Order or Sub Inv) (RAH);OPM to MES - Incoming Transport (Intern Order or Sub Inv) (REN);OPM to MES - Material Master (Item Master) (RAH);OPM to MES - Material Master (Item Master) (REN);OPM to MES - PROCESS ORDER (Batch) (RAH);OPM to MES - PROCESS ORDER (Batch) (REN)	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:01.722322
d5e505ee-bce8-4ff4-b8ee-a3e989d50233	Benefits	Benefits	Businesssolver to Oracle Payroll;INT084  Workday to Businessolver - Worker Data;Oracle Payroll to WageWorks;Wageworks to Oracle Payroll - Benefits	\N	\N	\N	\N	\N	\N	\N	\N	\N	G&A IT	\N	\N	2025-06-10 04:59:01.740483
876e1de5-ec7d-42e7-87d5-cacd4ee3f968	Bill of Material	Bill of Material	OPM to MES - Master Batch Record (BOM & Routing) (RAH);OPM to MES - Master Batch Record (BOM & Routing) (REN)	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:01.757711
7bc116a0-61f6-46fa-819e-9f03acd42093	BOM Item no.	BOM Item no.	MES to OPM - Take-Out on Manufacturing Order (RAH);MES to OPM - Take-Out on Manufacturing Order (REN);OPM to MES - PROCESS ORDER (Batch) (RAH);OPM to MES - PROCESS ORDER (Batch) (REN)	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:01.774672
ca11c575-8952-42ad-9208-2c2df9ad52af	BRR Approval Decision	BRR Approval Decision	MES to OPM - BRR Approval (RAH);MES to OPM - BRR Approval (REN)	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:01.792687
e694ab4a-1d3a-4196-af0c-a6ba806d5800	Buildings	Buildings	Data Warehouse to Fusion BCP	\N	\N	\N	\N	\N	\N	\N	\N	\N	G&A IT	\N	\N	2025-06-10 04:59:01.810828
6c02e913-54e6-47be-8104-29fdbb201799	Call Activity	Call Activity	Global Medical Analytics Datawarehouse to Qlik (Qlikview & QlikSense) - Call activity, medical information;RTS to Global Medical Analytics Datawarehouse - Call activity, Medical information;Veeva Medical CRM Global to Global Medical Analytics Datawarehouse - Call activity, medical information;Veeva Medical CRM to Engage - Call Activity;Veeva Medical CRM to RTS - Call activity, medical information	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Veeva Medical CRM Global	\N	2025-06-10 04:59:01.827505
f344bbc0-7176-447c-881a-ad0820b0961a	Call Center Inquiry Data	Call Center Inquiry Data	Sanofi Med Info Platform to RWDnA Platform - Call Center Inquiry Data	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:01.846603
68841e43-70de-4387-bcb9-fd541fd744ff	Candidate	Candidate	BrassRing to Qlik (External App);Candidates_Qlik_INT;HRDL_RPT_RAAS_Requisitions_Qlik;INT085  Avature to Workday - Candidate Information (PUT CANDIDATE);INT086  Workday to Candex - Candidate Status;INT090  Workday to Candex - All Requisitions;INT174  Workday to HireRight - Background Check;INT206  Candex to Workday - Candidate data include attachments;INT207  Candex to Workday - Candidate attachments;INT218_-_Business_Process_Transactions_-_Data_Warehouse__Qlik__Job_Application_Event;INT218_-_Job_Applications_-_Data_Warehouse__Qlik__Application_Data;INT218_-_Job_Applications_-_Data_Warehouse__Qlik__Candidate_Profile_Data;INT218_-_Job_Applications_-_Data_Warehouse__Qlik__Interview_Data;INT261 Workday to Modern Hire;INT265  Workday to Avature - Candidate Status;INT290 – Out - Workday to Beamery – CRM-API-Design;INT291 - Out - Workday to Beamery-Career Site -RAAS;INT294 - Out - Workday to Graebel - Candidate Data Feed - EIB;Oracle Finance to Data Warehouse;RPT_RAAS_Candidates_Qlik	Career Site Replacement	\N	\N	\N	\N	\N	\N	\N	\N	G&A IT	Beamery Talent CRM;LinkedIn Recruiter	\N	2025-06-10 04:59:01.914359
8a50f5d9-b35a-4859-9460-4f38c2ab352a	Catalog	Catalog	Veeva RIM Submissions to Alation - Catalog Data	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:01.93164
798d24f2-ba9b-4160-ac64-38174f5cb819	Checks	Checks	JPMC to Oracle Cash Management;Oracle Payables to JPMC - Checks to Print	\N	\N	\N	\N	\N	\N	\N	\N	\N	G&A IT	\N	\N	2025-06-10 04:59:01.950459
c69ea144-b6dc-4297-ae7e-dc58ecdf33de	CIOMS	CIOMS	Argus to Veeva Site Connect - CIOMS	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:01.974205
d65d32ed-b1c4-46ea-9e7e-331ec8cec5f6	Clinical Data	Clinical Data	gDAN to Veeva RIM Submissions - Clinical Trial Data;Veeva CTMS to Converge Health - Clinical Data	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:01.992173
85d5dbde-30d4-4caa-9ba4-44c3c61e81d9	Clinical Supplies Tracking	Clinical Supplies Tracking	ASIST to ODR - Supplies Tracking, Protocol, Country, Investigator, Site Number;KSP to ODR - Supplies Tracking;N-Side to ODR - Supplies Tracking	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:02.01735
38d0daa0-9700-4790-8683-5d0b79180acc	Clinical Trial Data	Clinical Trial Data	SharePoint to SharePoint - Excel Binder Report, Clinical Trials Documents;Veevavault CTMS - ODR - EDC, IVR, Monitoring Data	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:02.035409
db2ae2b9-27c4-446e-a7b3-a1a3cfc1787a	Compensation	Compensation	Candidates_Qlik_INT;INT- Range File BetterComp;INT294 - Out - Workday to Graebel - Candidate Data Feed - EIB;Oracle EBS to EPBCS Workforce - Compensation Data for Existing Employee;RPT_RAAS_Internal_Move_Reasons_Qlik;Workday to Payfactors - Compensation	\N	\N	\N	\N	\N	\N	\N	\N	\N	G&A IT	\N	\N	2025-06-10 04:59:02.053465
1594544c-403e-47d6-b6ad-5a1d047eb8d2	Compensation Foundation Data	Compensation Foundation Data	INT093  Workday to Payfactors - Work Structure Data;INT095  Workday to Payfactors - Paymarkets Data;INT099  Workday to Payfactors - Work Structure Mapping;INT_Bettercomp_Local_Grades;RPT_RAAS_Compensation_Categories_Qlik	\N	\N	\N	\N	\N	\N	\N	\N	\N	G&A IT	\N	\N	2025-06-10 04:59:02.070547
9620cdf9-7ebd-4b2e-8cd4-8219df31accc	Consolidated Report (PPD, IRT, ERT)	Consolidated Report (PPD, IRT, ERT)	RTS to Data Lake - Consolidated Report	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:02.08966
c2aa2279-7558-4d62-931f-5f814be865d6	Contracts	Contracts	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:02.106676
6c236acf-79f5-4f3a-9fff-6220947c99de	Contracts (GD)	Contracts (GD)	Icertis to Adobe Sign - Contracts;Veeva Medical CRM to Icertis - Contracts	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:02.123504
d933ea73-7ab2-4a10-b794-725f4e65d886	Contracts Documents	Contracts Documents	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:02.143603
ce7fc737-0dc4-40af-b769-e200af7e8487	Contracts Metadata	Contracts Metadata	I&AG Law Data Lake to Qlik - Contracts Metadata	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:02.161506
5c86d6f9-71a2-4fa7-a2c0-094f7ec98c46	Country	Country	ASIST to ODR - Supplies Tracking, Protocol, Country, Investigator, Site Number;Core Country Committee to ODL - Country Data;CRO to Veeva CTMS - Study, Country, Site;ODL to Knowledge Management - Study Metadata, Site Enrollment, Site Milestone, Site Information, Study Milestones, Country Data, ICF	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Country / Country Plan	2025-06-10 04:59:02.179372
9710bfc2-b3de-4a9c-a1dd-5aa228fa9ce8	Country Plan	Country / Country Plan	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:02.197472
685d13c8-8c45-4904-a4c2-8dcf78d76486	CRD	CRD	Veeva Vault MedComms to EverSana - SML, CML, SRD, CRD	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:02.21674
f76fcc6f-247a-487e-9557-bfe74e000ea2	CTMS Studies	CTMS Studies	ASIST to Sharepoint - CTMS and ESR Studies;Veeva CTMS to Sharepoint - CTMS and ESR Studies	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:02.234892
013f5724-6009-4516-af84-121ac3114fce	Currency	Currency	Oracle Finance to Data Warehouse;Reval to Oracle General Ledger - Currency	\N	\N	\N	\N	\N	\N	\N	\N	\N	G&A IT	\N	\N	2025-06-10 04:59:02.252817
d20dbf5f-fc9d-480f-9987-82db366ec260	Data Extracts	Data Extracts	ESR SP to Pharmaspectra - Data Extracts	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:02.274685
ede7f255-83b9-4574-b230-7aa5367352c3	Deletion Indicator	Deletion Indicator	OPM to MES - Master Batch Record (BOM & Routing) (RAH);OPM to MES - Master Batch Record (BOM & Routing) (REN);OPM to MES - Material Master (Item Master) (RAH);OPM to MES - Material Master (Item Master) (REN)	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:02.292725
0b270279-9761-4402-93ba-8de3b34deaa5	Departments	Departments	EDMCS to Beeline - Departments and Organizations;Insights RM to ODL - Insights	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:02.312175
52807594-d24c-45d1-85ae-668474c6a61e	Destination Location - Location Field Size Enlarged	Destination Location - Location Field Size Enlarged	MES to OPM - Take-Out on Manufacturing Order (RAH);MES to OPM - Take-Out on Manufacturing Order (REN);OPM to MES - Incoming Transport (Intern Order or Sub Inv) (RAH);OPM to MES - Incoming Transport (Intern Order or Sub Inv) (REN)	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:02.330041
0286ba58-fe91-485c-9719-702341dce059	Document	Document	Docubridge to Toolbox - Document;Veeva eTMF to Veeva RIM Submissions - Document;Veeva RIM Submissions to Veeva eTMF - Documents	* IOPS - Quality Systems Veeva Program / IOPS - GLO QMS/QDocs Veeva P2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Document / Approved Documents;Document / Approved Publication;Document / Audit Findings;Document / CAPA Response;Document / Custom Medical Letter (CML);Document / Draft;Document / Draft Publication;Document / Health Authority Correspondence Documents;Document / Labeling Requirements;Document / Labels;Document / Published Submission Documents;Document / Standard Medical Letter (SML);Document / Submission Content	2025-06-10 04:59:02.347933
edf94d05-48a8-4b1a-b179-76163e211c73	Approved Documents	Document / Approved Documents	Veeva eTMF to Veeva QMOD - Product, Study;Veeva MedComms to Veeva Medical CRM - Approved Documents, Medical Materials;Veeva MedComms to Veeva Medical CRM Global - Approved Documents, Medical Materials	* IOPS - Quality Systems Veeva Program / IOPS - GLO QMS/QDocs Veeva P2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:02.365605
4fcdb040-79fe-4d9b-a580-51a475d6065a	Approved Publication	Document / Approved Publication	Data vision to Mediverse - Approved Publication;External Authoring Vendors to Data Vision - Draft, Approved Publications	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:02.383644
a065b992-47be-4d21-a1f6-166575bbb15b	Audit Findings	Document / Audit Findings	Sharepoint to Veeva QMOD - Audit Findings, CAPA Response	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:02.401811
059cb522-2b30-498c-ba6d-ba2e9c126d48	CAPA Response	Document / CAPA Response	Sharepoint to Veeva QMOD - Audit Findings, CAPA Response	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:02.418669
a57b2d31-a7fd-43f7-920f-4580466cc4f7	Custom Medical Letter (CML)	Document / Custom Medical Letter (CML)	Veeva Vault MedComms to EverSana - SML, CML, SRD, CRD	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:02.43732
8446f733-6733-464a-8f7e-b5716b547d4d	Draft	Document / Draft	Veeva RIM Registrations to LATIS - Document drafts, Artwork, Labeling requirements	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:02.455137
5785e3cb-f521-4264-ac3d-3e2b148aef6d	Draft Publication	Document / Draft Publication	External Authoring Vendors to Data Vision - Draft, Approved Publications	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:02.472806
47491c8f-9e11-418a-badc-a6454a92eb22	Health Authority Correspondence Documents	Document / Health Authority Correspondence Documents	Health Authority Correspondence to SharePoint - HAC Documents	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:02.489613
c186cb51-8bd8-498e-8001-bf9278eb50e4	Labeling Requirements	Document / Labeling Requirements	Veeva RIM Registrations to LATIS - Document drafts, Artwork, Labeling requirements	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:02.507659
d06a5e0b-a081-4f58-a164-8275e8531b08	Labels	Document / Labels	Veeva Vault RIM Registration to Office 365 - Labels	* IOPS - Quality Systems Veeva Program / IOPS - GLO QMS/QDocs Veeva P2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:02.525402
b49c8661-c899-47d5-93b3-c080aae8f0e9	Published Submission Documents	Document / Published Submission Documents	DocuBridge to Veeva RIM Submissions - Published Submission Documents	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:02.543164
490c3c8d-4696-439b-b5c8-be0145fb9bac	Standard Medical Letter (SML)	Document / Standard Medical Letter (SML)	Veeva Vault MedComms to EverSana - SML, CML, SRD, CRD	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:02.561597
412b141c-6306-4aae-aae8-48e9696fc820	Submission Content	Document / Submission Content	CRO to ODR - eTMF Document, Non CRF Data;Veeva RIM Submissions to Docubridge - Submission Content	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:02.579212
65b95c50-fc13-40a2-971a-a5a3f8b35495	Document Requests	Document Requests	RWDnA Platform to Data Vision - Research Ideas, Document Requests	* IOPS - Quality Systems Veeva Program / IOPS - GLO QMS/QDocs Veeva P2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:02.597516
4649897b-4c11-4486-9958-2ec2c812e3a0	Domains	Domains	Insights RM to ODL - Insights	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:02.624818
2ad26b5c-e5d5-4e2e-b0ff-4555a8649125	eCOA/ePRO Data	eCOA/ePRO Data	CRO to Veeva to Vault Track (eTMF) - Operational Study Data	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	eCOA/ePRO Data / eCOA Master File;eCOA/ePRO Data / eCoA Summary Report	2025-06-10 04:59:02.651862
3f3e130b-e9d6-42e2-b82e-342a5f153b54	eCOA Master File	eCOA/ePRO Data / eCOA Master File	Bus Ops SharePoint to Data Lake Phase 1 - Study Budget and eCOA master file	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:02.669839
e4ecced8-2be6-4c69-873b-f536d5cd6c61	eCoA Summary Report	eCOA/ePRO Data / eCoA Summary Report	ODR to RTS - eCoA, IRT Summary Report	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:02.687722
1c3ce0b6-c5b2-4ba3-8e4a-d34512f646b9	EDC	EDC	Axway to Operational DataLake - Operational EDC, non-CRF Data;EDC Raw data, Labs, ECG, Imaging, Genomics to J-Review;Rave EDC to Scientific Data Lake - EDC Data;Rave EDC to Veeva CTMS - EDC;Veevavault CTMS - ODR - EDC, IVR, Monitoring Data	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	EDC / CRF Data;EDC / Patient	2025-06-10 04:59:02.706975
618aa105-c462-4615-bd85-868df502e4e3	CRF Data	EDC / CRF Data	Axway to IQVIA - CRF, Lab, Biomarker Data;CRF Data to Rave EDC - CRF Data	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:02.724833
8c2414f3-a9e6-4192-8484-c90b4eb87ff6	Patient	EDC / Patient	CRO to Veeva to Vault Track (eTMF) - Operational Study Data;Rave EDC to Veeva CTMS - EDC	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:02.742493
bdcd850f-d4df-4b7c-965f-d7cea369808a	Education	Education	HRADMNRPTMJG_RAAS_Diversity_and_Education_Qlik;INT276_-_All_Active_and_Terminated_Workers_-_RPT_QLIK_Employee_Education_Data;RPT_RAAS_Diversity_and_Education_Qlik	\N	\N	\N	\N	\N	G&A IT	\N	\N	\N	G&A IT	\N	\N	2025-06-10 04:59:02.760466
22b25d89-fc96-4d35-b327-0f66a70e6b1c	Element	Element	E*Trade to Oracle Payroll;EdAssist to Oracle Payroll;Fidelity to Oracle Payroll - Loan;Fidelity to Oracle Payroll - Pre and Post Tax;Weichert to Oracle Payroll - Reloc	\N	\N	\N	\N	\N	\N	\N	\N	\N	G&A IT	\N	\N	2025-06-10 04:59:02.778277
8c7d50aa-28c4-47b4-9feb-e8d8901022b1	Employee	Employee	Achievers to Oracle;Active Directory (External App) to Data Warehouse;Active Directory (External App) to Oracle Core HR;CCure (External App) to Data Warehouse;Concur to Medpro;Concur to Oracle General Ledger - Expense Report;Concur to Oracle General Ledger - PCard;Concur to Payroll - Expense Report Data;Corepay to Oracle General Ledger;Data Warehouse to Beeline - Users;Data Warehouse to CCure (External App);Data Warehouse to Dival Safety Boots (External App);Data Warehouse to Hyland Onbase - S&R;Data Warehouse to IOPS Data Warehouse (External App);Data Warehouse to Qlik (External App) - HR Data;Data Warehouse to RPA (External App);Data Warehouse to RSIGuard Ergonomics (External App);Data Warehouse to Zycus iAnalyze;E*Trade to Oracle Payroll;HRDL_RPT_RAAS_Requisitions_Qlik;Hubble to Oracle eBS;INT002  Workday to Achievers - Worker Data;INT003  Workday to Lawlogix - New Hire;INT005 - Out - Workday to Lawlogix - Employee Changes Feed - EIB;INT030  Workday to AON (External App) - Worker Data;INT040  Workday to Beeline Employee Data;INT041 TriRiga to Workday - Worker Assignment;INT084  Workday to Businessolver - Worker Data;INT091  Workday to Payfactors - Employee Data;INT094 DataWarehouse to Benevity (External App);INT102  Workday + Beeline to Compliance Wire (External App);INT108  Workday + Beeline to Concur - Profile Data;INT110  Workday + Beeline to Concur - Login Data;INT112  Workday to Conduent (External App) - New York Hiring Reporting;INT114  Workday to CorePay - Employee Master Delta;INT116  Workday to CorePay - Employee Master Full;INT118 Workday to Corepay - Salary Rate Delta;INT120 Workday to Corepay - Salary Rate Full;INT129 Workday + Beeline to SumTotal - Employee Data;INT131 Workday + Beeline to SumTotal - Users to Organizations;INT135 Workday + Beeline to SumTotal - User to Jobs;INT138 Workday + Beeline to CVENT - Approval Limits;INT143  Workday + Beeline to TriRiga;INT145  Workday + Beeline to Veeva (External App) - Termination Data;INT147 Workday to Veeva (External App) - New Hire Data;INT149  Workday to Veeva (External App) - Delta Data;INT162  Workday to EdAssist - Worker Data;INT163  Workday + Beeline to Enablon (External App);INT164  Workday to Equity Edge - Stock Portfolio;INT167  Workday + Beeline to Everbridge;INT169  Workday to Fidelity - Worker Data;INT172  Workday to Grainger (External App) Employee Data;INT176  Workday to Hyland - Worker Full Feed;INT177  Workday to Hyland - Worker Delta Feed;INT181  Workday to IC portal (External App) - LOA Data;INT182  Workday to IC portal (External App) - Transfer Data;INT183  Workday to IC portal (External App) - Promotion Data;INT184  Workday to IC portal (External App) - Term Data;INT185  Workday to IC portal (External App) - New Hire Data;INT186  Workday to IC portal (External App) - Roster Data;INT187  Workday + Beeline to Icertis;INT204  Workday to Broadspire - Worker Data;INT222 ServiceNow to Workday - Account and Email;INT224  Workday to ServiceNow - HR Profile;INT253 Workday to Glint - Employee Feed;INT261 Workday to Modern Hire;INT262  Workday to ServiceNow Case Creation - Terminations;INT263  Workday to ServiceNow Case Creation - non-termination events;INT267  Workday to Splunk (External App) - User Activity;INT275  Oracle Data Reconciliation;INT283 - Out - Get Connected New Hires – EIB;INT283 - Out - Get Connected New Hires – EIB / INT283 - Out - Get Connected New Hires - RENS - EIB;INT284 Workday to Journey Live - Worker Data;INT289 Workday + Beeline to Insights RM (External App);INT293 - Out - Workday to Aristotle (External App) - Employee Membership Eligibility Data Feed - EIB;INT296 - Out - Workday to Gift Vendor - Employee Address Data Feed - EIB;INT_Bettercomp_Employee_Data;INT_Workday_Vistornet;Legacy PBCS to Oracle eBS - GL, AP, PO;Lenel (External App) to Data Warehouse;Oracle Compensation to Equity Edge - Taxes;Oracle Compensation to Equity Edge - Wages;Oracle Core HR to Peoplefluent Who's Who;Oracle Core HR to Weight Watchers;Oracle EBS to Legacy PBCS - Employee;Oracle EBS to Legacy PBCS - Overtime;Oracle Finance to Data Warehouse;Oracle Payroll to ADP - Lien Disbursement;Oracle Payroll to ADP - Print Interface;Oracle Payroll to Fidelity;Oracle Payroll to i2Verify;Oracle to Legal Hold Pro;Oracle to SumTotal - Employee;Oracle to SumTotal - Employee to Job;Oracle to SumTotal - Employee to Organization;OTL to Corepay;P2000 (External App) to Data Warehouse;REGN ADP Tax Monthly Interface;REGN ADP Tax Periodic Interface;REGN ADP Tax Quarterly Interface;RPT_HCM_Terminations_IOPS_DL;Veeva (External App) to Data Warehouse;Wageworks to Oracle Payroll - Benefits;WD+BL to Intuition LMS (External App);Weichert to Oracle Payroll - Reloc;Workday + Beeline to Active Directory (External App);Workday + Beeline to CCure (External App);Workday + Beeline to Ceridian EE Out to Filemaker Pro V16 RENS (External App);Workday + Beeline to Ceridian EE Out to Filemaker Pro V18 Tarrytown (External App);Workday + Beeline to Ceridian EE Out to InsightsRM (External App);Workday + Beeline to Ceridian EE Out to SailPoint (External App);Workday + Beeline to Ceridian to Active Directory (External App);Workday + Beeline to Ceridian to Ruby User Table (External App);Workday + Beeline to Dival Safety Boots Tarrytown only (External App);Workday + Beeline to Filemaker Pro Tarrytown & Ruby User Table (External App) V18;Workday + Beeline to Hyland Onbase S&R (External App);Workday + Beeline to IOPS Data Warehouse (Managed by IOPS);Workday + Beeline to RSIGuard (External App);Workday + Beeline to Safety Stratus (External App);Workday + Beeline to Sailpoint (External App);Workday + Beeline to to Ceridian EE Out to Data Warehouse (Master Data);Workday to Benevity (External App);Workday to Dival Safety Boots (External App);Workday to Global Equity Tracker;Workday to Magnatron Employee Data;Workday to Oracle - Address Validation;Workday to Oracle - Automate IOPS Assignment Time Information;Workday to Oracle - Employee Shell Record;Workday to Weight Watchers;Workday to Workday Employee ID Update (Boomerang);Workday+Beeline to Intuition	Career Site Replacement	\N	\N	\N	\N	\N	\N	\N	\N	G&A IT	Graebel globalCONNECT;Maven Clinic Platform;Sedgwick	\N	2025-06-10 04:59:02.799784
70d68170-6cb6-47da-b93c-021091ffeddc	Employees	Employees	HRADMINRPT_RS_RAAS_Internal_Move _Reasons_Qlik;Insights RM to ODL - Insights;INT276_-_All_Active_and_Terminated_Workers_-_RPT_QLIK_Employee_Education_Data;INT292 - Out - Workday to Maven - Employee Family Benefits Data Feed - EIB;RPT_RAAS_HCM_Roster_Qlik;RPT_RAAS_Positions_Qlik;RPT_RAAS_Requisitions_Qlik;RPT_RAAS_Termination_Reason_Codes_Qlik;Workday to EPBCS Workforce - New Hire	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:02.834705
6846a13b-6ed7-4b91-acfc-273825e490b3	End Date	End Date	MES to OPM - End Manufacturing Order (RAH);MES to OPM - End Manufacturing Order (REN)	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:02.857417
212ded48-46ea-4c8f-b308-093ee93a6af7	End Points	End Points	gREG to ODL - End Points, Outcome Measures	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:02.876078
a5ead21d-c4dd-437f-aa06-4ecb31049011	Enrollment Milestone	Enrollment Milestone	Data Query Systems to CTMS - Study, Site, Enrollment Milestones;IQVIA to Veeva CTMS - Study, Site, Enrollment Milestones;ODR,ODL to Study Optimizer - Study,Site, Enrollment Data	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:02.893908
b973ba2d-4f1a-44c0-8750-f7d8e338df4b	ERP Destination Inventory Organization	ERP Destination Inventory Organization	OPM to MES - Incoming Transport (Intern Order or Sub Inv) (RAH);OPM to MES - Incoming Transport (Intern Order or Sub Inv) (REN)	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:02.911702
7ca3e90b-ba8f-4e9e-89ad-06e7bb2d16db	ERP Destination Storage Locator	ERP Destination Storage Locator	MES to OPM - Outgoing Transport (RAH);MES to OPM - Outgoing Transport (REN);OPM to MES - Incoming Transport (Intern Order or Sub Inv) (RAH);OPM to MES - Incoming Transport (Intern Order or Sub Inv) (REN)	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:02.92977
8ad2f4d7-1b9f-4552-959e-220f521f32fb	ERP Destination Sub-Inventory	ERP Destination Sub-Inventory	MES to OPM - Outgoing Transport (RAH);MES to OPM - Outgoing Transport (REN);OPM to MES - Incoming Transport (Intern Order or Sub Inv) (RAH);OPM to MES - Incoming Transport (Intern Order or Sub Inv) (REN)	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:02.947547
942adb7f-3fc5-43a4-a6c2-948b278c2221	ESR Studies	ESR Studies	ASIST to Sharepoint - CTMS and ESR Studies;Veeva CTMS to Sharepoint - CTMS and ESR Studies	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:02.965524
e928aca1-4379-4b67-b5c8-55715b9d875a	eTMF	eTMF	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	eTMF / eTMF Document;eTMF / eTMF Document Tracking	2025-06-10 04:59:02.983265
04abb10a-192a-414e-ad20-48ffacc3281a	eTMF Document	eTMF / eTMF Document	CRO to ODR - eTMF Document, Non CRF Data	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:03.00113
356c849c-86b0-4811-b1c3-de9c74b7731d	eTMF Document Tracking	eTMF / eTMF Document Tracking	eTMF to ODR - eTMF Document Tracking Data	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Veeva - eTMF (Track)	\N	2025-06-10 04:59:03.019153
9ec43486-fa7f-44a1-a092-07847563d83d	Excel Blinder Report	Excel Blinder Report	SharePoint to SharePoint - Excel Binder Report, Clinical Trials Documents	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:03.066898
448c7aef-ac2f-4228-b64a-a7547f2aa66a	Excel Output (Training for audit assignments/resources)	Excel Output (Training for audit assignments/resources)	REGENU to Compass - Excel Output	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:03.084955
f9042030-c2ba-484e-89c8-8c4ce34cd5a4	Expenses	Expenses	Concur to Medpro;Concur to Oracle General Ledger - Expense Report;Concur to Oracle General Ledger - PCard;Concur to Oracle Payroll;Concur to Payroll - Expense Report Data;Oracle Finance to Data Warehouse;Oracle to Data Warehouse - Concur Data	\N	\N	\N	\N	\N	\N	\N	\N	\N	G&A IT	\N	\N	2025-06-10 04:59:03.102812
64430cbd-e88c-46ec-bdfe-e18829c07474	Expert Tracking Info	Expert Tracking Info	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:03.121132
0e037bf0-d331-44d7-845d-80889a70ed31	Expiry date	Expiry date	OPM to MES - Batch Master Data (Lot Generation) (RAH);OPM to MES - Batch Master Data (Lot Generation) (REN)	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:03.138781
c3ec0726-e445-4a3a-afc6-6eedf50b6724	Facility Assets	Facility Assets	Data Warehouse to Fusion BCP;Oracle Finance to Data Warehouse;TriRiga to Data Warehouse - Assets	\N	\N	\N	\N	\N	\N	\N	\N	\N	G&A IT	\N	\N	2025-06-10 04:59:03.156489
dabc20c6-8483-4825-8c07-7c30cbe2b348	Final Issue Flag	Final Issue Flag	MES to OPM - Take-Out on Manufacturing Order (RAH);MES to OPM - Take-Out on Manufacturing Order (REN)	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:03.174162
7c64978c-9f7c-4441-973f-f65d7dc860c3	Financials	Financials	Hubble to Oracle eBS;Oracle Finance to Data Warehouse;Oracle Payables to JPMC - Positive Pay	\N	\N	\N	\N	\N	\N	\N	\N	\N	G&A IT	\N	\N	2025-06-10 04:59:03.192472
4b4a0b18-0c40-4209-8773-577282c2457d	Flat Files	Flat Files	Veeva Medical CRM to RW Data Lake - Flat Files	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:03.210239
1d1626a4-0422-46d3-b855-45f446fc33f2	Formatted Outputs	Formatted Outputs	Veeva CTMS to Veeva QMOD - Product, Study;Veeva eTMF to Veeva QMOD - Product, Study	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:03.227942
7d082131-1d95-45eb-a6b1-3541a0dea3dc	GL	GL	Concur to Oracle General Ledger - Expense Report;Concur to Oracle General Ledger - PCard;Concur to Payroll - Expense Report Data;Corepay to Oracle General Ledger;Costar to Oracle General Ledger;Legacy PBCS to Oracle eBS - GL, AP, PO;Oracle Finance to Data Warehouse;Reval to Oracle General Ledger - GL	\N	\N	\N	\N	\N	\N	\N	\N	\N	G&A IT	\N	\N	2025-06-10 04:59:03.244516
2858745b-e787-49dd-bd06-6d5ab0ef27b6	Grants Cases	Grants Cases	EFMS to Global Medical Analytics Datawarehouse - Grants Cases	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:03.262314
5aa02b18-c53b-4c27-a830-cf8e22a1ea73	HCO	HCO	Oracle Payables to MedPro	\N	\N	\N	\N	\N	\N	\N	\N	\N	G&A IT	\N	\N	2025-06-10 04:59:03.280207
e90771fb-4c1d-46eb-9ff8-3ee7ac84f2c4	HCP	HCP	Oracle Payables to MedPro	\N	\N	\N	\N	\N	\N	\N	\N	\N	G&A IT	\N	\N	2025-06-10 04:59:03.298257
48fcdad2-12e0-42d9-8c5d-de7135ee6e33	HCP (GD)	HCP (GD)	Veeva CRM to Veeva Link - Document;Veeva Medical CRM Global to Commercial MDM - HCP Accounts;Veeva Medical CRM to Commercial MDM - HCP Accounts;Veeva Medical CRM to Concur - HCP Accounts	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	HCP (GD) / Documents;HCP (GD) / Insights;HCP (GD) / Interactions;HCP (GD) / Key Opinion Leader (KOL)	2025-06-10 04:59:03.316034
a9150808-273f-49cd-a6ea-93951ea64393	Documents	HCP (GD) / Documents	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:03.333702
8ac1f2c8-a2d1-4984-9808-fa6ec5bd5c70	Insights	HCP (GD) / Insights	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:03.351579
6e03ce77-0817-40a8-aa00-d135f1890243	Interactions	HCP (GD) / Interactions	Veeva Medical CRM to Acceleration Point - HCP Interactions	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:03.369442
4953e7db-693a-4453-8b60-9e8656e007b6	Key Opinion Leader (KOL)	HCP (GD) / Key Opinion Leader (KOL)	SteepRock to Veeva Medical CRM - KOL	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:03.387309
6f7536c3-78d9-4b79-a2ab-d81d7f65104f	Headcounts	Headcounts	Insights RM to ODL - Insights	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:03.405089
13deb559-f476-461a-8dc4-01aa65a1f7fb	Health Authority Correspondence Data	Health Authority Correspondence Data	Veeva RIM to HAC - HAC Data	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:03.422905
ed39febf-06e1-4370-96b7-49a542e04349	Home Health	Home Health	GTO Data Ingestion Forms to Qlik - Materials, Recruitment Campaign - Country & Study, Social Media - Country & Study, Home Health, Patient Reimbursement, Site Augmentation - Study & Country	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:03.439528
689913ff-15f1-4b13-8454-874a29bc7955	HR Portal Data	HR Portal Data	Workday to Insights RM - HR Portal Data	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:03.458214
1a6360d1-a69e-4276-b5aa-60d4caf5422a	ICF Templates	ICF Templates	Precision Medicine Server to Veeva eTMF - ICF Templates	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:03.476216
731d4e96-d791-4414-8da1-572ecdc9c692	Images data	Images data	Imaging to Flywheel - Images;Imaging to iPACS - Images	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:03.493892
eb6826c0-4e7a-4bcb-8230-d7d8fe751535	Informed Consent form Data	Informed Consent form Data	Dataiku to ICF - Informed Consent Form Data / Metadata;ODL to Dataiku - Informed Consent Form Data;ODL to Knowledge Management - Study Metadata, Site Enrollment, Site Milestone, Site Information, Study Milestones, Country Data, ICF;Veeva CTMS (Zai China) to ODL - Site Milestone, Study Metadata, ICF;Veeva CTMS to ODL - Site Milestone, ICF;Veeva eTMF to ODL - Informed Consent Form Data	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:03.511837
95b0b1ee-73ab-4b9f-a0f7-1a524b4ec463	Informed Consent form MetaData	Informed Consent form MetaData	Dataiku to ICF - Informed Consent Form Data / Metadata	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:03.528477
963a6f04-247c-457b-8811-71cfd7e8c3a8	Insights RM Data	Insights RM Data	Insights RM to Dataiku - Insights RM Data;Insights RM to Power BI - Insights RM Data;Insights RM to Qlik - Insights RM Data;Insights RM to Tableau - Insights RM Data	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:03.546302
5366bf49-b792-4da8-97c8-5a867659c2ae	Insights/KPIs	Insights/KPIs	RWDnA to IQVIA - Plans, Insights	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:03.564379
80df0063-1700-4c43-a7ed-085647c9698d	Inspection Data	Inspection Data	Inspection Management DB to QlikView/QlikSense - Inspection Data	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:03.582266
daa836ef-7ecb-4f96-b633-0b5e98d894d0	Institution	Institution	Citeline to MDM - Investigator, Institution;DQS(IQVIA) Passback to MDM - Investigator, Institution;ICON CTMS to MDM - Investigator, Institution;ODL to Knowledge Management - Investigator, Institution;PAREXEL CTMS to MDM - Investigator, Institution;PPD CTMS to MDM - Investigator, Institution;SPOR to MDM - Institution;SYNEOS CTMS to MDM - Investigator, Institution;Veeva CTMS to MDM - Investigator, Institution, Study;WCG to MDM - Investigator, Institution	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:03.600128
56dbe625-e220-4fd8-9fb8-9397b92ebcd0	Investigator	Investigator	ASIST to ODR - Supplies Tracking, Protocol, Country, Investigator, Site Number;Citeline to MDM - Investigator, Institution;DQS(IQVIA) Passback to MDM - Investigator, Institution;ICON CTMS to MDM - Investigator, Institution;NPI Registry to MDM - Investigator;ODL to Knowledge Management - Investigator, Institution;ODL to MDM - Investigator, Study;PAREXEL CTMS to MDM - Investigator, Institution;PPD CTMS to MDM - Investigator, Institution;QMOD to MDM - Investigator;SYNEOS CTMS to MDM - Investigator, Institution;Veeva CTMS to MDM - Investigator, Institution, Study;Veeva Medical CRM to Jolt 360 - Investigator;WCG to MDM - Investigator, Institution	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:03.617955
cba5a764-9bb9-4dfd-bf49-325334fb89bd	Investigator Safety Alerts	Investigator Safety Alerts	IAL to Veeva eTMF - Investigator Safety Alerts;Site Connect to Veeva eTMF - Investigator Safety Alerts;Veeva CTMS to IAL - Investigator Safety Alerts;Veeva CTMS to Site Connect - Investigator Safety Alerts	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:03.635659
53e511f4-7745-401c-a168-d9dfbbec3bfe	Invoice	Invoice	Data Warehouse to Zycus iAnalyze;Email or Scanner (External App) to Kofax Markview;Kofax Markview to Oracle Payables;Oracle Accounts Payable to ModelN (External Application);Oracle Business Network (External App) to Oracle Payables;Oracle Finance to Data Warehouse;Oracle Payables to Business Digital Hub;Oracle Payables to Changepoint (External App) - Invoice Payments;REGN EBS EY GTP Integration;Serengeti to Oracle Payables	\N	\N	\N	\N	\N	\N	\N	\N	\N	G&A IT	Digital Business Hub;EY Global Tax Platform 1.0	\N	2025-06-10 04:59:03.653419
9254de7d-bb3b-4ef4-a902-47b21a72bc8e	Invoices & Accruals	Invoices & Accruals	Oracle Financials to Changepoint - Req & PO, Invoices & Accruals	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:03.671373
bb2504b4-7be7-4748-bebe-24bf97e2eaa7	IOPS Test	IOPS Test	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:03.689182
6ec1c655-12c8-4d9d-b2ef-bb3b0acc3816	IRT Reports	IRT Reports	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:03.707477
0130bd5b-f542-49cc-8de6-09a3bd7700f5	IVR	IVR	Veevavault CTMS - ODR - EDC, IVR, Monitoring Data	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:03.725167
4efe58f6-dc4c-4eb4-b354-33ca6b713e8f	Jira Project Epics data	Jira Project Epics data	Jira to Changepoint - Epics data	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:03.743133
ae00b776-f2dd-4b69-8447-928e901ed93e	Job	Job	Data Warehouse to Beeline - Job Titles;INT097  Workday to Payfactors - Job Data;INT107 Workday to Phenom;INT133 Oracle to SumTotal - Job Data;INT135 Workday + Beeline to SumTotal - User to Jobs;INT138 Workday + Beeline to CVENT - Approval Limits;INT225  Workday to CorePay Job Profile Feed;INT251 Workday to CorePay - External Job ID;INT276_-_All_Job_Profiles_-_RPT_Qlik_Job_Profiles;INT294 - Out - Workday to Graebel - Candidate Data Feed - EIB;INT_Bettercomp_Job_Data;Oracle to SumTotal - Employee to Job;Oracle to SumTotal - Jobs;Workday to Compa Offers - Job Data;Workday to Oracle EBS - Job Feed	\N	\N	\N	\N	\N	\N	\N	\N	\N	G&A IT	\N	\N	2025-06-10 04:59:03.761114
b6e52198-4cb2-4a75-9f3f-8db10b706e30	Job Applications	Job Applications	INT218_-_Business_Process_Transactions_-_Data_Warehouse__Qlik__Job_Application_Event;INT218_-_Job_Applications_-_Data_Warehouse__Qlik__Application_Data	\N	\N	\N	\N	\N	G&A IT	\N	\N	\N	G&A IT	\N	\N	2025-06-10 04:59:03.780373
4049f930-44be-4d75-bf9f-a0f3771e0eb5	Job Interview	Job Interview	INT218_-_Job_Applications_-_Data_Warehouse__Qlik__Interview_Data	\N	\N	\N	\N	\N	G&A IT	\N	\N	\N	G&A IT	\N	\N	2025-06-10 04:59:03.798653
68eaf5ab-c9dc-4851-b09c-fae59c184847	Job Marketing	Job Marketing	Sparc to Beamery Career Site	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Sparc-Amplify	\N	2025-06-10 04:59:03.816741
30389562-791f-4fa7-9179-93b27e1bbf1a	Job Offers	Job Offers	Workday to Compa Offers - Offer Data	\N	\N	\N	\N	\N	G&A IT - Human Resources	\N	\N	\N	G&A IT	\N	\N	2025-06-10 04:59:03.83435
4e64936d-4a05-45f7-a369-3bdca33b9685	Job Posting or Job Requisition	Job Posting or Job Requisition	Beamery Career Site to External Job Boards;Beamery Career Site to LinkedIn Recruiter;Indeed to Glassdoor;INT032  Workday to Avature - Job Requistion Data;INT088  Workday to Candex - Ownership Check;INT090  Workday to Candex - All Requisitions;INT218_-_Business_Process_Transactions_-_Data_Warehouse__Qlik__Job_Application_Event;INT218_-_Business_Process_Transactions_-_Data_Warehouse__Qlik__Job_Requisitions_Event;INT290 – Out - Workday to Beamery – CRM-API-Design;INT291 - Out - Workday to Beamery-Career Site -RAAS;Phenom to Athlete (External App);Phenom to BioNJ (External App);Phenom to Biospace (External App);Phenom to DirectEmployers;Phenom to Indeed;Phenom to Indeed for Sponsored Jobs (External App);Phenom to LinkedIn;RPT_RAAS_Candidates_Qlik;RPT_RAAS_Requisitions_Qlik;RPT_TA_Requisitions_IOPS_DL	Career Site Replacement	\N	\N	\N	\N	\N	\N	\N	\N	G&A IT	\N	\N	2025-06-10 04:59:03.852129
ec547bfa-aaf7-4a75-ba67-9e116c6559fa	Journal Entries	Journal Entries	Oracle Finance to Data Warehouse;Oracle General Ledger to Changepoint (External App)	\N	\N	\N	\N	\N	\N	\N	\N	\N	G&A IT	\N	\N	2025-06-10 04:59:03.869947
cfbb4b7b-58ff-4f54-b69a-a59d4fed9fd2	Key Dates	Key Dates	Veeva RIM Submissions to Compass - Key Dates, Timing	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:03.887971
7a7f3922-2577-4ba6-a324-4bcc0706f005	KM Workflow Data	KM Workflow Data	Knowledge Management to ODL - KM Workflow Data	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:03.960415
4c363070-d982-4f09-9f74-3ea8a705b1a1	KQIs	KQIs	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:03.97851
c237fe1b-e76e-4d07-9b47-8ac21839648d	Recruiter	Recruiter	Candidates_Qlik_INT;INT090  Workday to Candex - All Requisitions;INT294 - Out - Workday to Graebel - Candidate Data Feed - EIB	\N	\N	\N	\N	\N	\N	\N	\N	\N	G&A IT	\N	\N	2025-06-10 04:59:05.082753
588cd31d-ee24-48ab-9593-92bd55cc5844	Location	Location	Data Warehouse to Fusion BCP;MES to OPM - Permanent Inventory (RAH);MES to OPM - Permanent Inventory (REN);MES to OPM - Take-Out (On Cost Center and Scrapping) (RAH);MES to OPM - Take-Out (On Cost Center and Scrapping) (REN);Oracle Finance to Data Warehouse;TriRiga to Data Warehouse - Building Locations - BCP;TriRiga to Data Warehouse - Building Locations - NEMO;Workday to Benevity (External App)	\N	\N	\N	\N	\N	\N	\N	\N	\N	G&A IT	\N	\N	2025-06-10 04:59:03.998103
a00a9720-80a0-4b39-8364-ff43c6cae840	Master Data	Master Data	RPT_RAAS_Diversity_and_Education_Qlik;RPT_RAAS_Internal_Move_Reasons_Qlik	\N	\N	\N	\N	\N	G&A IT	\N	\N	\N	G&A IT	\N	\N	2025-06-10 04:59:04.016522
661bc3a8-7004-4cda-97b8-b7623ce8a5bc	Master Data (GD)	Master Data (GD)	MDM to ODL - Master Data;MDM to Veeva CTMS - Master Data	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:04.035997
d5814259-cfb3-4c13-8cd9-a95b7f4bd247	Material Description	Material Description	OPM to MES - Material Master (Item Master) (RAH);OPM to MES - Material Master (Item Master) (REN)	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:04.054127
fe03cd55-1926-4f80-9a55-046794814c9c	Material no.	Material no.	MES to OPM - BRR Approval (RAH);MES to OPM - BRR Approval (REN);MES to OPM - Outgoing Transport (RAH);MES to OPM - Outgoing Transport (REN);MES to OPM - Permanent Inventory (RAH);MES to OPM - Permanent Inventory (REN);MES to OPM - Take-Out (On Cost Center and Scrapping) (RAH);MES to OPM - Take-Out (On Cost Center and Scrapping) (REN);MES to OPM - Take-Out on Manufacturing Order (RAH);MES to OPM - Take-Out on Manufacturing Order (REN);MES to OPM - Transport Order (RAH);MES to OPM - Transport Order (REN);OPM to MES - Batch Master Data (Lot Generation) (RAH);OPM to MES - Batch Master Data (Lot Generation) (REN);OPM to MES - Incoming Transport (Intern Order or Sub Inv) (RAH);OPM to MES - Incoming Transport (Intern Order or Sub Inv) (REN);OPM to MES - Master Batch Record (BOM & Routing) (RAH);OPM to MES - Master Batch Record (BOM & Routing) (REN);OPM to MES - Material Master (Item Master) (RAH);OPM to MES - Material Master (Item Master) (REN);OPM to MES - PROCESS ORDER (Batch) (RAH);OPM to MES - PROCESS ORDER (Batch) (REN)	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:04.071933
6e93cc1e-b0d3-485a-b3d5-86e0d7d91172	Materials	Materials	GTO Data Ingestion Forms to Qlik - Materials, Recruitment Campaign - Country & Study, Social Media - Country & Study, Home Health, Patient Reimbursement, Site Augmentation - Study & Country	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:04.0899
81d27f29-11ed-4c90-a63c-b9a4ac578ad6	Medical Information	Medical Information	Axway to Looking Glass - Medical Information;Global Medical Analytics Datawarehouse to Qlik (Qlikview & QlikSense) - Call activity, medical information;Rave EDC to Looking Glass - Medical Information;RTS to Global Medical Analytics Datawarehouse - Call activity, Medical information;Veeva Medical CRM Global to Global Medical Analytics Datawarehouse - Call activity, medical information;Veeva Medical CRM to RTS - Call activity, medical information	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Veeva Medical CRM Global	\N	2025-06-10 04:59:04.109592
12b8503e-0e07-47ff-b564-24f24485b7db	Medical Information Requests Cases	Medical Information Requests Cases	Eversana/Techsol Call Center to Global Medical Analytics Datawarehouse - Medical Information Request Cases;Sanofi Med Info Platform to Global Medical Analytics Datawarehouse - Medical Information Request Cases	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:04.126642
9657eb25-88b5-46e5-aa3c-903190e9abbb	Medical Materials	Medical Materials	Veeva MedComms to Veeva Medical CRM - Approved Documents, Medical Materials;Veeva MedComms to Veeva Medical CRM Global - Approved Documents, Medical Materials;Veeva Medical CRM to Teams - Records Insights, Materials	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:04.145012
d000c753-e036-4acf-a129-36120adb8b42	Medical Response Documents	Medical Response Documents	Veeva MedComms to Mediverse - Medical Response Documents	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:04.163031
9e832811-138b-4d1a-b469-d0dfcdccbe69	MES Material Type (Default: Raw Material)	MES Material Type (Default: Raw Material)	OPM to MES - Material Master (Item Master) (RAH);OPM to MES - Material Master (Item Master) (REN)	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:04.180767
1a4b3ec3-d3c2-405d-a8c4-e9525d975b60	Metrics	Metrics	ODR to QlikView/QlikSense - Audit Data, Metrics, Studies, Sites, Enrollments	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:04.198732
2e6b2ff4-4146-4f7b-b0f8-104efbf5bddb	MO Status	MO Status	MES to OPM - End Manufacturing Order (RAH);MES to OPM - End Manufacturing Order (REN)	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:04.217342
ac46cc3a-40bd-49a3-aba9-153527d2140b	New Field for ERP Destination Inventory Organization	New Field for ERP Destination Inventory Organization	MES to OPM - Outgoing Transport (RAH);MES to OPM - Outgoing Transport (REN)	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:04.234866
35f06f4b-7b65-497d-b58c-3ab6c4f192e3	Non CRF Data	Non CRF Data	Axway to Operational DataLake - Operational EDC, non-CRF Data;CRO to ODR - eTMF Document, Non CRF Data	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Non CRF Data / Biomarker Data;Non CRF Data / Lab Data	2025-06-10 04:59:04.252967
464dcb58-fd0b-467a-bdf6-755573c64281	Biomarker Data	Non CRF Data / Biomarker Data	Axway to IQVIA - CRF, Lab, Biomarker Data	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:04.27159
fdb96567-a0e3-4ac4-9c69-1cc89954d7ee	Lab Data	Non CRF Data / Lab Data	Axway to IQVIA - CRF, Lab, Biomarker Data;Central Lab to Operational Data Lake (ODL) - Lab Data;Speciality Lab to Operational Data Lake (ODL) - Lab Data;Third Party Vendor Lab Data to Axway - Lab Data	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:04.288639
3aebc11a-8e3a-4907-8210-68fb200e2d80	Non-EDC	Non-EDC	EDC Raw data, Labs, ECG, Imaging, Genomics to J-Review	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:04.306506
bdc7d675-f06f-42ac-a792-3cc49801601c	Non-Employee	Non-Employee	Active Directory (External App) to Data Warehouse;Active Directory (External App) to Oracle Core HR;Beeline to Global Development - Non-employee Roster;Beeline to Global Development - Non-employee Roster form Ceredian;Beeline to Oracle EBS (Automated);Beeline to Oracle EBS (WebADI);Beeline to Research IT - Non-employee Roster;CCure (External App) to Data Warehouse;Concur to Oracle General Ledger - PCard;Data Warehouse to CCure (External App);Data Warehouse to Dival Safety Boots (External App);Data Warehouse to Hyland Onbase - S&R;Data Warehouse to IOPS Data Warehouse (External App);Data Warehouse to Qlik (External App) - HR Data;Data Warehouse to RPA (External App);Data Warehouse to RSIGuard Ergonomics (External App);Data Warehouse to Zycus iAnalyze;Hubble to Oracle eBS;INT041 TriRiga to Workday - Worker Assignment;INT102  Workday + Beeline to Compliance Wire (External App);INT108  Workday + Beeline to Concur - Profile Data;INT110  Workday + Beeline to Concur - Login Data;INT129 Workday + Beeline to SumTotal - Employee Data;INT131 Workday + Beeline to SumTotal - Users to Organizations;INT135 Workday + Beeline to SumTotal - User to Jobs;INT143  Workday + Beeline to TriRiga;INT145  Workday + Beeline to Veeva (External App) - Termination Data;INT163  Workday + Beeline to Enablon (External App);INT167  Workday + Beeline to Everbridge;INT187  Workday + Beeline to Icertis;INT236 Beeline to Workday - Non Employee Data;INT271 Data Warehouse to Beeline - Worker ID Upload;INT271 Data Warehouse to Beeline - Worker ID Upload / INT278  Worker Upload results file;INT289 Workday + Beeline to Insights RM (External App);INT320 Beeline Worker Download to Active Directory (External App);Lenel (External App) to Data Warehouse;Oracle Core HR to Peoplefluent Who's Who;Oracle Finance to Data Warehouse;Oracle to Legal Hold Pro;Oracle to SumTotal - Employee;Oracle to SumTotal - Employee to Job;Oracle to SumTotal - Employee to Organization;P2000 (External App) to Data Warehouse;WD+BL to Intuition LMS (External App);Workday + Beeline to Active Directory (External App);Workday + Beeline to CCure (External App);Workday + Beeline to Ceridian EE Out to Filemaker Pro V16 RENS (External App);Workday + Beeline to Ceridian EE Out to Filemaker Pro V18 Tarrytown (External App);Workday + Beeline to Ceridian EE Out to InsightsRM (External App);Workday + Beeline to Ceridian EE Out to SailPoint (External App);Workday + Beeline to Ceridian to Active Directory (External App);Workday + Beeline to Ceridian to Ruby User Table (External App);Workday + Beeline to Dival Safety Boots Tarrytown only (External App);Workday + Beeline to Filemaker Pro Tarrytown & Ruby User Table (External App) V18;Workday + Beeline to Hyland Onbase S&R (External App);Workday + Beeline to IOPS Data Warehouse (Managed by IOPS);Workday + Beeline to RSIGuard (External App);Workday + Beeline to Safety Stratus (External App);Workday + Beeline to Sailpoint (External App);Workday + Beeline to to Ceridian EE Out to Data Warehouse (Master Data);Workday+Beeline to Intuition	\N	\N	\N	\N	\N	\N	\N	\N	\N	G&A IT	\N	\N	2025-06-10 04:59:04.325127
d4b8f67b-525d-4858-851f-d463bf223d8a	Notifications	Notifications	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Notifications / Notifications to External Vendors;Notifications / Notifications to ODR help Team	2025-06-10 04:59:04.343528
b9222b47-b4f4-4839-915b-3f6f405b7177	Notifications to External Vendors	Notifications / Notifications to External Vendors	Data Vision to External Authoring Vendors - Notifications	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:04.361607
18877ee1-2fd8-402b-80ac-7572656d6ff2	Notifications to ODR help Team	Notifications / Notifications to ODR help Team	ODR to Outlook - Notifications	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:04.379545
2d6ea515-9845-46a2-8b8f-801b7029c950	Oncology Data	Oncology Data	Calyx IRT to ODL - Oncology Data;Endpoint to ODL - Oncology Data	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:04.398036
9312ce97-4d90-4da7-9f58-04fdfd498e6a	Operations	Operations	OPM to MES - Master Batch Record (BOM & Routing) (RAH);OPM to MES - Master Batch Record (BOM & Routing) (REN);OPM to MES - PROCESS ORDER (Batch) (RAH);OPM to MES - PROCESS ORDER (Batch) (REN)	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:04.417458
c6a712b2-5893-4d42-befa-d14bb7352f2e	OPM	OPM	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:04.435441
74f6134f-3cb5-4cbd-bef7-8df6b61f49a8	Order no.	Order no.	MES to OPM - End Manufacturing Order (RAH);MES to OPM - End Manufacturing Order (REN);MES to OPM - Take-Out on Manufacturing Order (RAH);MES to OPM - Take-Out on Manufacturing Order (REN);OPM to MES - PROCESS ORDER (Batch) (RAH);OPM to MES - PROCESS ORDER (Batch) (REN)	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:04.453903
6c098d75-8c46-4409-a8b4-0f74452cc837	Organization	Organization	Data Warehouse to Beeline - Cost Centers;Data Warehouse to Beeline - HR Orgs;Data Warehouse to Beeline - Organizational Unit (OU);Data Warehouse to Beeline - Region;Data Warehouse to Beeline - Territory;Data Warehouse to Beeline - Work Location;Dell Boomi to Veeva CTMS - Study, Org Information;INT090  Workday to Candex - All Requisitions;INT131 Workday + Beeline to SumTotal - Users to Organizations;INT137  Workday to SumTotal - Organization Data;INT223  Workday to ServiceNow Foundation;INT294 - Out - Workday to Graebel - Candidate Data Feed - EIB;Oracle Finance to Data Warehouse;Oracle to SumTotal - Employee to Organization;Oracle to SumTotal - Organizations;Oracle to Workday - Cost Center;Workday to Beeline - HR Orgs;Workday to Beeline - Region (Sup Org);Workday to Beeline - Territory	\N	\N	\N	\N	\N	\N	\N	\N	\N	G&A IT	\N	\N	2025-06-10 04:59:04.470701
f4debcf0-c28d-45fc-9d4b-a9a40e7e3a89	Organizations	Organizations	Candidates_Qlik_INT;EDMCS to Beeline - Departments and Organizations;Insights RM to ODL - Insights	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:04.488686
eac4c357-139b-4c63-806b-baad737084fd	Outcome Measures	Outcome Measures	gREG to ODL - End Points, Outcome Measures	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:04.506316
47044ac7-36ec-4d92-a68b-d83a514bfc2c	Outcomes Dataset	Outcomes Dataset	Educational Impact to PowerBI - Outcomes;Educational Impact to R/R Studio - Outcomes	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Outcomes Dataset / Final Outcomes;Outcomes Dataset / Interim Outcomes	2025-06-10 04:59:04.524517
f3cef1b7-408d-4775-86c5-d2a12bdb6c2e	Final Outcomes	Outcomes Dataset / Final Outcomes	Educational Impact to GFMS - Outcomes	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:04.541722
5784ffd7-4fb5-4035-8d03-156969e02ff0	Interim Outcomes	Outcomes Dataset / Interim Outcomes	Educational Impact to GFMS - Outcomes	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:04.559593
e5ac75a1-154a-4ac3-8d11-b90b774d2444	Patient Reimbursement	Patient Reimbursement	GTO Data Ingestion Forms to Qlik - Materials, Recruitment Campaign - Country & Study, Social Media - Country & Study, Home Health, Patient Reimbursement, Site Augmentation - Study & Country	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:04.576753
ee7da4d0-331c-4502-8792-2c3a3d27bb8d	Payables	Payables	Oracle Finance to Data Warehouse;Oracle Payables to Bank of America;Oracle Payables to JPMC - ACH;Oracle Payables to Reval	\N	\N	\N	\N	\N	\N	\N	\N	\N	G&A IT	\N	\N	2025-06-10 04:59:04.59503
d13ff1f7-2798-48ee-8ed6-83921b731a3f	Payment Data	Payment Data	Oracle Payables to MUFG Bank	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	MUFG Global Payment Hub	Payment Data / Check Number;Payment Data / Remittance Date	2025-06-10 04:59:04.612657
7ae083fd-fccc-4790-b947-9d1ec63710fe	Check Number	Payment Data / Check Number	GFMS to Markview - Payment Data	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:04.630616
097428bf-93d9-4a3e-9769-4ac6466fcd79	Remittance Date	Payment Data / Remittance Date	GFMS to Markview - Payment Data	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:04.648216
2c9c1221-c69f-4a33-8c7b-71ff907928e7	Payroll	Payroll	Achievers to Oracle;AON to CorePay;Axtria (External App) to Oracle;CorePay to Bank of Ireland;INT084  Workday to Businessolver - Worker Data;INT118 Workday to Corepay - Salary Rate Delta;INT120 Workday to Corepay - Salary Rate Full;Invesco to AON;Invesco to Oracle Payroll;Oracle Compensation to Equity Edge - Taxes;Oracle Compensation to Equity Edge - Wages;Oracle EBS to Legacy PBCS - Employee;Oracle EBS to Legacy PBCS - Overtime;Oracle Payroll to ADP - Periodic Tax;Oracle Payroll to ADP - REGN ADP Lien Disbursement Extract;Oracle Payroll to Fidelity;Oracle Payroll to WageWorks;Regeneron Ireland Mercer Outbound Interface;REGN ADP Tax Monthly Interface;REGN ADP Tax Periodic Interface;REGN ADP Tax Quarterly Interface	\N	\N	\N	\N	\N	\N	\N	\N	\N	G&A IT	\N	\N	2025-06-10 04:59:04.666009
1e92c67b-86d1-45ff-95c1-4eff61620984	Planned Dates	Planned Dates	OPM to MES - PROCESS ORDER (Batch) (RAH);OPM to MES - PROCESS ORDER (Batch) (REN)	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:04.68526
821edf23-6202-44bc-b6b0-4a4d9a8e15bc	Plans	Plans	RWDnA to IQVIA - Plans, Insights;RWDnA to Strategic Planning Teams Site - Plans	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:04.70298
899353a3-1268-4d88-ab56-9cde884967b5	Positions	Positions	INT276_-_All_Open_Positions_-_RPT_QLIK_All_Open_Positions;RPT_HCM_Position_Management_IOPS_DL;RPT_RAAS_Positions_Qlik	\N	\N	\N	\N	\N	G&A IT	\N	\N	\N	G&A IT	\N	\N	2025-06-10 04:59:04.720609
d31b162a-fe08-460f-8214-6a6566a2515c	Product	Product	Argus to MDM - Product;Bioregistry (RDL) to MDM - Study;Compass to MDM - Study, Product;Targets PPM to MDM - Product;Veeva CTMS to Veeva QMOD - Product, Study;Veeva eTMF to Veeva QMOD - Product, Study;Veeva RIM to MDM - Product	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Product / Product;Product / Registrations	2025-06-10 04:59:04.738878
bc759cdf-f55f-4e77-a5aa-73bac1abbb1d	Product	Product / Product	Veeva RIM Submissions to Veeva CTMS - Product Records	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:04.75566
c2c0ee0d-8912-4f61-8ff2-23694d8b6305	Registrations	Product / Registrations	Veeva CTMS to gREG - Study, Registrations	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:04.773417
aa692a09-ac31-4d63-9e68-309ae7114722	Product Version	Product Version	OPM to MES - PROCESS ORDER (Batch) (RAH);OPM to MES - PROCESS ORDER (Batch) (REN)	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:04.791522
5e367d97-2b25-4da8-8762-737f3ff54c4f	Project	Project	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	G&A IT	Tempus Resource	\N	2025-06-10 04:59:04.808487
9860012f-ae4c-4a5f-baf5-508d5a7b346a	Project Resource	Project Resource	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	G&A IT	Tempus Resource	\N	2025-06-10 04:59:04.826427
520714f0-67a1-4dc9-bc8f-80030ba8bdb3	Projections	Projections	Insights RM to ODL - Insights	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:04.844571
d6d39ea5-e47c-473d-9e29-bbe3d21de389	Publications	Publications	ALR to Milvus Vector DB - Publications;iEnvision to nonGxP Medical Data Lake - Publications;Milvus Vector DB to Azure Open AI - Publications;Pubmed to ALR - Publications	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:04.861614
27b9b52b-dc08-453c-a557-9180a4a1a59a	Purchase Orders	Purchase Orders	Email or Scanner (External App) to Kofax Markview;Oracle Finance to Data Warehouse;Oracle Procurement to Changepoint (External App);Oracle Purchasing to Oracle Business Network (External App)	\N	\N	\N	\N	\N	\N	\N	\N	\N	G&A IT	\N	\N	2025-06-10 04:59:04.879849
a535d468-ff5f-408f-b85f-4cd29046157c	Purchase Requisitions	Purchase Requisitions	Oracle Finance to Data Warehouse;Oracle Procurement to Changepoint (External App);Vendor Catalogs (External App) to Oracle Procurement	\N	\N	\N	\N	\N	\N	\N	\N	\N	G&A IT	\N	\N	2025-06-10 04:59:04.897714
a891c333-b93d-48dc-a6fd-c37bf14e6420	QMOD	QMOD	Veeva QMOD to QlickView - Quality Event Management Data, QMOD, Tracker	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Veeva - QMOD	\N	2025-06-10 04:59:04.91591
400e45b8-ce18-454e-ad63-b3df1c2d9b94	QRACT SS	QRACT SS	QRACT to Veeva CTMS - QRACT SS;Veeva CTMS to QRACT - Medical Monitoring Report, QRACT SS	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:04.934364
7d198b7e-5ae3-414d-9cb8-f074984e7f70	QS status (Batch status mapping)	QS status (Batch status mapping)	OPM to MES - Batch Master Data (Lot Generation) (RAH);OPM to MES - Batch Master Data (Lot Generation) (REN)	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:04.952547
42d21d25-03c6-4612-a931-368fce9f52dd	Quality Event Management Data	Quality Event Management Data	Veeva QMOD to QlickView - Quality Event Management Data, QMOD, Tracker	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Veeva - QMOD	\N	2025-06-10 04:59:04.970334
4eb33bcf-8a30-49f3-b01c-33d6695e3afa	Quality Risk Signals	Quality Risk Signals	Rave EDC to Veeva QMOD - Quality Risk Signals	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	RAVE EDC	\N	2025-06-10 04:59:04.989015
6c09166c-6e6d-49b8-b9b9-5744329a9146	Quantity	Quantity	MES to OPM - Outgoing Transport (RAH);MES to OPM - Outgoing Transport (REN);MES to OPM - Permanent Inventory (RAH);MES to OPM - Permanent Inventory (REN);MES to OPM - Take-Out (On Cost Center and Scrapping) (RAH);MES to OPM - Take-Out (On Cost Center and Scrapping) (REN);MES to OPM - Take-Out on Manufacturing Order (RAH);MES to OPM - Take-Out on Manufacturing Order (REN);MES to OPM - Transport Order (RAH);MES to OPM - Transport Order (REN);OPM to MES - Incoming Transport (Intern Order or Sub Inv) (RAH);OPM to MES - Incoming Transport (Intern Order or Sub Inv) (REN);OPM to MES - PROCESS ORDER (Batch) (RAH);OPM to MES - PROCESS ORDER (Batch) (REN)	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:05.008409
2f0f99c3-e726-4217-b47e-c11c65f69525	Randomization	Randomization	Calyx IRT to ODR - Screening, Randomization Data;YPrime IRT to ODR - Screening, Randomization Data	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:05.029526
65db098d-adae-4511-873a-317452ce3f40	Records Insights	Records Insights	Veeva Medical CRM to Teams - Records Insights, Materials	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:05.047837
17b93861-67c4-493b-a7fc-ac3dfd25d126	Recruitment Campaign - Country & Study	Recruitment Campaign - Country & Study	GTO Data Ingestion Forms to Qlik - Materials, Recruitment Campaign - Country & Study, Social Media - Country & Study, Home Health, Patient Reimbursement, Site Augmentation - Study & Country	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:05.100783
78d1bcec-82b7-4477-9042-e8814a89a150	Report	Report	Veeva Submissions to QlickView - Reports	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Report / Active Directory Report;Report / ERT Reports;Report / IRT Report;Report / IRT Summary Report;Report / Medical Monitoring Report;Report / Newly hired Employee Report;Report / Operational Report;Report / PPD Reports;Report / QMOD CAPA Report;Report / QMOD Report;Report / QMOD SSN Report;Report / Quarterly Signal Reports;Report / Separated Employee Report;Report / Training Non-compliance Report	2025-06-10 04:59:05.118898
5960550c-bccf-47ce-8d29-ad460cfcd101	Active Directory Report	Report / Active Directory Report	Veeva QMOD to Outlook - CAPA, Active Directory Report;Veeva QMOD to Outlook - SSN, Active Directory Report	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:05.135574
389ff4d9-5796-4043-86e4-4fba2c1cfe65	ERT Reports	Report / ERT Reports	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:05.152766
45c56f67-61cb-4137-926e-03837218331a	IRT Report	Report / IRT Report	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:05.170941
04bd0ce5-078c-46b8-a95e-2c0748efb6a9	IRT Summary Report	Report / IRT Summary Report	ODR to RTS - eCoA, IRT Summary Report	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:05.188831
fd5923d7-c180-4c1a-b3bc-de9257d6ccb9	Medical Monitoring Report	Report / Medical Monitoring Report	Veeva CTMS to QRACT - Medical Monitoring Report, QRACT SS	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:05.207234
0f5bd0da-d6c9-41f9-8795-e51b2b3f651d	Newly hired Employee Report	Report / Newly hired Employee Report	QlikSense to Compass - Newly hired Employee Report	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:05.225309
00d560c1-090a-4074-9187-9df4d88d4a67	Operational Report	Report / Operational Report	Veeva QMOD to ODR/ODL - Operational Reports;Veeva RIM Submissions to ODR/ODL - Operational Reports;Veevavault CTMS - ODR - EDC, IVR, Monitoring Data	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:05.245451
0035a4e0-623a-416e-b6c1-3dd8aa492b41	PPD Reports	Report / PPD Reports	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:05.263998
f6321003-52b7-4bb4-8bf5-683830c695b9	QMOD CAPA Report	Report / QMOD CAPA Report	Veeva QMOD to Outlook - CAPA, Active Directory Report	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:05.281844
71c14eea-e42f-4398-bf48-13af39c5f033	QMOD Report	Report / QMOD Report	Veeva QMOD to RPA CAPA Bot - QMOD Report	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Veeva - QMOD	\N	2025-06-10 04:59:05.301757
c465c628-ebf2-4cd3-ba2e-6287853e06b8	QMOD SSN Report	Report / QMOD SSN Report	Veeva QMOD to Outlook - SSN, Active Directory Report	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:05.318572
31dd7b13-4445-48aa-9106-995d17564a93	Quarterly Signal Reports	Report / Quarterly Signal Reports	Veeva RIM Registrations to CWI FAERS EVDAS Service - Quarterly Signal Reports	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:05.337099
1ddb161c-7996-4443-99fb-a6d920fc91f8	Separated Employee Report	Report / Separated Employee Report	QlikSense to Compass - Separated Employee Report	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:05.355663
4abf4437-2f29-4d4e-a582-93ef77f303e2	Training Non-compliance Report	Report / Training Non-compliance Report	REGNU to QlikSense - Training Non-compliance Report;TalentHub to QlikSense - Training Non-compliance Report	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:05.373925
836fa0e7-e591-4fca-b969-e011813b2aff	Report Headcount	Report Headcount	Insights RM to ODL - Insights	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:05.391519
7c16e695-5dda-4466-b61f-23e1c88b8838	Req & PO	Req & PO	Oracle Financials to Changepoint - Req & PO, Invoices & Accruals	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:05.409623
5cf6f3fc-cf40-4e51-a161-e67e9c6fe9df	Requisition	Requisition	Candidates_Qlik_INT;HRDL_RPT_RAAS_Requisitions_Qlik;INT252  Workday to Textio - job requisition data	\N	\N	\N	\N	\N	\N	\N	\N	\N	G&A IT	\N	\N	2025-06-10 04:59:05.428132
c11c6f30-f5f2-4f97-8460-45096214c476	Research Ideas	Research Ideas	Panalgo to RWDnA Platform - Research Ideas;RWDnA Platform to Data Vision - Research Ideas, Document Requests	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:05.446168
88a3b4a1-9dc6-4b8f-af79-121f0c4527bb	Resource Milestones	Resource Milestones	Compass to Insights RM - Resource Milestones;Insights RM to ODR - Resource Milestones	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:05.464871
af365044-df45-4ea9-97d6-136038d9ec5f	Resume	Resume	INT206  Candex to Workday - Candidate data include attachments	Career Site Replacement	\N	\N	\N	\N	\N	\N	\N	\N	G&A IT	LinkedIn Recruiter	\N	2025-06-10 04:59:05.483868
b9818b63-d1c2-480e-8d0b-81439f4d7b31	Review Document	Review Document	PleaseReview to ODL - Review Document	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:05.500492
7e73cb39-d883-489b-94a3-00af69b37287	Reviewed Content	Reviewed Content	PleaseReview to Veeva Submissions - Reviewed Content	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:05.518174
53717b3c-744b-4182-bcef-c16199ebf60b	Risk Management Template	Risk Management Template	Accenture StartingPoint to Veeva RIM Registration - Risk Management Template	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:05.5364
80866141-33a4-43b3-b4fd-37dc8776fb61	Roles	Roles	Insights RM to ODL - Insights	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:05.554596
9a129da1-5c6d-4313-9c77-16f7a213549b	Sample Data	Sample Data	Research Data Lake (RDL) to Human Sample Request (HSR) - Sample Data	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:05.572914
98419aab-c5c1-41d6-b7be-1ebcd33e6cf7	Sample Information	Sample Information	Nautilus LIMS to Sample Permissions Database - Sample Management Information	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:05.591018
02bb2536-cf1d-412c-b94d-776cb8877416	SAS Datasets	SAS Datasets	Axway to Isilon - SAS Datasets;RTS to BDI - SAS Datasets	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	SAS Datasets / CDASH Compliant Datasets;SAS Datasets / Early look datasets	2025-06-10 04:59:05.608786
7929de15-dbc8-4627-a8e8-8efc18c01d2e	CDASH Compliant Datasets	SAS Datasets / CDASH Compliant Datasets	Rave EDC to Axway - CDASH Compliant SAS Datasets	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:05.627173
ca517185-49f7-481c-ade3-21f363b22d77	Early look datasets	SAS Datasets / Early look datasets	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:05.64516
05fe1969-450b-4c87-9cb9-5c85aee76959	Screening	Screening	Calyx IRT to ODR - Screening, Randomization Data;YPrime IRT to ODR - Screening, Randomization Data	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:05.662922
0bc96419-74fb-4589-993a-d64d4ac666da	SDTM	SDTM	Multi Edit 2008 Lite  to Veeva Vault RIM Submissions - SDTM, ADaM, TLFs;PC SAS to Veeva Vault RIM Submissions - SDTM, ADaM, TLFs;SAS Grid to Veeva Vault RIM Submissions - SDTM, ADam, TLFs	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:05.681308
47ace01f-c8b8-4317-a735-ce17c8abecc8	Seat	Seat	INT041 TriRiga to Workday - Worker Assignment;INT_Workday_Vistornet;Oracle Finance to Data Warehouse	\N	\N	\N	\N	\N	\N	\N	\N	\N	G&A IT	\N	\N	2025-06-10 04:59:05.699164
28bfd15d-4e15-4e8e-8462-e8090499fdce	Site	Site	CRO to ODR - eTMF Document, Non CRF Data;CRO to Veeva CTMS - Study, Country, Site;ODR to Dataiku - Studies, Sites, Enrollments;ODR to Power BI - Studies, Sites, Enrollments;ODR to QlikView/QlikSense - Audit Data, Metrics, Studies, Sites, Enrollments;ODR to Tableau - Studies, Sites, Enrollments;ODR,ODL to Study Optimizer - Study,Site, Enrollment Data	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Site / Site Activation;Site / Site Enrollment;Site / Site Information;Site / Site Milestone;Site / Site Monitoring;Site / Site Number;Site / Site Plan;Site / Site Records;Site / Site Visit	2025-06-10 04:59:05.71768
5ec94886-d51e-4d2e-bb64-6613b1d9384a	Site Activation	Site / Site Activation	CRO to Veeva to Vault Track (eTMF) - Operational Study Data;RTS to ODL - IRT Summary Report, Site Activation, eCoA Data;Study Optimizer to Veeva CTMS - Enrollment, Site Activation Plans	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:05.734511
3757db04-6cef-4a54-b6a3-f6e6430eac31	Site Enrollment	Site / Site Enrollment	CRO to Veeva to Vault Track (eTMF) - Operational Study Data;DQS to ODL - Study Metadata, Site Enrollment, Site Milestone, Site Information;ODL to Knowledge Management - Study Metadata, Site Enrollment, Site Milestone, Site Information, Study Milestones, Country Data, ICF;ODR,ODL to Study Optimizer - Study,Site, Enrollment Data;Study Optimizer to Veeva CTMS - Enrollment, Site Activation Plans	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:05.752244
dd757320-a78a-4373-83b3-2595ebb60dfd	Site Information	Site / Site Information	DQS to ODL - Study Metadata, Site Enrollment, Site Milestone, Site Information;ODL to Knowledge Management - Study Metadata, Site Enrollment, Site Milestone, Site Information, Study Milestones, Country Data, ICF;VeevaVault CTMS to Site Contact Information - SCI	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:05.769919
4b56500b-055a-4933-befa-5fa03e64f335	Site Milestone	Site / Site Milestone	Data Query Systems to CTMS - Study, Site, Enrollment Milestones;DQS to ODL - Study Metadata, Site Enrollment, Site Milestone, Site Information;IQVIA to Veeva CTMS - Study, Site, Enrollment Milestones;ODL to Knowledge Management - Study Metadata, Site Enrollment, Site Milestone, Site Information, Study Milestones, Country Data, ICF;Veeva CTMS (Zai China) to ODL - Site Milestone, Study Metadata, ICF;Veeva CTMS to ODL - Site Milestone, ICF	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:05.788504
816925b9-9b03-463a-b0b8-5d34b13da5ce	Site Monitoring	Site / Site Monitoring	Veevavault CTMS - ODR - EDC, IVR, Monitoring Data	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	ODR (CST Dashboard);Veeva - CTMS	\N	2025-06-10 04:59:05.805452
19c1654c-8083-4677-898c-46386d8732c9	Site Number	Site / Site Number	ASIST to ODR - Supplies Tracking, Protocol, Country, Investigator, Site Number	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:05.823078
de3b0442-1136-4403-940f-12950477427c	Site Plan	Site / Site Plan	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:05.841026
c42f658b-df21-4b3a-a81b-82e8691b0dfa	Site Records	Site / Site Records	Veeva CTMS to Veeva RIM Submissions - Study, Study Product, Site Records	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:05.858943
b6148c2d-271a-4e15-91f4-b4e7995f2a56	Site Visit	Site / Site Visit	CRO to Veeva to Vault Track (eTMF) - Operational Study Data	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:05.878729
1414ca9c-c117-425b-8edf-5d879a6101e7	Site Augmentation - Study & Country	Site Augmentation - Study & Country	GTO Data Ingestion Forms to Qlik - Materials, Recruitment Campaign - Country & Study, Social Media - Country & Study, Home Health, Patient Reimbursement, Site Augmentation - Study & Country	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:05.89701
04c5c530-a1c7-4a65-b532-ce968dec15de	Social Media - Country & Study	Social Media - Country & Study	GTO Data Ingestion Forms to Qlik - Materials, Recruitment Campaign - Country & Study, Social Media - Country & Study, Home Health, Patient Reimbursement, Site Augmentation - Study & Country	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:05.913459
bdd4bbc9-2120-45c1-9b73-6ef99f2dd5bd	SOE (Schedule of Events) Data	SOE (Schedule of Events) Data	Nurocor Clinical Platform (NCP) to Operational Data Lake (ODL) - Protocol and SOE Data;Operational Data Lake (ODL) to One Source Data Hub (OSDH) - Protocol and SOE Data	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:05.931343
ac1f4e9c-b491-4935-8879-89540163eb8d	Source and Destination Location ( Size Enlarged)	Source and Destination Location ( Size Enlarged)	MES to OPM - Outgoing Transport (RAH);MES to OPM - Outgoing Transport (REN)	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:05.949343
ac2d11be-6fc0-4ad8-8e28-11538a23e22d	SQL Queries	SQL Queries	GFMS to iZenda - SQL Queries	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:05.967348
35958b19-41b4-474f-918c-15d62b77ee29	SRD	SRD	Veeva Vault MedComms to EverSana - SML, CML, SRD, CRD	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:05.985071
e30bd3d4-d3b2-4cd1-bcb6-8726894d8235	Statistical Analysis	Statistical Analysis	GDS Big Data Initiative to SAS - Statistical Analysis;Scientific Data Lake to SAS 9.4 - Statistical Analysis	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:06.002834
89ee459b-a2c8-4cf7-a047-21c0c3879ea8	Study	Study	Compass to MDM - Study, Product;Compass to ODR - Study Milestones, Study Data;Compass to Qlik;Compass to Veeva CTMS - Study;CRO to ODR - eTMF Document, Non CRF Data;CRO to Veeva CTMS - Study, Country, Site;Dataiku to ODR - Studies, Milestones, TA Ops;Dell Boomi to Veeva CTMS - Study, Org Information;Knowledge Management to Sharepoint - Study Data;ODL to MDM - Investigator, Study;ODR to Dataiku - Studies, Sites, Enrollments;ODR to Power BI - Studies, Sites, Enrollments;ODR to QlikView/QlikSense - Audit Data, Metrics, Studies, Sites, Enrollments;ODR to Tableau - Studies, Sites, Enrollments;ODR,ODL to Study Optimizer - Study,Site, Enrollment Data;Power BI to ODR - Studies, Milestones, TA Ops;Precision Medicine Server to Veeva QMOD - Study;Qlik to ODR - Studies, Milestones, TA Ops;Sharepoint to MDM - Study;Tableau to ODR - Studies, Milestones, TA Ops;Veeva CTMS to MDM - Investigator, Institution, Study;Veeva CTMS to Veeva QMOD - Product, Study;Veeva eTMF to Veeva QMOD - Product, Study	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Study / Activity Logs;Study / Clinical Study Reports;Study / Monthly Study Data;Study / Protocol;Study / Protocol Definition;Study / Protocol Deviation (Bot);Study / Protocol Deviation Files;Study / Study Budget (Bot);Study / Study Daily Report;Study / Study Data;Study / Study Documents;Study / Study Enrollment;Study / Study Invitees;Study / Study MetaData;Study / Study Milestones;Study / Study Number;Study / Study Product;Study / Study Responses;Study / Study Timelines;Study / Study Tracking;Study / Subject Data	2025-06-10 04:59:06.019813
01ce70ad-9879-4107-8573-9bbe4265700e	Activity Logs	Study / Activity Logs	Site Feasibility Application to Data Lake- Study Invitees, Responses & Activity Logs	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:06.03742
f65a4991-ab5d-46af-b9ac-43732f13ac6a	Clinical Study Reports	Study / Clinical Study Reports	PPD Portal to RTS - Study Reports;ProofPoint Secure Share to CTIS - Clinical Study Reports, Translation files	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:06.055572
e858b10d-6800-4d68-8bd7-733cd3b8795e	Monthly Study Data	Study / Monthly Study Data	ESR SP to Compass - Monthly Study Data;ESR SP to WCG Safety Portal - Monthly Study Data	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:06.07247
0afaf84d-39e5-4da5-89d6-f1ec45f0f6bd	Protocol	Study / Protocol	ASIST to ODR - Supplies Tracking, Protocol, Country, Investigator, Site Number;Nurocor Clinical Platform (NCP) to Operational Data Lake (ODL) - Protocol and SOE Data;Operational Data Lake (ODL) to One Source Data Hub (OSDH) - Protocol and SOE Data	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:06.090135
0cf7b6c7-038d-4a98-ad2b-24f477b70278	Protocol Definition	Study / Protocol Definition	Veeva CTMS to Compass - Protocol Definition	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:06.109522
8324e816-aea1-495a-8ff2-07ea10e4a5c2	Protocol Deviation (Bot)	Study / Protocol Deviation (Bot)	CRO to ODR - eTMF Document, Non CRF Data;DataLake to ODR - Study Number, Study Budget Data (Bot), Protocol Deviation Data (Bot)	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:06.127518
34ba96f7-fb23-48c4-ba57-21c2aeeb87c8	Protocol Deviation Files	Study / Protocol Deviation Files	Bus Ops SharePoint to Data Lake (Phase 2) - Protocol Deviation Files	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:06.145163
b4a42cb2-f0d1-44c7-9390-6508027f3c8b	Study Budget (Bot)	Study / Study Budget (Bot)	Bus Ops SharePoint to Data Lake Phase 1 - Study Budget and eCOA master file;DataLake to ODR - Study Number, Study Budget Data (Bot), Protocol Deviation Data (Bot)	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:06.16347
167461f3-cc98-4773-b974-01e067886d9f	Study Daily Report	Study / Study Daily Report	QlikSense to Sharepoint - Study Daily Report;Veeva eTMF to Outlook - Study Daily Report & 1572 information	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:06.181313
6f2cf072-a005-4b28-b00a-b04444534c70	Study Data	Study / Study Data	Operational Data Lake (ODL) to Genesis Playbook - Study Data;Operational Data Lake (ODL) to Human Sample Request (HSR) - Study Data;Veeva CTMS to Veeva RIM Submissions - Study, Study Product, Site Records	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:06.199295
09c366be-0e97-486d-bad8-25dcef7910e0	Study Documents	Study / Study Documents	Veeva eTMF to Veeva eTMF - Study Documents	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:06.217379
c33393a2-f4e7-4be8-a3fe-0eaa86baa23c	Study Enrollment	Study / Study Enrollment	CRO to ODR - eTMF Document, Non CRF Data;ODR,ODL to Study Optimizer - Study,Site, Enrollment Data;Study Optimizer to Veeva CTMS - Enrollment, Site Activation Plans	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Clinical Operational Repository (ODR)	\N	2025-06-10 04:59:06.236244
b9a09f48-25e2-4a5b-973c-b98a8b97550f	Study Invitees	Study / Study Invitees	Site Feasibility Application to Data Lake- Study Invitees, Responses & Activity Logs	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:06.254197
75ca3ae4-59a7-4cab-b6cb-bd6c53f7d3ce	Study MetaData	Study / Study MetaData	DQS to ODL - Study Metadata, Site Enrollment, Site Milestone, Site Information;Informa Citeline to ODL - Study Metadata;ODL to Knowledge Management - Study Metadata, Site Enrollment, Site Milestone, Site Information, Study Milestones, Country Data, ICF;Veeva CTMS (Zai China) to ODL - Site Milestone, Study Metadata, ICF;Veeva CTMS to ODL - Study Metadata	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:06.272414
5639290b-327c-4fdb-b85e-90d55c6aab14	Study Milestones	Study / Study Milestones	Compass to ODL - Study Milestones;Compass to ODR - Study Milestones, Study Data;Compass to Qlik;Data Query Systems to CTMS - Study, Site, Enrollment Milestones;Dataiku to ODR - Studies, Milestones, TA Ops;IQVIA to Veeva CTMS - Study, Site, Enrollment Milestones;ODL to Knowledge Management - Study Metadata, Site Enrollment, Site Milestone, Site Information, Study Milestones, Country Data, ICF;Power BI to ODR - Studies, Milestones, TA Ops;Qlik to ODR - Studies, Milestones, TA Ops;Tableau to ODR - Studies, Milestones, TA Ops;Veeva CTMS to Compass - Protocol Definition	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:06.290263
36011389-ce92-4853-afb7-c6d175a1eb2b	Study Number	Study / Study Number	DataLake to ODR - Study Number, Study Budget Data (Bot), Protocol Deviation Data (Bot);Sharepoint GD Study Numbers to Data Warehouse	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:06.308176
04556444-8875-463f-b89b-ae4bbd289a75	Study Product	Study / Study Product	Veeva CTMS to Veeva RIM Submissions - Study, Study Product, Site Records	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:06.326129
e515e946-c658-4eb8-8fae-ef74d1823c33	Study Responses	Study / Study Responses	Site Feasibility Application to Data Lake- Study Invitees, Responses & Activity Logs	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:06.344187
0242dac1-af07-47fd-a958-e9899e802101	Study Timelines	Study / Study Timelines	Compass to Qlik	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:06.362372
72f63f6b-a5dd-4748-aa95-451dd7db9a80	Study Tracking	Study / Study Tracking	ESR SP to Benevity ESR - Study Tracking	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:06.380616
33a0cfe8-01bf-4d18-b13e-ceebfcf7aad0	Subject Data	Study / Subject Data	Calyx to Veeva eTMF - EDC Patient;CRO to ODR - eTMF Document, Non CRF Data;Global Data Lake (GDL) to Human Sample Request (HSR) - Subject Data;YPrime IRT to Veeva eTMF - Subject	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:06.398799
26e88cbb-8428-481c-9e36-aae2574a9264	Supplier	Supplier	Approved Supplier Data to Oracle;Data Warehouse to Fusion BCP;Data Warehouse to Hyland Onbase - S&R;Data Warehouse to Safety Stratus (External App) - Supplier Data for EHS;Oracle Accounts Payable to ModelN (External Application);Oracle Finance to Data Warehouse;Oracle Procurement to iCertis - Supplier Data;Oracle Procurement to OneTrust - Supplier Data;Oracle to Data Warehouse - Supplier Data;Oracle to Data Warehouse - Vendor Data;Zycus iSupplier to Oracle Purchasing	\N	\N	\N	\N	\N	\N	\N	\N	\N	G&A IT	\N	\N	2025-06-10 04:59:06.415511
1c2c4efc-b151-411e-82d4-cc8565ee801a	TA Ops	TA Ops	Dataiku to ODR - Studies, Milestones, TA Ops;Power BI to ODR - Studies, Milestones, TA Ops;Qlik to ODR - Studies, Milestones, TA Ops;Tableau to ODR - Studies, Milestones, TA Ops	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:06.433996
2b6bc868-6cc6-4948-8015-ba9b83a63629	Tables, Figures and Listings (TFLs)	Tables, Figures and Listings (TFLs)	Multi Edit 2008 Lite  to Veeva Vault RIM Submissions - SDTM, ADaM, TLFs;PC SAS to Veeva Vault RIM Submissions - SDTM, ADaM, TLFs;SAS Grid to Veeva Vault RIM Submissions - SDTM, ADam, TLFs	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:06.451513
2902736c-43aa-4973-a448-73b918c33733	Tax	Tax	Oracle Finance to Data Warehouse;Revenue (External App) to Corepay;Vertex to Oracle Payroll	\N	\N	\N	\N	\N	\N	\N	\N	\N	G&A IT	\N	\N	2025-06-10 04:59:06.470345
0fbc6258-846c-49af-be7a-d124289c4255	Timesheet	Timesheet	Oracle EBS to Legacy PBCS - Employee;Oracle EBS to Legacy PBCS - Overtime;Oracle Finance to Data Warehouse;OTL to Corepay	\N	\N	\N	\N	\N	\N	\N	\N	\N	G&A IT	\N	\N	2025-06-10 04:59:06.488888
81279cd4-9c84-48ee-81c0-f66a11f94e25	Timing	Timing	Veeva RIM Submissions to Compass - Key Dates, Timing	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:06.507012
3a1db20f-da50-4893-8f1c-e418bd3cc52f	TMF Input	TMF Input	RPA Bot to eTMF - TMF Input	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:06.525062
f996b3f2-cc7d-4734-b1f8-a2a3339895e3	Tracker	Tracker	Veeva QMOD to QlickView - Quality Event Management Data, QMOD, Tracker	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	Veeva - QMOD	\N	2025-06-10 04:59:06.542913
61fb44bf-c780-49d6-8414-a1bd409bfa1e	Train Program	Train Program	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:06.560869
396975b2-be57-4adb-aa76-dc847fd724b2	Training	Training	INT632 - SumTotal ILT Calendar Update;REGNU to RTS - Training Data;RTS to ODL - Training Data	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:06.578894
ef2f6799-ef68-4939-96fc-2d22a7c2afa3	Training Schedule	Training Schedule	Intuition LMS to MTM - Training Schedule	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:06.596841
a374b008-69cf-4131-aa24-5832ecaafd3c	Translation files	Translation files	ProofPoint Secure Share to CTIS - Clinical Study Reports, Translation files	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:06.615452
42e9d2a3-4c2c-4578-afcc-80420032e341	University	University	Oracle Payables to MedPro	\N	\N	\N	\N	\N	\N	\N	\N	\N	G&A IT	\N	\N	2025-06-10 04:59:06.633442
8f27530d-2531-4aaf-83dd-fd94abc814ad	User Login Data	User Login Data	Linkedin to Mediverse - User Login Data;Sermo to Mediverse - User Login Data	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:06.651341
ea3e3764-1959-4be9-ae6a-6aa9ae77caf8	Users	Users	Beeline to Changepoint - User Data;Insights RM to ODL - Insights;Workday to Changepoint - User Data	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:06.669115
6514181d-1171-4cca-b236-f66f64705679	Valid Lot Size	Valid Lot Size	OPM to MES - Master Batch Record (BOM & Routing) (RAH);OPM to MES - Master Batch Record (BOM & Routing) (REN)	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:06.687091
3b5ff3b8-b56c-479e-833d-923635fac04a	Validity Range	Validity Range	OPM to MES - Master Batch Record (BOM & Routing) (RAH);OPM to MES - Master Batch Record (BOM & Routing) (REN)	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:06.705117
4da7e5a9-6421-4ba4-8ec9-bc03684149e5	Value Sets	Value Sets	Legacy PBCS to Oracle eBS - FIDS	\N	\N	\N	\N	\N	\N	\N	\N	\N	G&A IT	\N	\N	2025-06-10 04:59:06.723246
aa54fea9-d5d0-47a9-aedc-4ebec05d682e	Wearables Data	Wearables Data	RTS to Data Lake - Wearables	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:06.74105
676d6aa4-7137-4c38-a2b3-ab8f8e14f2c9	Workday Configuration Objects	Workday Configuration Objects	Workday to Workday - Tenant Analysis - CS Delivery Validation;Workday to Workday - Tenant Analysis - CS_Integrations_Health_Check;Workday to Workday - Tenant Analysis - DART-Integrations;Workday to Workday - Tenant Analysis - Field Impacts Analyzer;Workday to Workday - Tenant Analysis - INT Studio Migration Helper Inbound	\N	\N	\N	\N	\N	G&A IT - Human Resources	\N	\N	\N	G&A IT	\N	\N	2025-06-10 04:59:06.759629
e27d7590-7382-4181-9e45-46614af388fd	Workflow Functionalities	Workflow Functionalities	Veeva RIM Registrations to HAC - Workflow Functionalities;Veeva RIM Submissions Archive to HAC - Workflow Functionalities;Veeva RIM Submissions to HAC - Workflow Functionalities	* IOPS - Quality Systems Veeva Program / IOPS - GLO QMS/QDocs Veeva P2	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-06-10 04:59:06.776517
5d99d579-af3f-4089-b77b-922f9b94729b	Workspaces	Workspaces	INT264  Tririga to Workday – Workspace Creation-Inbound	\N	\N	\N	\N	\N	\N	\N	\N	\N	G&A IT	\N	\N	2025-06-10 04:59:06.794495
\.


--
-- Data for Name: initiatives; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.initiatives (id, name, description, status, start_date, end_date, business_capabilities, applications, created_at) FROM stdin;
e546da93-f17b-4515-98ba-0bd3bd6f5566	* IOPS - Logistics and Distribution Program	* IOPS - Logistics and Distribution Program	7. Execute	\N	\N	\N	\N	2025-06-10 05:01:14.56992
3c545ea4-dfdf-4ece-9153-0cdced58a316	IOPS - GLO Cloud Warehouse Management System (WH&L)	* IOPS - Logistics and Distribution Program / IOPS - GLO Cloud Warehouse Management System (WH&L)	3. Prioritize	\N	\N	IOPS Supply Chain Management / Warehouse Management	Future State ERP;Oracle eBusiness Suite [Platform]	2025-06-10 05:01:14.56992
c20232b6-e59d-4a19-ad2c-9a0eafb2cb95	IOPS - GLO Global Trade Compliance	* IOPS - Logistics and Distribution Program / IOPS - GLO Global Trade Compliance	3. Prioritize	\N	\N	IOPS Supply Chain Management / Global Trade Management	Future State ERP;Oracle eBusiness Suite [Platform]	2025-06-10 05:01:14.56992
f33c66b4-3653-4bbb-ab60-7c03dc0d9ba7	IOPS -GLO Transportation Management (4PLs)	* IOPS - Logistics and Distribution Program / IOPS -GLO Transportation Management (4PLs)	3. Prioritize	\N	\N	IOPS Supply Chain Management / Inbound / Outbound Transportation Management	Oracle eBusiness Suite [Platform]	2025-06-10 05:01:14.56992
491765b2-0196-4f0f-8185-08f88bad7682	* IOPS - Oracle Quality Improvement Program	* IOPS - Oracle Quality Improvement Program	1. Surface	\N	\N	\N	\N	2025-06-10 05:01:14.56992
da2ab581-bb26-4ebf-aadf-e3a13e59d846	* IOPS - QC Systems Program	* IOPS - QC Systems Program	7. Execute	\N	\N	\N	LabWare LIMS;Nautilus LIMS	2025-06-10 05:01:14.56992
f6b0d96b-634a-4bef-9873-451138fe38ad	IOPS - GLO LabWare Raw Materials Rollout	* IOPS - QC Systems Program / IOPS - GLO LabWare Raw Materials Rollout	7. Execute	\N	\N	IOPS Quality Control / Raw Materials Testing	Labware ELN;LabWare LIMS	2025-06-10 05:01:14.56992
06d2d702-ba3f-424e-b2a5-59d444067798	IOPS - GLO LabWare Upgrade (v8) and Qualification	* IOPS - QC Systems Program / IOPS - GLO LabWare Upgrade (v8) and Qualification	7. Execute	\N	\N	IOPS Quality Control	LabWare LIMS	2025-06-10 05:01:14.56992
53c44614-ad2a-41b0-a99b-ab5798680b29	IOPS - GLO LW Commercial Molecule Implementation	* IOPS - QC Systems Program / IOPS - GLO LW Commercial Molecule Implementation	6. Planning	\N	\N	IOPS Quality Control / In-Process and Product Release Testing	LabWare LIMS	2025-06-10 05:01:14.56992
f5811073-f0fe-416c-8d81-f21d94405bfd	* IOPS - Quality Systems Veeva Program	* IOPS - Quality Systems Veeva Program	7. Execute	\N	\N	\N	IOPS Veeva Vault QMS;QUMAS EQMS (Process Compliance)	2025-06-10 05:01:14.56992
1790895b-7e7b-417b-9de6-5cdb6cbbbef7	IOPS - GLO DocC Application Decommissioning	* IOPS - Quality Systems Veeva Program / IOPS - GLO DocC Application Decommissioning	2. Shape	\N	\N	IOPS Quality Assurance / Document Control	QUMAS EDMS (DocCompliance)	2025-06-10 05:01:14.56992
b27b1023-8d9d-435d-b1f4-073717bb7fe8	IOPS - GLO Process Compliance Upgrade	* IOPS - Quality Systems Veeva Program / IOPS - GLO Process Compliance Upgrade	7. Execute	\N	\N	IOPS Quality Assurance / Change Control;IOPS Quality Assurance / Deviation Management	QUMAS EQMS (Process Compliance)	2025-06-10 05:01:14.56992
994126d9-c5c1-42a2-ad1a-2ac9fd8487e2	IOPS - GLO QMS/EDMS P1: Veeva EM / EM QA	* IOPS - Quality Systems Veeva Program / IOPS - GLO QMS/EDMS P1: Veeva EM / EM QA	7. Execute	\N	\N	\N	\N	2025-06-10 05:01:14.56992
15cf647f-ae58-435d-b64b-65c1b676690f	IOPS - GLO QMS/EDMS P3: Veeva QMS	* IOPS - Quality Systems Veeva Program / IOPS - GLO QMS/EDMS P3: Veeva QMS	6. Planning	\N	\N	IOPS Quality Assurance / Complaints Management;IOPS Quality Assurance / Deviation Management;IOPS Quality Control / Test & Result Management	QUMAS EDMS (DocCompliance);QUMAS EQMS (Process Compliance)	2025-06-10 05:01:14.56992
c117242b-bd4e-47d7-ace0-b9ecd88298aa	IOPS - GLO QMS/QDocs Veeva P2	* IOPS - Quality Systems Veeva Program / IOPS - GLO QMS/QDocs Veeva P2	7. Execute	\N	\N	IOPS Quality Assurance / Change Control;IOPS Quality Assurance / Document Control;IOPS Quality Assurance / Validation	QUMAS EDMS (DocCompliance);QUMAS EQMS (Process Compliance)	2025-06-10 05:01:14.56992
78aee857-f36e-49c1-872b-e60a2e5a6390	2Seventy GD-IT: RA Systems Transition	2Seventy GD-IT: RA Systems Transition	active	\N	\N	\N	\N	2025-06-10 05:01:14.56992
96cd7868-d44c-419e-9b27-a19220383d58	2Seventy-GD IT: Clinical, Quality, GPS, Reg Affairs	2Seventy-GD IT: Clinical, Quality, GPS, Reg Affairs	active	\N	\N	\N	\N	2025-06-10 05:01:14.56992
31077d74-920e-4ef5-a5db-65e581133075	Appian Cloud Migration	Appian Cloud Migration	active	\N	\N	\N	Additional Risk Minimization Measures;Head Count Tracker;Health Authority Correspondence;Informed Consent Form (ICF) Management;Knowledge Management;Operations Management System (OMS);Site Contact Information	2025-06-10 05:01:14.56992
ee31781b-0bff-4cc6-9c87-00d6c28de17d	Bioanalytical Assay Provider Database (bAPD)	Bioanalytical Assay Provider Database (bAPD)	active	\N	\N	\N	\N	2025-06-10 05:01:14.56992
5904bf85-fa9c-4158-b79f-5b3a12b2352d	Broadspire Replacement	Broadspire Replacement	active	\N	\N	Benefits Management	Broadspire;Sedgwick	2025-06-10 05:01:14.56992
54e20ae9-a220-467f-a4a3-e61180a8514a	Build Data and Technology Foundation for Portfolio Management	Build Data and Technology Foundation for Portfolio Management	active	\N	\N	\N	\N	2025-06-10 05:01:14.56992
f4ce1fc1-70e5-4722-97e7-89b92b77ada6	Career Site Replacement	Career Site Replacement	active	\N	\N	Talent Acquisition;Talent Acquisition / Recruiting	Avature;Beamery Talent CRM;DirectEmployers;External Application;Glassdoor;HireEZ (Hiretual);Indeed;LinkedIn Recruiter;Phenom;REGN Career Site;Sparc-Amplify;Workday [Platform]	2025-06-10 05:01:14.56992
10388a56-909e-4dde-96f2-24157b5efb7d	CDSL Forecasting Lite Solution - Discovery Phase	CDSL Forecasting Lite Solution - Discovery Phase	active	\N	\N	\N	N-Side	2025-06-10 05:01:14.56992
c74da79c-984e-4dd7-97f1-27d160f945fa	Certara DX and CDM Pilot	Certara DX and CDM Pilot	active	\N	\N	\N	\N	2025-06-10 05:01:14.56992
cd5bc5e0-b45f-4bfd-b0ee-2eb00168cd47	CES Implementation	CES Implementation	active	\N	\N	\N	\N	2025-06-10 05:01:14.56992
dc66afe8-8fc2-4fa6-b1ad-fd720cbdc2f7	Clinical Data Enablement DevOps	Clinical Data Enablement DevOps	active	\N	\N	\N	\N	2025-06-10 05:01:14.56992
515dde38-0952-4ed0-a08a-dd20fc78f995	CST Enablement DevOps	CST Enablement DevOps	active	\N	\N	\N	\N	2025-06-10 05:01:14.56992
bd3f179d-7058-441e-81e2-67610135bd26	CTMS Program	CTMS Program	active	\N	\N	\N	Veeva - CTMS	2025-06-10 05:01:14.56992
44e77c1a-042a-4101-a58b-fbefe448cd7e	Cvent-Congress Planning tool	Cvent-Congress Planning tool	active	\N	\N	\N	\N	2025-06-10 05:01:14.56992
c8da2e67-2590-48db-a3dc-f5daaeed7700	Data Science Environment for Business Analytics Program	Data Science Environment for Business Analytics Program	active	\N	\N	\N	\N	2025-06-10 05:01:14.56992
3163c785-8fa5-4964-ac3a-c9043e1f47fc	Decibel Integration Impact Analysis	Decibel Integration Impact Analysis	active	\N	\N	\N	\N	2025-06-10 05:01:14.56992
84d813fd-fbb8-4bbc-9f2f-e7d388653f97	EFMS Upgrades	EFMS Upgrades	active	\N	\N	\N	\N	2025-06-10 05:01:14.56992
90989e63-86b4-4743-8d2e-be2f85bb9c08	EmployeeReferral	EmployeeReferral	active	\N	\N	\N	EmployeeReferrals.com	2025-06-10 05:01:14.56992
e10585ce-426e-4eb0-87ae-dc3aeb672597	eSource to EDC	eSource to EDC	active	\N	\N	\N	\N	2025-06-10 05:01:14.56992
3813cf90-ee39-4fde-b3ce-9596b0ef8c56	Externally Sponsored Research & Managed Access Program	Externally Sponsored Research & Managed Access Program	active	\N	\N	\N	\N	2025-06-10 05:01:14.56992
ab74669d-8afe-4333-9455-60aaaa2491fc	Flywheel Imaging Platform Pilot	Flywheel Imaging Platform Pilot	active	\N	\N	\N	\N	2025-06-10 05:01:14.56992
272e2cd6-60fe-4b7b-890f-973a109026c0	FSMDR - Lab and Data Integration	FSMDR - Lab and Data Integration	active	\N	\N	\N	\N	2025-06-10 05:01:14.56992
b8247b63-5349-4b1c-a8fa-4b755472c456	FSMDR - Protocol Authoring/SOE Digitization Pilot	FSMDR - Protocol Authoring/SOE Digitization Pilot	active	\N	\N	\N	\N	2025-06-10 05:01:14.56992
359ecce5-a25e-4851-b132-a434564a1dc0	FSMDR - Site Sample Tracking Technology Pilot	FSMDR - Site Sample Tracking Technology Pilot	active	\N	\N	\N	\N	2025-06-10 05:01:14.56992
e65a1c9c-063b-4119-b4c0-1e41fe7368b4	FSMDR Program	FSMDR Program	active	\N	\N	\N	\N	2025-06-10 05:01:14.56992
eafcf0f2-2840-4405-8618-27b92f94e357	GA-ERP-Markview/Kofax product Upgrades (EOL Lifecycle) (2024) (MH)	GA-ERP-Markview/Kofax product Upgrades (EOL Lifecycle) (2024) (MH)	active	\N	\N	\N	Markview 10.1	2025-06-10 05:01:14.56992
fa78ce56-a8e4-4bb7-a065-c6af42d6af5c	Genesis: Site Feasibility and Selection	Genesis: Site Feasibility and Selection	active	\N	\N	\N	Knowledge Management	2025-06-10 05:01:14.56992
33322b7c-98ae-406e-8334-a93e58402608	Genesis: Site Feasibility and Selection Program	Genesis: Site Feasibility and Selection Program	active	\N	\N	\N	\N	2025-06-10 05:01:14.56992
f1a19357-a8d3-4e27-8048-a970e397748b	Global Benefit Providers	Global Benefit Providers	active	\N	\N	Benefits Management / Relocation;Benefits Management / Wellness;Benefits Management / Wellness / Family Planning	Graebel globalCONNECT;Journey Live;Maven Clinic Platform;Weichert;Workday [Platform]	2025-06-10 05:01:14.56992
a72155bf-56c5-4616-becc-7ca08d31427b	Global Equity Tracker	Global Equity Tracker	active	\N	\N	Tax	Equity Edge (E*TRADE);Global Equity Tracker;Oracle eBusiness Suite [Platform];Workday [Platform]	2025-06-10 05:01:14.56992
7a19bcb4-29d8-4180-b694-2fe8191b8b5f	GMA Medical Education Team Internal Site	GMA Medical Education Team Internal Site	active	\N	\N	\N	\N	2025-06-10 05:01:14.56992
a5f1a1e3-0354-4e1c-a0a0-22b457a9472c	GPS:AE PC LMS Program	GPS:AE PC LMS Program	active	\N	\N	\N	\N	2025-06-10 05:01:14.56992
1f50be5d-3eac-4ca8-b007-acf11372dbe7	GPS:Argus J Implementation	GPS:Argus J Implementation	active	\N	\N	\N	\N	2025-06-10 05:01:14.56992
c2771067-9500-45d4-9e5f-360d6d87265d	GPS:Argus Veeva Site Connect IAL Integration	GPS:Argus Veeva Site Connect IAL Integration	active	\N	\N	\N	\N	2025-06-10 05:01:14.56992
919d841d-c689-40be-a866-e795fdec5ed3	GPS:PEPI non-GxP Analytics (Panoply)	GPS:PEPI non-GxP Analytics (Panoply)	active	\N	\N	\N	\N	2025-06-10 05:01:14.56992
8612d995-9726-4ad0-83c3-ea32a2dcde90	GPS:Safety System Platform 2023	GPS:Safety System Platform 2023	active	\N	\N	\N	\N	2025-06-10 05:01:14.59369
102ecf8a-9192-4adb-8433-e4d02c5b5d05	GPS:SSP Decommission	GPS:SSP Decommission	active	\N	\N	\N	\N	2025-06-10 05:01:14.59369
51779520-aa15-41a8-a67b-4296523e0448	HR Chatbot	HR Chatbot	active	\N	\N	\N	\N	2025-06-10 05:01:14.59369
dd0f1015-9acc-4f3e-90a5-ba750047de63	HR Data Lake Part 2: Prism	HR Data Lake Part 2: Prism	active	\N	\N	\N	\N	2025-06-10 05:01:14.59369
0904ca58-7d4b-4e93-9e3d-4b60b08f38fb	HR Data Lake Re-architecture Part 1	HR Data Lake Re-architecture Part 1	active	\N	\N	\N	Beeline;Oracle eBusiness Suite [Platform];Qlik (Qlikview & QlikSense);Workday [Platform]	2025-06-10 05:01:14.59369
95b22236-3c55-4578-977a-8dafc697fac5	IA (AI) - CDA searchability in icertis	IA (AI) - CDA searchability in icertis	active	\N	\N	\N	\N	2025-06-10 05:01:14.59369
13199ae9-2b56-4338-abf1-9f9431e652ad	IA (AI) - SOP Assistant	IA (AI) - SOP Assistant	active	\N	\N	\N	\N	2025-06-10 05:01:14.59369
1cd75e79-5ba7-4e9a-8bda-b71674a9326f	IA (AI) – Automated Literature Review Digital Health Technology	IA (AI) – Automated Literature Review Digital Health Technology	active	\N	\N	\N	\N	2025-06-10 05:01:14.59369
e035e5de-20d5-4fa9-8251-e90f342e2559	IA (BPM) - HSR Human Sample Request	IA (BPM) - HSR Human Sample Request	active	\N	\N	\N	\N	2025-06-10 05:01:14.59369
9f144fd2-c132-40b6-adc6-197e85000180	IA - (AI) Assisted Systematic Literature Review	IA - (AI) Assisted Systematic Literature Review	active	\N	\N	\N	\N	2025-06-10 05:01:14.59369
92f9ed72-d9d2-4ca2-8fcf-885d83caa2f9	Icertis One Touch CDA	Icertis One Touch CDA	active	\N	\N	\N	Icertis	2025-06-10 05:01:14.59369
4c706505-1885-4f54-8f30-9e5255d889c8	Icertis WhatFix Implementation	Icertis WhatFix Implementation	active	\N	\N	Enable Business Transactions / Manage Contracts / Review & Draft Contracts	Icertis;WhatFix	2025-06-10 05:01:14.59369
fbcebe0c-9e62-4049-ae0c-b17dd1368f30	iEnvision Sharepoint Migration	iEnvision Sharepoint Migration	active	\N	\N	\N	\N	2025-06-10 05:01:14.59369
02eeb89d-fa95-4113-b0bf-76a4f5f9f650	Image Data Management and Analytics Program	Image Data Management and Analytics Program	active	\N	\N	\N	\N	2025-06-10 05:01:14.59369
1174498c-9f2f-4587-83f4-16b700792c9c	Implement Compa Offers	Implement Compa Offers	active	\N	\N	Compensation Management	Compa Offers;Workday [Platform]	2025-06-10 05:01:14.59369
25796125-9e69-47ad-beea-6e2be5cacdb6	Interview Scheduling	Interview Scheduling	active	\N	\N	Talent Acquisition	Paradox;Rooster;Workday [Platform]	2025-06-10 05:01:14.59369
05a357a5-8f89-4327-8223-b65f5a2854bd	IOPS - GLO AEL Hold Pause Feature	IOPS - GLO AEL Hold Pause Feature	active	\N	\N	IOPS Quality Assurance / Batch Disposition Management	\N	2025-06-10 05:01:14.59369
a92d6260-56d5-4faf-9d6f-b938ca40fbdc	IOPS - GLO APS P2: Demand/Constrained Supply Plan & SIOP	IOPS - GLO APS P2: Demand/Constrained Supply Plan & SIOP	Completed	\N	\N	IOPS Enterprise Support / Master Data Management;IOPS Product Manufacturing / Finite Scheduling;IOPS Supply Chain Management / Capacity Planning;IOPS Supply Chain Management / Demand Planning;IOPS Supply Chain Management / Sales Inventory and Operations Planning (SIOP);IOPS Supply Chain Management / Supply Planning	A Squared (A2);Dash;Kinaxis Maestro Advanced Planning System (APS);Oracle eBusiness Suite [Platform] / Oracle OPM and Mobile Applications;Work Management Tool (WMT)	2025-06-10 05:01:14.59369
762ad7ff-af4f-4832-828f-541164474ee3	IOPS - GLO Augmentir Upgrade	IOPS - GLO Augmentir Upgrade	active	\N	\N	IOPS Quality Assurance / Technical Training (Learning Management)	\N	2025-06-10 05:01:14.59369
b898d57c-c8ac-49ac-a190-08ef674dd8aa	IOPS - GLO Biovia OneLab ELN	IOPS - GLO Biovia OneLab ELN	7. Execute	\N	\N	IOPS Quality Control / Lab Notebook Mgmt	Biovia OneLab ELN	2025-06-10 05:01:14.59369
1cfd0fa8-74b5-471f-9ab1-8b0f3a101bd9	IOPS - GLO Biovia OneLab ELN Phase 2	IOPS - GLO Biovia OneLab ELN Phase 2	6. Planning	\N	\N	IOPS Quality Control / Lab Notebook Mgmt	Biovia OneLab ELN	2025-06-10 05:01:14.59369
5f432fae-345d-4d0b-966e-e4ba7f9e81dd	IOPS - GLO BMRAM R3 Cloud Migration	IOPS - GLO BMRAM R3 Cloud Migration	active	\N	\N	IOPS Plant Management / Plant Maintenance	Blue Mountain Regulatory Asset Manager (BMRAM)	2025-06-10 05:01:14.59369
e51f3950-2b1a-4af7-aeda-6af7a0157057	IOPS - GLO Box Implementation	IOPS - GLO Box Implementation	6. Planning	\N	\N	IOPS Enterprise Support / Collaboration	\N	2025-06-10 05:01:14.59369
fdcac6de-519a-4f3a-b0de-c5027f00a373	IOPS - GLO Business to Business (B2B) Strategy	IOPS - GLO Business to Business (B2B) Strategy	2. Shape	\N	\N	IOPS Supply Chain Management / B2B Collaboration	\N	2025-06-10 05:01:14.59369
bf528dcb-23d6-47e2-9893-5736169d14f8	IOPS - GLO CI System Replatform	IOPS - GLO CI System Replatform	active	\N	\N	\N	\N	2025-06-10 05:01:14.59369
f55e5ecb-2820-4f28-9bc2-5e0e9dd378e6	IOPS - GLO Consistent IP Addresses for Portable Devices	IOPS - GLO Consistent IP Addresses for Portable Devices	active	\N	\N	\N	\N	2025-06-10 05:01:14.59369
047aa4cc-713a-412a-9fb8-5497d4257fbf	IOPS - GLO Control Systems Centralized Audit Trail	IOPS - GLO Control Systems Centralized Audit Trail	active	\N	\N	IOPS Product Manufacturing / Batch Management;IOPS Quality Assurance / Validation	\N	2025-06-10 05:01:14.59369
3f31a096-8aec-430a-b64d-5e9e360a7b79	IOPS - GLO Control Tower	IOPS - GLO Control Tower	3. Prioritize	\N	\N	IOPS Supply Chain Management	\N	2025-06-10 05:01:14.59369
558effd5-4d86-4d4e-abaa-dc96d1bff521	IOPS - GLO Cority Ergonomics System	IOPS - GLO Cority Ergonomics System	active	\N	\N	IOPS Plant Management / Environmental Health and Safety (EHS)	\N	2025-06-10 05:01:14.59369
eda3b318-3304-44ed-adf1-ac4f5e896881	IOPS - GLO CSA/SDLC Tool	IOPS - GLO CSA/SDLC Tool	active	\N	\N	IOPS Enterprise Support / Application Management	\N	2025-06-10 05:01:14.59369
3c6d19e7-81b7-49a7-91aa-adae2f10f3db	IOPS - GLO Data Lake Qualification	IOPS - GLO Data Lake Qualification	active	\N	\N	IOPS Enterprise Support / Data Modeling	\N	2025-06-10 05:01:14.59369
e6664d37-404f-40d2-b23d-e5f6551b51fd	IOPS - GLO Digital Guardian Implementation	IOPS - GLO Digital Guardian Implementation	active	\N	\N	IOPS Quality Control / Lab Data Capture & Mgmt	\N	2025-06-10 05:01:14.59369
aef2ad2b-ed4b-4e73-bcf8-7267f33b43f0	IOPS - GLO Digital Signage Implementation (CAPA)	IOPS - GLO Digital Signage Implementation (CAPA)	6. Planning	\N	\N	IOPS Quality Assurance / Document Control	OpsTrakker	2025-06-10 05:01:14.59369
80ca4666-e146-40bf-a531-68d9147ad399	IOPS - GLO Discoverant 2023 w/Appstream Migration	IOPS - GLO Discoverant 2023 w/Appstream Migration	1. Surface	\N	\N	\N	\N	2025-06-10 05:01:14.59369
8b8b5751-0327-4664-b4ba-b44c3bbf2080	IOPS - GLO Discoverant Upgrade	IOPS - GLO Discoverant Upgrade	5. Demand Review	\N	\N	IOPS Product Development / Process Monitoring	Discoverant Raheen;Discoverant Rensselaer	2025-06-10 05:01:14.59369
97daf9c6-1200-4651-a6c6-5de9576a7769	IOPS - GLO Drawing Management System	IOPS - GLO Drawing Management System	2. Shape	\N	\N	IOPS Plant Management / Drawing Management	\N	2025-06-10 05:01:14.59369
379d1af8-d894-4d17-b934-3f0dae280862	IOPS - GLO E-validation System ValGenesis P2 (CSV)	IOPS - GLO E-validation System ValGenesis P2 (CSV)	7. Execute	\N	\N	IOPS Quality Assurance / Validation	ValGenesis	2025-06-10 05:01:14.59369
040bbdfa-4cbd-449b-88d0-45e6e8d948e7	IOPS - GLO EAMS Upgrade (Maximo)	IOPS - GLO EAMS Upgrade (Maximo)	2. Shape	\N	\N	IOPS Plant Management / Asset Accounting;IOPS Plant Management / Asset Location Tracking;IOPS Plant Management / Asset Management;IOPS Plant Management / Asset Performance;IOPS Plant Management / Calibration Management;IOPS Plant Management / Equipment Management;IOPS Plant Management / Inventory and Spare Parts Management;IOPS Plant Management / Plant Maintenance;IOPS Plant Management / Preventive Maintenance Scheduling;IOPS Plant Management / Work Order Management	Blue Mountain Regulatory Asset Manager (BMRAM);Future State EAMS	2025-06-10 05:01:14.59369
1e6aa4c9-2282-46fb-94c3-c2c2e1dfea11	IOPS - GLO eForms (CAPA)	IOPS - GLO eForms (CAPA)	7. Execute	\N	\N	IOPS Quality Assurance / Document Control	OpsTrakker	2025-06-10 05:01:14.59369
1ce5fb75-0dee-4686-a6af-8ef49cc3e0e8	IOPS - GLO eLearning Content Management System	IOPS - GLO eLearning Content Management System	active	\N	\N	IOPS Quality Assurance / Technical Training (Learning Management)	REGNU	2025-06-10 05:01:14.59369
88f01c69-aa3f-46af-8edd-570cb7a1b0f8	IOPS - GLO Electronic Logbook Implementation Phase I	IOPS - GLO Electronic Logbook Implementation Phase I	3. Prioritize	\N	\N	IOPS Quality Assurance / Document Control	\N	2025-06-10 05:01:14.59369
3af4f09c-fcc9-4d80-93a6-de3afc9fed55	IOPS - GLO Empower 3.8 LACe Cutover	IOPS - GLO Empower 3.8 LACe Cutover	4. Roadmap (Approved)	\N	\N	IOPS Quality Control / Lab Chromatography	\N	2025-06-10 05:01:14.59369
860a6266-e93d-4772-a4e5-48e8ceb3d3f9	IOPS - GLO Empower 3.8 Upgrade	IOPS - GLO Empower 3.8 Upgrade	7. Execute	\N	\N	IOPS Quality Control / Lab Chromatography	Empower 3 FR4	2025-06-10 05:01:14.59369
892f46a1-6316-4552-aad3-9a9e3f94eb08	IOPS - GLO Enablon Platform Enhancements	IOPS - GLO Enablon Platform Enhancements	active	\N	\N	IOPS Plant Management / Environmental Health and Safety (EHS)	\N	2025-06-10 05:01:14.59369
1a0def94-3415-4c3e-a904-89383e0a1c82	IOPS - GLO Enhanced Controls for the Requisition of GxP Services (CAPA23-1680)	IOPS - GLO Enhanced Controls for the Requisition of GxP Services (CAPA23-1680)	6. Planning	\N	\N	IOPS Enterprise Support / Global Procurement	\N	2025-06-10 05:01:14.59369
cc607067-78f6-46e4-9fae-81adf50c4871	IOPS - GLO Enterprise Integration Platform	IOPS - GLO Enterprise Integration Platform	active	\N	\N	IOPS Enterprise Support / Application Management	\N	2025-06-10 05:01:14.59369
575620f5-635e-4758-a539-3acb30226be2	IOPS - GLO ERP Capability to the Cloud	IOPS - GLO ERP Capability to the Cloud	3. Prioritize	\N	\N	IOPS Product Manufacturing / Regulatory Jurisdiction Planning;IOPS Supply Chain Management / Inbound / Outbound Transportation Management;IOPS Supply Chain Management / Order Management;IOPS Supply Chain Management / Product Lifecycle Management	Future State ERP;Oracle eBusiness Suite [Platform];Oracle eBusiness Suite [Platform] / Oracle OPM and Mobile Applications;Oracle eBusiness Suite [Platform] / Oracle Order Management and Shipping	2025-06-10 05:01:14.59369
e524137b-ed36-4e61-9ad2-1f20aa13a85b	IOPS - GLO Fire Extinguishers Monitoring	IOPS - GLO Fire Extinguishers Monitoring	active	\N	\N	IOPS Plant Management / Environmental Health and Safety (EHS)	\N	2025-06-10 05:01:14.59369
6ba7cb71-42ae-44d5-bf6a-f6bf2340f40f	IOPS - GLO Global Vision Verify Clinical Label Review	IOPS - GLO Global Vision Verify Clinical Label Review	active	\N	\N	\N	\N	2025-06-10 05:01:14.59369
bd939a7e-d9d8-4384-97bd-2d5ad63cf19f	IOPS - GLO IPEM / Endotoxin Validated Report	IOPS - GLO IPEM / Endotoxin Validated Report	active	\N	\N	IOPS Quality Control / In-Process and Product Release Testing	\N	2025-06-10 05:01:14.59369
918e6051-1664-489b-837e-4e67f525f26a	IOPS - GLO Key Management	IOPS - GLO Key Management	active	\N	\N	IOPS Plant Management / Key Management	\N	2025-06-10 05:01:14.617386
e19d4bd8-dcb7-43b4-91e0-22da90f56fd5	IOPS - GLO Lab Bus	IOPS - GLO Lab Bus	active	\N	\N	IOPS Quality Control / Lab Data Capture & Mgmt	\N	2025-06-10 05:01:14.617386
e3e26be1-5fc3-4b17-878d-281bbac34fbd	IOPS - GLO Lab-X	IOPS - GLO Lab-X	On Hold	\N	\N	IOPS Quality Control / Lab Data Capture & Mgmt	\N	2025-06-10 05:01:14.617386
62a05c95-3a53-4109-8a79-b18098a0ae14	IOPS - GLO Labels Phase 4	IOPS - GLO Labels Phase 4	active	\N	\N	IOPS Quality Assurance / Document Control	DSI Enterprise Printing Platform (OPM);OpsTrakker;Oracle eBusiness Suite [Platform] / Oracle OPM and Mobile Applications	2025-06-10 05:01:14.617386
f1c9d690-3971-4ed9-a6d8-ba823d33da80	IOPS - GLO Master Data Management	IOPS - GLO Master Data Management	active	\N	\N	IOPS Enterprise Support / Master Data Management	\N	2025-06-10 05:01:14.617386
8283c44b-3d34-4d39-b0da-b9010fc13cdf	IOPS - GLO Method Performance Data Mart	IOPS - GLO Method Performance Data Mart	7. Execute	\N	\N	IOPS Quality Control / Assay Development	\N	2025-06-10 05:01:14.617386
642fc476-fa9b-4ac3-beeb-ad8f71c986c7	IOPS - GLO Microlearning Platform	IOPS - GLO Microlearning Platform	active	\N	\N	IOPS Quality Assurance / Technical Training (Learning Management)	\N	2025-06-10 05:01:14.617386
5c2fecb3-9bf6-4cc0-986e-85b182f9c832	IOPS - GLO Monitoring & Material Shelf Life	IOPS - GLO Monitoring & Material Shelf Life	active	\N	\N	IOPS Supply Chain Management / Inventory Management	\N	2025-06-10 05:01:14.617386
12f7477c-573f-46c2-93c0-f9c528f099ac	IOPS - GLO Nautilus Upgrade - 19C	IOPS - GLO Nautilus Upgrade - 19C	6. Planning	\N	\N	IOPS Quality Control	\N	2025-06-10 05:01:14.617386
aaff0a0d-3b0f-48f8-8f86-ea5ea427173b	IOPS - GLO Neo4j Graph Database	IOPS - GLO Neo4j Graph Database	active	\N	\N	\N	\N	2025-06-10 05:01:14.617386
e50ef103-6808-4fbb-a9d2-3113f5702d2f	IOPS - GLO NGS Pipeline Software	IOPS - GLO NGS Pipeline Software	active	\N	\N	IOPS Quality Control / QC Virology	\N	2025-06-10 05:01:14.617386
95c7a9f1-3270-4aa1-999d-ebc2ea385de4	IOPS - GLO Notification System	IOPS - GLO Notification System	active	\N	\N	IOPS Plant Management / Building Automation	\N	2025-06-10 05:01:14.617386
ccf4da62-d8cd-468b-a418-19d2c65ed823	IOPS - GLO Nymi Qualification	IOPS - GLO Nymi Qualification	7. Execute	\N	\N	IOPS Plant Management / Badge and Access Management	Nymi Band – Global –  IOPS	2025-06-10 05:01:14.617386
06dbaec4-3fec-421b-a1b5-bc86531d32ce	IOPS - GLO Onsite Contractor Management	IOPS - GLO Onsite Contractor Management	active	\N	\N	IOPS Enterprise Support / Workforce Planning	\N	2025-06-10 05:01:14.617386
c3eb4bb6-6c88-474a-bb63-bf016054382c	IOPS - GLO OPM Labels Phase 3	IOPS - GLO OPM Labels Phase 3	7. Execute	\N	\N	IOPS Quality Assurance / Document Control	Oracle eBusiness Suite [Platform] / Oracle OPM and Mobile Applications	2025-06-10 05:01:14.617386
282d316e-cf4b-401c-ba3a-600ef114a9e6	IOPS - GLO OpsTrakker Application Lifecycle Management	IOPS - GLO OpsTrakker Application Lifecycle Management	5. Demand Review	\N	\N	IOPS Quality Assurance / Document Control	\N	2025-06-10 05:01:14.617386
9b5b4164-895e-4c1d-9709-ec5e820903e3	IOPS - GLO Plant Bus	IOPS - GLO Plant Bus	active	\N	\N	IOPS Product Manufacturing / Batch Management	\N	2025-06-10 05:01:14.617386
3a6101cf-cd05-4c26-be4e-3fa0f1274359	IOPS - GLO Process Sciences Dashboards	IOPS - GLO Process Sciences Dashboards	active	\N	\N	IOPS Product Development / Process Monitoring	\N	2025-06-10 05:01:14.617386
264b2991-f0e5-4fca-b4da-47f8c1cc300c	IOPS - GLO ProcessX ITSM Module	IOPS - GLO ProcessX ITSM Module	active	\N	\N	IOPS Enterprise Support / Application Management;IOPS Enterprise Support / Client Services	\N	2025-06-10 05:01:14.617386
9ba3c661-afc5-4eb0-a2bc-a8b695bd8cb6	IOPS - GLO Product Lifecycle Management (PLM) Evaluation	IOPS - GLO Product Lifecycle Management (PLM) Evaluation	1. Surface	\N	\N	IOPS Supply Chain Management / Product Lifecycle Management	Oracle eBusiness Suite [Platform]	2025-06-10 05:01:14.617386
40c1c3a1-8c52-4c7f-adca-3884da68d88a	IOPS - GLO Project/Portfolio Management	IOPS - GLO Project/Portfolio Management	active	\N	\N	IOPS Enterprise Support / Portfolio Mgmt	\N	2025-06-10 05:01:14.617386
3792292d-1415-4c05-bd50-a89cd4c2e558	IOPS - GLO Radiation Monitoring	IOPS - GLO Radiation Monitoring	active	\N	\N	IOPS Plant Management / Environmental Health and Safety (EHS)	\N	2025-06-10 05:01:14.617386
a567d88d-ea96-4185-9a27-422a3d613833	IOPS - GLO Raw Material Release Dashboard	IOPS - GLO Raw Material Release Dashboard	active	\N	\N	IOPS Quality Assurance / Raw Material Disposition	\N	2025-06-10 05:01:14.617386
5c0afe18-32d7-486b-bd23-d736520a875d	IOPS - GLO RCM Integration Program	IOPS - GLO RCM Integration Program	2. Shape	\N	\N	\N	\N	2025-06-10 05:01:14.617386
d34e8eaa-3176-410c-95ad-389bad057d13	IOPS - GLO RCM Blue Mountain and Timestone Integration	IOPS - GLO RCM Integration Program / IOPS - GLO RCM Blue Mountain and Timestone Integration	2. Shape	\N	\N	IOPS Plant Management / Plant Maintenance	Blue Mountain Regulatory Asset Manager (BMRAM)	2025-06-10 05:01:14.617386
02bb1d03-3d65-446b-9700-aad80d874162	IOPS - GLO RCM Compliance Wire Integration	IOPS - GLO RCM Integration Program / IOPS - GLO RCM Compliance Wire Integration	2. Shape	\N	\N	IOPS Quality Assurance / Technical Training (Learning Management)	\N	2025-06-10 05:01:14.617386
38b7fcb2-0236-4f02-8625-cfda778ce04b	IOPS - GLO RCM Oracle Integration	IOPS - GLO RCM Integration Program / IOPS - GLO RCM Oracle Integration	2. Shape	\N	\N	IOPS Enterprise Support / Accounting;IOPS Product Manufacturing / Finite Scheduling;IOPS Supply Chain Management / Warehouse Management	Oracle eBusiness Suite [Platform] / Oracle OPM and Mobile Applications;Oracle eBusiness Suite [Platform] / Oracle Order Management and Shipping	2025-06-10 05:01:14.617386
0df2f089-7d61-468a-9650-85ff644701d5	IOPS - GLO RCM Softmax Integration	IOPS - GLO RCM Integration Program / IOPS - GLO RCM Softmax Integration	6. Planning	\N	\N	IOPS Quality Control / Lab Data Capture & Mgmt	Softmax Pro 7  / GxP Admin	2025-06-10 05:01:14.617386
47e5d4a7-37ab-496d-a07a-f944cadd504e	IOPS - GLO RCM Veeva Integration	IOPS - GLO RCM Integration Program / IOPS - GLO RCM Veeva Integration	2. Shape	\N	\N	\N	\N	2025-06-10 05:01:14.617386
42bc4357-ca60-486a-864e-e57dc7351a12	IOPS - GLO Realware Headsets APK	IOPS - GLO Realware Headsets APK	active	\N	\N	IOPS Quality Assurance / Technical Training (Learning Management)	\N	2025-06-10 05:01:14.617386
835f3ef9-bbcb-4fe3-b182-34858e1a7b81	IOPS - GLO Regulatory Retention Program Dashboard	IOPS - GLO Regulatory Retention Program Dashboard	2. Shape	\N	\N	\N	\N	2025-06-10 05:01:14.617386
f937fbef-f5f9-4fdc-aae6-7e047f9e73bf	IOPS - GLO Requirements Management	IOPS - GLO Requirements Management	active	\N	\N	IOPS Product Development / Device Specification Management	\N	2025-06-10 05:01:14.617386
6fed4596-aa2f-4dd7-87fe-d0cab1fdb6d7	IOPS - GLO SDMS Upgrade	IOPS - GLO SDMS Upgrade	7. Execute	\N	\N	IOPS Quality Control / Lab Data Capture & Mgmt	NuGenesis SDMS	2025-06-10 05:01:14.617386
f2c49a77-9635-438b-840f-282c62aa90bc	IOPS - GLO Siera GMP Enterprise Data Warehouse Upgrade/Migration	IOPS - GLO Siera GMP Enterprise Data Warehouse Upgrade/Migration	active	\N	\N	IOPS Enterprise Support / Data & Statistical Analysis	\N	2025-06-10 05:01:14.617386
c4785ee5-b078-40d8-b446-e95d066dac26	IOPS - GLO Siera Server Upgrade and DR Testing	IOPS - GLO Siera Server Upgrade and DR Testing	2. Shape	\N	\N	\N	\N	2025-06-10 05:01:14.617386
9ee3c89c-62e2-432a-94d2-fb9622fe754f	IOPS - GLO SIMCA / SIMCA Online Validation	IOPS - GLO SIMCA / SIMCA Online Validation	active	\N	\N	IOPS Product Development / Process Monitoring	\N	2025-06-10 05:01:14.617386
0a4d7408-c2ed-4af9-aca9-a25aefc1770b	IOPS - GLO SOA Upgrade / Replacement	IOPS - GLO SOA Upgrade / Replacement	6. Planning	\N	\N	\N	Oracle eBusiness Suite [Platform] / Oracle OPM and Mobile Applications;PAS-X Manufacturing Execution System (MES) Raheen;PAS-X Manufacturing Execution System (MES) Rensselaer	2025-06-10 05:01:14.617386
17647cb4-3541-4b21-80fd-38fd3e3e0113	IOPS - GLO Thinglink 3D Videos	IOPS - GLO Thinglink 3D Videos	active	\N	\N	IOPS Quality Assurance / Technical Training (Learning Management)	\N	2025-06-10 05:01:14.617386
10251d31-d4fb-4062-8ad5-4f4951475102	IOPS - GLO Track and Trace (DocuTrack)	IOPS - GLO Track and Trace (DocuTrack)	active	\N	\N	IOPS Quality Assurance / Document Control	\N	2025-06-10 05:01:14.617386
42533d5e-75fd-4fbb-b1ae-302516c63f14	IOPS - GLO Two-Factor Authentication (2FA)	IOPS - GLO Two-Factor Authentication (2FA)	active	\N	\N	IOPS Plant Management / Badge and Access Management	\N	2025-06-10 05:01:14.617386
25a49480-4c8f-4a4f-8238-537fdb012877	IOPS - GLO Upgrade Discoverant Database servers to Oracle 19C	IOPS - GLO Upgrade Discoverant Database servers to Oracle 19C	7. Execute	\N	\N	\N	Discoverant Raheen;Discoverant Rensselaer	2025-06-10 05:01:14.617386
12e07e29-3160-4960-baa6-3576373e44d8	IOPS - GLO Utilities ELN	IOPS - GLO Utilities ELN	7. Execute	\N	\N	IOPS Quality Control / Environmental Monitoring	Labware ELN	2025-06-10 05:01:14.617386
002fdaf1-9d20-45b8-8a22-da231f4b7ec9	IOPS - GLO Validated Electronic System for Records Issuance, Tracking and Reconciliation	IOPS - GLO Validated Electronic System for Records Issuance, Tracking and Reconciliation	4. Roadmap (Approved)	\N	\N	IOPS Quality Assurance / Document Control	OpsTrakker	2025-06-10 05:01:14.617386
bfe323eb-a05b-42f5-a48f-ffd09ca00a66	IOPS - GLO Video Hosting Solution	IOPS - GLO Video Hosting Solution	2. Shape	\N	\N	\N	\N	2025-06-10 05:01:14.617386
22f6fc5f-1c88-46ab-bf9c-cfdd8b880543	IOPS - GLO VR Training System	IOPS - GLO VR Training System	active	\N	\N	IOPS Quality Assurance / Technical Training (Learning Management)	\N	2025-06-10 05:01:14.617386
efe076cf-d918-451d-944a-6d0b4a97fdc9	IOPS - GLO Warehouse Automation	IOPS - GLO Warehouse Automation	active	\N	\N	IOPS Supply Chain Management / Warehouse Management	\N	2025-06-10 05:01:14.617386
ada3327f-f9f0-4431-9a4b-30ac58a60d3c	IOPS - GLO Windows 10 Global	IOPS - GLO Windows 10 Global	6. Planning	\N	\N	IOPS Enterprise Support / IT Risk Management	\N	2025-06-10 05:01:14.617386
44931461-8de2-4d75-ac23-53ad446b1da1	IOPS - Magellan Globalization of DocCompliance (MY QUMAS) (REQ'D)	IOPS - Magellan Globalization of DocCompliance (MY QUMAS) (REQ'D)	7. Execute	\N	\N	IOPS Quality Assurance / Document Control	QUMAS EDMS (DocCompliance)	2025-06-10 05:01:14.617386
964c54f3-bdb4-488d-a8ba-3c722cb7822d	IOPS - Magellan Globalization of REGNU for GxP Training	IOPS - Magellan Globalization of REGNU for GxP Training	7. Execute	\N	\N	IOPS Quality Assurance / Technical Training (Learning Management)	REGNU	2025-06-10 05:01:14.617386
d869d272-f0e5-4af1-8a1a-30461bd9bd83	IOPS - Magellan Order Management (OTC Workstream)	IOPS - Magellan Order Management (OTC Workstream)	6. Planning	\N	\N	IOPS Supply Chain Management / Order Management	Kinaxis Maestro Advanced Planning System (APS);Oracle eBusiness Suite [Platform] / Oracle OPM and Mobile Applications	2025-06-10 05:01:14.617386
680097e7-345a-4e3d-bda6-b7f6a3b00fb2	IOPS - MVP GMP Solution for MR Corrections (CAPA 23-2009)	IOPS - MVP GMP Solution for MR Corrections (CAPA 23-2009)	2. Shape	\N	\N	IOPS Quality Assurance / Batch Disposition Management	\N	2025-06-10 05:01:14.637849
5c410e44-3b85-41e5-8d15-c170cab6d92b	IOPS - Oracle Enablement Program	IOPS - Oracle Enablement Program	7. Execute	\N	\N	IOPS Supply Chain Management / Order Management	Oracle eBusiness Suite [Platform] / Oracle Order Management and Shipping	2025-06-10 05:01:14.637849
59021d1b-87c3-469b-b49d-633bb7d44eb6	IOPS - RAH - Lab Systems Instrument - W10 upgrade	IOPS - RAH - Lab Systems Instrument - W10 upgrade	7. Execute	\N	\N	IOPS Enterprise Support / IT Risk Management;IOPS Quality Control / Lab Data Capture & Mgmt	\N	2025-06-10 05:01:14.637849
107b9d3c-c86b-4706-a8a2-499826332668	IOPS - RAH Augmentir Expansion	IOPS - RAH Augmentir Expansion	2. Shape	\N	\N	IOPS Quality Assurance / Technical Training (Learning Management)	Augmentir	2025-06-10 05:01:14.637849
38d7596c-e3f6-44ba-90f2-481e4a7ffa4d	IOPS - RAH BAS/QBAS Lifecycle Refresh	IOPS - RAH BAS/QBAS Lifecycle Refresh	1. Surface	\N	\N	\N	\N	2025-06-10 05:01:14.637849
6a4935f8-939f-4804-8ecd-48f033f13525	IOPS - REN - Lab Systems Instrument - W10 upgrade	IOPS - REN - Lab Systems Instrument - W10 upgrade	6. Planning	\N	\N	IOPS Enterprise Support / Application Management;IOPS Quality Control / Lab Data Capture & Mgmt	\N	2025-06-10 05:01:14.637849
5ac66a0c-f027-4bfd-b001-e0e3b0fb0cc3	IOPS - REN AS ELN	IOPS - REN AS ELN	7. Execute	\N	\N	IOPS Quality Control / Test Execution	Labware ELN	2025-06-10 05:01:14.637849
b6520f20-ea10-45c3-8a0c-763e378ce44d	IOPS - REN Autonomous Floor Cleaners	IOPS - REN Autonomous Floor Cleaners	active	\N	\N	IOPS Plant Management / Plant Maintenance	\N	2025-06-10 05:01:14.637849
bb83c565-2591-4b76-82be-c6c5339650e4	IOPS - REN B17 Fill Finish Program Plan	IOPS - REN B17 Fill Finish Program Plan	7. Execute	\N	\N	\N	Kinaxis Maestro Advanced Planning System (APS)	2025-06-10 05:01:14.637849
920a3d99-39eb-4356-8be0-d48510e5e750	IOPS - REN B17 Dupixent Serialization	IOPS - REN B17 Fill Finish Program Plan / IOPS - REN B17 Dupixent Serialization	6. Planning	\N	\N	IOPS Product Manufacturing / Product Serialization	Optel Open Site Master (OSM);Tracelink	2025-06-10 05:01:14.637849
6f9a264f-2619-43e5-8855-ef8f51f4e8d4	IOPS - REN B17 Site Metrics and Analytics	IOPS - REN B17 Fill Finish Program Plan / IOPS - REN B17 Site Metrics and Analytics	7. Execute	\N	\N	\N	Qlik (Qlikview & QlikSense)	2025-06-10 05:01:14.637849
f123c3fa-262d-41cb-ac3e-5ef54d365a14	IOPS - REN B17 Tracelink SIT	IOPS - REN B17 Fill Finish Program Plan / IOPS - REN B17 Tracelink SIT	6. Planning	\N	\N	IOPS Product Manufacturing / Product Serialization	Optel Open Site Master (OSM)	2025-06-10 05:01:14.637849
e4f36657-d850-49e5-8402-a2eec08f6974	IOPS - REN B17 Optel OSM Line 2	IOPS - REN B17 Optel OSM Line 2	1. Surface	\N	\N	\N	\N	2025-06-10 05:01:14.637849
79e45bf7-524d-4ed4-b9f7-3218a96abdf5	IOPS - REN Control Replacement (TempTale to Saga)	IOPS - REN Control Replacement (TempTale to Saga)	1. Surface	\N	\N	\N	\N	2025-06-10 05:01:14.637849
98fd892f-d3c2-400e-8f1b-4c8d5e11dd53	IOPS - REN DASH Replacement Infrastructure	IOPS - REN DASH Replacement Infrastructure	active	\N	\N	\N	\N	2025-06-10 05:01:14.637849
077334e1-8d7c-4c28-b299-de82c65ce9bd	IOPS - REN Edge Device Control & Integration using Ignition	IOPS - REN Edge Device Control & Integration using Ignition	active	\N	\N	IOPS Plant Management / Process Control	\N	2025-06-10 05:01:14.637849
31e79c95-07db-420a-b1e8-47942052054d	IOPS - REN Engineering Device Configuration Spec GxP Storage/Database	IOPS - REN Engineering Device Configuration Spec GxP Storage/Database	1. Surface	\N	\N	\N	\N	2025-06-10 05:01:14.637849
992d7266-7ef0-4246-96b8-32d44422a26b	IOPS - REN Genetec Video System	IOPS - REN Genetec Video System	1. Surface	\N	\N	\N	\N	2025-06-10 05:01:14.637849
29e57c3d-9016-48e3-ba95-be29dd119426	IOPS - REN Gold Particle Tester Replacement	IOPS - REN Gold Particle Tester Replacement	active	\N	\N	\N	\N	2025-06-10 05:01:14.637849
7f000c57-7fe6-4930-98e1-8904dfcb0846	IOPS - REN P2000 Upgrade to C-Cure	IOPS - REN P2000 Upgrade to C-Cure	6. Planning	\N	\N	IOPS Plant Management / Badge and Access Management	CCURE 9000 Security Management System;Johnson Controls Security Management (P2000)	2025-06-10 05:01:14.637849
f7e5df06-1fdb-4888-bcf3-01c233e2b3db	IOPS - REN PA16 Sandbox	IOPS - REN PA16 Sandbox	active	\N	\N	\N	\N	2025-06-10 05:01:14.637849
4f4ebbfe-9998-4cbc-a8fb-49502085e6e0	IOPS - REN Particulate Risk Assessment Tool	IOPS - REN Particulate Risk Assessment Tool	1. Surface	\N	\N	\N	\N	2025-06-10 05:01:14.637849
41a95085-8b09-4c01-bf0d-edff2ee4f8b5	IOPS - RHN Endoscan App Server Implementation	IOPS - RHN Endoscan App Server Implementation	7. Execute	\N	\N	\N	EndoScan	2025-06-10 05:01:14.637849
f6cd8fa7-9d81-46ea-aede-6a1098dcae8e	IOPS - RHN ERT Paging System	IOPS - RHN ERT Paging System	active	\N	\N	\N	\N	2025-06-10 05:01:14.637849
348b48d6-1d9b-4ad2-9153-f8fca68f8912	IOPS - RHN Lenel Upgrade	IOPS - RHN Lenel Upgrade	active	\N	\N	IOPS Plant Management / Badge and Access Management	\N	2025-06-10 05:01:14.637849
3bd2788e-8fda-4589-bd6d-1656d769419f	IOPS - SAR DCS DeltaV	IOPS - SAR DCS DeltaV	active	\N	\N	IOPS Product Development / Process Analytical Technology and automated process control;IOPS Product Manufacturing / Batch Management	\N	2025-06-10 05:01:14.637849
08d17406-c7f4-4199-a7b2-7de697c0fab3	IOPS - SAR MES for Saratoga	IOPS - SAR MES for Saratoga	active	\N	\N	IOPS Product Manufacturing / Batch Management	\N	2025-06-10 05:01:14.637849
74d4b3e2-473c-4e67-89bb-a9622bb40290	IOPS - Transchrom Expansion	IOPS - Transchrom Expansion	active	\N	\N	IOPS Quality Control / Lab Chromatography	\N	2025-06-10 05:01:14.637849
85868fc3-3754-4774-84b2-6f1a0f4e9037	JobTarget	JobTarget	active	\N	\N	\N	\N	2025-06-10 05:01:14.637849
968175db-23ec-4f5e-b6f9-fd3ff4d4aa74	Lean IX Phase 2	Lean IX Phase 2	active	\N	\N	\N	LeanIX	2025-06-10 05:01:14.637849
c422588b-097b-4cc4-a9b4-80d36faf7b81	Magellan - GD - GPS:Libtayo Sanofi Acquisition Technology	Magellan - GD - GPS:Libtayo Sanofi Acquisition Technology	active	\N	\N	\N	\N	2025-06-10 05:01:14.637849
66a80262-aad9-46cf-9134-32af76167303	Magellan - GD - Signal Management Implementation	Magellan - GD - Signal Management Implementation	active	\N	\N	\N	\N	2025-06-10 05:01:14.637849
41d8e880-4499-462d-9a18-948e69244d59	Magellan – GD – Lorenz docuBridge: Japan	Magellan – GD – Lorenz docuBridge: Japan	active	\N	\N	\N	\N	2025-06-10 05:01:14.637849
71ea09a0-4cd4-45af-8418-546fd795616e	Master Data Management (GDS Implementation)	Master Data Management (GDS Implementation)	active	\N	\N	\N	Master Data Management (MDM)	2025-06-10 05:01:14.637849
41dfb18f-c82b-48f7-af5a-99676108611d	Mediverse Ph 2	Mediverse Ph 2	active	\N	\N	\N	\N	2025-06-10 05:01:14.637849
adc34532-8fed-4691-be59-fe307a09914a	MediVerse Program	MediVerse Program	active	\N	\N	\N	\N	2025-06-10 05:01:14.637849
e439cf91-275c-4d53-a7f6-cd6070c984ee	MIS-Medical Inquiry System	MIS-Medical Inquiry System	active	\N	\N	\N	\N	2025-06-10 05:01:14.637849
fe4494dd-99df-4a3b-ba6e-6855b41b388d	NEMO R4	NEMO R4	active	\N	\N	\N	\N	2025-06-10 05:01:14.637849
060b3843-1135-4b8c-a601-167a745d0c06	Onboarding Revamp	Onboarding Revamp	active	\N	\N	\N	\N	2025-06-10 05:01:14.637849
fe379e6f-626c-4a18-98ce-4c8b65c6199b	One Source Data Hub	One Source Data Hub	active	\N	\N	\N	\N	2025-06-10 05:01:14.637849
c7f4dc15-1f8a-46b2-a74a-9d36223abaec	OneTrust DSAR Implementation	OneTrust DSAR Implementation	active	\N	\N	\N	OneTrust	2025-06-10 05:01:14.637849
1a08ea04-e2f6-4b5b-8160-263ab46b6fc9	OneTrust Incident Management	OneTrust Incident Management	active	\N	\N	\N	OneTrust	2025-06-10 05:01:14.637849
790cc1f8-a43f-4dfc-8c00-8e28c16cb50e	PPM Tool Initiative	PPM Tool Initiative	active	\N	\N	\N	\N	2025-06-10 05:01:14.637849
682a8fde-8212-4788-9a96-f6939957858a	Project Online Replacement Evaluation	Project Online Replacement Evaluation	active	\N	\N	\N	Compass	2025-06-10 05:01:14.637849
e425482d-75cb-407b-b34a-0626fbbcb7db	Project Unity for DHT Implementation	Project Unity for DHT Implementation	active	\N	\N	\N	\N	2025-06-10 05:01:14.637849
32e460d2-49d1-4cb7-9cf0-9e8aac58ec8e	R env - Interactive Data Review & Topline Results	R env - Interactive Data Review & Topline Results	active	\N	\N	\N	\N	2025-06-10 05:01:14.637849
7094dfdf-6677-44d2-8e68-d9c9ab16fbc5	RA: GRITS Assessment	RA: GRITS Assessment	active	\N	\N	\N	\N	2025-06-10 05:01:14.637849
2baba453-2ae6-493a-8ba9-8a5d58a0c37c	RA: Post Plus - Box GxP Platform - Qualification	RA: Post Plus - Box GxP Platform - Qualification	active	\N	\N	\N	\N	2025-06-10 05:01:14.637849
af325228-ce16-4b69-86da-fbb748906131	Replace SumTotal Integrations	Replace SumTotal Integrations	active	\N	\N	\N	Beeline;Oracle eBusiness Suite [Platform];TalentHub [Platform];Workday + Beeline;Workday [Platform]	2025-06-10 05:01:14.637849
9ee0c110-963f-48f7-8cf7-670a07553e44	Risk Based Quality Management (RBQM)	Risk Based Quality Management (RBQM)	active	\N	\N	\N	CluePoints RBQM	2025-06-10 05:01:14.637849
a7334476-a6df-4aa1-afe0-14ea94862168	SAS Platform Modernization Program	SAS Platform Modernization Program	active	\N	\N	\N	\N	2025-06-10 05:01:14.659624
b9580b41-ce57-4776-aa8b-459a7fca5eb7	SAS Viya Implementation	SAS Viya Implementation	active	\N	\N	\N	\N	2025-06-10 05:01:14.659624
c455e6af-741f-44b4-9e85-c595c3c059a5	Scientific & Samples Data Lakes-DevOps Program​	Scientific & Samples Data Lakes-DevOps Program​	active	\N	\N	\N	\N	2025-06-10 05:01:14.659624
3d1ab77b-1583-4bc9-aaf2-27a2dfb46e49	SDE - Data Integrations for One Source Data Hub	SDE - Data Integrations for One Source Data Hub	active	\N	\N	\N	\N	2025-06-10 05:01:14.659624
1354ec06-d836-4b24-aea5-c2f92081c12d	SDE - Extract CES-2241 Moticon data into RTS	SDE - Extract CES-2241 Moticon data into RTS	active	\N	\N	\N	\N	2025-06-10 05:01:14.659624
4530f41c-60ae-4a58-9960-0d53d7483198	SDE - iEnvision Data to GDDL	SDE - iEnvision Data to GDDL	active	\N	\N	\N	\N	2025-06-10 05:01:14.659624
14e664a1-d262-43a1-b5d0-e0746659cf44	SDE - Ingest GTO Vendor Data to Support Metrics Dashboard	SDE - Ingest GTO Vendor Data to Support Metrics Dashboard	active	\N	\N	\N	\N	2025-06-10 05:01:14.659624
68f4470f-dc60-40fe-9adc-1e4da5011261	SDE - Ingest REGNU Data to ODL	SDE - Ingest REGNU Data to ODL	active	\N	\N	\N	Operational Data Lake;REGNU	2025-06-10 05:01:14.659624
fdbe4e46-b244-4ea7-8cc5-d6a243ce8385	SDE - Ingest Zai China Operational Data into ODL	SDE - Ingest Zai China Operational Data into ODL	active	\N	\N	\N	Operational Data Lake;Veeva - CTMS	2025-06-10 05:01:14.659624
e5cf576a-c556-4671-9703-3b4756f3b114	SDE - Komodo Data into BDI Instance	SDE - Komodo Data into BDI Instance	active	\N	\N	\N	\N	2025-06-10 05:01:14.659624
70dad8b0-1991-4af5-ab3f-d1b5aa63200c	SDE - Mediverse Integration	SDE - Mediverse Integration	active	\N	\N	\N	\N	2025-06-10 05:01:14.659624
ca73bc5b-056f-4d14-99f3-a7ee5e343475	SDE- Academy Page for Data Enablement Integration	SDE- Academy Page for Data Enablement Integration	active	\N	\N	\N	Academy Pages	2025-06-10 05:01:14.659624
c784fa0e-fc9f-4e9d-a779-4d2aa400410b	SDE- Integration Cluepoints data into ODL	SDE- Integration Cluepoints data into ODL	active	\N	\N	\N	CluePoints RBQM;Operational Data Lake	2025-06-10 05:01:14.659624
96ba25c2-f46d-4d36-9857-2a9528eeb668	Unified Request Management Repository and Reporting - Implementation	Unified Request Management Repository and Reporting - Implementation	active	\N	\N	\N	CTMS Request Management	2025-06-10 05:01:14.659624
49f19414-da08-4748-b1bd-94f740ce6268	Veeva Clinical Vault 2024 Business Releases	Veeva Clinical Vault 2024 Business Releases	active	\N	\N	\N	\N	2025-06-10 05:01:14.659624
18ac9cee-b99e-4508-a8aa-b54b5060fabb	Veeva Platform Center of Excellence (CoE) Implementation	Veeva Platform Center of Excellence (CoE) Implementation	active	\N	\N	\N	\N	2025-06-10 05:01:14.659624
3c167ff8-7b83-4f9b-826a-6f2f7c0fab8c	Veeva Quality Vault 2024 Business Releases	Veeva Quality Vault 2024 Business Releases	active	\N	\N	\N	\N	2025-06-10 05:01:14.659624
11a385e7-5e4f-4df4-bba1-56642ee40d03	Veeva RIM Vault 2024 Business Releases	Veeva RIM Vault 2024 Business Releases	active	\N	\N	\N	\N	2025-06-10 05:01:14.659624
db0805e8-6bb8-499f-9be9-a7582b44c4a3	Veeva Site Connect Phases 0-1 - Safety Letter Distribution	Veeva Site Connect Phases 0-1 - Safety Letter Distribution	active	\N	\N	\N	Site Connect	2025-06-10 05:01:14.659624
d7556537-d7df-441d-9ba8-e8116e987671	WCG Site Feasibility Application Re-Platform	WCG Site Feasibility Application Re-Platform	active	\N	\N	\N	Site Feasibility Application	2025-06-10 05:01:14.659624
06094ba3-b15d-4047-ad0e-b72c6015b047	WFP - Interim & Long-Term Deliverables	WFP - Interim & Long-Term Deliverables	active	\N	\N	\N	\N	2025-06-10 05:01:14.659624
73834c8a-55de-4c5e-bfdb-f71c7bb406ec	Workday Demand Backlog	Workday Demand Backlog	active	\N	\N	\N	Beeline;BenefitSolver;Boomi;CorePay;Equity Edge (E*TRADE);External Application;Graebel globalCONNECT;Journey Live;Maven Clinic Platform;OneTrust;Oracle eBusiness Suite [Platform];Oracle EPM  [Platform] / Oracle EDMCS;PayFactors;Qlik (Qlikview & QlikSense);ServiceNow [Platform];TalentHub [Platform];Workday + Beeline;Workday [Platform]	2025-06-10 05:01:14.659624
c4559cd6-1f0e-48fd-a136-c04bbaa10a51	Workday People Integrations	Workday People Integrations	active	\N	\N	\N	Beeline;External Application;Hyland Onbase  [Platform] / Hyland Onbase Shipping and Receiving;Oracle EPM  [Platform] / Oracle EDMCS;Weight Watchers;Workday + Beeline;Workday [Platform]	2025-06-10 05:01:14.659624
dad5155a-e30c-4940-b954-6f1531c65c25	Workforce Planning	Workforce Planning	active	\N	\N	\N	\N	2025-06-10 05:01:14.659624
\.


--
-- Data for Name: interfaces; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.interfaces (id, name, source_application, target_application, data_flow, frequency, data_objects, status, created_at) FROM stdin;
4d86b33a-39d4-4998-b1d3-b7df2d3645b7	A2 to APS - Blinding	A2	Kinaxis Maestro Advanced Planning System (APS)	outgoing			active	2025-06-10 04:59:06.825347
d0a8a721-bdfa-46d6-875e-d1bd57c4e153	A2 to APS - Clinical Forecast	A2	Kinaxis Maestro Advanced Planning System (APS)	outgoing			active	2025-06-10 04:59:06.844082
8b655557-536e-4d84-9a8a-315e457cffc9	A2 to APS - Clinical Orders	A2	Kinaxis Maestro Advanced Planning System (APS)	outgoing			active	2025-06-10 04:59:06.861812
7dcc9198-d509-4a6b-a896-41a7799c245d	A2 to APS - Commercial Forecast	A2	Kinaxis Maestro Advanced Planning System (APS)	outgoing			active	2025-06-10 04:59:06.880051
dcc74243-5803-4709-b8ee-d3f08b0f1ee5	A2 to APS - Country	A2	Kinaxis Maestro Advanced Planning System (APS)	outgoing			active	2025-06-10 04:59:06.898176
c8a7cbb8-aab4-4990-9349-87db5ab2dd3d	A2 to APS - CountryGroup	A2	Kinaxis Maestro Advanced Planning System (APS)	outgoing			active	2025-06-10 04:59:06.917647
1e7f4f99-f0a4-46ca-93ba-52c87ee9f570	A2 to APS - CountryGroupCountry	A2	Kinaxis Maestro Advanced Planning System (APS)	outgoing			active	2025-06-10 04:59:06.936122
ef293999-a5da-4267-9e50-2c785117ec56	A2 to APS - Customer	A2	Kinaxis Maestro Advanced Planning System (APS)	outgoing			active	2025-06-10 04:59:06.959065
f40afc13-94ea-4e8f-9c3c-e63425ebf926	A2 to APS - Customer Partner	A2	Kinaxis Maestro Advanced Planning System (APS)	outgoing			active	2025-06-10 04:59:06.983653
43e7e168-eea0-4c57-b844-2fa63cb8d8f4	A2 to APS - IND Dmd Program	A2	Kinaxis Maestro Advanced Planning System (APS)	outgoing			active	2025-06-10 04:59:07.003332
05e4cff4-8f20-4444-8376-d5b2e5e8380a	A2 to APS - IndDmd Clinical	A2	Kinaxis Maestro Advanced Planning System (APS)	outgoing			active	2025-06-10 04:59:07.021451
042f9cab-ae49-41a0-bc26-3b3c6d40b8e5	A2 to APS - Label	A2	Kinaxis Maestro Advanced Planning System (APS)	outgoing			active	2025-06-10 04:59:07.060641
513cbcd1-f3d3-4125-bb7f-1d51b460b13e	A2 to APS - LabelColor	A2	Kinaxis Maestro Advanced Planning System (APS)	outgoing			active	2025-06-10 04:59:07.07856
6e10a667-63f5-4a45-bf91-6d29cd220bd3	A2 to APS - LabelStatus	A2	Kinaxis Maestro Advanced Planning System (APS)	outgoing			active	2025-06-10 04:59:07.09618
5757f5d1-cb83-47c6-8c18-51899324acc3	A2 to APS - LabelType	A2	Kinaxis Maestro Advanced Planning System (APS)	outgoing			active	2025-06-10 04:59:07.113993
0809fd09-60e8-4150-af51-54c7e213b77d	A2 to APS - Milestone	A2	Kinaxis Maestro Advanced Planning System (APS)	outgoing			active	2025-06-10 04:59:07.131784
8aab6cbd-8ba2-4388-978f-152014036164	A2 to APS - MilestoneProject	A2	Kinaxis Maestro Advanced Planning System (APS)	outgoing			active	2025-06-10 04:59:07.148507
b027fb54-7e4a-4e37-acb8-a1ed639e34b7	A2 to APS - NetType	A2	Kinaxis Maestro Advanced Planning System (APS)	outgoing			active	2025-06-10 04:59:07.166313
10765cd8-5b61-4529-b3b7-88c9c01e5476	A2 to APS - Objective	A2	Kinaxis Maestro Advanced Planning System (APS)	outgoing			active	2025-06-10 04:59:07.184576
95912c65-3ff9-4e44-b771-45cca941c79e	A2 to APS - ObjectiveType	A2	Kinaxis Maestro Advanced Planning System (APS)	outgoing			active	2025-06-10 04:59:07.20259
8976452e-fa0b-4cd2-9abc-61c91d812bf0	A2 to APS - Partner	A2	Kinaxis Maestro Advanced Planning System (APS)	outgoing			active	2025-06-10 04:59:07.22081
5a9a79d4-70d2-4143-8ba8-672773bdd6c4	A2 to APS - Program Orders	A2	Kinaxis Maestro Advanced Planning System (APS)	outgoing			active	2025-06-10 04:59:07.2377
155581d5-d7de-4935-ac62-5098494a400a	A2 to APS - ProgramMilestone	A2	Kinaxis Maestro Advanced Planning System (APS)	outgoing			active	2025-06-10 04:59:07.255533
aadf8994-1785-4d92-8a67-794ea3e45b02	A2 to APS - Project	A2	Kinaxis Maestro Advanced Planning System (APS)	outgoing			active	2025-06-10 04:59:07.273541
2098ddf9-3650-4487-b80b-e1f56e88fef3	A2 to APS - ProjectObjective	A2	Kinaxis Maestro Advanced Planning System (APS)	outgoing			active	2025-06-10 04:59:07.291605
18a176a7-f944-4250-aaea-2dae9543ebf1	A2 to APS - RandomizationList	A2	Kinaxis Maestro Advanced Planning System (APS)	outgoing			active	2025-06-10 04:59:07.309495
36350a36-b1df-476b-ab3e-c07d126e7f3c	A2 to APS - Study	A2	Kinaxis Maestro Advanced Planning System (APS)	outgoing			active	2025-06-10 04:59:07.327406
c49b445b-2194-43a0-a4e5-f2f16aa3ae72	A2 to APS - StudyPhases	A2	Kinaxis Maestro Advanced Planning System (APS)	outgoing			active	2025-06-10 04:59:07.380182
3b7581f6-2c1b-4da7-8034-8484f5ff4805	A2 to APS - StudyStage	A2	Kinaxis Maestro Advanced Planning System (APS)	outgoing			active	2025-06-10 04:59:07.398138
3b152211-97d8-4216-b140-4b9f4a1ac936	A2 to APS - StudyStatus	A2	Kinaxis Maestro Advanced Planning System (APS)	outgoing			active	2025-06-10 04:59:07.415976
1d47b3df-8f98-48d3-991f-1e05b87e776f	A2 to APS - StudyType	A2	Kinaxis Maestro Advanced Planning System (APS)	outgoing			active	2025-06-10 04:59:07.434213
95fe17d5-661a-4818-90ef-9bdde9b03776	Accenture StartingPoint to Veeva RIM Registration - Risk Management Template	Accenture StartingPoint	Veeva - RIM Registrations	outgoing		Risk Management Template	active	2025-06-10 04:59:07.452436
1f422b3b-cc5b-4f21-8070-cbb58b42a772	Achievers to Oracle	Achievers	Oracle eBusiness Suite [Platform]	incoming		Employee;Payroll	active	2025-06-10 04:59:07.470459
543ba191-b950-452d-86fc-08e56f8ec6c4	Active Directory (External App) to Data Warehouse	Active Directory (External App)	NEMO DGT	outgoing	monthly	Employee;Non-Employee	active	2025-06-10 04:59:07.488373
dcd3258c-cecc-4ae2-bd3c-652a8a5adabf	Active Directory (External App) to Oracle Core HR	Active Directory (External App)	Oracle eBusiness Suite [Platform]	incoming	hourly	Employee;Non-Employee	active	2025-06-10 04:59:07.506452
bb2b7bc0-cab5-46ad-adca-69bd40ce70fa	Adobe -  Workday to Adobe	Adobe -  Workday					active	2025-06-10 04:59:07.524741
089e40c6-92a0-48c3-beab-2e343ba45f16	ALR to Milvus Vector DB - Publications	ALR		biDirectional	onDemand	Publications	active	2025-06-10 04:59:07.544597
fcc931da-8c6a-4d7e-9e54-48d01e891043	AON to CorePay	AON	CorePay			Payroll	active	2025-06-10 04:59:07.562305
36c530c2-6223-4b0d-b473-1ca472a6864b	Approved Supplier Data to Oracle	Approved Supplier Data	Oracle eBusiness Suite [Platform]	incoming		Supplier	active	2025-06-10 04:59:07.580154
8cca7678-c488-4cb7-9f51-9086460a5ffd	APS to mYSupply	APS					active	2025-06-10 04:59:07.59828
e02074cb-6cd6-4de7-9ed0-5ba96200711f	APS to mYSupply - Horizontal Plan	APS	mYSupply	outgoing	daily		active	2025-06-10 04:59:07.616182
bf288165-0263-4ab1-bac9-2c8bdfba492e	APS to mYSupply - Item Attributes	APS	mYSupply	outgoing	daily		active	2025-06-10 04:59:07.634065
4fd27611-2b69-4b11-bede-f6cb15acaf0f	Argus to Axway - Case Data	Argus	Axway	biDirectional		AE/SAE Case Data	active	2025-06-10 04:59:07.651967
192125fe-d483-4cc2-9bde-31b4831c8c39	Argus to MDM - Product	Argus	Master Data Management (MDM)	outgoing	daily	Product	active	2025-06-10 04:59:07.670488
8973d425-f193-4e72-8d38-f733c74ad021	Argus to Veeva Site Connect - CIOMS	Argus	Site Connect	outgoing	realtime	CIOMS	active	2025-06-10 04:59:07.688192
1961eb96-0b57-47dd-8c06-0c88ee4bba4a	ASIST to ODR - Supplies Tracking, Protocol, Country, Investigator, Site Number	ASIST	Clinical Operational Repository (ODR)	outgoing		Clinical Supplies Tracking;Country;Investigator;Site / Site Number;Study / Protocol	active	2025-06-10 04:59:07.705699
0011de81-391e-4464-8d89-6fdfd2a8db94	ASIST to Sharepoint - CTMS and ESR Studies	ASIST	Sharepoint	outgoing	daily	CTMS Studies;ESR Studies	active	2025-06-10 04:59:07.72329
88c4a861-7fd3-4a4d-8bba-6fe277eec91f	Axtria (External App) to Oracle	Axtria (External App)	Oracle eBusiness Suite [Platform]			Payroll	active	2025-06-10 04:59:07.741018
bf1b6de5-8ab1-4a24-b22b-a45de8f7135a	Axway to Converge Health SRP - Case Data	Axway	ConvergeHealth SRP	outgoing		AE/SAE Case Data	active	2025-06-10 04:59:07.758757
20b7fa44-e4a7-40a1-ae50-4f6672986b9a	Axway to IQVIA - CRF, Lab, Biomarker Data	Axway		biDirectional		EDC / CRF Data;Non CRF Data / Biomarker Data;Non CRF Data / Lab Data	active	2025-06-10 04:59:07.776318
e34f7f32-a9c3-463f-9577-df539d2861a7	Axway to Isilon - SAS Datasets	Axway	Isilon	outgoing		SAS Datasets	active	2025-06-10 04:59:07.813161
8614dd60-82b9-45bb-89f2-778d373d0a2b	Axway to Looking Glass - Medical Information	Axway	Looking Glass	outgoing		Medical Information	active	2025-06-10 04:59:07.837594
feb4b790-4bf1-43ce-8d6a-b38a9486d9e4	Axway to Operational DataLake - Operational EDC, non-CRF Data	Axway	Operational Data Lake	outgoing		EDC;Non CRF Data	active	2025-06-10 04:59:07.85537
5f95dd48-32e4-4c3a-95b8-a59b4161bc13	Beamery Career Site to External Job Boards	Beamery Career Site	External Application			Job Posting or Job Requisition	active	2025-06-10 04:59:07.873291
8300e9aa-005e-40cc-af5b-76375ad4466f	Beamery Career Site to LinkedIn Recruiter	Beamery Career Site	LinkedIn Recruiter	outgoing	onDemand	Job Posting or Job Requisition	active	2025-06-10 04:59:07.891049
2798c26e-f55a-4951-9c6d-90b782f20531	Beeline to Changepoint - User Data	Beeline	Planview Changepoint	outgoing	daily	Users	active	2025-06-10 04:59:07.90992
d513fdcf-a4f1-4ef1-91b1-2ea3904f4755	Beeline to Global Development - Non-employee Roster	Beeline	External Application	outgoing		Non-Employee	active	2025-06-10 04:59:07.926548
c73e5720-827f-4adf-a0e3-3d0a8100fc08	Beeline to Global Development - Non-employee Roster form Ceredian	Beeline	External Application	outgoing		Non-Employee	active	2025-06-10 04:59:07.944219
578e423b-2336-4a0e-aa4b-91ba6833f515	Beeline to Insights RM - Actual Hours	Beeline	Insights RM	outgoing		Actual Hours	active	2025-06-10 04:59:07.961953
fd5dd181-1fa1-4075-ab9c-df901348cfe4	Beeline to Oracle EBS (Automated)	Beeline	Oracle eBusiness Suite [Platform]	outgoing	onDemand	Non-Employee	active	2025-06-10 04:59:07.978453
e306a044-1015-43e6-a818-e01ac0ea02c8	Beeline to Oracle EBS (WebADI)	Beeline	Oracle eBusiness Suite [Platform]	outgoing	onDemand	Non-Employee	active	2025-06-10 04:59:07.996078
b11a0adb-34e7-4d79-82b6-cbb17b4799a3	Beeline to Research IT - Non-employee Roster	Beeline	External Application	outgoing		Non-Employee	active	2025-06-10 04:59:08.013745
c15a16d8-691d-48ad-ba23-dfbe6df88711	Bioregistry (RDL) to MDM - Study	Bioregistry (RDL)	Master Data Management (MDM)	outgoing	daily	Product	active	2025-06-10 04:59:08.031776
fd626541-4889-4b42-8d12-3d39b677d275	Boomi to Icertis User Profile Feed	Boomi	Icertis				active	2025-06-10 04:59:08.048442
615a7074-dc13-4f8e-b908-3b8da4b83f41	BrassRing to Qlik (External App)	BrassRing	Qlik (Qlikview & QlikSense)	outgoing		Candidate	active	2025-06-10 04:59:08.066171
9dd20189-582b-47dc-ba1b-e0f27ce1adb6	Bus Ops SharePoint to Data Lake (Phase 2) - Protocol Deviation Files	Bus Ops SharePoint	Operational Data Lake	outgoing	daily	Study / Protocol Deviation Files	active	2025-06-10 04:59:08.084272
e22657fb-8bde-4f91-a9e1-e3d5fb59345d	Bus Ops SharePoint to Data Lake Phase 1 - Study Budget and eCOA master file	Bus Ops SharePoint	Operational Data Lake	outgoing	daily	eCOA/ePRO Data / eCOA Master File;Study / Study Budget (Bot)	active	2025-06-10 04:59:08.101934
1945412e-d37f-4428-b878-79f10b2fdb50	BusinessSolver to Aetna	BusinessSolver	Aetna				active	2025-06-10 04:59:08.121941
fa4cbdec-9d83-4355-99b4-de15f4085b37	BusinessSolver to Broadspire	BusinessSolver	Broadspire				active	2025-06-10 04:59:08.140099
5802878c-ada2-4b7c-b1d6-bc30a62f5d91	BusinessSolver to CDPHP	BusinessSolver	CDPHP				active	2025-06-10 04:59:08.156531
771c6df0-0359-4883-a7a2-0bf2b9894a1e	BusinessSolver to Cigna	BusinessSolver	Cigna				active	2025-06-10 04:59:08.17503
1583843c-d1c1-4f9b-bb35-e4287c640bf7	BusinessSolver to Delta Dental	BusinessSolver	Delta Dental				active	2025-06-10 04:59:08.192752
887fc653-5219-4796-8cfd-0f4fee10996c	BusinessSolver to Hartford	BusinessSolver	Hartford				active	2025-06-10 04:59:08.21046
b1060663-2b23-4d93-aba7-704d216d3ff9	BusinessSolver to Hyatt Legal	BusinessSolver	MetLife Legal Plans				active	2025-06-10 04:59:08.228104
51d6fc73-0816-43ca-b75c-11b3f681e640	BusinessSolver to Norton Lifelock	BusinessSolver	LifeLock				active	2025-06-10 04:59:08.246049
90823c32-4fc5-4c3b-ba24-ad06fefa08ce	BusinessSolver to OptumRX	BusinessSolver	OptumRX				active	2025-06-10 04:59:08.26918
074f6865-917c-4e04-b1fe-ae2e65fb88c4	Businesssolver to Oracle Payroll	Businesssolver	Oracle eBusiness Suite [Platform]	incoming		Benefits	active	2025-06-10 04:59:08.28699
b2b8b508-6fbd-484d-a936-86bdcffef919	BusinessSolver to VSP	BusinessSolver	VSP Vision				active	2025-06-10 04:59:08.303611
f673bc24-a90b-4eb9-b82e-bf42ca1bdba3	Businesssolver to WageWorks	Businesssolver	WageWorks				active	2025-06-10 04:59:08.322823
fed35020-8eed-4ba0-b796-b3dc40d611d2	Calyx IRT to ODL - Oncology Data	Calyx IRT	Operational Data Lake	outgoing	daily	Oncology Data	active	2025-06-10 04:59:08.340418
fad493db-4d0d-467a-9ad6-1b59d5adcb2b	Calyx IRT to ODR - Screening, Randomization Data	Calyx IRT	Clinical Operational Repository (ODR)	outgoing		Randomization;Screening	active	2025-06-10 04:59:08.358292
d141bd87-e105-418c-8f9a-5275161b7f50	Calyx to Veeva eTMF - EDC Patient	Calyx	Veeva - eTMF (Track)	outgoing		Study / Subject Data	active	2025-06-10 04:59:08.376066
22e36478-b86a-4196-ab62-f801542a09be	Candidates_Qlik_INT	Candidates_Qlik_INT	Qlik (Qlikview & QlikSense)	outgoing		Candidate;Compensation;Organizations;Recruiter;Requisition	active	2025-06-10 04:59:08.393654
64941be5-0fe1-402e-899d-bd5bf852d06b	CCure (External App) to Data Warehouse	CCure (External App)	NEMO DGT			Employee;Non-Employee	active	2025-06-10 04:59:08.411559
1758d5be-4e26-4020-9e52-d1722d5c7e43	Central Lab to Operational Data Lake (ODL) - Lab Data	Central Lab	Operational Data Lake	outgoing	daily	Non CRF Data / Lab Data	active	2025-06-10 04:59:08.429067
b1b5d0b4-fe7b-4f10-aed2-9d441306f97c	Citeline to MDM - Investigator, Institution	Citeline	Master Data Management (MDM)	outgoing	daily	Institution;Investigator	active	2025-06-10 04:59:08.447965
7906a8b6-b8a5-478d-88b2-6c493e1a8bc6	Clinical EDC to PVIT - Case Data	Clinical EDC	RxLogix - PVIT	outgoing		AE/SAE Case Data	active	2025-06-10 04:59:08.466033
9df069fb-0f63-4b3d-aa3a-c06bb27ca5b5	Clinical Trial Tracker to Regulatory SP -	Clinical Trial Tracker	Regulatory Sequence Analysis Tool (SP)	outgoing			active	2025-06-10 04:59:08.483736
4e9aa2c9-2e09-4087-baff-730bf7c54d1c	CMS to Databricks	CMS	Databricks	outgoing	onDemand		active	2025-06-10 04:59:08.501481
cfc031e1-f350-4336-ac6e-30727ea4e99a	Compass to Insights RM - Resource Milestones	Compass	Insights RM	outgoing		Resource Milestones	active	2025-06-10 04:59:08.51914
4c2b0e75-dbde-492c-a02a-f0df1ee60e76	Compass to MDM - Study, Product	Compass	Master Data Management (MDM)	outgoing	daily	Product;Study	active	2025-06-10 04:59:08.53704
a69654ac-7029-42ac-9f2c-697e506b755a	Compass to ODL - Study Milestones	Compass	Operational Data Lake	outgoing	hourly	Study / Study Milestones	active	2025-06-10 04:59:08.554923
2f34764f-9dab-4c96-bb45-cfa335a8ab49	Compass to ODR - Study Milestones, Study Data	Compass	Clinical Operational Repository (ODR)			Study;Study / Study Milestones	active	2025-06-10 04:59:08.572164
a4d0e0ed-a8e0-44f0-8d2d-e78aff2e8096	Compass to Qlik	Compass	Qlik (Qlikview & QlikSense)	outgoing		Study;Study / Study Milestones;Study / Study Timelines	active	2025-06-10 04:59:08.589866
724ad278-f706-4612-b27c-38c2e80ff0fc	Compass to Veeva CTMS - Study	Compass	Veeva - CTMS	outgoing		Study	active	2025-06-10 04:59:08.607398
21bf4e43-4c89-4293-89bf-0e98272172b4	ConcertAI to Databricks	ConcertAI	Databricks	outgoing	onDemand		active	2025-06-10 04:59:08.635572
f9e1f61d-6a50-47ea-977d-4083a3ef652a	Concur to Medpro	Concur	MedPro			Employee;Expenses	active	2025-06-10 04:59:08.654918
11e391b1-53f2-484f-ac4a-d83da5bcec2f	Concur to Oracle General Ledger - Expense Report	Concur	Oracle eBusiness Suite [Platform]	outgoing	weekly	Employee;Expenses;GL	active	2025-06-10 04:59:08.671577
87c41e85-077b-42fe-a466-5503bb45f616	Concur to Oracle General Ledger - PCard	Concur	Oracle eBusiness Suite [Platform]	incoming	weekly	Employee;Expenses;GL;Non-Employee	active	2025-06-10 04:59:08.689491
0925ebed-0180-4347-b8f2-dd1d5a417981	Concur to Oracle Payroll	Concur	Oracle eBusiness Suite [Platform]	incoming		Expenses	active	2025-06-10 04:59:08.707192
a0f7e263-4dea-4c3b-aba1-abc2cf6861c2	Concur to Payroll - Expense Report Data	Concur	Oracle eBusiness Suite [Platform]	incoming		Employee;Expenses;GL	active	2025-06-10 04:59:08.724894
198c4fe5-9e39-4b8d-8812-82aaa63c49b1	Core Country Committee to ODL - Country Data	Core Country Committee	Operational Data Lake	outgoing	monthly	Country	active	2025-06-10 04:59:08.742576
c0f1493d-9b98-4ae2-bcdb-6741291f9112	CorePay to Bank of Ireland	CorePay	Bank of Ireland			Payroll	active	2025-06-10 04:59:08.760637
777f6c52-7685-4a65-9619-452a7bca0fb5	Corepay to Oracle General Ledger	Corepay	Oracle eBusiness Suite [Platform]	incoming		Employee;GL	active	2025-06-10 04:59:08.778555
efb5d791-918d-4f6b-86fb-290041e2c07a	CorePay to Revenue (External App)	CorePay	External Application				active	2025-06-10 04:59:08.796265
ba30ddc6-b929-4179-82d3-61ef22dde2f6	Costar to Oracle General Ledger	Costar	Oracle eBusiness Suite [Platform]	incoming	onDemand	GL	active	2025-06-10 04:59:08.813825
46e624bc-e737-472d-8b1f-4f0e31712e2d	CRF Data to Rave EDC - CRF Data	CRF Data	RAVE EDC	outgoing		EDC / CRF Data	active	2025-06-10 04:59:08.833122
d97f0020-5511-4d88-92c7-c38f9874f723	CRO to ODR - eTMF Document, Non CRF Data	CRO	Clinical Operational Repository (ODR)	outgoing		Audit Data;Document / Submission Content;eTMF / eTMF Document;Non CRF Data;Site;Study;Study / Protocol Deviation (Bot);Study / Study Enrollment;Study / Subject Data	active	2025-06-10 04:59:08.851013
b6019594-a4ed-4fcd-aa5f-7c8579538b87	CRO to Veeva CTMS - Study, Country, Site	CRO	Veeva - CTMS	outgoing		Country;Site;Study	active	2025-06-10 04:59:08.868948
d8db7c0f-831e-4b89-b6e2-ee5bab7444ed	CRO to Veeva to Vault Track (eTMF) - Operational Study Data	CRO	Veeva - eTMF (Track)	outgoing		eCOA/ePRO Data;EDC / Patient;Site / Site Activation;Site / Site Enrollment;Site / Site Visit	active	2025-06-10 04:59:08.886504
2c1e3de1-1236-4eb1-8912-5e7fd2630af2	Data Query Systems to CTMS - Study, Site, Enrollment Milestones	Data Query Systems	Veeva - CTMS	outgoing		Enrollment Milestone;Site / Site Milestone;Study / Study Milestones	active	2025-06-10 04:59:08.905311
8f5b634a-668a-44d1-8b12-7cdd1b7bb8b6	Data Vision to External Authoring Vendors - Notifications	Data Vision		outgoing		Notifications / Notifications to External Vendors	active	2025-06-10 04:59:08.925514
e130f982-9092-4e66-98d3-288cc0decdb7	Data vision to Mediverse - Approved Publication	Data vision	Regeneron Medical Portal	outgoing	onDemand	Document / Approved Publication	active	2025-06-10 04:59:08.943491
fa7db8c7-2b92-455c-a53b-424a0e9cc2a7	Data Warehouse to Beeline - Cost Centers	Data Warehouse	Beeline	outgoing	daily	Organization	active	2025-06-10 04:59:08.965193
bafa4ba3-303d-41c2-88fe-b3acafcc658d	Data Warehouse to Beeline - HR Orgs	Data Warehouse	Beeline	outgoing	daily	Organization	active	2025-06-10 04:59:08.984532
7ef57b79-14ab-465d-baab-23ae11b2705a	Data Warehouse to Beeline - Job Titles	Data Warehouse	Beeline	outgoing	daily	Job	active	2025-06-10 04:59:09.002297
9007d014-6a14-4039-9681-493b6803bfcb	Data Warehouse to Beeline - Organizational Unit (OU)	Data Warehouse	Beeline	outgoing	daily	Organization	active	2025-06-10 04:59:09.021384
80fd95b4-e57a-4f75-b5da-a6134ab68def	Data Warehouse to Beeline - Region	Data Warehouse	Beeline	outgoing	daily	Organization	active	2025-06-10 04:59:09.039861
02e3c084-c5fc-4865-94eb-7e4ada51ca90	Data Warehouse to Beeline - Territory	Data Warehouse	Beeline	outgoing	daily	Organization	active	2025-06-10 04:59:09.059136
c62e06b8-2cd0-4e4b-af6b-bdb94c8cb447	Data Warehouse to Beeline - Users	Data Warehouse	Beeline	outgoing	daily	Employee	active	2025-06-10 04:59:09.076405
9f1e2e6b-7bf5-4995-b6a2-374f888fbefb	Data Warehouse to Beeline - Work Location	Data Warehouse	Beeline	outgoing	daily	Organization	active	2025-06-10 04:59:09.09653
2a98079a-a871-4fee-b9f5-964d17b342c5	Data Warehouse to CCure (External App)	Data Warehouse	External Application			Employee;Non-Employee	active	2025-06-10 04:59:09.114357
37dc4db9-a63c-4aeb-abf8-7eae7d210f89	Data Warehouse to Dival Safety Boots (External App)	Data Warehouse	External Application			Employee;Non-Employee	active	2025-06-10 04:59:09.13191
720b8366-ba25-4a3e-8be8-46c56065f8ad	Data Warehouse to Fusion BCP	Data Warehouse	Fusion BC (DR Management)	outgoing	daily	Buildings;Facility Assets;Location;Supplier	active	2025-06-10 04:59:09.148543
b475c68a-ace9-411a-8ca5-c952f99537a0	Data Warehouse to Hyland Onbase - S&R	Data Warehouse	Hyland Onbase  [Platform]			Employee;Non-Employee;Supplier	active	2025-06-10 04:59:09.168027
3433942b-2f9d-42f7-8eb6-38e500ef7d5d	Data Warehouse to IOPS Data Warehouse (External App)	Data Warehouse	External Application	outgoing	daily	Employee;Non-Employee	active	2025-06-10 04:59:09.185466
65d28c7d-5b0c-4bdb-9306-6694b476ac19	Data Warehouse to Qlik (External App) - Finance Data	Data Warehouse	Qlik (Qlikview & QlikSense)				active	2025-06-10 04:59:09.203299
7ee8faae-d267-440f-af0e-87c30652da86	Data Warehouse to Qlik (External App) - HR Data	Data Warehouse	Qlik (Qlikview & QlikSense)	outgoing	daily	Employee;Non-Employee	active	2025-06-10 04:59:09.221158
86460814-de59-441c-9ee1-245a3fa2fbf9	Data Warehouse to RPA (External App)	Data Warehouse	External Application	outgoing	daily	Employee;Non-Employee	active	2025-06-10 04:59:09.23889
550e9c02-14c0-4a28-b9fc-1ba3bd6cc6e5	Data Warehouse to RSIGuard Ergonomics (External App)	Data Warehouse	External Application	outgoing	weekly	Employee;Non-Employee	active	2025-06-10 04:59:09.256708
c2e71211-f168-4a61-9f39-7d7f0ca8cac7	Data Warehouse to Safety Stratus (External App) - Supplier Data for EHS	Data Warehouse	External Application	outgoing	daily	Supplier	active	2025-06-10 04:59:09.27431
e197e7c5-1d2d-40e8-b5db-2d5da270a745	Data Warehouse to Zycus iAnalyze	Data Warehouse	Zycus [Platform]	outgoing	monthly	Employee;Invoice;Non-Employee	active	2025-06-10 04:59:09.293166
9bb24ff1-cc4f-4774-89de-6108a53e9a2c	Databricks to plotly Dash	Databricks		outgoing	onDemand		active	2025-06-10 04:59:09.310956
d9af9b1f-943f-4304-b10d-10a8a2ab6244	Databricks to R Studio Connect	Databricks	R / R Studio	outgoing	onDemand		active	2025-06-10 04:59:09.410947
b99212e6-2589-4c24-8b7f-e3b41a21cd3a	Databricks to SaS	Databricks		outgoing	onDemand		active	2025-06-10 04:59:09.42868
b7af7e72-1fd1-42f9-8d1c-0d927581ee7f	Databricks to Web App ATLAS	Databricks		outgoing	onDemand		active	2025-06-10 04:59:09.446445
255ed988-b0e2-430d-bee5-4a43363adc22	Dataiku to ICF - Informed Consent Form Data / Metadata	Dataiku	Informed Consent Form (ICF) Management	outgoing	onDemand	Informed Consent form Data;Informed Consent form MetaData	active	2025-06-10 04:59:09.464124
2481b71c-ee8d-46e0-8ec2-1b7b74217a29	Dataiku to ODR - Studies, Milestones, TA Ops	Dataiku	Clinical Operational Repository (ODR)	outgoing		Study;Study / Study Milestones;TA Ops	active	2025-06-10 04:59:09.481732
\.


--
-- Data for Name: it_components; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.it_components (id, name, display_name, category, vendor, version, status, applications, created_at) FROM stdin;
e9178563-fb1f-4b5c-acd7-cf4bad7d2458	1TEST	1TEST				active		2025-06-10 05:01:14.39822
c9175ef6-0add-4aad-b1aa-bd1c60b12190	Hosting	3CLogic Hosting		3CLogic		active	HR4U [Platform] / 3CLogic Call Center	2025-06-10 05:01:14.39822
aeb8db53-49b4-4056-9cb6-9a66044b7960	Achievers SaaS Hosting	Achievers Achievers SaaS Hosting	Human Resources Management (HRM) / Employee Performance and Engagement Management	Achievers		active	Achievers	2025-06-10 05:01:14.39822
5e3b25a1-312c-460f-a51a-36a911a5fd0b	Acrobat	Adobe Acrobat 9.x		Adobe		active	PAS-X Manufacturing Execution System (MES) Rensselaer	2025-06-10 05:01:14.39822
904db97c-31a7-44ca-8f02-2a3e50dc7b9e	Captivate	Adobe Captivate		Adobe		active	Captivate	2025-06-10 05:01:14.39822
c96a22d9-0060-4173-984c-bcfeaf62411f	InDesign	Adobe InDesign		Adobe		active	InDesign	2025-06-10 05:01:14.39822
04b11f07-7c60-4b1e-92aa-23318c9313f4	Aetna Application Hosting	Aetna Aetna Application Hosting		Aetna		active	Aetna	2025-06-10 05:01:14.39822
b5fc5b15-0eea-4ed3-b0b1-3e5a6d015966	Aetna SaaS Hosting	Aetna Aetna SaaS Hosting		Aetna		active	Aetna	2025-06-10 05:01:14.39822
7338cabf-137e-4ab0-8787-3a7e8de07017	Analytics SaaS Hosting	Alphabet / Google Analytics SaaS Hosting		Alphabet / Google		active	Clinical Trials Site - Corporate;REGN Career Site;Workday [Platform]	2025-06-10 05:01:14.39822
9e82babb-7726-469b-b1f9-6e4d2f8083ed	Apigee API Management	Alphabet / Google Apigee API Management	Software Development / Development Environment	Alphabet / Google		active		2025-06-10 05:01:14.39822
6c41c1ac-d3c6-4656-8d80-25c32b959086	Flutter	Alphabet / Google Flutter 3.22.x		Alphabet / Google		active	Return to Office Smart Mobile App	2025-06-10 05:01:14.39822
c5409790-5ec3-4748-857f-9e1c0b8be6ce	Google Analytics	Alphabet / Google Google Analytics		Alphabet / Google		active	Regeneron Medical Portal	2025-06-10 05:01:14.39822
b3e3b3a6-d774-4901-b823-fd9b85d6360f	Amazon RDS for Oracle	Amazon.com / AWS Amazon RDS for Oracle		Amazon.com / AWS		active	Enterprise Data Warehouse;Human Sample Request	2025-06-10 05:01:14.39822
a3f8dafc-1b20-4c48-a933-82cb0b35ceef	Amazon Redshift SaaS Hosting	Amazon.com / AWS Amazon Redshift SaaS Hosting		Amazon.com / AWS		active		2025-06-10 05:01:14.39822
e5db8b0b-20c7-4c68-9c0b-a481e019036c	Amazon S3	Amazon.com / AWS Amazon S3	Storage Management / Storage Resource Management	Amazon.com / AWS		active	ALR (Automated Literature Review);Flywheel.io;GDS Big Data Initiative (BDI);Human Sample Request;J-Review Web;OSDH (One source data hub)	2025-06-10 05:01:14.39822
b7ccb6c4-b2a0-4042-987d-b86b3fc70e40	EC2	Amazon.com / AWS EC2		Amazon.com / AWS		active	3D Slicer for Imaging;Boomi;CRF Annotation Interactive Automation;Enterprise Data Warehouse;Flywheel.io;Human Sample Request;Informed Consent Form (ICF) Management;J-Review Web;MAGNATron;Markview 10.1;Oracle EPM  [Platform]	2025-06-10 05:01:14.39822
f1e4d15a-60e8-454f-8877-851eac1e405d	ElastiCache for Redis	Amazon.com / AWS ElastiCache for Redis		Amazon.com / AWS		active		2025-06-10 05:01:14.39822
551772c4-6434-4861-b9f5-ecec391e54f6	Lambda	Amazon.com / AWS Lambda	IT Management / IT Asset Maintenance & Support	Amazon.com / AWS		active		2025-06-10 05:01:14.39822
4bd7d48c-0a87-4906-ab65-adab7d0fcc2a	Transfer for SFTP	Amazon.com / AWS Transfer for SFTP	Enterprise Content Management (ECM) / Content Delivery and Distribution	Amazon.com / AWS		active		2025-06-10 05:01:14.39822
2f3e404a-3682-4383-9131-72246e0c4d8e	AON Application Hosting	AON AON Application Hosting		AON		active	AON	2025-06-10 05:01:14.39822
93c731f1-3d6c-4078-98d6-efabe3e392dc	Hive	Apache Software Foundation Hive 3.x	Business Intelligence (BI) / Data Mining and Warehousing	Apache Software Foundation		active		2025-06-10 05:01:14.39822
95f19b38-b5af-4e1b-8fd0-3d579ed2ca4c	Apache Tomcat	Apache Tomcat				active	CRF Annotation Interactive Automation	2025-06-10 05:01:14.39822
3548b4fd-31ab-4c07-8b1c-7651cb734072	API	API				active		2025-06-10 05:01:14.39822
5eff375a-fac4-43fe-b8a1-c8aaaf6e7ab1	Appian	Appian Appian		Appian		active	Additional Risk Minimization Measures;Informed Consent Form (ICF) Management	2025-06-10 05:01:14.39822
d39d7c7e-b606-4600-847b-f22c4e713ce1	Archie Bot	Archie Bot	Robotic Process Automation (RPA) (Bot)			active	Health Authority Correspondence;Sharepoint	2025-06-10 05:01:14.39822
5419cbb9-24cb-40d5-b957-619f52f9d8d8	Argo CD	Argo Project Argo CD 2.9.x		Argo Project		active		2025-06-10 05:01:14.39822
e2566b27-b88f-494f-8f3d-2d873c5f1413	Articulate Application Hosting	Articulate Articulate Application Hosting		Articulate		active	Storyline 360	2025-06-10 05:01:14.39822
fd5b320c-fbf5-434f-b775-298aa3a662cd	Articulate SaaS Hosting	Articulate Global Articulate SaaS Hosting		Articulate Global		active	Articulate	2025-06-10 05:01:14.39822
5ecd965a-573f-4217-a8d5-dccd1e73be9b	Atlassian Confluence SaaS Hosting	Atlassian Atlassian Confluence SaaS Hosting		Atlassian		active	Atlassian Confluence	2025-06-10 05:01:14.39822
2ea9afc9-7c29-43f3-ab57-a2943fa9ae46	Bitbucket Server	Atlassian Bitbucket Server 8.14.x		Atlassian		active		2025-06-10 05:01:14.39822
33d69fd2-ec19-4d54-884f-501b8a66742e	Bitbucket Server	Atlassian Bitbucket Server 8.6.x		Atlassian		active		2025-06-10 05:01:14.39822
d130d23a-fdde-4058-b4be-70306ea5d518	Jira	Atlassian Jira		Atlassian		active	Jira BPM Projects	2025-06-10 05:01:14.39822
1926ed9b-b9a2-47d5-9adb-b85d5c647cfa	Jira Service Desk	Atlassian Jira Service Desk		Atlassian		active	DADS Intake	2025-06-10 05:01:14.39822
33c58240-fc54-4f4e-85bb-9ef2de45ee8f	Automation of SSN Intake Forms from CRO Bot	Automation of SSN Intake Forms from CRO Bot	Robotic Process Automation (RPA) (Bot)			active		2025-06-10 05:01:14.39822
ce87f6b4-d61e-47e4-9faf-1c39d020e4bc	Application Hosting	Avature Application Hosting		Avature		active	Avature	2025-06-10 05:01:14.39822
5dc1b944-267e-4622-ab9f-4e1eacb7a871	Avoma	Avoma Avoma		Avoma		active		2025-06-10 05:01:14.39822
04cda74e-b53d-4fe0-9c1b-d2a4c253051a	Axway B2Bi	Axway B2Bi				active	Axway	2025-06-10 05:01:14.39822
3c0d922e-6968-4e47-93b5-f53b07379428	Hosting	Bank of America Hosting		Bank of America		active		2025-06-10 05:01:14.39822
f9244912-5f1b-4f73-b272-f7e0ffeb2470	Beamery SaaS Hosting	Beamery Beamery SaaS Hosting		Beamery		active	Beamery Talent CRM	2025-06-10 05:01:14.39822
b1249044-e4f6-412c-b284-527ac9240ad4	Beamery Chrome Extension	Beamery Chrome Extension				active	Beamery Talent CRM	2025-06-10 05:01:14.39822
00d58a73-63e5-498b-86e3-b380501cf426	Application Hosting	Beeline Application Hosting		Beeline		active	Beeline	2025-06-10 05:01:14.39822
f8b67fb3-2aeb-4230-8369-421f0c49016e	Beeline SaaS Hosting	Beeline Beeline SaaS Hosting		Beeline		active	Beeline	2025-06-10 05:01:14.39822
25ea4e18-9780-4253-87a8-1939b28cec67	RaaS	Beeline RaaS		Beeline		active		2025-06-10 05:01:14.39822
28763213-523b-4f1c-9bfa-691739f2246a	Benchling Modalities API	Benchling Modalities API				active		2025-06-10 05:01:14.39822
2b89c4d4-803a-4b27-aedb-c9ca35ddc8ed	Application Hosting	BenefitSolver Application Hosting		BenefitSolver		active	BenefitSolver	2025-06-10 05:01:14.39822
25720544-45df-4226-b46a-e59f045689da	BioRender SaaS Hosting	BioRender BioRender SaaS Hosting		BioRender		active	BioRender	2025-06-10 05:01:14.39822
922e704a-b9f4-4985-b1fe-86171ef1c10a	Boomi Integration	Boomi Boomi Integration	Middleware / Enterprise Integration	Boomi		active		2025-06-10 05:01:14.39822
33a7cb52-d5cf-440f-9643-3718f35cc1f4	BOTSON	BOTSON	Robotic Process Automation (RPA) (Bot)			active		2025-06-10 05:01:14.39822
d9e9eda0-1068-4e4d-a41b-69367d6e197b	BrassRing Application Hosting	BrassRing BrassRing Application Hosting		BrassRing		active		2025-06-10 05:01:14.39822
7e2bc1da-287e-4030-8924-c8a163f462e5	Bright Horizon Application Hosting	Bright Horizon Bright Horizon Application Hosting		Bright Horizon		active	Bright Horizons	2025-06-10 05:01:14.39822
03be8cf8-71ee-4433-936b-56d0ff76dfca	LifeLock SaaS Hosting	Broadcom / NortonLifeLock LifeLock SaaS Hosting		Broadcom / NortonLifeLock		active	LifeLock	2025-06-10 05:01:14.433351
48bce909-3b39-4b18-ba20-9f357b480b5b	Broadspire Application Hosting	Broadspire Broadspire Application Hosting		Broadspire		active	Broadspire	2025-06-10 05:01:14.433351
908b9a44-9c32-4f7b-8988-002813c76ba7	Hosting	BTS Hosting		BTS		active		2025-06-10 05:01:14.433351
72946874-8356-4bb8-ab76-86b3ee39d6f3	Bus Ops SharePoint (Protocol Deviation) to Data Lake Phase 2 Bot	Bus Ops SharePoint (Protocol Deviation) to Data Lake Phase 2 Bot	Robotic Process Automation (RPA) (Bot)			active	Operational Data Lake;Sharepoint	2025-06-10 05:01:14.433351
d7f6b65a-7173-4316-94bf-23a2c9ea9c6c	Bus Ops SharePoint (Study Budget) to Data Lake Phase 1 Bot	Bus Ops SharePoint (Study Budget) to Data Lake Phase 1 Bot	Robotic Process Automation (RPA) (Bot)			active	Operational Data Lake;Sharepoint	2025-06-10 05:01:14.433351
b252a8aa-cbfb-4de4-9c7b-176d575dbb9e	Application Hosting	Candex Application Hosting		Candex		active	Candex Agency Portal	2025-06-10 05:01:14.433351
c64e43ad-7401-49fe-980c-6b53e774271f	CareerBuilder Application Hosting	CareerBuilder CareerBuilder Application Hosting		CareerBuilder		active	Broadbean	2025-06-10 05:01:14.433351
24310ff3-1247-413f-90e1-e039367f0b7f	CDISC SDTM CRF Data Annotation Bot	CDISC SDTM CRF Data Annotation Bot	Robotic Process Automation (RPA) (Bot)			active		2025-06-10 05:01:14.433351
c6a023b2-3932-4215-b9b5-f699585b7bbb	CDPHP Application Hosting	CDPHP CDPHP Application Hosting		CDPHP		active	CDPHP	2025-06-10 05:01:14.433351
8de58ca1-cd3f-4845-ab76-be170829df41	Central Labs	Central Labs				active		2025-06-10 05:01:14.433351
1e61f4cb-2bc2-4187-92b7-e494d18037fd	Ceridian File	Ceridian File				active		2025-06-10 05:01:14.433351
7f844e69-d01a-4743-af22-3b5f25ec0152	Cigna Application Hosting	Cigna Cigna Application Hosting		Cigna		active	Cigna	2025-06-10 05:01:14.433351
2a3b2896-f9b8-466d-9bfd-4da67b2d43cc	Clinical Fin Disclosure Report Bot	Clinical Fin Disclosure Report Bot	Robotic Process Automation (RPA) (Bot)			active	Veeva - eTMF (Track)	2025-06-10 05:01:14.433351
59841a63-5520-4bd4-be56-1c1f9af4206b	Clinical Logistics Bot	Clinical Logistics Bot	Robotic Process Automation (RPA) (Bot)			active		2025-06-10 05:01:14.433351
ce7874c4-ae29-4f8e-b1ab-dbe219325a19	Clinical ODR Performance Tracking Bot	Clinical ODR Performance Tracking Bot	Robotic Process Automation (RPA) (Bot)			active	Clinical Operational Repository (ODR);Office Suite / Microsoft Outlook	2025-06-10 05:01:14.433351
d5ecdcfa-ee9b-412e-a7b2-59eef0526a57	Clinical Vault - Site Notification	Clinical Vault - Site Notification				active	Site Connect	2025-06-10 05:01:14.433351
f8619385-076e-415f-8e1f-2f6fe3574b88	Compliant Data Platform	Compliant Data Platform				active	Intelligent Sensor Data Platform	2025-06-10 05:01:14.433351
41dffd1f-a7e5-4266-aea1-f0ca95191f31	Hosting	Concur Hosting		Concur		active		2025-06-10 05:01:14.433351
eabba32c-87b8-4db6-a055-514940f36b59	ConvergeHealth Safety ETL	ConvergeHealth Safety ETL				active	ConvergeHealth SRP	2025-06-10 05:01:14.433351
8dddec6f-bc0d-445f-850b-0f7cc3d49958	ConvergeHealth Safety Report Distribution	ConvergeHealth Safety Report Distribution				active	ConvergeHealth SRP	2025-06-10 05:01:14.433351
f19bc796-3c09-479e-bd0c-c3237b4ec3ac	Hosting	Corepay Hosting		Corepay		active		2025-06-10 05:01:14.433351
e22ab333-0614-4dd1-829c-1a08bf800fa4	CPP MPP Bot	CPP MPP Bot	Robotic Process Automation (RPA) (Bot)			active	Qlik (Qlikview & QlikSense);Sharepoint	2025-06-10 05:01:14.433351
edf9224f-cb17-4888-804d-c3ba1c110170	CTIS Transcribing Information Bot	CTIS Transcribing Information Bot	Robotic Process Automation (RPA) (Bot)			active	CTIS (Clinical Trials Information System);Proofpoint Secure Share	2025-06-10 05:01:14.433351
ca3046bb-4720-4346-a218-824e163eaea6	Go-No-Go	Cytel Go-No-Go		Cytel		active	East	2025-06-10 05:01:14.433351
15dc2129-37bb-402e-be82-6cf51a5a753a	Database Results	Database Results				active		2025-06-10 05:01:14.433351
369e0b61-8d35-49f5-8ce6-230ad06962e7	Database Views	Database Views				active		2025-06-10 05:01:14.433351
ad94e36f-ef80-417d-86fa-1572458284e3	Decare Dental Application Hosting	Decare Dental Decare Dental Application Hosting		Decare Dental		active	Decare Dental	2025-06-10 05:01:14.433351
861a73fc-d14c-42eb-acf5-ed2490a7f126	Decryption	Decryption				active		2025-06-10 05:01:14.433351
3fbe1e4b-3b4b-4438-b439-992b868ad7a3	Delta Dental Application Hosting	Delta Dental Delta Dental Application Hosting		Delta Dental		active	Delta Dental	2025-06-10 05:01:14.433351
bbcb11ec-0643-44eb-92dc-1702f069de6b	DirectEmployers Application Hosting	DirectEmployers DirectEmployers Application Hosting		DirectEmployers		active	DirectEmployers	2025-06-10 05:01:14.433351
fc3846e9-0b12-4ba2-866f-e81e6b6ba29b	DocuBridge viewer instance	DocuBridge viewer instance				active	DocuBridge	2025-06-10 05:01:14.433351
5802d57f-7365-49fc-964c-5f3f472581e9	Dotmatics SaaS Hosting	Dotmatics Dotmatics SaaS Hosting		Dotmatics		active	Dotmatics	2025-06-10 05:01:14.433351
51916e41-8048-49da-9c7c-a80057693178	Druva SaaS Hosting	Druva Druva SaaS Hosting		Druva		active	Druva	2025-06-10 05:01:14.433351
54a44ab5-186e-49ce-900e-94cbb41f3fda	Application Hosting	EdAssist Application Hosting		EdAssist		active	EdAssist	2025-06-10 05:01:14.433351
c2978c19-03f2-4abd-a8c6-ebee17491dfe	ElevateSafety	ElevateSafety				active	ConvergeHealth SRP	2025-06-10 05:01:14.433351
1d43486c-36ec-42a7-a579-5970f1bc7f94	Empower SaaS Hosting	Empower Finance Empower SaaS Hosting		Empower Finance		active	Empower	2025-06-10 05:01:14.433351
cd9b1874-49cc-4800-81cf-21433dcc8f4d	iEnvision	Envision Pharma iEnvision		Envision Pharma		active	Datavision - iEnvision	2025-06-10 05:01:14.433351
17845ec8-a4d4-4016-8401-069a7340f666	Erwin Data Modeler	Erwin Data Modeler				active	OSDH (One source data hub)	2025-06-10 05:01:14.433351
cc7e0600-a495-453e-81e3-46003f408773	ESR Excel	ESR Excel				active	Benevity ESR	2025-06-10 05:01:14.433351
29445137-9568-490f-8112-5cca008c1759	ESR SP	ESR SP				active	Benevity ESR	2025-06-10 05:01:14.433351
389dcaf8-5157-4ae5-9645-6dc50f1b2f0f	eTMF Document Mapping (Study ID) Bot	eTMF Document Mapping (Study ID) Bot	Robotic Process Automation (RPA) (Bot)			active	Veeva - eTMF (Track)	2025-06-10 05:01:14.433351
7acdbe1c-bb64-421b-bd43-43cf9c4a49f4	Fidelity Application Hosting	Fidelity Fidelity Application Hosting		Fidelity		active	Fidelity NetBenefits	2025-06-10 05:01:14.433351
384a3272-471f-4ae6-9903-17df96a0e639	Fidelity PSW SaaS Hosting	Fidelity Investments Fidelity PSW SaaS Hosting		Fidelity Investments		active	Fidelity PSW	2025-06-10 05:01:14.433351
1e1dc730-2247-45c0-8cea-1654b6fba68b	Figma SaaS Hosting	Figma Figma SaaS Hosting		Figma		active		2025-06-10 05:01:14.433351
7c8c602f-4828-4f59-9a1b-6630aea2eb5e	File	File				active		2025-06-10 05:01:14.433351
e23f5629-806f-404b-976f-b69b62e3e084	CSV	File / CSV				active		2025-06-10 05:01:14.433351
80a3038d-7a72-4879-a2c9-e04ae8bb1c6d	DAT	File / DAT				active		2025-06-10 05:01:14.433351
62672e9d-be47-4cf8-981f-541aebac64f9	TXT	File / TXT				active		2025-06-10 05:01:14.433351
43b90c41-f38b-4890-a588-d941f473f403	GD REGNU Training Bot	GD REGNU Training Bot	Robotic Process Automation (RPA) (Bot)			active		2025-06-10 05:01:14.433351
7ce7d826-d63e-4b57-b160-cc7fa605a805	GD TalentHub Training Bot	GD TalentHub Training Bot	Robotic Process Automation (RPA) (Bot)			active		2025-06-10 05:01:14.433351
eb41c28b-bf9b-4520-82d6-c698f1c8da99	GDT Training Material Testing Bot	GDT Training Material Testing Bot	Robotic Process Automation (RPA) (Bot)			active		2025-06-10 05:01:14.457993
dfb5c09c-ad96-4ea6-acc8-434343ad8051	Glassdoor Application Hosting	Glassdoor Glassdoor Application Hosting		Glassdoor		active	Glassdoor	2025-06-10 05:01:14.457993
4771899e-ed79-4f41-83a0-908d0ae2f967	Glassdoor SaaS Hosting	Glassdoor Glassdoor SaaS Hosting		Glassdoor		active	Glassdoor	2025-06-10 05:01:14.457993
abd77e13-f9c9-45da-b5ad-46cad4e456f6	Glint Application Hosting	Glint Glint Application Hosting		Glint		active	Glint	2025-06-10 05:01:14.457993
6272d42e-c2bf-4a93-afb4-5aca430de628	Vyond SaaS Hosting	GoAnimate Vyond SaaS Hosting		GoAnimate		active	Vyond	2025-06-10 05:01:14.457993
4fc7465b-cbd8-40df-9b14-ccc0a59a485b	Grafana	Grafana Labs Grafana 9.5.x		Grafana Labs		active		2025-06-10 05:01:14.457993
e895e562-3b90-464c-a834-a04b8f681e27	Grants and funding management system (GFMS)	Grants and funding management system (GFMS)				active	Educational Funding Management System (EFMS)	2025-06-10 05:01:14.457993
80fa7fb8-0c0c-4e4c-ac5f-5a13b1210eda	Hartford Application Hosting	Hartford Hartford Application Hosting		Hartford		active	Hartford	2025-06-10 05:01:14.457993
1e7f3003-3d00-4591-ac0a-17aaf39b1d91	Health Advocate Application Hosting	Health Advocate Health Advocate Application Hosting		Health Advocate		active		2025-06-10 05:01:14.457993
e0385fde-2d9f-48b5-beea-d1527c30ffe5	HireEZ Application Hosting	HireEZ HireEZ Application Hosting		HireEZ		active	HireEZ (Hiretual)	2025-06-10 05:01:14.457993
86515f0f-4de1-4ffd-bba3-07b29e4f4220	HireRight Application Hosting	HireRight HireRight Application Hosting		HireRight		active	HireRight	2025-06-10 05:01:14.457993
fa6e7ced-2738-4d12-8e61-b4443af8f298	HireRight SaaS Hosting	HireRight HireRight SaaS Hosting		HireRight		active	HireRight	2025-06-10 05:01:14.457993
0b847a2a-e5af-4c30-bfe5-af261ef78cad	hireEZ SaaS Hosting	HireTeamMate hireEZ SaaS Hosting		HireTeamMate		active	HireEZ (Hiretual)	2025-06-10 05:01:14.457993
9fe8697c-b163-49ac-87c4-3de16df26362	Modern Hire SaaS Hosting	HireVue / Modern Hire Modern Hire SaaS Hosting		HireVue / Modern Hire		active	Modern Hire	2025-06-10 05:01:14.457993
26d27531-f066-4fb2-9e6e-f724b8c627bd	HMAA Application Hosting	HMAA HMAA Application Hosting		HMAA		active	HMAA	2025-06-10 05:01:14.457993
44a6fd8f-115f-430e-9c76-346e7b425f1a	Hubble	Hubble				active		2025-06-10 05:01:14.457993
467f2b45-61fb-4f80-9b88-1ebcf641cec4	Hunter Warfield Application Hosting	Hunter Warfield Hunter Warfield Application Hosting		Hunter Warfield		active	Hunter Warfield	2025-06-10 05:01:14.457993
b5531aa6-bae2-447e-9057-f90859e75f40	Hyland Application Hosting	Hyland Hyland Application Hosting		Hyland		active	Hyland Onbase  [Platform];Lawlogix Guardian	2025-06-10 05:01:14.457993
7a762057-a245-4de6-b2a3-4724f1cba55f	Onbase Mobile App	Hyland Onbase Mobile App		Hyland		active	Hyland Onbase  [Platform] / Hyland Onbase Shipping and Receiving	2025-06-10 05:01:14.457993
a92d4549-83d2-49a8-bc5d-d4affe8a67c3	Hyland OnBase SaaS Hosting	Hyland Software Hyland OnBase SaaS Hosting		Hyland Software		active	Hyland Onbase  [Platform]	2025-06-10 05:01:14.457993
1326fb70-107b-427d-be2d-5d523b5005ac	Unity Client	Hyland Unity Client		Hyland		active	Hyland Onbase  [Platform] / Hyland Onbase EDM	2025-06-10 05:01:14.457993
b2e06c5c-3272-441b-841b-e097d3a96e10	Imaging	Imaging				active		2025-06-10 05:01:14.457993
76d88011-f3c5-49ed-8ac9-1e09e65d3bef	Indeed Application Hosting	Indeed Indeed Application Hosting		Indeed		active	Indeed	2025-06-10 05:01:14.457993
de88c5a6-8c5a-4b52-a294-6b0eff8ae633	Indeed SaaS Hosting	Indeed.com Indeed SaaS Hosting		Indeed.com		active	Indeed	2025-06-10 05:01:14.457993
fff7cc1d-dcf7-459f-9e4c-5ef413caac35	Informatica	Informatica				active		2025-06-10 05:01:14.457993
4297443e-ebcc-409e-a303-e30370c29309	Informatica Master Data Management	Informatica Informatica Master Data Management		Informatica		active	Master Data Management (MDM)	2025-06-10 05:01:14.457993
9c7b9309-0fda-4f29-93e2-9f66ff27f6c8	Informatica SaaS Hosting	Informatica Informatica SaaS Hosting		Informatica		active	Informatica	2025-06-10 05:01:14.457993
5c86f3ee-b575-4bca-a9b9-729486320076	Informatica Secure Agent	Informatica Informatica Secure Agent		Informatica		active	Master Data Management (MDM)	2025-06-10 05:01:14.457993
2094493b-9e36-41c5-a6c1-fac912be610b	Integration - Discovery PPM and Dotmatics	Integration - Discovery PPM and Dotmatics				active	Discovery Pipeline PPM;Dotmatics	2025-06-10 05:01:14.457993
2b37295b-e178-4dee-a5f7-abc4537ffb5b	Intuition LMS	Intuition LMS				active		2025-06-10 05:01:14.457993
5237d333-600b-46ef-87e7-8516afedeace	Invesco Application Hosting	Invesco Invesco Application Hosting		Invesco		active	Invesco	2025-06-10 05:01:14.457993
c098bede-e9f2-458d-84d2-ca5ef43bd738	Java	Java				active	CRF Annotation Interactive Automation	2025-06-10 05:01:14.457993
72788cad-ca95-4640-8d6d-d36f0d3b2531	Hosting	JP Morgan Chase Hosting		JP Morgan Chase		active		2025-06-10 05:01:14.457993
d977cf86-f566-4f49-9d35-490c4e12cefe	JSF	JSF				active	Datavision - iEnvision	2025-06-10 05:01:14.457993
9b365eb8-1326-4c16-9e6f-b8a1304d4e57	JSON	JSON				active		2025-06-10 05:01:14.457993
1cf2643c-3f86-4690-90d7-5597cb0b2b1c	Kahoot	Kahoot Kahoot		Kahoot		active		2025-06-10 05:01:14.457993
caae0d5f-28a6-4b26-b0bb-bf2276eed04a	Kinaxis RapidResponse	Kinaxis Kinaxis RapidResponse		Kinaxis		active	Kinaxis Maestro Advanced Planning System (APS)	2025-06-10 05:01:14.457993
a36762ca-8ff2-4cd2-b24d-6a38e3746fe3	Komodo Sentinel	Komodo Sentinel				active		2025-06-10 05:01:14.457993
bb36ab5e-d441-4a9f-87a5-fa4ab35b46ab	Kong 3.6	Kong 3.6				active	Return to Office Smart Mobile App	2025-06-10 05:01:14.457993
888ba572-9d49-431d-acc2-350cd1ef268a	Legal Club of America Application Hosting	Legal Club of America Legal Club of America Application Hosting		Legal Club of America		active	Legal Club of America	2025-06-10 05:01:14.457993
7110d40c-1c9d-4bab-842b-00e93978355d	Liberty Mutual Application Hosting	Liberty Mutual Liberty Mutual Application Hosting		Liberty Mutual		active	Liberty Mutual	2025-06-10 05:01:14.457993
49e5ca49-3e6c-4da3-b2dc-2b69a0c67d56	LinkedIn Application Hosting	LinkedIn LinkedIn Application Hosting		LinkedIn		active	LinkedIn Learning;LinkedIn Recruiter	2025-06-10 05:01:14.457993
169ec72a-70e2-4014-a219-e9d2eee488bf	Jenkins	Linux Foundation / CD Foundation Jenkins 2.448		Linux Foundation / CD Foundation		active		2025-06-10 05:01:14.457993
6bd75516-9f64-4d9d-b82d-55ab925c3a61	Managed Access Programs Drug Use Bot	Managed Access Programs Drug Use Bot	Robotic Process Automation (RPA) (Bot)			active		2025-06-10 05:01:14.457993
6b08d7df-a734-4240-8956-c547545da001	Manhattan Associates Warehouse Management	Manhattan Associates Manhattan Associates Warehouse Management		Manhattan Associates		active	Manhattan Warehouse Management System (WMS)	2025-06-10 05:01:14.457993
2f8d5fb4-d838-4d65-a5e0-3cb49351a43b	Medical Safety Mailbox	Medical Safety Mailbox				active	Office Suite / Microsoft Outlook	2025-06-10 05:01:14.457993
67e1204d-b99c-4352-aa09-8ea9dd7e8cd5	Medidata Rave	Medidata Rave				active	RAVE EDC	2025-06-10 05:01:14.457993
36f8985d-bbcc-40f9-a591-a4e96474f0d3	Hosting	MedPro Hosting		MedPro		active		2025-06-10 05:01:14.457993
fbd129a7-cad7-49ba-b2b5-ab40a15422fb	Mercer Application Hosting	Mercer Mercer Application Hosting		Mercer		active	Mercer Oneview	2025-06-10 05:01:14.457993
d86974c1-2fad-4d00-847e-e8a08a2f94c9	React	Meta React 16.0.x		Meta		active		2025-06-10 05:01:14.457993
2ef3bc47-4b99-422f-8af5-c57914fc537b	MetLife Application Hosting	MetLife Legal Plans MetLife Application Hosting		MetLife Legal Plans		active	MetLife Legal Plans	2025-06-10 05:01:14.479987
72d0f944-d878-4f73-977c-6ce2d95e917d	Learning SaaS Hosting	Microsoft / LinkedIn Learning SaaS Hosting		Microsoft / LinkedIn		active	LinkedIn Learning	2025-06-10 05:01:14.479987
dd854496-03e3-46b7-9e40-2894fdf99399	Recruiter SaaS Hosting	Microsoft / LinkedIn Recruiter SaaS Hosting		Microsoft / LinkedIn		active	LinkedIn Recruiter	2025-06-10 05:01:14.479987
493f6324-8578-412b-a62f-25c3c7f8b6e1	Microsoft 365	Microsoft 365				active		2025-06-10 05:01:14.479987
6a97cba7-3b73-4c87-b619-24559b950607	Microsoft Access	Microsoft Access				active		2025-06-10 05:01:14.479987
0f240569-0b84-4d5f-aa14-073dfd29f7ae	Microsoft Bookings with Me	Microsoft Bookings with Me				active	Beamery Talent CRM	2025-06-10 05:01:14.479987
5506feef-aa64-4b83-a488-506957cefbd4	Microsoft Azure (Non REGN)	Microsoft Microsoft Azure (Non REGN)		Microsoft		active	Metrics That Matters (MTM)	2025-06-10 05:01:14.479987
212a9799-e90f-4874-ac75-6044bc021686	Microsoft Excel SaaS Hosting	Microsoft Microsoft Excel SaaS Hosting		Microsoft		active	Microsoft Excel	2025-06-10 05:01:14.479987
6b0dd1fe-2bd7-470b-ab14-ed63e9daeeba	Microsoft Viva Glint SaaS Hosting	Microsoft Microsoft Viva Glint SaaS Hosting		Microsoft		active	Glint	2025-06-10 05:01:14.479987
6b99bc2c-f503-4d01-b247-7192d519b0a9	Office Excel	Microsoft Office Excel Standard 2016	Productivity / Spreadsheets	Microsoft		active		2025-06-10 05:01:14.479987
3919525d-d7e2-4657-91e9-bb0a5fed0d0c	OneNote SaaS Hosting	Microsoft OneNote SaaS Hosting		Microsoft		active	Microsoft OneNote	2025-06-10 05:01:14.479987
5d53f2ac-76d1-4093-9734-4c504b49bfc5	PowerBI	PowerBI				active	Acceleration Point;GD-IT Time Tracking Tool	2025-06-10 05:01:14.502941
f3f286ba-c1f2-4aab-95d7-fc1dce54f53a	Project Online Desktop Client SaaS Hosting	Microsoft Project Online Desktop Client SaaS Hosting		Microsoft		active	Microsoft Project	2025-06-10 05:01:14.479987
63d42905-27a6-40ab-808e-ee0f873ba4b5	SQL Server	Microsoft SQL Server 2016		Microsoft		active		2025-06-10 05:01:14.479987
773c451c-90e7-42ed-8210-3ba67f326830	SQL Server SaaS Hosting	Microsoft SQL Server SaaS Hosting	Database Management Systems (DBMS) / Relational Database	Microsoft		active	Datavision - iEnvision	2025-06-10 05:01:14.479987
130438d1-5b64-464e-9914-b35bd43587e2	Windows Server	Microsoft Windows Server 2016		Microsoft		active	PAS-X Manufacturing Execution System (MES) Rensselaer	2025-06-10 05:01:14.479987
60926e73-0472-44e0-8f70-f95321f14894	Milvus Vector DB	Milvus Vector DB				active		2025-06-10 05:01:14.479987
22376786-04db-4915-8ee3-c4a58c43437c	Mobile App	Mobile App				active	Journey Live;Maven Clinic Platform;Workday [Platform]	2025-06-10 05:01:14.479987
058ac9ff-348c-4861-a394-45e26f72df20	Modern Hire Application Hosting	Modern Hire Modern Hire Application Hosting		Modern Hire		active	Modern Hire	2025-06-10 05:01:14.479987
ce5228fb-d182-49e2-9275-9c14b19914ce	Momentive Application Hosting	Momentive Momentive Application Hosting		Momentive		active		2025-06-10 05:01:14.479987
ad7dba4a-60a0-447a-b3aa-781d6cbadc51	MyFamilyCare Application Hosting	MyFamilyCare MyFamilyCare Application Hosting		MyFamilyCare		active	My Family Care	2025-06-10 05:01:14.479987
cd777ab0-6e2d-4f68-8f6a-a3dea6b6f5c9	Nationwide Application Hosting	Nationwide Nationwide Application Hosting		Nationwide		active	Nationwide	2025-06-10 05:01:14.479987
c7a4d46c-81e4-49ff-aa6c-7e8dc32a0950	Network Share	Network Share				active		2025-06-10 05:01:14.479987
fb5cd08f-62ac-4cb9-8171-569265a4d246	Nexus IQ - release 178	Nexus IQ - release 178				active		2025-06-10 05:01:14.479987
4564a2c7-ca35-4fb3-9fc8-e5aa0b6606e1	Node JS	Node JS				active	Intelligent Sensor Data Platform	2025-06-10 05:01:14.479987
861c0712-fb85-46b2-881c-23fe2ca02a27	Noetix	Noetix				active		2025-06-10 05:01:14.479987
4340efb3-2bb7-47e5-ab54-41327bd3f38b	Norton Application Hosting	Norton Norton Application Hosting		Norton		active	LifeLock	2025-06-10 05:01:14.479987
ec34c92a-cecd-4bec-b8d2-cb3b52ce34ce	NPI Registry	NPI Registry				active		2025-06-10 05:01:14.479987
44aae65c-f1b0-4fd1-8b9b-ea4f9c2ba9a2	SSO	Okta SSO		Okta		active	3D Slicer for Imaging;ABAC Risk Center KYBP;Acceleration Point;Achievers;Acquia DAM;Additional Risk Minimization Measures;Alation;ALR (Automated Literature Review);Argus;Aroma;Avature;Axway;Beamery Talent CRM;BenefitSolver;Benevity ESR;Boomi;Compa Offers;Concur;ConvergeHealth SRP;CRF Annotation Interactive Automation;CVENT;DADS Intake;Databricks;Datavision - iEnvision;DeepL Translation Service;EdAssist;Educational Funding Management System (EFMS);Eversana Techsol;Firecrest;Flywheel.io;GD-IT Time Tracking Tool;Genesis Playbook;GPS-Veeva-Safety Document Management System;Graebel globalCONNECT;GTO Data Ingestion Forms;Head Count Tracker;HR4U [Platform] / HR Service Delivery (HR4U);Human Sample Request;Icertis;Informed Consent Form (ICF) Management;Intuition AE/PC LMS;J-Review Web;Jira BPM Projects;Knowledge Management;LeanIX;LinkedIn Recruiter;Master Data Management (MDM);Metrics That Matters (MTM);NCP;Planview Changepoint;PV Signal (SMART);Qualtrics;RAVE EDC;REGN Career Site;Scientific Communication Platform (SCP);Sedgwick;Simpleshow;Site Connect;Site Contact Information;Trial Summaries Portal;TriloDocs;Truveta Studio;Veeva Medical CRM Global;Veeva Medical CRM US;Veeva – MedComms;WCG Safety IAL Portal;WhatFix;Workday [Platform]	2025-06-10 05:01:14.479987
f41ebe06-9fee-418c-b172-9f2b20179458	Cookie Consent SaaS Hosting	OneTrust Cookie Consent SaaS Hosting		OneTrust		active	REGN Career Site	2025-06-10 05:01:14.479987
4296749b-ec2d-4952-8b9a-b90e18e6464d	OneTrust	OneTrust OneTrust		OneTrust		active	Clinical Trials Site - Corporate;Regeneron Medical Portal	2025-06-10 05:01:14.479987
527b89b6-ca2f-42dd-a630-cd9ec606663a	Optum Application Hosting	Optum Optum Application Hosting		Optum		active	OptumRX	2025-06-10 05:01:14.479987
d5ce2f6a-b910-42b2-8887-37c76ba4ea8a	Oracle Argus	Oracle Argus				active	Argus	2025-06-10 05:01:14.479987
442e3843-0740-4b20-83bd-a25df013593f	Concurrent Program	Oracle Concurrent Program		Oracle		active	EY Global Tax Platform 1.0	2025-06-10 05:01:14.479987
847e1540-b4b2-4205-b8a0-28770a18bea5	Data Integrator	Oracle Data Integrator Enterprise 11g	Storage Management / Storage Resource Management	Oracle		active		2025-06-10 05:01:14.479987
e1f9404f-f9a6-4dd0-8bd8-64231ed3e423	Data Integrator	Oracle Data Integrator Enterprise 12cR2 12.2.1	Storage Management / Storage Resource Management	Oracle		active	Enterprise Data Warehouse	2025-06-10 05:01:14.479987
c1b006fc-0baa-4fbc-84e6-bcab2373d5c1	Database	Oracle Database		Oracle		active		2025-06-10 05:01:14.479987
ac0fcee1-d8e1-49f6-b1c5-2598df27895f	Oracle eBs Database	Oracle eBs Database				active	Discoverant Raheen;Discoverant Rensselaer;Hubble;Markview 10.1;Vertex 4.4.7	2025-06-10 05:01:14.479987
9bd6cb05-1df1-4f93-8370-e8290748f240	JDBC Driver	Oracle JDBC Driver 21c.x	Utilities / Connectivity Tools	Oracle		active		2025-06-10 05:01:14.479987
3bc50811-b1dc-49f0-91a9-653f3b514d41	Oracle REST API	Oracle REST API				active		2025-06-10 05:01:14.479987
abd6f431-d32c-43d4-a2bc-970014d49348	SOA Suite	Oracle SOA Suite 12.1.x		Oracle		active		2025-06-10 05:01:14.479987
8b4cc938-2570-4611-af5f-4a95557a101e	Oracle Transport Agent	Oracle Transport Agent				active		2025-06-10 05:01:14.479987
4ab417a6-9e60-458c-b32d-cb03607f91a1	Oracle WebADI	Oracle WebADI				active		2025-06-10 05:01:14.479987
37adccd2-5f1c-4db4-afb1-f49cc1e63537	Oracle XML Gateway	Oracle XML Gateway				active		2025-06-10 05:01:14.479987
3266294c-90f2-4098-bd32-baae7ce4a315	Palo Alto Firewall	Palo Alto Firewall				active		2025-06-10 05:01:14.479987
fa65b3b1-2de6-435c-b8e5-fe567462a12b	Pana Application Hosting	Pana Pana Application Hosting		Pana		active	Pana	2025-06-10 05:01:14.479987
1d15532e-3e68-467a-9a24-6d010ba4fa3c	Parexel CTMS	Parexel CTMS				active		2025-06-10 05:01:14.479987
2f0bd35e-2a2f-4c53-990e-08cb688fcaa8	Partner / Subsidiary Systems (Webex, Zoom, portals, etc.)	Partner / Subsidiary Systems (Webex, Zoom, portals, etc.)				active		2025-06-10 05:01:14.479987
29703465-feae-45c0-bfe6-8c653b6f21b4	Patient Diaries	Patient Diaries				active		2025-06-10 05:01:14.479987
e259d1c3-dc57-4d45-9118-cbd7aaa56228	Application Hosting	Payscale Application Hosting		Payscale		active	PayFactors	2025-06-10 05:01:14.479987
97021566-ba97-470f-bf9a-26f57e5dcb68	Pendo.io SaaS Hosting	Pendo.io Pendo.io SaaS Hosting	Software Development	Pendo.io		active		2025-06-10 05:01:14.479987
52160b5a-a77b-4c50-87d2-9f41b78a5a2b	OCB	Peoplefluent OCB		Peoplefluent		active		2025-06-10 05:01:14.502941
8312e2ba-4311-4bea-96c7-f8a13d5f03ec	Perceptive	Perceptive				active		2025-06-10 05:01:14.502941
94b14043-fa76-4ebb-be2c-c0fbb712eccd	PGP	PGP				active		2025-06-10 05:01:14.502941
116a642a-88e4-4309-a21f-3ca75ac4a452	Phenom Application Hosting	Phenom Phenom Application Hosting		Phenom		active	Phenom	2025-06-10 05:01:14.502941
905e8cf9-9185-4621-a9d7-93a4021eb45f	SSO	Ping Federate SSO		Ping Federate		active	Hyland Onbase  [Platform] / Hyland Onbase EDM;Markview 10.1;TalentHub [Platform]	2025-06-10 05:01:14.502941
d03a21a0-39db-4635-a812-76952cdf520f	SSO	Ping One SSO		Ping One		active	Anaqua Annuities;AON;Audit Board;Beeline;CorePay;Costar;Glint;HireRight;iManage;LinkedIn Learning;Modern Hire;Oracle eBusiness Suite [Platform];PayFactors;Textio Flow;WebFilings (Workiva);Zycus [Platform]	2025-06-10 05:01:14.502941
840d429b-5fdc-4932-b864-d1688e9135a8	Changepoint PPM	Planview Changepoint PPM		Planview		active	Planview Changepoint	2025-06-10 05:01:14.502941
199aa921-e857-4620-ab49-f2e15d61f117	Changepoint SPM	Planview Changepoint SPM		Planview		active	Planview Changepoint	2025-06-10 05:01:14.502941
8f0f95f2-b6de-4432-92df-ad43338b7021	PostgreSQL	PostgreSQL				active	Informed Consent Form (ICF) Management;J-Review Web	2025-06-10 05:01:14.502941
6406a52f-9b57-4cb6-a72b-51271b41747a	Power Apps	Power Apps				active	Blueprint PWA;GD-IT Time Tracking Tool;Scientific Communication Platform (SCP)	2025-06-10 05:01:14.502941
a34603aa-aa63-4ddf-af17-ad9dd4262d40	Power Automate	Power Automate				active	GD-IT Time Tracking Tool;Scientific Communication Platform (SCP)	2025-06-10 05:01:14.502941
1d7d4934-3a7f-44a6-9a16-c3607fbeff9b	PPD Portal	PPD Portal				active		2025-06-10 05:01:14.502941
e905ea4b-d609-4a31-bc28-27e1f4a0ab36	PPD Study Report Generation Bot	PPD Study Report Generation Bot	Robotic Process Automation (RPA) (Bot)			active	Operational Data Lake	2025-06-10 05:01:14.502941
392d7cd2-56fd-41a4-a51a-d1eec5e46e29	PPD/IRT/ERT Report Integration to Data Lake Bot	PPD/IRT/ERT Report Integration to Data Lake Bot	Robotic Process Automation (RPA) (Bot)			active	Calyx IRT/RTSM;Clario ERT;Operational Data Lake	2025-06-10 05:01:14.502941
9a70f201-68c4-4015-b9ef-f17e9f65439d	Precision Medicine  SMG Data Transfer and Standardization Bot	Precision Medicine  SMG Data Transfer and Standardization Bot	Robotic Process Automation (RPA) (Bot)			active		2025-06-10 05:01:14.502941
2d782fc6-070a-46ff-a97a-2dd3468b2eac	Tempus Resource SaaS Hosting	ProSymmetry Tempus Resource SaaS Hosting		ProSymmetry		active	Tempus Resource	2025-06-10 05:01:14.502941
c5425caf-6cc5-4458-8a4c-eac70a67dd55	ProUnlimited Application Hosting	ProUnlimited ProUnlimited Application Hosting		ProUnlimited		active	Wand	2025-06-10 05:01:14.502941
983dfe74-70d1-459f-b6c4-f09b7eb464a5	Punch Out Level 1	Punch Out Level 1				active		2025-06-10 05:01:14.502941
80d0e06c-c0d2-41d1-b170-27b82c3e1052	QA/QE Notificaitons Phase 1 Bot	QA/QE Notificaitons Phase 1 Bot	Robotic Process Automation (RPA) (Bot)			active	Veeva - QMOD	2025-06-10 05:01:14.502941
96a415e9-35e1-4cee-ab0b-fb339cec7e48	Qlik	Qlik				active		2025-06-10 05:01:14.502941
261b5335-8c3e-48f9-bdd2-bbd1e64f2439	QMOD CAPA Notifications Bot	QMOD CAPA Notifications Bot	Robotic Process Automation (RPA) (Bot)			active	Veeva - QMOD	2025-06-10 05:01:14.502941
d2eb318a-2869-4b81-99a4-cb9e7f466277	whatfix SaaS Hosting	Quicko Technosoft Labs whatfix SaaS Hosting		Quicko Technosoft Labs		active	WhatFix	2025-06-10 05:01:14.502941
18c80cc4-6bc3-45af-bae0-e1bae540ecd2	R Software	R Foundation R Software 3.6		R Foundation		active	GDS Big Data Initiative (BDI)	2025-06-10 05:01:14.502941
6a87a7f2-35f1-4861-b6a2-fd09627dabc7	Mediverse Mobile App	RafterOne (Docmation) Mediverse Mobile App		RafterOne (Docmation)		active	Regeneron Medical Portal	2025-06-10 05:01:14.502941
b4ce35d9-81c4-4fc9-b22a-26faa649e3a4	RDS MySQL	RDS MySQL				active	ALR (Automated Literature Review)	2025-06-10 05:01:14.502941
d4eb6e34-b665-46bd-b4be-2f49aef7b9e2	RegionalHelpWanted Application Hosting	RegionalHelpWanted RegionalHelpWanted Application Hosting		RegionalHelpWanted		active		2025-06-10 05:01:14.502941
78e71517-8370-466d-bf6c-e373b4b7e1fd	REGN SFTP (Not AWS)	REGN SFTP (Not AWS)				active		2025-06-10 05:01:14.502941
aaaec934-cbac-421b-963b-f7f38eee71c0	Resource Management Onboarding Bot	Resource Management Onboarding Bot	Robotic Process Automation (RPA) (Bot)			active		2025-06-10 05:01:14.502941
499613a7-3e71-4e7f-bec0-4e38acf8d952	Resource Management Separation Bot	Resource Management Separation Bot	Robotic Process Automation (RPA) (Bot)			active		2025-06-10 05:01:14.502941
b0a9e5d8-204e-4302-8203-03efff430d0f	Hosting	Reval Hosting		Reval		active		2025-06-10 05:01:14.502941
fb44b616-97f6-48a9-ad03-a8b40f516cb4	FactoryTalk AssetCentre Server	Rockwell Automation FactoryTalk AssetCentre Server 8.0		Rockwell Automation		active		2025-06-10 05:01:14.502941
6045250c-2acc-405a-874a-7fc1fe8aad31	Rstudio Shiny	Rstudio Shiny				active	MAGNATron	2025-06-10 05:01:14.502941
e39c129c-c8fe-4ac5-9bfe-696fb4d93d04	RxLogix PV	RxLogix PV				active	RxLogix - PVIT	2025-06-10 05:01:14.502941
d63c80f0-058b-4e1f-867b-5885d7093580	Salesforce	Salesforce				active	Clinical Trials Site - Corporate	2025-06-10 05:01:14.502941
60781669-1ca5-4af0-b259-5ee0c4b89a82	Salesforce Experience Cloud	Salesforce Experience Cloud				active		2025-06-10 05:01:14.502941
c3b2badf-2b47-482a-b214-4ec9d4f5b7a5	Sanofi Med Info Platform	Sanofi Med Info Platform				active		2025-06-10 05:01:14.502941
abf564f4-6b95-4fb6-b809-59c2631616e4	ViaOne SaaS Hosting	Sedgwick ViaOne SaaS Hosting		Sedgwick		active		2025-06-10 05:01:14.502941
23dd295e-9ad4-4f93-9355-05cfa0d554bd	Sender Authentication	Sender Authentication				active	Beamery Talent CRM	2025-06-10 05:01:14.502941
87963dc0-d427-42fb-a204-a5ed3aa77bfa	Hosting	Serengeti Hosting		Serengeti		active		2025-06-10 05:01:14.502941
0985247a-dcc7-45f3-a939-837ada612245	Sermo	Sermo				active		2025-06-10 05:01:14.502941
e18a2181-ac4c-4db1-a099-5bc7c0505a3a	Application Hosting	ServiceNow Application Hosting		ServiceNow		active	HR4U [Platform] / HR Service Delivery (HR4U)	2025-06-10 05:01:14.502941
33a228b1-d392-47a0-9cc3-ad0a907c3d15	ServiceNow ITSM	ServiceNow ServiceNow ITSM		ServiceNow		active	REGN IT Global Support Center	2025-06-10 05:01:14.502941
04f244f8-932c-4bcf-a2fa-ff13ed66aff4	SFDC (Vendor)	SFDC (Vendor)				active	Educational Funding Management System (EFMS)	2025-06-10 05:01:14.502941
674acbce-7930-4f1b-ad93-3ec3172b3b6e	Sharepoint	Sharepoint				active	GD-IT Time Tracking Tool;Scientific Communication Platform (SCP)	2025-06-10 05:01:14.502941
987fb39a-12ae-42ed-8ab0-066e94c9119a	Site Device Data	Site Device Data				active		2025-06-10 05:01:14.502941
72c0d92b-551d-41db-a8cd-e606639376ea	Site Feasibility Questionnaire Information Bot	Site Feasibility Questionnaire Information Bot	Robotic Process Automation (RPA) (Bot)			active	Operational Data Lake;WCG Safety IAL Portal	2025-06-10 05:01:14.502941
39f0b49c-ea1e-4168-9d99-e3993377d52b	SkillSurvey Application Hosting	SkillSurvey SkillSurvey Application Hosting		SkillSurvey		active	SkillSurvey	2025-06-10 05:01:14.502941
2a21ef8d-acf8-4e74-a7b0-7215a44a878b	Smart Signals	Smart Signals				active		2025-06-10 05:01:14.502941
f432184c-9c3a-4404-ae39-207be024c18b	SMB Client	SMB Client				active		2025-06-10 05:01:14.502941
17edfb8e-e652-478b-9ae0-7010337a8901	SOAP/XML	SOAP/XML				active		2025-06-10 05:01:14.527536
fd4d4948-450a-4560-8898-0d2451b8a8a6	SonarQube	SonarSource SonarQube 9.9.x		SonarSource		active		2025-06-10 05:01:14.527536
f0a70bce-7c3d-4c16-be93-5c2e6eb57dbf	Sparc Application Hosting	Sparc Sparc Application Hosting		Sparc		active	Sparc-Amplify	2025-06-10 05:01:14.527536
eb0499ca-fec6-4f53-867e-296d9ba34a9b	Specialty Labs	Specialty Labs				active		2025-06-10 05:01:14.527536
1c644191-c3b5-4d1b-aa1a-1cdc0a3a5cd8	SSH	SSH				active		2025-06-10 05:01:14.527536
dfd670ca-76e4-4384-8c8c-0d8fcd9fbf3e	Standard Enterprise Tools	Standard Enterprise Tools				active		2025-06-10 05:01:14.527536
a4a32cfb-600e-4785-9ef7-e79ba866525f	Stateless EJBs	Stateless EJBs				active	Datavision - iEnvision	2025-06-10 05:01:14.527536
c04bd243-3822-4b55-83cc-cd7b877d55f2	Strapi -v4.22.1\tContent Management	Strapi -v4.22.1\tContent Management				active		2025-06-10 05:01:14.527536
892a467f-2a00-48c6-b020-784ac081b9db	Application Hosting	Sumtotal Application Hosting		Sumtotal		active	TalentHub [Platform]	2025-06-10 05:01:14.527536
9c2a8cc7-503e-4d9d-bb9f-fa045fb18126	Syneos CTMS	Syneos CTMS				active		2025-06-10 05:01:14.527536
f70e51f2-612a-4483-b9d1-2ccfbfaeb5da	Target Entity Services	Target Entity Services				active		2025-06-10 05:01:14.527536
bb0a81dc-62d1-4013-802a-ecfbeb39c823	TE Excursion Bot	TE Excursion Bot	Robotic Process Automation (RPA) (Bot)			active	ASIST;Sharepoint;Veeva - CTMS	2025-06-10 05:01:14.527536
ca174ab0-830a-4f59-b4aa-258f3b70fcd6	Tealbook SaaS Hosting	Tealbook Tealbook SaaS Hosting		Tealbook		active	Tealbook	2025-06-10 05:01:14.527536
e94b5059-9a3f-4ef6-82b1-365c225db0ec	Techsol Call Center	Techsol Call Center				active	Eversana Techsol	2025-06-10 05:01:14.527536
94e0220f-307f-48f3-9157-f48d9370a1a7	Chrome Extension	Textio Chrome Extension		Textio		active	Textio Flow	2025-06-10 05:01:14.527536
d81005ba-b5fa-4fd1-8893-81bd6b1d8691	Outlook Plugin	Textio Outlook Plugin		Textio		active	Textio Flow	2025-06-10 05:01:14.527536
3b4cba91-75c0-4358-b77a-e342923266a3	Textio Application Hosting	Textio Textio Application Hosting		Textio		active	Textio Flow	2025-06-10 05:01:14.527536
f8acb1b4-1795-49ed-afb2-024eac583c42	Textio SaaS Hosting	Textio Textio SaaS Hosting		Textio		active	Textio Flow	2025-06-10 05:01:14.527536
1b5fe907-d4c3-4a2e-93fa-a90e6068c300	Access Workspace SaaS Hosting	The Access Group Access Workspace SaaS Hosting		The Access Group		active	Access Workspace	2025-06-10 05:01:14.527536
b90f786e-39be-462a-8d99-dbc3b16d0953	Third Party Vendor Lab Data	Third Party Vendor Lab Data				active		2025-06-10 05:01:14.527536
b7cfb941-94b4-4e49-9c5a-d4d88b897ed5	McAfee+ SaaS Hosting	Trellix / McAfee McAfee+ SaaS Hosting		Trellix / McAfee		active	McAfee+	2025-06-10 05:01:14.527536
dd30e1cf-5508-4a20-8680-eadff7e0d78e	TriRiga API	TriRiga API				active		2025-06-10 05:01:14.527536
25678261-5889-4acd-b3a7-c70ab1de32fc	Hosting	TriRiga Hosting		TriRiga		active		2025-06-10 05:01:14.527536
7f493a22-120b-4d9c-ad5c-c26b28303a91	Capture	Tungsten Automation Capture 11.0.x	Enterprise Content Management (ECM) / Document Capturing and Imaging	Tungsten Automation		active		2025-06-10 05:01:14.527536
942c37ca-aa00-49b0-a86f-6bedc1c87e3a	Transformation Modules	Tungsten Automation Transformation Modules 6.3.x	Enterprise Content Management (ECM) / Document and Records Management	Tungsten Automation		active		2025-06-10 05:01:14.527536
283e55d8-a13f-4e48-b985-ebb8e89c07e0	UiPath	UiPath				active		2025-06-10 05:01:14.527536
9ddf6f3c-fcf5-4144-8d24-c8d8064d183a	Veeva / Salesforce	Veeva / Salesforce				active	Veeva Medical CRM Global;Veeva Medical CRM US	2025-06-10 05:01:14.527536
10627315-e584-4e9f-8adc-7d72eec1daab	Veeva MedComms	Veeva MedComms				active	Veeva – MedComms	2025-06-10 05:01:14.527536
36cc7425-d943-4db2-966c-656896f4aad7	Vendor CIOMS	Vendor CIOMS				active		2025-06-10 05:01:14.527536
6b2e1258-5043-45e8-b408-00ae41858535	Vendor SFTP	Vendor SFTP				active		2025-06-10 05:01:14.527536
a04250a3-e2bd-4fe5-964d-f2feeb9ffabf	Vendor/Partner Safety Databases (Sanofi, Bayer, etc.)	Vendor/Partner Safety Databases (Sanofi, Bayer, etc.)				active		2025-06-10 05:01:14.527536
2dccfe0c-5cab-48b9-b03f-14c472cf2ecf	VHI Application Hosting	VHI VHI Application Hosting		VHI		active	MyVHI	2025-06-10 05:01:14.527536
08cf5458-6623-4200-991e-f1a9602f3d26	Vimeo SaaS Hosting	Vimeo Vimeo SaaS Hosting		Vimeo		active	Vimeo	2025-06-10 05:01:14.527536
c02089bd-172f-40bf-9d6b-e4f64aa21d56	TARORGPUBAPP01P	VMWare TARORGPUBAPP01P		VMWare		active	Who's Who (OrgPublisher)	2025-06-10 05:01:14.527536
d48aa5be-ada4-4dfa-ae57-dba266eda420	VSP Vision Application Hosting	VSP Vision VSP Vision Application Hosting		VSP Vision		active	VSP Vision	2025-06-10 05:01:14.527536
26054846-2554-4a20-af97-b40f6287b443	WageWorks Application Hosting	WageWorks WageWorks Application Hosting		WageWorks		active	WageWorks	2025-06-10 05:01:14.527536
44687a99-1ecc-407b-adc1-9cbdaa137a1a	WCG Safety Portal	WCG Safety Portal				active	WCG Safety IAL Portal	2025-06-10 05:01:14.527536
6dd41505-53d7-4198-a875-302728d0a51e	Application Hosting	Weichert Application Hosting		Weichert		active	Weichert	2025-06-10 05:01:14.527536
2501cb6c-e20d-4776-8a09-33139af10eee	Application Hosting	Workday Application Hosting		Workday		active	Workday [Platform]	2025-06-10 05:01:14.527536
78314c99-9602-4577-8ba6-d2c83459a042	Workday Cloud Integration	Workday Cloud Integration				active		2025-06-10 05:01:14.527536
9b61b701-f7d5-4738-a855-2e4b739f596f	Workday Connector	Workday Connector				active		2025-06-10 05:01:14.527536
be5a173d-18f1-46ca-8adb-8d7f8d3da6bd	Core Connector - Worker	Workday Core Connector - Worker		Workday		active		2025-06-10 05:01:14.527536
cc8dc4e5-71ac-4a7e-9ef8-87040d4cd28d	Document Transformation	Workday Document Transformation		Workday		active		2025-06-10 05:01:14.527536
e6f6bd4f-b1f2-450a-bf4e-994fac193067	EIB	Workday EIB		Workday		active		2025-06-10 05:01:14.527536
35ea944c-fced-4b80-b3ce-c06945698415	Help SaaS Hosting	Workday Help SaaS Hosting		Workday		active	Workday [Platform]	2025-06-10 05:01:14.527536
6afca9a4-b32c-4050-83a6-e31974fb5ca0	PICOF	Workday PICOF		Workday		active		2025-06-10 05:01:14.527536
21df676f-03f1-42a4-b2d5-cb2ebf99d171	RaaS	Workday RaaS		Workday		active		2025-06-10 05:01:14.527536
16cce10d-8079-4155-b393-f1ace48161fb	Workday Report	Workday Report				active		2025-06-10 05:01:14.527536
1b9cb730-21f0-403d-9d66-2270aa605737	Studio	Workday Studio		Workday		active		2025-06-10 05:01:14.527536
5791c0e1-f6ed-4758-b3d7-39b02e6e7b0b	Web Service	Workday Web Service		Workday		active		2025-06-10 05:01:14.527536
665b0bb5-dfd1-4633-8069-d41fc6720222	XML	XML				active		2025-06-10 05:01:14.54755
b0019913-b7a0-47b9-95c1-0377cf0daa11	YPrime	YPrime				active		2025-06-10 05:01:14.54755
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.users (id, username, password) FROM stdin;
\.


--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE SET; Schema: drizzle; Owner: neondb_owner
--

SELECT pg_catalog.setval('drizzle.__drizzle_migrations_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.users_id_seq', 1, false);


--
-- Name: __drizzle_migrations __drizzle_migrations_pkey; Type: CONSTRAINT; Schema: drizzle; Owner: neondb_owner
--

ALTER TABLE ONLY drizzle.__drizzle_migrations
    ADD CONSTRAINT __drizzle_migrations_pkey PRIMARY KEY (id);


--
-- Name: applications applications_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_pkey PRIMARY KEY (id);


--
-- Name: business_capabilities business_capabilities_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.business_capabilities
    ADD CONSTRAINT business_capabilities_pkey PRIMARY KEY (id);


--
-- Name: data_objects data_objects_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.data_objects
    ADD CONSTRAINT data_objects_pkey PRIMARY KEY (id);


--
-- Name: initiatives initiatives_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.initiatives
    ADD CONSTRAINT initiatives_pkey PRIMARY KEY (id);


--
-- Name: interfaces interfaces_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.interfaces
    ADD CONSTRAINT interfaces_pkey PRIMARY KEY (id);


--
-- Name: it_components it_components_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.it_components
    ADD CONSTRAINT it_components_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_unique UNIQUE (username);


--
-- Name: business_capabilities business_capabilities_parent_id_business_capabilities_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.business_capabilities
    ADD CONSTRAINT business_capabilities_parent_id_business_capabilities_id_fk FOREIGN KEY (parent_id) REFERENCES public.business_capabilities(id);


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

