# Mapa de Intenciones y Flujos Conversacionales — Innovakine

## Intenciones Detectadas

### Intenciones Primarias (alta frecuencia)

| ID | Intencion | Frecuencia | Ejemplo |
|----|-----------|------------|---------|
| `info_tratamiento` | Consulta general sobre tratamiento | Muy alta | "Que tipo de tratamiento ofrecen?" |
| `info_precio` | Consulta de precios/valores | Muy alta | "Cuanto cuesta?", "Que valor tiene?" |
| `agendar_evaluacion` | Quiere agendar primera sesion | Muy alta | "Quiero agendar una hora" |
| `agendar_sesion` | Quiere agendar sesion de seguimiento | Alta | "Para cuando tenemos sesion?" |
| `reagendar` | Cambiar fecha/hora de cita | Muy alta | "Podemos reagendar?", "No podre asistir" |
| `cancelar` | Cancelar cita | Alta | "Necesito cancelar la hora" |
| `confirmar` | Confirmar asistencia | Muy alta | "Si, confirmo", "Nos vemos manana" |
| `ubicacion` | Donde esta la clinica | Alta | "Donde estan ubicados?" |
| `horarios` | Horarios de atencion | Media | "Hasta que hora atienden?" |
| `condicion_medica` | Consulta si sirve para su caso | Alta | "Sirve para artrosis?" |

### Intenciones Secundarias (media/baja frecuencia)

| ID | Intencion | Frecuencia | Ejemplo |
|----|-----------|------------|---------|
| `info_isapre` | Consulta sobre cobertura | Media | "Atienden FONASA?" |
| `info_otros_servicios` | Kine, masajes, recovery | Media | "Que otros servicios tienen?" |
| `solicitar_boleta` | Pide boleta/comprobante | Baja | "Me puedes enviar la boleta?" |
| `referir_persona` | Recomienda a alguien | Baja | "Mi amiga quiere agendar" |
| `reembolso` | Solicita devolucion | Baja | "Me pueden devolver el dinero?" |
| `atraso` | Avisa que llega tarde | Baja | "Voy atrasado" |
| `saludo_solo` | Solo saluda sin intencion clara | Media | "Hola", "Buenos dias" |
| `agradecimiento` | Agradece sin necesitar respuesta | Alta | "Muchas gracias" |
| `enviar_datos` | Envia datos personales solicitados | Alta | "Nombre: ..., RUT: ..." |

---

## Flujos Conversacionales Tipicos

### Flujo 1: Consulta Nueva → Evaluacion (el mas comun, ~35% de conversaciones)

```
Cliente: Saludo + consulta general
  ↓
Admin: Saludo + info del tratamiento + precio evaluacion
  ↓
Cliente: Pregunta adicional (precio plan, condicion medica, ubicacion)
  ↓
Admin: Responde + invita a agendar
  ↓
Cliente: Acepta, indica dia preferido
  ↓
Admin: Ofrece horarios disponibles
  ↓
Cliente: Elige horario
  ↓
Admin: Solicita datos (nombre, RUT, edad, diagnostico, medicamentos)
  ↓
Cliente: Envia datos
  ↓
Admin: Confirma reserva + info que enviara recordatorio
  ↓
[Dia anterior] Admin: Recordatorio con indicaciones
  ↓
Cliente: Confirma asistencia
```

**Duracion promedio**: 2-5 dias (desde primera consulta hasta la cita)
**Mensajes promedio**: 10-16

---

### Flujo 2: Paciente Recurrente — Reagendamiento (~30%)

```
Cliente: "Hola, no podre asistir hoy" / "Podemos reagendar?"
  ↓
Admin: "No hay problema, para que dia reagendamos?"
  ↓
Cliente: Indica dia/hora preferida
  ↓
Admin: Confirma o propone alternativa
  ↓
[Dia anterior] Admin: Recordatorio
  ↓
Cliente: Confirma
```

**Duracion promedio**: Minutos a 1 dia
**Mensajes promedio**: 4-8

---

### Flujo 3: Consulta de Informacion sin Conversion (~15%)

```
Cliente: Pregunta por info / precios
  ↓
Admin: Entrega informacion completa
  ↓
Cliente: "Ok gracias" / "Lo voy a pensar"
  ↓
[FIN — sin follow-up]
```

**Oportunidad de mejora**: Agregar follow-up automatico a las 48-72 horas.

---

### Flujo 4: Paciente Recurrente — Confirmacion de Recordatorio (~15%)

```
Admin: Recordatorio dia anterior
  ↓
Cliente: "Si, confirmo" / emoji de confirmacion
  ↓
[FIN]
```

**Mensajes promedio**: 2

---

### Flujo 5: Cancelacion por Emergencia (~5%)

```
Cliente: Explica situacion (salud, emergencia, viaje)
  ↓
Admin: Comprension + oferta de reagendar
  ↓
Cliente: Agradece / indica que avisara cuando pueda retomar
  ↓
[FIN o retoma semanas despues]
```

---

## Puntos de Decision para el Bot

### El bot PUEDE manejar:
- Info del tratamiento (respuestas estandarizadas)
- Precios y planes
- Ubicacion y horarios
- Indicaciones previas a sesion
- Consultas medicas generales (con respuestas pre-aprobadas)
- Primer paso del agendamiento (preguntar dia preferido)
- Saludo y bienvenida
- Follow-up de info sin conversion

### El bot DEBE derivar a humano:
- Completar agendamiento real (requiere ver agenda del sistema)
- Reagendamientos (requiere verificar disponibilidad)
- Reclamos o insatisfaccion
- Solicitudes de reembolso
- Consultas administrativas (boletas, SII)
- Condiciones medicas complejas o que requieren evaluacion profesional
- Negociaciones de precio
- Cualquier tema sensible (datos de salud detallados)
