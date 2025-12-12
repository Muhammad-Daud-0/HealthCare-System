/** @format */

import dotenv from "dotenv";
import { pool } from "../config/database";

dotenv.config({ path: ".env.local" });

const createTables = async () => {
	const client = await pool.connect();

	try {
		console.log("🔨 Creating database tables...");

		// Create enum types
		await client.query(`
      DO $$ BEGIN
        CREATE TYPE appointment_status AS ENUM ('SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

		// Create appointments table
		await client.query(`
      CREATE TABLE IF NOT EXISTS appointments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        patient_id UUID NOT NULL,
        doctor_id UUID NOT NULL,
        appointment_date TIMESTAMP NOT NULL,
        duration INTEGER NOT NULL,
        reason TEXT,
        status appointment_status DEFAULT 'SCHEDULED',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

		// Create indexes
		await client.query(`
      CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON appointments(patient_id);
      CREATE INDEX IF NOT EXISTS idx_appointments_doctor_id ON appointments(doctor_id);
      CREATE INDEX IF NOT EXISTS idx_appointments_appointment_date ON appointments(appointment_date);
      CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
    `);

		// Create updated_at trigger function
		await client.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

		// Create trigger for appointments table
		await client.query(`
      DROP TRIGGER IF EXISTS update_appointments_updated_at ON appointments;
      CREATE TRIGGER update_appointments_updated_at
        BEFORE UPDATE ON appointments
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `);

		console.log("✅ Database tables created successfully");
	} catch (error) {
		console.error("❌ Error creating tables:", error);
		throw error;
	} finally {
		client.release();
	}
};

// Run if called directly
if (require.main === module) {
	createTables()
		.then(() => {
			console.log("✅ Database initialization complete");
			process.exit(0);
		})
		.catch((error) => {
			console.error("❌ Database initialization failed:", error);
			process.exit(1);
		});
}

export default createTables;
