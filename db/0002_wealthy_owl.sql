ALTER TABLE "arcs" DROP CONSTRAINT "arcs_timeline_name_name_pk";--> statement-breakpoint
ALTER TABLE "episodes" DROP CONSTRAINT "episodes_timeline_name_arc_name_number_pk";--> statement-breakpoint
ALTER TABLE "parts" DROP CONSTRAINT "parts_timeline_name_arc_name_episode_number_number_pk";--> statement-breakpoint
ALTER TABLE "chapters" DROP CONSTRAINT "chapters_pk";--> statement-breakpoint
ALTER TABLE "chapters" ALTER COLUMN "part_number" DROP NOT NULL;