// Datos de demostración para cuando Supabase no está configurado
import type { Vehicle } from './services/fleet'
import type { Client } from './services/clients'
import type { Service } from './services/services'
import type { Quote } from './services/quotes'
import type { Container } from './services/containers'

export const mockVehicles: Vehicle[] = [
  {
    id: '1',
    placa: 'WQR456',
    tipo: 'Turbo',
    modelo: 'FH16',
    marca: 'Volvo',
    año: 2022,
    conductor: 'Carlos Rodríguez',
    estado: 'disponible',
    soat_vence: '2024-12-15',
    tecno_vence: '2024-11-30',
    ubicacion_actual: 'Terminal Principal Bogotá',
    kilometraje: 125000,
    capacidad_toneladas: 8,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-08-29T10:00:00Z'
  },
  {
    id: '2',
    placa: 'ABC123',
    tipo: 'Dobletroque',
    modelo: 'Actros',
    marca: 'Mercedes',
    año: 2021,
    conductor: 'Miguel Torres',
    estado: 'en_ruta',
    soat_vence: '2025-03-20',
    tecno_vence: '2025-01-15',
    ubicacion_actual: 'Carretera Bogotá-Medellín Km 45',
    kilometraje: 89000,
    capacidad_toneladas: 28,
    created_at: '2024-02-10T10:00:00Z',
    updated_at: '2024-08-29T09:30:00Z'
  },
  {
    id: '3',
    placa: 'XYZ789',
    tipo: 'Mini-mula 3 Ejes',
    modelo: 'Constellation',
    marca: 'Volkswagen',
    año: 2020,
    conductor: 'Ana López',
    estado: 'mantenimiento',
    soat_vence: '2024-10-10',
    tecno_vence: '2024-09-25',
    ubicacion_actual: 'Taller Mantenimiento',
    kilometraje: 156000,
    capacidad_toneladas: 18,
    created_at: '2024-03-05T10:00:00Z',
    updated_at: '2024-08-28T16:45:00Z'
  },
  {
    id: '4',
    placa: 'DEF456',
    tipo: 'Mula 2 Ejes',
    modelo: 'FMX',
    marca: 'Volvo',
    año: 2023,
    conductor: 'Pedro Sánchez',
    estado: 'disponible',
    soat_vence: '2025-01-30',
    tecno_vence: '2024-12-05',
    ubicacion_actual: 'Bodega Central Medellín',
    kilometraje: 45000,
    capacidad_toneladas: 24,
    created_at: '2024-04-12T10:00:00Z',
    updated_at: '2024-08-29T08:15:00Z'
  },
  {
    id: '5',
    placa: 'GHI789',
    tipo: 'Refrigerado',
    modelo: 'Axor',
    marca: 'Mercedes',
    año: 2022,
    conductor: 'Laura Martínez',
    estado: 'en_ruta',
    soat_vence: '2025-02-14',
    tecno_vence: '2025-01-20',
    ubicacion_actual: 'Puerto Buenaventura',
    kilometraje: 67000,
    capacidad_toneladas: 15,
    created_at: '2024-05-20T10:00:00Z',
    updated_at: '2024-08-29T07:20:00Z'
  }
]

export const mockClients: Client[] = [
  {
    id: '1',
    nombre_empresa: 'Distribuidora Nacional S.A.S.',
    nit: '900123456-7',
    contacto_principal: 'María Fernández',
    telefono: '+57 310 123 4567',
    email: 'm.fernandez@distribuidora.com',
    direccion: 'Carrera 15 # 93-07',
    ciudad: 'Bogotá',
    tipo_cliente: 'corporativo',
    estado: 'activo',
    fecha_registro: '2024-01-15',
    servicios_contratados: ['Transporte de Carga', 'Almacenamiento'],
    limite_credito: 50000000,
    saldo_pendiente: 2500000,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-08-29T10:00:00Z'
  },
  {
    id: '2',
    nombre_empresa: 'Comercializadora del Valle Ltda.',
    nit: '800987654-3',
    contacto_principal: 'Juan Carlos Méndez',
    telefono: '+57 320 987 6543',
    email: 'jc.mendez@comvalle.com',
    direccion: 'Calle 70 # 23-45',
    ciudad: 'Cali',
    tipo_cliente: 'pyme',
    estado: 'activo',
    fecha_registro: '2024-02-20',
    servicios_contratados: ['Transporte de Carga'],
    limite_credito: 20000000,
    saldo_pendiente: 0,
    created_at: '2024-02-20T10:00:00Z',
    updated_at: '2024-08-28T15:30:00Z'
  },
  {
    id: '3',
    nombre_empresa: 'Industrias Antioqueñas S.A.',
    nit: '890456789-1',
    contacto_principal: 'Ana Sofía Restrepo',
    telefono: '+57 315 456 7890',
    email: 'a.restrepo@industriasant.com',
    direccion: 'Carrera 50 # 8-20',
    ciudad: 'Medellín',
    tipo_cliente: 'corporativo',
    estado: 'activo',
    fecha_registro: '2024-03-10',
    servicios_contratados: ['Transporte de Carga', 'Proyectos Logísticos', 'Alquiler de Vehículos'],
    limite_credito: 100000000,
    saldo_pendiente: 15750000,
    created_at: '2024-03-10T10:00:00Z',
    updated_at: '2024-08-29T09:45:00Z'
  }
]

export const mockServices: Service[] = [
  {
    id: '1',
    cliente_id: '1',
    tipo_servicio: 'transporte_carga',
    descripcion: 'Transporte de mercancía seca Bogotá - Medellín',
    origen: 'Bogotá D.C.',
    destino: 'Medellín, Antioquia',
    fecha_inicio: '2024-08-28',
    fecha_estimada: '2024-08-29',
    estado: 'en_proceso',
    vehiculo_id: '2',
    conductor: 'Miguel Torres',
    carga_tipo: 'Mercancía seca',
    peso_kg: 15000,
    valor_total: 2500000,
    observaciones: 'Entrega en horario de oficina',
    created_at: '2024-08-28T08:00:00Z',
    updated_at: '2024-08-29T10:00:00Z',
    cliente: {
      nombre_empresa: 'Distribuidora Nacional S.A.S.',
      contacto_principal: 'María Fernández'
    },
    vehiculo: {
      placa: 'ABC123',
      tipo: 'Dobletroque'
    }
  },
  {
    id: '2',
    cliente_id: '3',
    tipo_servicio: 'transporte_carga',
    descripcion: 'Transporte de materiales industriales',
    origen: 'Medellín, Antioquia',
    destino: 'Cali, Valle del Cauca',
    fecha_inicio: '2024-08-25',
    fecha_estimada: '2024-08-26',
    fecha_completado: '2024-08-26T16:30:00Z',
    estado: 'completado',
    vehiculo_id: '4',
    conductor: 'Pedro Sánchez',
    carga_tipo: 'Materiales industriales',
    peso_kg: 22000,
    valor_total: 3200000,
    observaciones: 'Entrega exitosa sin novedad',
    created_at: '2024-08-25T06:00:00Z',
    updated_at: '2024-08-26T16:30:00Z',
    cliente: {
      nombre_empresa: 'Industrias Antioqueñas S.A.',
      contacto_principal: 'Ana Sofía Restrepo'
    },
    vehiculo: {
      placa: 'DEF456',
      tipo: 'Mula 2 Ejes'
    }
  }
]

export const mockQuotes: Quote[] = [
  {
    id: '1',
    cliente_id: '2',
    numero_cotizacion: 'COT-202408-0001',
    tipo_servicio: 'transporte_carga',
    descripcion: 'Transporte de productos alimenticios refrigerados',
    origen: 'Cali, Valle del Cauca',
    destino: 'Bogotá D.C.',
    fecha_solicitud: '2024-08-27T10:00:00Z',
    fecha_vencimiento: '2024-09-03',
    estado: 'enviada',
    tipo_carga: 'Productos refrigerados',
    peso_estimado: 12000,
    volumen_estimado: 45,
    valor_estimado: 2800000,
    descuento_porcentaje: 5,
    valor_final: 2660000,
    observaciones: 'Requiere vehículo refrigerado, temperatura entre 2-8°C',
    terminos_condiciones: 'Pago a 30 días, incluye seguro de mercancía',
    created_at: '2024-08-27T10:00:00Z',
    updated_at: '2024-08-27T10:00:00Z',
    cliente: {
      nombre_empresa: 'Comercializadora del Valle Ltda.',
      contacto_principal: 'Juan Carlos Méndez',
      email: 'jc.mendez@comvalle.com'
    }
  }
]

export const mockContainers: Container[] = [
  {
    id: '1',
    numero_contenedor: 'MSKU7465123',
    tipo: 'dry',
    tamaño: '40ft',
    cliente_id: '1',
    origen: 'Puerto de Buenaventura',
    destino: 'Bogotá D.C.',
    fecha_llegada: '2024-08-25T14:00:00Z',
    fecha_entrega_estimada: '2024-08-30',
    estado: 'en_puerto',
    ubicacion_actual: 'Puerto Buenaventura - Zona A',
    peso_bruto: 18500,
    peso_neto: 16200,
    mercancia: 'Productos textiles importados',
    observaciones: 'Contenedor en perfecto estado',
    numero_bl: 'BL-2024-089456',
    naviera: 'Maersk Line',
    buque: 'Maersk Sealand',
    viaje: 'MS-2024-08-15',
    created_at: '2024-08-25T14:00:00Z',
    updated_at: '2024-08-29T10:00:00Z',
    cliente: {
      nombre_empresa: 'Distribuidora Nacional S.A.S.',
      contacto_principal: 'María Fernández'
    }
  }
]
