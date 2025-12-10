--
-- PostgreSQL database dump
--

-- Dumped from database version 16.11 (Ubuntu 16.11-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 17.0

-- Started on 2025-12-10 17:20:40

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

DROP DATABASE taxisrilanka_prod_db;
--
-- TOC entry 3500 (class 1262 OID 16388)
-- Name: taxisrilanka_prod_db; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE taxisrilanka_prod_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.UTF-8';


ALTER DATABASE taxisrilanka_prod_db OWNER TO postgres;

\connect taxisrilanka_prod_db

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
-- TOC entry 215 (class 1259 OID 16390)
-- Name: admin_users; Type: TABLE; Schema: public; Owner: taxisrilanka_user
--

CREATE TABLE public.admin_users (
    id integer NOT NULL,
    username character varying(100) NOT NULL,
    password_hash character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    full_name character varying(255),
    is_active boolean DEFAULT true,
    last_login timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.admin_users OWNER TO taxisrilanka_user;

--
-- TOC entry 216 (class 1259 OID 16398)
-- Name: admin_users_id_seq; Type: SEQUENCE; Schema: public; Owner: taxisrilanka_user
--

CREATE SEQUENCE public.admin_users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.admin_users_id_seq OWNER TO taxisrilanka_user;

--
-- TOC entry 3503 (class 0 OID 0)
-- Dependencies: 216
-- Name: admin_users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: taxisrilanka_user
--

ALTER SEQUENCE public.admin_users_id_seq OWNED BY public.admin_users.id;


--
-- TOC entry 217 (class 1259 OID 16399)
-- Name: bookings; Type: TABLE; Schema: public; Owner: taxisrilanka_user
--

CREATE TABLE public.bookings (
    id integer NOT NULL,
    booking_reference character varying(50) NOT NULL,
    vehicle_id integer NOT NULL,
    full_name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    phone character varying(20) NOT NULL,
    pickup_location character varying(500) NOT NULL,
    dropoff_location character varying(500) NOT NULL,
    pickup_date date NOT NULL,
    pickup_time time without time zone NOT NULL,
    estimated_distance_km numeric(10,2) NOT NULL,
    total_price numeric(10,2) NOT NULL,
    special_requests text,
    status character varying(20) DEFAULT 'pending'::character varying,
    payment_status character varying(20) DEFAULT 'unpaid'::character varying,
    payment_method character varying(50),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT bookings_payment_status_check CHECK (((payment_status)::text = ANY (ARRAY[('unpaid'::character varying)::text, ('paid'::character varying)::text, ('refunded'::character varying)::text]))),
    CONSTRAINT bookings_status_check CHECK (((status)::text = ANY (ARRAY[('pending'::character varying)::text, ('confirmed'::character varying)::text, ('completed'::character varying)::text, ('cancelled'::character varying)::text])))
);


ALTER TABLE public.bookings OWNER TO taxisrilanka_user;

--
-- TOC entry 3504 (class 0 OID 0)
-- Dependencies: 217
-- Name: TABLE bookings; Type: COMMENT; Schema: public; Owner: taxisrilanka_user
--

COMMENT ON TABLE public.bookings IS 'Customer taxi booking records';


--
-- TOC entry 3505 (class 0 OID 0)
-- Dependencies: 217
-- Name: COLUMN bookings.estimated_distance_km; Type: COMMENT; Schema: public; Owner: taxisrilanka_user
--

COMMENT ON COLUMN public.bookings.estimated_distance_km IS 'Estimated distance in kilometers for the trip';


--
-- TOC entry 3506 (class 0 OID 0)
-- Dependencies: 217
-- Name: COLUMN bookings.total_price; Type: COMMENT; Schema: public; Owner: taxisrilanka_user
--

COMMENT ON COLUMN public.bookings.total_price IS 'Same as distance_price (no base price anymore)';


--
-- TOC entry 3507 (class 0 OID 0)
-- Dependencies: 217
-- Name: COLUMN bookings.status; Type: COMMENT; Schema: public; Owner: taxisrilanka_user
--

COMMENT ON COLUMN public.bookings.status IS 'Booking status: pending, confirmed, completed, cancelled';


--
-- TOC entry 3508 (class 0 OID 0)
-- Dependencies: 217
-- Name: COLUMN bookings.payment_status; Type: COMMENT; Schema: public; Owner: taxisrilanka_user
--

COMMENT ON COLUMN public.bookings.payment_status IS 'Payment status: unpaid, paid, refunded';


--
-- TOC entry 218 (class 1259 OID 16410)
-- Name: bookings_id_seq; Type: SEQUENCE; Schema: public; Owner: taxisrilanka_user
--

CREATE SEQUENCE public.bookings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.bookings_id_seq OWNER TO taxisrilanka_user;

--
-- TOC entry 3509 (class 0 OID 0)
-- Dependencies: 218
-- Name: bookings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: taxisrilanka_user
--

ALTER SEQUENCE public.bookings_id_seq OWNED BY public.bookings.id;


--
-- TOC entry 219 (class 1259 OID 16411)
-- Name: payments; Type: TABLE; Schema: public; Owner: taxisrilanka_user
--

CREATE TABLE public.payments (
    id integer NOT NULL,
    booking_id integer NOT NULL,
    onepay_transaction_id character varying(100),
    reference_number character varying(100) NOT NULL,
    amount numeric(10,2) NOT NULL,
    currency character varying(10) DEFAULT 'LKR'::character varying,
    status character varying(20) DEFAULT 'pending'::character varying,
    payment_method character varying(50),
    redirect_url text,
    callback_data jsonb,
    paid_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT payments_status_check CHECK (((status)::text = ANY (ARRAY[('pending'::character varying)::text, ('processing'::character varying)::text, ('completed'::character varying)::text, ('failed'::character varying)::text, ('refunded'::character varying)::text])))
);


ALTER TABLE public.payments OWNER TO taxisrilanka_user;

--
-- TOC entry 3510 (class 0 OID 0)
-- Dependencies: 219
-- Name: TABLE payments; Type: COMMENT; Schema: public; Owner: taxisrilanka_user
--

COMMENT ON TABLE public.payments IS 'Payment transaction records for bookings';


--
-- TOC entry 220 (class 1259 OID 16421)
-- Name: payments_id_seq; Type: SEQUENCE; Schema: public; Owner: taxisrilanka_user
--

CREATE SEQUENCE public.payments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payments_id_seq OWNER TO taxisrilanka_user;

--
-- TOC entry 3511 (class 0 OID 0)
-- Dependencies: 220
-- Name: payments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: taxisrilanka_user
--

ALTER SEQUENCE public.payments_id_seq OWNED BY public.payments.id;


--
-- TOC entry 221 (class 1259 OID 16422)
-- Name: taxi_packages; Type: TABLE; Schema: public; Owner: taxisrilanka_user
--

CREATE TABLE public.taxi_packages (
    id integer NOT NULL,
    package_name character varying(255) NOT NULL,
    package_code character varying(50) NOT NULL,
    description text,
    category character varying(50) NOT NULL,
    base_price numeric(10,2) NOT NULL,
    price_per_km numeric(10,2) NOT NULL,
    included_km integer DEFAULT 0,
    max_passengers integer NOT NULL,
    duration_hours integer NOT NULL,
    features jsonb DEFAULT '[]'::jsonb,
    vehicle_types jsonb DEFAULT '[]'::jsonb,
    popular boolean DEFAULT false,
    is_active boolean DEFAULT true,
    image character varying(500),
    terms_conditions text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.taxi_packages OWNER TO taxisrilanka_user;

--
-- TOC entry 222 (class 1259 OID 16434)
-- Name: taxi_packages_id_seq; Type: SEQUENCE; Schema: public; Owner: taxisrilanka_user
--

CREATE SEQUENCE public.taxi_packages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.taxi_packages_id_seq OWNER TO taxisrilanka_user;

--
-- TOC entry 3512 (class 0 OID 0)
-- Dependencies: 222
-- Name: taxi_packages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: taxisrilanka_user
--

ALTER SEQUENCE public.taxi_packages_id_seq OWNED BY public.taxi_packages.id;


--
-- TOC entry 223 (class 1259 OID 16435)
-- Name: vehicles; Type: TABLE; Schema: public; Owner: taxisrilanka_user
--

CREATE TABLE public.vehicles (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    category character varying(50) NOT NULL,
    price_per_km numeric(10,2) NOT NULL,
    image text,
    seats integer NOT NULL,
    luggage integer NOT NULL,
    rating numeric(3,2) DEFAULT 0,
    reviews integer DEFAULT 0,
    features jsonb DEFAULT '[]'::jsonb,
    description text,
    is_available boolean DEFAULT true,
    fuel_type character varying(50),
    transmission character varying(50),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.vehicles OWNER TO taxisrilanka_user;

--
-- TOC entry 224 (class 1259 OID 16446)
-- Name: vehicles_id_seq; Type: SEQUENCE; Schema: public; Owner: taxisrilanka_user
--

CREATE SEQUENCE public.vehicles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vehicles_id_seq OWNER TO taxisrilanka_user;

--
-- TOC entry 3513 (class 0 OID 0)
-- Dependencies: 224
-- Name: vehicles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: taxisrilanka_user
--

ALTER SEQUENCE public.vehicles_id_seq OWNED BY public.vehicles.id;


--
-- TOC entry 3269 (class 2604 OID 16447)
-- Name: admin_users id; Type: DEFAULT; Schema: public; Owner: taxisrilanka_user
--

ALTER TABLE ONLY public.admin_users ALTER COLUMN id SET DEFAULT nextval('public.admin_users_id_seq'::regclass);


--
-- TOC entry 3273 (class 2604 OID 16448)
-- Name: bookings id; Type: DEFAULT; Schema: public; Owner: taxisrilanka_user
--

ALTER TABLE ONLY public.bookings ALTER COLUMN id SET DEFAULT nextval('public.bookings_id_seq'::regclass);


--
-- TOC entry 3278 (class 2604 OID 16449)
-- Name: payments id; Type: DEFAULT; Schema: public; Owner: taxisrilanka_user
--

ALTER TABLE ONLY public.payments ALTER COLUMN id SET DEFAULT nextval('public.payments_id_seq'::regclass);


--
-- TOC entry 3283 (class 2604 OID 16450)
-- Name: taxi_packages id; Type: DEFAULT; Schema: public; Owner: taxisrilanka_user
--

ALTER TABLE ONLY public.taxi_packages ALTER COLUMN id SET DEFAULT nextval('public.taxi_packages_id_seq'::regclass);


--
-- TOC entry 3291 (class 2604 OID 16451)
-- Name: vehicles id; Type: DEFAULT; Schema: public; Owner: taxisrilanka_user
--

ALTER TABLE ONLY public.vehicles ALTER COLUMN id SET DEFAULT nextval('public.vehicles_id_seq'::regclass);


--
-- TOC entry 3485 (class 0 OID 16390)
-- Dependencies: 215
-- Data for Name: admin_users; Type: TABLE DATA; Schema: public; Owner: taxisrilanka_user
--

INSERT INTO public.admin_users VALUES (4, 'admin', '$2b$10$.HbWKQnRbYxZMwFbV0ANCeHdiYn8Qw8OJtX6UrevJ.AVL7gI7mwNC', 'admin@taxipickme.com', 'System Administrator', true, '2025-12-01 17:20:57.20292', '2025-11-30 14:27:55.272556', '2025-11-30 14:27:55.272556');


--
-- TOC entry 3487 (class 0 OID 16399)
-- Dependencies: 217
-- Data for Name: bookings; Type: TABLE DATA; Schema: public; Owner: taxisrilanka_user
--

INSERT INTO public.bookings VALUES (7, 'TPM-20251201112409-R6FY5O', 7, 'Kanchana Kalansooriya', 'kanchana.20212055@iit.ac.lk', '+94760570695', 'Hikkaduwa Beach, Sri Lanka', 'Galle, Sri Lanka', '2025-12-25', '19:12:00', 18.49, 1849.00, NULL, 'pending', 'unpaid', NULL, '2025-12-01 16:54:09.215237', '2025-12-01 16:54:09.215237');
INSERT INTO public.bookings VALUES (8, 'TPM-20251201113800-VJWUIW', 7, 'Kanchana Kalansooriya', 'kanchana.20212055@iit.ac.lk', '+94760570695', 'Hikkaduwa Beach, Sri Lanka', 'Galle, Sri Lanka', '2025-12-25', '19:12:00', 18.49, 1849.00, NULL, 'pending', 'unpaid', NULL, '2025-12-01 17:08:00.54404', '2025-12-01 17:08:00.54404');
INSERT INTO public.bookings VALUES (9, 'TPM-20251201122751-QUPQ32', 7, 'Kanchana Kalansooriya', 'kanchana.20212055@iit.ac.lk', '+94760570695', 'Galle Face, Colombo, Sri Lanka', '2 Sir Chittampalam A Gardiner Mawatha, කොළඹ 00200, Sri Lanka', '2025-12-02', '08:00:00', 1.74, 174.00, NULL, 'confirmed', 'paid', NULL, '2025-12-01 17:57:51.596328', '2025-12-01 18:33:42.067676');
INSERT INTO public.bookings VALUES (10, 'TPM-20251210065753-ZA3SY2', 7, 'upul', 'customer@email.com', '+94760570695', 'Galle Dutch Fort, Galle 80000, Sri Lanka', 'Dehiwala, Dehiwala-Mount Lavinia, Sri Lanka', '2025-12-19', '13:30:00', 114.60, 11460.00, NULL, 'pending', 'unpaid', NULL, '2025-12-10 06:57:53.933533', '2025-12-10 06:57:53.933533');
INSERT INTO public.bookings VALUES (11, 'TPM-20251210092251-SWAFZW', 7, 'Dinayadura Shaleel Sandeepa', 'shaleelsandeepa7@gmail.com', '0770612128', 'Battaramulla, Sri Lanka', 'Colombo 03, Colombo, Sri Lanka', '2025-12-10', '16:25:00', 9.45, 945.00, NULL, 'pending', 'unpaid', NULL, '2025-12-10 09:22:51.486293', '2025-12-10 09:22:51.486293');


--
-- TOC entry 3489 (class 0 OID 16411)
-- Dependencies: 219
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: taxisrilanka_user
--

INSERT INTO public.payments VALUES (1, 10, '1WWZ1190AC04FA6B39F50', 'TPM-1765349876015-10', 11460.00, 'LKR', 'pending', 'onepay', 'https://payment.onepay.lk/redirect/AEBH1189D03D695DFB767/1WWZ1190AC04FA6B39F50/AEBH1189D03D695DFB767', NULL, NULL, '2025-12-10 06:57:56.803083', '2025-12-10 06:57:56.803083');
INSERT INTO public.payments VALUES (2, 11, 'SGG31190AC054E6AFA2FD', 'TPM-1765358584008-11', 945.00, 'LKR', 'pending', 'onepay', 'https://payment.onepay.lk/redirect/AEBH1189D03D695DFB767/SGG31190AC054E6AFA2FD/AEBH1189D03D695DFB767', NULL, NULL, '2025-12-10 09:23:05.092563', '2025-12-10 09:23:05.092563');


--
-- TOC entry 3491 (class 0 OID 16422)
-- Dependencies: 221
-- Data for Name: taxi_packages; Type: TABLE DATA; Schema: public; Owner: taxisrilanka_user
--

INSERT INTO public.taxi_packages VALUES (2, 'Airport Transfer Premium', 'PKG-AIRPORT-PREM', 'Luxury airport pickup and drop service', 'luxury', 5000.00, 75.00, 30, 3, 2, '["Meet & Greet", "Luggage Assistance", "Water Bottles", "WiFi", "Child Seat Available"]', '[]', true, true, '/images/packages/airport-premium.jpg', NULL, '2025-11-30 01:17:49.826011', '2025-11-30 17:31:57.025435');
INSERT INTO public.taxi_packages VALUES (1, 'City Tour - Half Day', 'PKG-CITY-HALF', 'Perfect for exploring the city within 4 hours', 'economy', 3500.00, 50.00, 50, 4, 4, '["Air Conditioning", "Professional Driver", "Fuel Included", "City Guide"]', '[]', true, true, '/images/packages/city-tour.jpg', NULL, '2025-11-30 01:17:49.826011', '2025-11-30 17:31:58.876316');
INSERT INTO public.taxi_packages VALUES (3, 'Full Day Rental', 'PKG-FULLDAY-STD', 'Rent a taxi for the entire day - 8 hours', 'standard', 6500.00, 45.00, 100, 4, 8, '["Air Conditioning", "Professional Driver", "Fuel Included", "Flexible Routes"]', '[]', true, true, '/images/packages/full-day.jpg', NULL, '2025-11-30 01:17:49.826011', '2025-11-30 17:32:09.218063');


--
-- TOC entry 3493 (class 0 OID 16435)
-- Dependencies: 223
-- Data for Name: vehicles; Type: TABLE DATA; Schema: public; Owner: taxisrilanka_user
--

INSERT INTO public.vehicles VALUES (3, 'Toyota Hiace', 'Van', 250.00, '/images/vehicles/Toyota Hiace.png', 12, 6, 4.90, 312, '["Air Conditioning", "GPS", "USB Charging", "Extra Legroom"]', 'Large van perfect for group travel', true, 'Diesel', 'Manual', '2025-11-21 12:44:15.084018', '2025-11-21 12:44:15.084018');
INSERT INTO public.vehicles VALUES (8, 'Toyota KDH Van', 'Van', 280.00, '/images/vehicles/Toyota KDH Van.jpg', 14, 8, 4.80, 289, '["Air Conditioning", "GPS", "Reclining Seats", "USB Charging"]', 'Premium van for large groups', true, 'Diesel', 'Manual', '2025-11-21 12:44:15.084018', '2025-11-21 12:44:15.084018');
INSERT INTO public.vehicles VALUES (5, 'Mercedes-Benz E-Class', 'Luxury', 400.00, '/images/vehicles/Mercedes-Benz E-Class.jpg', 4, 3, 5.00, 428, '["Air Conditioning", "GPS", "Leather Seats", "Premium Sound", "Massage Seats"]', 'Luxury sedan with premium comfort', false, 'Petrol', 'Automatic', '2025-11-21 12:44:15.084018', '2025-12-01 18:39:17.26619');
INSERT INTO public.vehicles VALUES (4, 'Nissan Leaf', 'Sedan', 120.00, '/images/vehicles/Nissan Leaf.jpg', 4, 2, 4.60, 156, '["Air Conditioning", "GPS", "Electric", "Eco-Friendly"]', 'Eco-friendly electric sedan', false, 'Electric', 'Automatic', '2025-11-21 12:44:15.084018', '2025-12-01 18:39:19.091304');
INSERT INTO public.vehicles VALUES (2, 'Honda Vezel', 'SUV', 180.00, '/images/vehicles/Honda Vezel.jpg', 5, 3, 4.70, 189, '["Air Conditioning", "GPS", "Sunroof", "Leather Seats"]', 'Spacious SUV ideal for family trips', true, 'Petrol', 'Automatic', '2025-11-21 12:44:15.084018', '2025-12-01 18:39:20.715825');
INSERT INTO public.vehicles VALUES (1, 'Toyota Prius', 'Sedan', 150.00, '/images/vehicles/prius.jpg', 4, 2, 4.80, 245, '["Air Conditioning", "GPS", "Bluetooth", "USB Charging"]', 'Comfortable hybrid sedan perfect for city rides', true, 'Hybrid', 'Automatic', '2025-11-21 12:44:15.084018', '2025-12-01 18:39:21.939021');
INSERT INTO public.vehicles VALUES (6, 'Toyota Axio', 'Sedan', 140.00, '/images/vehicles/Axio.jpg', 4, 2, 4.50, 198, '["Air Conditioning", "GPS", "Bluetooth"]', 'Budget-friendly reliable sedan', true, 'Petrol', 'Automatic', '2025-11-21 12:44:15.084018', '2025-12-01 18:39:26.493246');
INSERT INTO public.vehicles VALUES (7, 'Suzuki Alto', 'Mini', 100.00, '/images/vehicles/Suzuki_Alto.jpg', 4, 1, 4.30, 167, '["Air Conditioning", "Radio"]', 'Compact and economical city car', true, 'Petrol', 'Manual', '2025-11-21 12:44:15.084018', '2025-12-01 18:57:26.401726');


--
-- TOC entry 3514 (class 0 OID 0)
-- Dependencies: 216
-- Name: admin_users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: taxisrilanka_user
--

SELECT pg_catalog.setval('public.admin_users_id_seq', 4, true);


--
-- TOC entry 3515 (class 0 OID 0)
-- Dependencies: 218
-- Name: bookings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: taxisrilanka_user
--

SELECT pg_catalog.setval('public.bookings_id_seq', 11, true);


--
-- TOC entry 3516 (class 0 OID 0)
-- Dependencies: 220
-- Name: payments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: taxisrilanka_user
--

SELECT pg_catalog.setval('public.payments_id_seq', 2, true);


--
-- TOC entry 3517 (class 0 OID 0)
-- Dependencies: 222
-- Name: taxi_packages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: taxisrilanka_user
--

SELECT pg_catalog.setval('public.taxi_packages_id_seq', 3, true);


--
-- TOC entry 3518 (class 0 OID 0)
-- Dependencies: 224
-- Name: vehicles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: taxisrilanka_user
--

SELECT pg_catalog.setval('public.vehicles_id_seq', 8, true);


--
-- TOC entry 3302 (class 2606 OID 16453)
-- Name: admin_users admin_users_email_key; Type: CONSTRAINT; Schema: public; Owner: taxisrilanka_user
--

ALTER TABLE ONLY public.admin_users
    ADD CONSTRAINT admin_users_email_key UNIQUE (email);


--
-- TOC entry 3304 (class 2606 OID 16455)
-- Name: admin_users admin_users_pkey; Type: CONSTRAINT; Schema: public; Owner: taxisrilanka_user
--

ALTER TABLE ONLY public.admin_users
    ADD CONSTRAINT admin_users_pkey PRIMARY KEY (id);


--
-- TOC entry 3306 (class 2606 OID 16457)
-- Name: admin_users admin_users_username_key; Type: CONSTRAINT; Schema: public; Owner: taxisrilanka_user
--

ALTER TABLE ONLY public.admin_users
    ADD CONSTRAINT admin_users_username_key UNIQUE (username);


--
-- TOC entry 3308 (class 2606 OID 16459)
-- Name: bookings bookings_booking_reference_key; Type: CONSTRAINT; Schema: public; Owner: taxisrilanka_user
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_reference_key UNIQUE (booking_reference);


--
-- TOC entry 3310 (class 2606 OID 16461)
-- Name: bookings bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: taxisrilanka_user
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_pkey PRIMARY KEY (id);


--
-- TOC entry 3323 (class 2606 OID 16463)
-- Name: payments payments_onepay_transaction_id_key; Type: CONSTRAINT; Schema: public; Owner: taxisrilanka_user
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_onepay_transaction_id_key UNIQUE (onepay_transaction_id);


--
-- TOC entry 3325 (class 2606 OID 16465)
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: taxisrilanka_user
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- TOC entry 3327 (class 2606 OID 16467)
-- Name: payments payments_reference_number_key; Type: CONSTRAINT; Schema: public; Owner: taxisrilanka_user
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_reference_number_key UNIQUE (reference_number);


--
-- TOC entry 3332 (class 2606 OID 16469)
-- Name: taxi_packages taxi_packages_package_code_key; Type: CONSTRAINT; Schema: public; Owner: taxisrilanka_user
--

ALTER TABLE ONLY public.taxi_packages
    ADD CONSTRAINT taxi_packages_package_code_key UNIQUE (package_code);


--
-- TOC entry 3334 (class 2606 OID 16471)
-- Name: taxi_packages taxi_packages_pkey; Type: CONSTRAINT; Schema: public; Owner: taxisrilanka_user
--

ALTER TABLE ONLY public.taxi_packages
    ADD CONSTRAINT taxi_packages_pkey PRIMARY KEY (id);


--
-- TOC entry 3339 (class 2606 OID 16473)
-- Name: vehicles vehicles_pkey; Type: CONSTRAINT; Schema: public; Owner: taxisrilanka_user
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_pkey PRIMARY KEY (id);


--
-- TOC entry 3311 (class 1259 OID 16474)
-- Name: idx_bookings_created_at; Type: INDEX; Schema: public; Owner: taxisrilanka_user
--

CREATE INDEX idx_bookings_created_at ON public.bookings USING btree (created_at);


--
-- TOC entry 3312 (class 1259 OID 16475)
-- Name: idx_bookings_email; Type: INDEX; Schema: public; Owner: taxisrilanka_user
--

CREATE INDEX idx_bookings_email ON public.bookings USING btree (email);


--
-- TOC entry 3313 (class 1259 OID 16476)
-- Name: idx_bookings_payment_status; Type: INDEX; Schema: public; Owner: taxisrilanka_user
--

CREATE INDEX idx_bookings_payment_status ON public.bookings USING btree (payment_status);


--
-- TOC entry 3314 (class 1259 OID 16477)
-- Name: idx_bookings_pickup_date; Type: INDEX; Schema: public; Owner: taxisrilanka_user
--

CREATE INDEX idx_bookings_pickup_date ON public.bookings USING btree (pickup_date);


--
-- TOC entry 3315 (class 1259 OID 16478)
-- Name: idx_bookings_reference; Type: INDEX; Schema: public; Owner: taxisrilanka_user
--

CREATE INDEX idx_bookings_reference ON public.bookings USING btree (booking_reference);


--
-- TOC entry 3316 (class 1259 OID 16479)
-- Name: idx_bookings_status; Type: INDEX; Schema: public; Owner: taxisrilanka_user
--

CREATE INDEX idx_bookings_status ON public.bookings USING btree (status);


--
-- TOC entry 3317 (class 1259 OID 16480)
-- Name: idx_bookings_vehicle_id; Type: INDEX; Schema: public; Owner: taxisrilanka_user
--

CREATE INDEX idx_bookings_vehicle_id ON public.bookings USING btree (vehicle_id);


--
-- TOC entry 3328 (class 1259 OID 16481)
-- Name: idx_packages_active; Type: INDEX; Schema: public; Owner: taxisrilanka_user
--

CREATE INDEX idx_packages_active ON public.taxi_packages USING btree (is_active);


--
-- TOC entry 3329 (class 1259 OID 16482)
-- Name: idx_packages_category; Type: INDEX; Schema: public; Owner: taxisrilanka_user
--

CREATE INDEX idx_packages_category ON public.taxi_packages USING btree (category);


--
-- TOC entry 3330 (class 1259 OID 16483)
-- Name: idx_packages_popular; Type: INDEX; Schema: public; Owner: taxisrilanka_user
--

CREATE INDEX idx_packages_popular ON public.taxi_packages USING btree (popular);


--
-- TOC entry 3318 (class 1259 OID 16484)
-- Name: idx_payments_booking_id; Type: INDEX; Schema: public; Owner: taxisrilanka_user
--

CREATE INDEX idx_payments_booking_id ON public.payments USING btree (booking_id);


--
-- TOC entry 3319 (class 1259 OID 16485)
-- Name: idx_payments_onepay_transaction_id; Type: INDEX; Schema: public; Owner: taxisrilanka_user
--

CREATE INDEX idx_payments_onepay_transaction_id ON public.payments USING btree (onepay_transaction_id);


--
-- TOC entry 3320 (class 1259 OID 16486)
-- Name: idx_payments_reference_number; Type: INDEX; Schema: public; Owner: taxisrilanka_user
--

CREATE INDEX idx_payments_reference_number ON public.payments USING btree (reference_number);


--
-- TOC entry 3321 (class 1259 OID 16487)
-- Name: idx_payments_status; Type: INDEX; Schema: public; Owner: taxisrilanka_user
--

CREATE INDEX idx_payments_status ON public.payments USING btree (status);


--
-- TOC entry 3335 (class 1259 OID 16488)
-- Name: idx_vehicles_available; Type: INDEX; Schema: public; Owner: taxisrilanka_user
--

CREATE INDEX idx_vehicles_available ON public.vehicles USING btree (is_available);


--
-- TOC entry 3336 (class 1259 OID 16489)
-- Name: idx_vehicles_category; Type: INDEX; Schema: public; Owner: taxisrilanka_user
--

CREATE INDEX idx_vehicles_category ON public.vehicles USING btree (category);


--
-- TOC entry 3337 (class 1259 OID 16490)
-- Name: idx_vehicles_seats; Type: INDEX; Schema: public; Owner: taxisrilanka_user
--

CREATE INDEX idx_vehicles_seats ON public.vehicles USING btree (seats);


--
-- TOC entry 3340 (class 2606 OID 16491)
-- Name: bookings bookings_vehicle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: taxisrilanka_user
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id);


--
-- TOC entry 3341 (class 2606 OID 16496)
-- Name: payments payments_booking_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: taxisrilanka_user
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(id);


--
-- TOC entry 3501 (class 0 OID 0)
-- Dependencies: 3500
-- Name: DATABASE taxisrilanka_prod_db; Type: ACL; Schema: -; Owner: postgres
--

GRANT ALL ON DATABASE taxisrilanka_prod_db TO taxisrilanka_user;


--
-- TOC entry 3502 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT ALL ON SCHEMA public TO taxisrilanka_user;


-- Completed on 2025-12-10 17:21:07

--
-- PostgreSQL database dump complete
--

