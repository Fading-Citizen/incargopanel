-- INCARGO Admin Panel Database Schema
-- Este script SQL debe ejecutarse en Supabase para crear las tablas

-- Crear extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de usuarios del sistema
CREATE TABLE users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'viewer' CHECK (role IN ('admin', 'operator', 'viewer')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de clientes
CREATE TABLE clients (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  address TEXT,
  city VARCHAR(100),
  nit VARCHAR(50) UNIQUE,
  contact_person VARCHAR(255),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de vehículos de la flota
CREATE TABLE vehicles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  plate VARCHAR(20) UNIQUE NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('turbo', 'sencillo', 'dobletroque', 'mini-mula-2', 'mini-mula-3', 'mula-2', 'mula-3', 'refrigerado', 'plataforma', 'contenedor')),
  capacity DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'in_transit', 'maintenance', 'inactive')),
  driver_name VARCHAR(255),
  driver_phone VARCHAR(50),
  driver_license VARCHAR(50),
  soat_expiry DATE,
  tech_review_expiry DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de servicios/proyectos
CREATE TABLE services (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('transporte_nacional', 'carga_mercancia', 'bodegaje', 'vehiculos_rodados', 'proyecto_logistico')),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  origin VARCHAR(255) NOT NULL,
  destination VARCHAR(255) NOT NULL,
  cargo_type VARCHAR(255),
  weight DECIMAL(10,2),
  volume DECIMAL(10,2),
  value DECIMAL(15,2),
  status VARCHAR(20) DEFAULT 'quote' CHECK (status IN ('quote', 'confirmed', 'in_progress', 'completed', 'cancelled')),
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  start_date DATE,
  end_date DATE,
  vehicle_id UUID REFERENCES vehicles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de cotizaciones
CREATE TABLE quotes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  service_type VARCHAR(255) NOT NULL,
  origin VARCHAR(255) NOT NULL,
  destination VARCHAR(255) NOT NULL,
  cargo_details TEXT,
  weight DECIMAL(10,2),
  volume DECIMAL(10,2),
  quoted_price DECIMAL(15,2),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'accepted', 'rejected', 'expired')),
  valid_until DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de contenedores
CREATE TABLE containers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  container_number VARCHAR(50) UNIQUE NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('20ft', '40ft', '40ft_hc', 'special')),
  status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'in_use', 'maintenance', 'transit')),
  current_location VARCHAR(255),
  client_id UUID REFERENCES clients(id),
  service_id UUID REFERENCES services(id),
  last_inspection DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON vehicles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_quotes_updated_at BEFORE UPDATE ON quotes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_containers_updated_at BEFORE UPDATE ON containers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insertar datos de ejemplo
INSERT INTO clients (name, email, phone, address, city, nit, contact_person) VALUES
('Almacenes Éxito S.A.', 'logistica@exito.com', '+57 1 234 5678', 'Carrera 15 # 93-07', 'Bogotá', '890900608-8', 'Ana María Rodríguez'),
('Grupo Nutresa S.A.', 'transporte@nutresa.com', '+57 4 567 8901', 'Calle 8 Sur # 50-67', 'Medellín', '890903894-1', 'Carlos Alberto Gómez'),
('Bavaria S.A.', 'distribucion@bavaria.co', '+57 1 345 6789', 'Carrera 53A # 127-35', 'Bogotá', '860007738-9', 'María Elena Torres'),
('Tecnoquímicas S.A.', 'logistica@tecnoquimicas.com', '+57 2 456 7890', 'Carrera 7 # 99-53', 'Cali', '890903407-9', 'Jorge Luis Herrera'),
('Postobón S.A.', 'operaciones@postobon.com', '+57 4 567 8901', 'Carrera 50 # 8 Sur-17', 'Medellín', '890903407-8', 'Sandra Patricia López');

INSERT INTO vehicles (plate, type, capacity, driver_name, driver_phone, driver_license, soat_expiry, tech_review_expiry) VALUES
('ABC-123', 'mula-3', 34.0, 'Carlos Rodríguez', '+57 301 234 5678', '123456789', '2024-12-15', '2024-11-30'),
('DEF-456', 'turbo', 8.0, 'María González', '+57 302 345 6789', '234567890', '2025-01-20', '2024-12-10'),
('GHI-789', 'refrigerado', 15.0, 'Juan Pérez', '+57 303 456 7890', '345678901', '2024-10-05', '2024-09-25'),
('JKL-012', 'dobletroque', 28.0, 'Ana López', '+57 304 567 8901', '456789012', '2025-02-10', '2025-01-15'),
('MNO-345', 'sencillo', 5.0, 'Pedro Martínez', '+57 305 678 9012', '567890123', '2024-11-25', '2024-10-30'),
('PQR-678', 'mini-mula-2', 12.0, 'Laura Silva', '+57 306 789 0123', '678901234', '2025-03-05', '2025-02-20');

-- Habilitar Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE containers ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (ajustar según necesidades de autenticación)
CREATE POLICY "Allow all for authenticated users" ON users FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON clients FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON vehicles FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON services FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON quotes FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON containers FOR ALL TO authenticated USING (true);
