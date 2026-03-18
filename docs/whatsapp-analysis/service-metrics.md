# Metricas de Servicio — WhatsApp Innovakine

## Periodo: 14 dic 2025 — 17 mar 2026 (~3 meses)

---

## Volumetria

| Metrica | Valor |
|---------|-------|
| Conversaciones totales | 407 |
| Mensajes procesados | 5,954 |
| Pares Q&A | 1,422 |
| Promedio mensajes/conversacion | 15 |
| Chats vacios o con <2 mensajes | 194 (32% del total) |

---

## Tiempos de Respuesta

| Metrica | Valor |
|---------|-------|
| **Mediana** | **8 minutos** |
| Promedio | 21 horas (sesgado por respuestas de dias despues) |
| Mejor caso (percentil 25) | ~2 minutos |
| Peor caso (percentil 75) | ~45 minutos |

**Interpretacion**: El admin responde en menos de 10 minutos en la mayoria de los casos durante horario laboral. Las respuestas tardias (>1 hora) corresponden a mensajes recibidos fuera de horario o fines de semana.

---

## Distribucion Horaria

### Horas pico de mensajes

| Hora | Mensajes | Barra visual |
|------|----------|-------------|
| 08:00 | 366 | ████████████░░░░░░░░ |
| 09:00 | 464 | ███████████████░░░░░ |
| 10:00 | 455 | ██████████████░░░░░░ |
| **11:00** | **499** | **████████████████░░░░** |
| 12:00 | 477 | ███████████████░░░░░ |
| 13:00 | 476 | ███████████████░░░░░ |
| 14:00 | 372 | ████████████░░░░░░░░ |
| 15:00 | 398 | █████████████░░░░░░░ |
| **16:00** | **492** | **████████████████░░░░** |
| 17:00 | 442 | ██████████████░░░░░░ |
| 18:00 | 295 | █████████░░░░░░░░░░░ |
| 19:00 | 422 | █████████████░░░░░░░ |
| 20:00 | 179 | ██████░░░░░░░░░░░░░░ |
| 21:00 | 122 | ████░░░░░░░░░░░░░░░░ |
| 22:00 | 74  | ██░░░░░░░░░░░░░░░░░░ |

### Franjas clave:
- **Pico manana**: 11:00 (499 msgs)
- **Pico tarde**: 16:00 (492 msgs)
- **Valle**: 14:00-15:00 (almuerzo)
- **Fuera de horario significativo**: 19:00-21:00 (723 msgs, 12% del total)
- **Madrugada (00-07)**: 100 msgs (1.7%, despreciable)

---

## Tipologia de Conversaciones

| Tipo | % estimado | Descripcion |
|------|-----------|-------------|
| Consulta nueva → evaluacion | 35% | Cliente nuevo que agenda primera sesion |
| Reagendamiento/cancelacion | 30% | Paciente existente cambiando hora |
| Confirmacion de recordatorio | 15% | Solo confirma tras recordatorio |
| Consulta sin conversion | 10% | Pide info pero no agenda |
| Administrativa/proveedor | 5% | Boletas, SII, proveedores |
| Personal/no-clinica | 5% | Conversaciones internas, amigos |

---

## Tasa de Conversion Estimada

De las conversaciones que son consultas nuevas genuinas (~142 conversaciones):
- **~70% agenda evaluacion**: La mayoria de quienes preguntan terminan agendando
- **~15% pide info y dice "lo voy a pensar"**: No hay follow-up
- **~15% abandona**: No responde despues de recibir info

**Oportunidad**: El 30% que no convierte podria recuperarse con follow-up automatico a las 48-72h.

---

## Patrones de Cancelacion

- Las cancelaciones mas frecuentes son por motivos de salud propios o de familiares
- Muchos pacientes cancelan el mismo dia o el dia anterior
- El admin siempre responde con comprension y ofrece reagendar
- No hay penalizacion por cancelaciones tardias

---

## Metricas que Mejoraria el Bot

| Metrica actual | Con bot |
|----------------|---------|
| Tiempo respuesta fuera de horario: >12h | Inmediato (info) |
| Follow-up sin conversion: 0% | 100% (automatico a 48-72h) |
| Cobertura horaria: L-V 09-19 | 24/7 para info |
| Consistencia de respuestas: Variable | 100% estandarizada |
| Mensajes truncados: Frecuente | 0 |
| Respuestas duplicadas: Frecuente | 0 |
