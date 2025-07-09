ALTER TABLE "users" ADD COLUMN "card_type" varchar(50);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "credit_limit" integer;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "confidence" integer;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "prediction_reasons" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "predicted_at" timestamp;