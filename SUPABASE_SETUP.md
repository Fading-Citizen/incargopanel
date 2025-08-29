# Configuración de Supabase para INCARGO

## 1. Crear Proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) y crea una cuenta
2. Crea un nuevo proyecto llamado "incargo-admin"
3. Elige una región cercana (por ejemplo: South America)
4. Guarda la contraseña de la base de datos

## 2. Configurar Base de Datos

1. En el dashboard de Supabase, ve a **SQL Editor**
2. Crea una nueva query
3. Copia y pega todo el contenido del archivo `database.sql`
4. Ejecuta la query para crear todas las tablas

## 3. Obtener Credenciales

1. Ve a **Settings** > **API**
2. Copia los siguientes valores:
   - **Project URL** (NEXT_PUBLIC_SUPABASE_URL)
   - **anon public** key (NEXT_PUBLIC_SUPABASE_ANON_KEY)
   - **service_role** key (SUPABASE_SERVICE_ROLE_KEY)

## 4. Configurar Variables de Entorno

Edita el archivo `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_aqui
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tu_secret_aleatorio_aqui
```

## 5. Configurar Autenticación (Opcional)

Si quieres habilitar autenticación:

1. Ve a **Authentication** en Supabase
2. Configura **Providers** (Email/Password)
3. Configura **URL Configuration**:
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/**`

## 6. Configurar Row Level Security (RLS)

Las políticas básicas ya están incluidas en el script SQL, pero puedes ajustarlas:

1. Ve a **Authentication** > **Policies**
2. Revisa las políticas para cada tabla
3. Ajusta según tus necesidades de seguridad

## 7. Datos de Ejemplo

El script incluye datos de ejemplo para:
- 5 clientes principales de Colombia
- 6 vehículos de diferentes tipos
- Datos realistas basados en la empresa INCARGO

## 8. Deploy en Vercel

1. Conecta tu repositorio con Vercel
2. Configura las variables de entorno en Vercel:
   - Ve a **Settings** > **Environment Variables**
   - Añade todas las variables de `.env.local`
3. Despliega el proyecto

## 9. Verificación

Una vez configurado, deberías poder:
- Acceder al dashboard en `http://localhost:3000`
- Ver datos de ejemplo en todas las secciones
- Navegar entre las diferentes páginas del panel

## 10. Próximos Pasos

- Implementar autenticación completa
- Añadir funcionalidad CRUD para cada módulo
- Configurar notificaciones y emails
- Implementar reportes avanzados
- Integrar APIs de mapas para tracking

## Soporte

Si tienes problemas:
1. Verifica que las credenciales de Supabase sean correctas
2. Revisa la consola del navegador para errores
3. Verifica que el script SQL se ejecutó completamente
4. Comprueba que las variables de entorno estén bien configuradas
