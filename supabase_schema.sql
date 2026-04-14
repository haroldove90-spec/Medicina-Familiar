-- Esquema de Base de Datos para Consultorio Médico Digital (PostgreSQL / Supabase)
-- Cumplimiento con NOM-024-SSA3-2012 y COFEPRIS

-- 1. Tabla de Usuarios (Médicos y Personal)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    professional_license TEXT, -- Cédula Profesional
    role TEXT CHECK (role IN ('admin', 'doctor', 'nurse', 'receptionist')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabla de Pacientes
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    birth_date DATE NOT NULL,
    gender CHAR(1) CHECK (gender IN ('M', 'F', 'O')),
    curp TEXT UNIQUE,
    phone TEXT,
    email TEXT,
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabla de Notas Médicas (Expediente Clínico)
CREATE TABLE medical_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES users(id),
    note_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Signos Vitales
    systolic_bp INTEGER,
    diastolic_bp INTEGER,
    temperature DECIMAL(4,2),
    heart_rate INTEGER,
    respiratory_rate INTEGER,
    weight DECIMAL(5,2),
    height INTEGER,
    
    -- Metodología SOAP
    subjective TEXT NOT NULL,
    objective TEXT NOT NULL,
    analysis TEXT NOT NULL,
    plan TEXT NOT NULL,
    
    -- Diagnóstico
    diagnosis_code TEXT, -- CIE-10
    diagnosis_description TEXT,
    
    is_signed BOOLEAN DEFAULT FALSE,
    digital_signature TEXT, -- Hash de la nota para integridad
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabla de Bitácora de Auditoría (Exigencia COFEPRIS)
-- Debe ser inmutable (solo INSERT, no UPDATE/DELETE)
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES users(id),
    action TEXT NOT NULL, -- e.g., 'CREATE_NOTE', 'VIEW_PATIENT', 'LOGIN'
    entity_name TEXT NOT NULL, -- e.g., 'medical_notes'
    entity_id UUID,
    old_data JSONB,
    new_data JSONB,
    ip_address TEXT,
    user_agent TEXT
);

-- 5. Función para registrar auditoría automáticamente (Trigger)
CREATE OR REPLACE FUNCTION process_audit_log() RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO audit_log (user_id, action, entity_name, entity_id, new_data)
        VALUES (auth.uid(), 'INSERT', TG_TABLE_NAME, NEW.id, row_to_json(NEW)::jsonb);
        RETURN NEW;
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO audit_log (user_id, action, entity_name, entity_id, old_data, new_data)
        VALUES (auth.uid(), 'UPDATE', TG_TABLE_NAME, NEW.id, row_to_json(OLD)::jsonb, row_to_json(NEW)::jsonb);
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO audit_log (user_id, action, entity_name, entity_id, old_data)
        VALUES (auth.uid(), 'DELETE', TG_TABLE_NAME, OLD.id, row_to_json(OLD)::jsonb);
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger a tablas críticas
CREATE TRIGGER audit_medical_notes
AFTER INSERT OR UPDATE OR DELETE ON medical_notes
FOR EACH ROW EXECUTE FUNCTION process_audit_log();

CREATE TRIGGER audit_patients
AFTER INSERT OR UPDATE OR DELETE ON patients
FOR EACH ROW EXECUTE FUNCTION process_audit_log();

-- 6. Políticas de Seguridad (RLS - Row Level Security)
ALTER TABLE medical_notes ENABLE ROW LEVEL SECURITY;

-- Solo el médico que creó la nota o un admin puede verla (ejemplo simplificado)
CREATE POLICY doctor_access_notes ON medical_notes
    FOR ALL USING (auth.uid() = doctor_id OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));
