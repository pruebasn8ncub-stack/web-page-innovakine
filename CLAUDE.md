# InnovaKine — Plataforma de Gestión Clínica

Proyecto: Next.js 14 (App Router) + Supabase + N8N + Vercel
Idioma UI: Español (es-CL)
Idioma código: Inglés (variables, funciones, commits)

## Arquitectura

- **Frontend**: Next.js 14 (App Router) + React 18 + TypeScript 5
- **Estilos**: Tailwind CSS + Framer Motion
- **Base de datos**: Supabase (PostgreSQL self-hosted en Hostinger/EasyPanel)
- **Auth**: Supabase Auth con roles en tabla `profiles` (admin, professional, receptionist)
- **Backend API**: api-agenda-web en Hostinger/EasyPanel
- **Chatbot IA**: "Kini" via N8N webhooks
- **Deploy frontend**: Vercel
- **Deploy backend**: Hostinger VPS con EasyPanel

### Patrón de datos

- **Lecturas**: directas a Supabase desde frontend
- **Escrituras críticas**: a través del backend API (`/api/v1/`)
- No crear API routes en Next.js para lo que el backend ya maneja

### Variables de entorno

- Credenciales en `.env.local` (NUNCA hardcodear)
- Template en `.env.example`
- Las variables `NEXT_PUBLIC_*` son visibles en el cliente
- Variables server-only (sin prefijo) solo accesibles en API routes y server components

## Estructura del Proyecto

```
src/
├── app/                    # Next.js App Router
│   ├── admin/              # Portal administrativo
│   │   ├── agenda/         # Calendario y citas
│   │   ├── dashboard/      # Dashboard principal
│   │   ├── patients/       # Gestión de pacientes
│   │   ├── professionals/  # Gestión de profesionales
│   │   ├── services/       # Configuración de servicios
│   │   ├── resources/      # Recursos físicos (boxes, cámaras)
│   │   ├── schedules/      # Horarios profesionales
│   │   └── exceptions/     # Excepciones de horario
│   ├── api/chat/           # Endpoint chatbot → N8N
│   └── page.tsx            # Landing pública
├── components/             # Componentes reutilizables
├── lib/                    # Utilidades y servicios
│   ├── supabase.ts         # Cliente Supabase
│   ├── utils.ts            # Helpers (cn, etc.)
│   ├── api-response.ts     # Builder de respuestas API
│   ├── error-handler.ts    # Middleware de errores
│   └── errors.ts           # Clases de error custom
├── types/                  # TypeScript interfaces
└── tests/                  # Tests unitarios (Vitest)
```

## Seguridad (CRÍTICO — datos médicos)

- **NUNCA** loguear datos de pacientes (nombre, rut, teléfono, email) en `console.log`
- Toda tabla con datos de pacientes **DEBE** tener RLS activado
- **NUNCA** hardcodear credenciales — siempre `.env.local`
- **NO** commitear archivos `.env`
- Validar todos los inputs del usuario antes de enviar a Supabase o al backend
- Las API routes que manejan datos sensibles deben verificar autenticación
- Sanitizar datos antes de renderizar (prevenir XSS)

## Reglas de Código

### TypeScript

- Modo estricto — no usar `any`
- Path alias `@/` para imports (`@/components/`, `@/lib/`, etc.)
- Validar inputs con Zod
- Formularios con React Hook Form + `@hookform/resolvers`

### Componentes

- Componentes reutilizables en `src/components/`
- Páginas en `src/app/`
- Textos de UI en español
- Variables, funciones y nombres de archivo en inglés
- Usar `cn()` de `@/lib/utils` para clases condicionales

### Estilos

- Tailwind CSS siempre — no CSS inline ni módulos CSS
- Usar variables del design system: `--cyan`, `--teal`, `--navy`, `--bg-main`, `--surface`
- Font: Outfit (configurada en layout.tsx)
- Animaciones con Framer Motion
- Iconos con Lucide React
- Border radius: `rounded-lg` (24px), `rounded-md` (16px), `rounded-sm` (12px)

### Git

- Conventional commits: `feat:`, `fix:`, `style:`, `chore:`, `refactor:`
- Verificar build (`npm run build`) antes de push a main
- No commitear `.next/`, `node_modules/`, `.env*`

### Testing

- Framework: Vitest
- Tests en `src/tests/`
- Mockear Supabase client en tests unitarios
- Ejecutar: `npx vitest run`

## Prohibiciones

- **NO** instalar dependencias sin justificación
- **NO** modificar `tailwind.config.ts` ni `next.config.mjs` sin preguntar
- **NO** borrar ni renombrar tablas de Supabase sin aprobación
- **NO** modificar la estructura de roles (`admin`, `professional`, `receptionist`)
- **NO** cambiar URLs de producción sin confirmar
- **NO** hacer push force a main

## Tablas Principales (Supabase)

| Tabla | Descripción |
|-------|-------------|
| `profiles` | Usuarios con roles |
| `patients` | Datos de pacientes (soft delete) |
| `services` | Servicios médicos |
| `service_phases` | Fases de servicios multi-fase |
| `appointments` | Citas médicas |
| `appointment_allocations` | Asignación de profesional/recurso por fase |
| `physical_resources` | Salas y equipos (chamber, box) |
| `schedule_blocks` | Bloques de disponibilidad semanal |
| `schedule_exceptions` | Bloqueos, feriados, ausencias |
| `whatsapp_conversations` | Conversaciones WhatsApp (`contact_name`=pushName, `custom_name`=nombre del admin) |
| `whatsapp_messages` | Mensajes individuales de WhatsApp |
| `whatsapp_bot_settings` | Configuración global del bot Kini |

## Acceso a Infraestructura (VPS Hostinger)

Todos los servicios de backend (Supabase, N8N, Evolution API, EasyPanel) corren en el VPS de Hostinger.
Para intervenir directamente (SQL, Docker, configs), usar SSH:

```bash
ssh VPSHostinger    # Alias configurado en ~/.ssh/config → root@187.77.229.36
```

### Comandos útiles via SSH

| Tarea | Comando |
|-------|---------|
| SQL en Supabase | `ssh VPSHostinger "docker exec -i supabase-db-1 psql -U postgres -c 'TU SQL AQUI'"` |
| Ver containers | `ssh VPSHostinger "docker ps --format '{{.Names}}'"` |
| Logs de un container | `ssh VPSHostinger "docker logs --tail 50 CONTAINER_NAME"` |
| Restart container | `ssh VPSHostinger "docker restart CONTAINER_NAME"` |

### Containers principales

| Container | Servicio |
|-----------|----------|
| `supabase-db-1` | PostgreSQL (base de datos principal) |
| `supabase-rest-1` | PostgREST API |
| `supabase-auth-1` | Auth server |
| `supabase-realtime-1` | Realtime subscriptions |
| `supabase-kong-1` | API Gateway |
| `supabase-studio-1` | Dashboard UI |
| `supabase-storage-1` | File storage |

**IMPORTANTE**: Siempre usar SSH para operaciones de BD, Docker, N8N o Evolution API. No intentar usar MCP de Supabase ni RPC — el acceso directo es via SSH.

## URLs de Servicios

Las URLs están en `.env.local`. No referenciar URLs de producción directamente en el código.

## Auto-actualización

Este archivo es un **documento vivo**. Claude debe actualizarlo cuando:

- Descubra una regla crítica que no está documentada
- Se agregue una nueva tabla, servicio o integración
- Cambie la arquitectura o patrones del proyecto
- Se identifique un error recurrente que debe prevenirse
- Se instale una nueva dependencia importante

### Variables de entorno

Cuando Claude identifique o reciba una nueva credencial, URL de servicio o API key:

1. Agregarla a `.env.local` con el valor real
2. Agregarla a `.env.example` sin el valor (solo el nombre de la variable)
3. Actualizar el código para leerla desde `process.env` (nunca hardcodear)
4. Si es pública (accesible desde el cliente), usar prefijo `NEXT_PUBLIC_`

Al actualizar, agregar la regla en la sección correspondiente y mantener el archivo conciso.
