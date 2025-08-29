# Panel Administrativo INCARGO

Panel administrativo moderno para INCARGO - Tu socio confiable en soluciones de Logística y transporte en todo el territorio nacional.

## 🚀 Características

- **Dashboard completo** con métricas en tiempo real
- **Gestión de flota** - Control total de vehículos y conductores
- **Gestión de clientes** - Administración de información de clientes
- **Gestión de servicios** - Control de proyectos logísticos
- **Sistema de cotizaciones** - Generación y seguimiento de cotizaciones
- **Gestión de contenedores** - Control de contenedores especializados
- **Reportes y analytics** - Visualización de datos y tendencias
- **Responsive design** - Optimizado para todos los dispositivos

## 🛠 Tecnologías

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: Supabase (PostgreSQL)
- **Charts**: Recharts
- **Icons**: Heroicons, Lucide React
- **Forms**: React Hook Form con Zod validation
- **UI Components**: Radix UI primitives
- **Deployment**: Vercel

## 📦 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone [repository-url]
   cd incargo
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env.local
   ```
   
   Editar `.env.local` con tus credenciales:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=tu_supabase_service_role_key
   ```

4. **Configurar la base de datos**
   - Crear un proyecto en [Supabase](https://supabase.com)
   - Ejecutar el script `database.sql` en el SQL Editor de Supabase
   - Esto creará todas las tablas y datos de ejemplo

5. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

## 🗄 Estructura de la Base de Datos

### Tablas Principales

- **users** - Usuarios del sistema administrativo
- **clients** - Clientes de INCARGO
- **vehicles** - Flota de vehículos
- **services** - Servicios y proyectos logísticos
- **quotes** - Cotizaciones
- **containers** - Gestión de contenedores

### Tipos de Servicios

- **Transporte Nacional** - Transporte de carga completa
- **Carga de Mercancía** - Transporte de carga parcial
- **Bodegaje** - Servicios de almacenamiento
- **Vehículos Rodados** - Transporte de vehículos
- **Proyectos Logísticos** - Soluciones integrales

### Tipos de Vehículos

- **Turbo** - Vehículos ligeros y rápidos
- **Sencillo** - Vehículos de una unidad
- **Dobletroque** - Camiones de doble eje trasero
- **Mini-mula 2 Ejes** - Unidades compactas
- **Mini-mula 3 Ejes** - Mayor capacidad y maniobrabilidad
- **Mula 2 Ejes** - Camiones especializados
- **Mula 3 Ejes** - Máxima capacidad (hasta 34 toneladas)
- **Refrigerado** - Control de temperatura
- **Plataforma Abierta** - Cargas voluminosas
- **Contenedor Especial** - Cargas delicadas

## 🚀 Deployment en Vercel

1. **Conectar con Vercel**
   ```bash
   npm i -g vercel
   vercel
   ```

2. **Configurar variables de entorno en Vercel**
   - Ir al dashboard de Vercel
   - Añadir las variables de entorno de Supabase
   - Hacer redeploy

3. **Configuración automática**
   El proyecto está configurado para deployment automático en Vercel.

## 📱 Funcionalidades del Panel

### Dashboard Principal
- Métricas clave (vehículos activos, clientes, servicios, ingresos)
- Gráfico de ingresos mensuales
- Actividad reciente
- Estado de la flota

### Gestión de Flota
- Lista completa de vehículos
- Estados: Disponible, En Tránsito, Mantenimiento
- Control de documentos (SOAT, Revisión Técnica)
- Información de conductores

### Gestión de Clientes
- Base de datos de clientes
- Información de contacto y facturación
- Historial de servicios
- Estados activo/inactivo

### Gestión de Servicios
- Tipos de servicio INCARGO
- Estados: Cotización, Confirmado, En Progreso, Completado
- Prioridades: Baja, Media, Alta, Urgente
- Asignación de vehículos

### Sistema de Cotizaciones
- Generación de cotizaciones
- Seguimiento de estados
- Fecha de validez
- Conversión a servicios

## 🎨 Diseño y UX

- **Verde INCARGO** como color principal (#10B981)
- **Diseño responsivo** para móviles y tablets
- **Navegación intuitiva** con sidebar
- **Componentes reutilizables** con Tailwind CSS
- **Estados visuales** con badges y colores

## 📞 Contacto INCARGO

- **Teléfono**: +57 321 562 5901
- **Email**: operaciones@incargo.co
- **Servicios**: Transporte nacional, carga, bodegaje, vehículos rodados

## 🤝 Contribuir

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto es privado y propiedad de INCARGO.

---

**INCARGO** - Tu socio confiable en soluciones de Logística y transporte 🚛
