CREATE TABLE "applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"display_name" text,
	"business_capabilities" text,
	"it_component_display_name" text,
	"active_from" text,
	"active_until" text,
	"cost_total_annual" text,
	"description" text,
	"obsolescence_risk_comment" text,
	"obsolescence_risk_status" text,
	"service_level" text,
	"technical_suitability" text,
	"gd_it_teams" text,
	"owned_by" text,
	"owning_function" text,
	"business_domain" text,
	"maturity_status" text,
	"main_area" text,
	"pace" text,
	"business_unit" text,
	"vendor" text,
	"lx_ps_wip" text,
	"region" text,
	"other_tags" text,
	"organizations" text,
	"cmdb_application_service_url" text,
	"cmdb_business_application_url" text,
	"functional_fit" text,
	"technical_fit" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "business_capabilities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"display_name" text,
	"hierarchy" text,
	"parent_id" uuid,
	"level" integer DEFAULT 1,
	"mapped_level1_capability" text,
	"mapped_to_lifesciences_capabilities" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "data_objects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"display_name" text,
	"rel_data_object_to_interface" text,
	"rel_data_object_to_project" text,
	"tags_gd_it_teams" text,
	"tags_owned_by" text,
	"tags_owning_function" text,
	"tags_business_domain" text,
	"tags_main_area" text,
	"tags_business_unit" text,
	"tags_lx_ps_wip" text,
	"tags_region" text,
	"tags_other_tags" text,
	"rel_data_object_to_application" text,
	"rel_to_child" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "initiatives" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"status" text,
	"start_date" text,
	"end_date" text,
	"business_capabilities" text,
	"applications" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "interfaces" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"source_application" text,
	"target_application" text,
	"data_flow" text,
	"frequency" text,
	"data_objects" text,
	"status" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "it_components" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"display_name" text,
	"category" text,
	"vendor" text,
	"version" text,
	"status" text,
	"applications" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "business_capabilities" ADD CONSTRAINT "business_capabilities_parent_id_business_capabilities_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."business_capabilities"("id") ON DELETE no action ON UPDATE no action;