

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


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."chat_messages" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "order_id" "uuid",
    "user_id" "uuid",
    "message" "text" NOT NULL,
    "attachment_url" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."chat_messages" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."ex_tokens" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" character varying(255) NOT NULL,
    "symbol" character varying(50) NOT NULL,
    "logo" "text",
    "address" character varying(255) NOT NULL,
    "network_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."ex_tokens" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."networks" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" character varying(255) NOT NULL,
    "chain_type" character varying(10) NOT NULL,
    "rpc_url" "text" NOT NULL,
    "explorer_url" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "chain_id" character varying(30),
    "logo" character varying(255),
    CONSTRAINT "networks_chain_type_check" CHECK ((("chain_type")::"text" = ANY ((ARRAY['evm'::character varying, 'sui'::character varying, 'sol'::character varying])::"text"[])))
);


ALTER TABLE "public"."networks" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."notifications" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "type" character varying(50) NOT NULL,
    "title" character varying(255) NOT NULL,
    "content" "text" NOT NULL,
    "is_read" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."notifications" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."offers" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "token_id" "uuid",
    "ex_token_id" "uuid",
    "seller_wallet_id" "uuid",
    "price" numeric(18,8) NOT NULL,
    "quantity" numeric(18,8) NOT NULL,
    "filled" numeric(18,8) DEFAULT 0 NOT NULL,
    "status" character varying(20) DEFAULT 'open'::character varying,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "collateral_percent" numeric(5,2) DEFAULT 0 NOT NULL,
    "settle_duration" integer DEFAULT 0 NOT NULL,
    "title" character varying(255) DEFAULT ''::character varying NOT NULL,
    "description" "text",
    "close_tx_hash" character varying(255),
    CONSTRAINT "check_token_or_ex_token" CHECK ((("token_id" IS NOT NULL) OR ("ex_token_id" IS NOT NULL))),
    CONSTRAINT "offers_status_check" CHECK ((("status")::"text" = ANY ((ARRAY['open'::character varying, 'closed'::character varying])::"text"[])))
);


ALTER TABLE "public"."offers" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."orders" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "offer_id" "uuid",
    "buyer_wallet_id" "uuid",
    "amount" numeric(18,8) NOT NULL,
    "status" character varying(20) DEFAULT 'pending'::character varying,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "hash_id" character varying(66),
    "settle_tx_hash" character varying(255),
    "cancel_tx_hash" character varying(255),
    "promotion_id" "uuid",
    "discount_percent" integer,
    CONSTRAINT "orders_discount_percent_check" CHECK ((("discount_percent" >= 0) AND ("discount_percent" <= 100))),
    CONSTRAINT "orders_status_check" CHECK ((("status")::"text" = ANY ((ARRAY['pending'::character varying, 'settled'::character varying, 'cancelled'::character varying, 'settling'::character varying])::"text"[])))
);


ALTER TABLE "public"."orders" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."promotions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "offer_id" "uuid" NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL,
    "discount_percent" integer NOT NULL,
    "check_type" character varying(32) NOT NULL,
    "check_eligible_url" character varying(255),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "title" character varying(100) NOT NULL,
    "description" character varying(500),
    CONSTRAINT "promotions_discount_percent_check" CHECK ((("discount_percent" > 0) AND ("discount_percent" <= 100)))
);


ALTER TABLE "public"."promotions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."reviews" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "offer_id" "uuid",
    "rating" integer NOT NULL,
    "comment" "text" NOT NULL,
    "reply" "text",
    "status" character varying(20) DEFAULT 'pending'::character varying,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "buyer_id" "uuid" NOT NULL,
    CONSTRAINT "reviews_rating_check" CHECK ((("rating" >= 1) AND ("rating" <= 5))),
    CONSTRAINT "reviews_status_check" CHECK ((("status")::"text" = ANY ((ARRAY['pending'::character varying, 'approved'::character varying, 'rejected'::character varying])::"text"[])))
);


ALTER TABLE "public"."reviews" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."support_tickets" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "subject" character varying(255) NOT NULL,
    "content" "text" NOT NULL,
    "status" character varying(20) DEFAULT 'open'::character varying,
    "admin_id" character varying(255),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "support_tickets_status_check" CHECK ((("status")::"text" = ANY ((ARRAY['open'::character varying, 'in_progress'::character varying, 'resolved'::character varying, 'closed'::character varying])::"text"[])))
);


ALTER TABLE "public"."support_tickets" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."tokens" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" character varying(255) NOT NULL,
    "symbol" character varying(50) NOT NULL,
    "logo" "text",
    "token_contract" character varying(255),
    "network_id" "uuid",
    "start_time" timestamp with time zone NOT NULL,
    "end_time" timestamp with time zone NOT NULL,
    "status" character varying(20) DEFAULT 'draft'::character varying,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "website_url" character varying(255),
    "twitter_url" character varying(255),
    "telegram_url" character varying(255),
    "banner_url" character varying(255),
    CONSTRAINT "tokens_status_check" CHECK ((("status")::"text" = ANY ((ARRAY['draft'::character varying, 'active'::character varying, 'ended'::character varying, 'cancelled'::character varying, 'settling'::character varying])::"text"[])))
);


ALTER TABLE "public"."tokens" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."transactions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tx_hash" character varying(255) NOT NULL,
    "chain_id" bigint NOT NULL,
    "log_index" integer NOT NULL,
    "event" character varying(50) NOT NULL,
    "event_data" "jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."transactions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" character varying(255) NOT NULL,
    "avatar" "text",
    "banner" "text",
    "description" "text",
    "social_media" "jsonb" DEFAULT '{"discord": "", "twitter": "", "youtube": "", "facebook": "", "telegram": "", "instagram": ""}'::"jsonb" NOT NULL,
    "kyc_status" character varying(20) DEFAULT 'pending'::character varying,
    "status" character varying(20) DEFAULT 'pending'::character varying,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "users_kyc_status_check" CHECK ((("kyc_status")::"text" = ANY ((ARRAY['pending'::character varying, 'verified'::character varying, 'rejected'::character varying])::"text"[]))),
    CONSTRAINT "users_status_check" CHECK ((("status")::"text" = ANY ((ARRAY['active'::character varying, 'banned'::character varying, 'pending'::character varying])::"text"[])))
);


ALTER TABLE "public"."users" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."wallet_ex_tokens" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "wallet_id" "uuid",
    "ex_token_id" "uuid",
    "balance" numeric(18,8) DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."wallet_ex_tokens" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."wallets" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "chain_type" character varying(10) NOT NULL,
    "address" character varying(255) NOT NULL,
    "is_primary" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "wallets_chain_type_check" CHECK ((("chain_type")::"text" = ANY ((ARRAY['evm'::character varying, 'sui'::character varying, 'sol'::character varying])::"text"[])))
);


ALTER TABLE "public"."wallets" OWNER TO "postgres";


ALTER TABLE ONLY "public"."chat_messages"
    ADD CONSTRAINT "chat_messages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."ex_tokens"
    ADD CONSTRAINT "ex_tokens_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."networks"
    ADD CONSTRAINT "networks_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."offers"
    ADD CONSTRAINT "offers_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."promotions"
    ADD CONSTRAINT "promotions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "reviews_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."support_tickets"
    ADD CONSTRAINT "support_tickets_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."tokens"
    ADD CONSTRAINT "tokens_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."transactions"
    ADD CONSTRAINT "transactions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."transactions"
    ADD CONSTRAINT "transactions_tx_hash_log_index_event_key" UNIQUE ("tx_hash", "log_index", "event");



ALTER TABLE ONLY "public"."wallets"
    ADD CONSTRAINT "unique_primary_wallet_per_user" EXCLUDE USING "btree" ("user_id" WITH =) WHERE (("is_primary" = true));



ALTER TABLE ONLY "public"."wallet_ex_tokens"
    ADD CONSTRAINT "unique_wallet_ex_token" UNIQUE ("wallet_id", "ex_token_id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."wallet_ex_tokens"
    ADD CONSTRAINT "wallet_ex_tokens_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."wallets"
    ADD CONSTRAINT "wallets_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_chat_messages_order_id" ON "public"."chat_messages" USING "btree" ("order_id");



CREATE INDEX "idx_chat_messages_user_id" ON "public"."chat_messages" USING "btree" ("user_id");



CREATE INDEX "idx_ex_tokens_address" ON "public"."ex_tokens" USING "btree" ("address");



CREATE INDEX "idx_ex_tokens_network_id" ON "public"."ex_tokens" USING "btree" ("network_id");



CREATE INDEX "idx_ex_tokens_symbol" ON "public"."ex_tokens" USING "btree" ("symbol");



CREATE INDEX "idx_networks_chain_type" ON "public"."networks" USING "btree" ("chain_type");



CREATE INDEX "idx_notifications_is_read" ON "public"."notifications" USING "btree" ("is_read");



CREATE INDEX "idx_notifications_user_id" ON "public"."notifications" USING "btree" ("user_id");



CREATE INDEX "idx_offers_seller_wallet_id" ON "public"."offers" USING "btree" ("seller_wallet_id");



CREATE INDEX "idx_offers_status" ON "public"."offers" USING "btree" ("status");



CREATE INDEX "idx_offers_token_id" ON "public"."offers" USING "btree" ("token_id");



CREATE INDEX "idx_orders_buyer_wallet_id" ON "public"."orders" USING "btree" ("buyer_wallet_id");



CREATE INDEX "idx_orders_offer_id" ON "public"."orders" USING "btree" ("offer_id");



CREATE INDEX "idx_orders_promotion_id" ON "public"."orders" USING "btree" ("promotion_id");



CREATE INDEX "idx_orders_status" ON "public"."orders" USING "btree" ("status");



CREATE INDEX "idx_reviews_buyer_id" ON "public"."reviews" USING "btree" ("buyer_id");



CREATE INDEX "idx_reviews_buyer_id_status" ON "public"."reviews" USING "btree" ("buyer_id", "status");



CREATE INDEX "idx_reviews_offer_id" ON "public"."reviews" USING "btree" ("offer_id");



CREATE INDEX "idx_reviews_offer_id_buyer_id" ON "public"."reviews" USING "btree" ("offer_id", "buyer_id");



CREATE INDEX "idx_support_tickets_status" ON "public"."support_tickets" USING "btree" ("status");



CREATE INDEX "idx_support_tickets_user_id" ON "public"."support_tickets" USING "btree" ("user_id");



CREATE INDEX "idx_tokens_network_id" ON "public"."tokens" USING "btree" ("network_id");



CREATE INDEX "idx_tokens_status" ON "public"."tokens" USING "btree" ("status");



CREATE INDEX "idx_tokens_symbol" ON "public"."tokens" USING "btree" ("symbol");



CREATE INDEX "idx_transactions_chain_id" ON "public"."transactions" USING "btree" ("chain_id");



CREATE INDEX "idx_transactions_event" ON "public"."transactions" USING "btree" ("event");



CREATE INDEX "idx_transactions_log_index" ON "public"."transactions" USING "btree" ("log_index");



CREATE INDEX "idx_transactions_tx_hash" ON "public"."transactions" USING "btree" ("tx_hash");



CREATE INDEX "idx_wallet_ex_tokens_ex_token_id" ON "public"."wallet_ex_tokens" USING "btree" ("ex_token_id");



CREATE INDEX "idx_wallet_ex_tokens_wallet_id" ON "public"."wallet_ex_tokens" USING "btree" ("wallet_id");



CREATE INDEX "idx_wallets_address" ON "public"."wallets" USING "btree" ("address");



CREATE INDEX "idx_wallets_chain_type" ON "public"."wallets" USING "btree" ("chain_type");



CREATE INDEX "idx_wallets_user_id" ON "public"."wallets" USING "btree" ("user_id");



CREATE OR REPLACE TRIGGER "update_ex_tokens_updated_at" BEFORE UPDATE ON "public"."ex_tokens" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_offers_updated_at" BEFORE UPDATE ON "public"."offers" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_orders_updated_at" BEFORE UPDATE ON "public"."orders" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_reviews_updated_at" BEFORE UPDATE ON "public"."reviews" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_support_tickets_updated_at" BEFORE UPDATE ON "public"."support_tickets" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_tokens_updated_at" BEFORE UPDATE ON "public"."tokens" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_users_updated_at" BEFORE UPDATE ON "public"."users" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



ALTER TABLE ONLY "public"."chat_messages"
    ADD CONSTRAINT "chat_messages_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."chat_messages"
    ADD CONSTRAINT "chat_messages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."ex_tokens"
    ADD CONSTRAINT "ex_tokens_network_id_fkey" FOREIGN KEY ("network_id") REFERENCES "public"."networks"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."offers"
    ADD CONSTRAINT "offers_ex_token_id_fkey" FOREIGN KEY ("ex_token_id") REFERENCES "public"."ex_tokens"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."offers"
    ADD CONSTRAINT "offers_seller_wallet_id_fkey" FOREIGN KEY ("seller_wallet_id") REFERENCES "public"."wallets"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."offers"
    ADD CONSTRAINT "offers_token_id_fkey" FOREIGN KEY ("token_id") REFERENCES "public"."tokens"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_buyer_wallet_id_fkey" FOREIGN KEY ("buyer_wallet_id") REFERENCES "public"."wallets"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_offer_id_fkey" FOREIGN KEY ("offer_id") REFERENCES "public"."offers"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_promotion_id_fkey" FOREIGN KEY ("promotion_id") REFERENCES "public"."promotions"("id");



ALTER TABLE ONLY "public"."promotions"
    ADD CONSTRAINT "promotions_offer_id_fkey" FOREIGN KEY ("offer_id") REFERENCES "public"."offers"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "reviews_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "reviews_offer_id_fkey" FOREIGN KEY ("offer_id") REFERENCES "public"."offers"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."support_tickets"
    ADD CONSTRAINT "support_tickets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."tokens"
    ADD CONSTRAINT "tokens_network_id_fkey" FOREIGN KEY ("network_id") REFERENCES "public"."networks"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."wallet_ex_tokens"
    ADD CONSTRAINT "wallet_ex_tokens_ex_token_id_fkey" FOREIGN KEY ("ex_token_id") REFERENCES "public"."ex_tokens"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."wallet_ex_tokens"
    ADD CONSTRAINT "wallet_ex_tokens_wallet_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "public"."wallets"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."wallets"
    ADD CONSTRAINT "wallets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

























































































































































GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";


















GRANT ALL ON TABLE "public"."chat_messages" TO "anon";
GRANT ALL ON TABLE "public"."chat_messages" TO "authenticated";
GRANT ALL ON TABLE "public"."chat_messages" TO "service_role";



GRANT ALL ON TABLE "public"."ex_tokens" TO "anon";
GRANT ALL ON TABLE "public"."ex_tokens" TO "authenticated";
GRANT ALL ON TABLE "public"."ex_tokens" TO "service_role";



GRANT ALL ON TABLE "public"."networks" TO "anon";
GRANT ALL ON TABLE "public"."networks" TO "authenticated";
GRANT ALL ON TABLE "public"."networks" TO "service_role";



GRANT ALL ON TABLE "public"."notifications" TO "anon";
GRANT ALL ON TABLE "public"."notifications" TO "authenticated";
GRANT ALL ON TABLE "public"."notifications" TO "service_role";



GRANT ALL ON TABLE "public"."offers" TO "anon";
GRANT ALL ON TABLE "public"."offers" TO "authenticated";
GRANT ALL ON TABLE "public"."offers" TO "service_role";



GRANT ALL ON TABLE "public"."orders" TO "anon";
GRANT ALL ON TABLE "public"."orders" TO "authenticated";
GRANT ALL ON TABLE "public"."orders" TO "service_role";



GRANT ALL ON TABLE "public"."promotions" TO "anon";
GRANT ALL ON TABLE "public"."promotions" TO "authenticated";
GRANT ALL ON TABLE "public"."promotions" TO "service_role";



GRANT ALL ON TABLE "public"."reviews" TO "anon";
GRANT ALL ON TABLE "public"."reviews" TO "authenticated";
GRANT ALL ON TABLE "public"."reviews" TO "service_role";



GRANT ALL ON TABLE "public"."support_tickets" TO "anon";
GRANT ALL ON TABLE "public"."support_tickets" TO "authenticated";
GRANT ALL ON TABLE "public"."support_tickets" TO "service_role";



GRANT ALL ON TABLE "public"."tokens" TO "anon";
GRANT ALL ON TABLE "public"."tokens" TO "authenticated";
GRANT ALL ON TABLE "public"."tokens" TO "service_role";



GRANT ALL ON TABLE "public"."transactions" TO "anon";
GRANT ALL ON TABLE "public"."transactions" TO "authenticated";
GRANT ALL ON TABLE "public"."transactions" TO "service_role";



GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";



GRANT ALL ON TABLE "public"."wallet_ex_tokens" TO "anon";
GRANT ALL ON TABLE "public"."wallet_ex_tokens" TO "authenticated";
GRANT ALL ON TABLE "public"."wallet_ex_tokens" TO "service_role";



GRANT ALL ON TABLE "public"."wallets" TO "anon";
GRANT ALL ON TABLE "public"."wallets" TO "authenticated";
GRANT ALL ON TABLE "public"."wallets" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";






























RESET ALL;
