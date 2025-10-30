CREATE TABLE "timelines" (
	"name" text PRIMARY KEY NOT NULL,
	"description" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "arcs" (
	"timeline_name" text NOT NULL,
	"name" text NOT NULL,
	"number" integer NOT NULL,
	"description" text NOT NULL,
	CONSTRAINT "arcs_timeline_name_name_pk" PRIMARY KEY("timeline_name","name")
);
--> statement-breakpoint
CREATE TABLE "episodes" (
	"timeline_name" text NOT NULL,
	"arc_name" text NOT NULL,
	"number" integer NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	CONSTRAINT "episodes_timeline_name_arc_name_number_pk" PRIMARY KEY("timeline_name","arc_name","number")
);
--> statement-breakpoint
CREATE TABLE "parts" (
	"timeline_name" text NOT NULL,
	"arc_name" text NOT NULL,
	"episode_number" integer NOT NULL,
	"number" integer NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	CONSTRAINT "parts_timeline_name_arc_name_episode_number_number_pk" PRIMARY KEY("timeline_name","arc_name","episode_number","number")
);
--> statement-breakpoint
CREATE TABLE "chapters" (
	"timeline_name" text NOT NULL,
	"arc_name" text NOT NULL,
	"episode_number" integer NOT NULL,
	"part_number" integer NOT NULL,
	"number" integer NOT NULL,
	"pov" text NOT NULL,
	"title" text NOT NULL,
	"summary" text NOT NULL,
	"location" text NOT NULL,
	"date" text NOT NULL,
	"outfit" text,
	"kink" text,
	"words" integer NOT NULL,
	"characters" integer NOT NULL,
	"characters_no_spaces" integer NOT NULL,
	"paragraphs" integer NOT NULL,
	"sentences" integer NOT NULL,
	"reading_time_minutes" integer NOT NULL,
	CONSTRAINT "chapters_timeline_name_arc_name_episode_number_part_number_number_pk" PRIMARY KEY("timeline_name","arc_name","episode_number","part_number","number")
);
--> statement-breakpoint
ALTER TABLE "arcs" ADD CONSTRAINT "arcs_timeline_name_timelines_name_fk" FOREIGN KEY ("timeline_name") REFERENCES "public"."timelines"("name") ON DELETE cascade ON UPDATE no action;