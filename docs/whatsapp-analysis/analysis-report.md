# Reporte de Analisis — Conversaciones WhatsApp Innovakine

## Resumen Ejecutivo

Se analizaron **407 conversaciones** con **5,954 mensajes** y **1,422 pares pregunta-respuesta** del WhatsApp de Innovakine, cubriendo el periodo del 14 de diciembre 2025 al 17 de marzo 2026.

## Metricas Clave

| Metrica | Valor |
|---------|-------|
| Conversaciones analizadas | 407 |
| Mensajes procesados | 5,954 |
| Pares Q&A extraidos | 1,422 |
| Promedio mensajes/conversacion | 15 |
| Mediana tiempo de respuesta | **8 minutos** |
| Promedio tiempo de respuesta | 21 horas (sesgado por respuestas tardias) |

## Distribucion Horaria de Mensajes

| Franja | Mensajes | % del total |
|--------|----------|-------------|
| 08:00-09:00 | 366 | 6.1% |
| 09:00-10:00 | 464 | 7.8% |
| 10:00-11:00 | 455 | 7.6% |
| **11:00-12:00** | **499** | **8.4%** |
| 12:00-13:00 | 477 | 8.0% |
| 13:00-14:00 | 476 | 8.0% |
| 14:00-15:00 | 372 | 6.2% |
| 15:00-16:00 | 398 | 6.7% |
| **16:00-17:00** | **492** | **8.3%** |
| 17:00-18:00 | 442 | 7.4% |
| 18:00-19:00 | 295 | 5.0% |
| 19:00-20:00 | 422 | 7.1% |
| 20:00-24:00 | 398 | 6.7% |
| 00:00-08:00 | 100 | 1.7% |

**Picos**: 11:00 y 16:00. Actividad significativa fuera de horario (19:00-22:00).

## Temas Mas Frecuentes (por volumen de Q&A)

### 1. Agendamiento y reagendamiento (~40% de interacciones)
El tema dominante. Incluye:
- Solicitar hora nueva
- Reagendar por imprevistos personales
- Confirmar asistencia tras recordatorio
- Cancelar sesiones con aviso

### 2. Informacion del tratamiento hiperbarico (~25%)
- Que es, como funciona, cuanto dura
- Presion de trabajo (1.5 ATA)
- Comodidad de la camara
- Frecuencia recomendada (2-3 veces/semana)

### 3. Precios y planes (~15%)
- Valor evaluacion ($19.990)
- Planes de 5 y 12 sesiones
- Sesiones individuales ($24.990)
- Descuento 20% en planes
- Facilidades de pago (2 cuotas)

### 4. Consultas medicas especificas (~10%)
- Artrosis, lumbago, fibromialgia, migranas
- Post-cirugia
- Contraindicaciones (hipertension, resfrio)
- Condiciones especificas de cada paciente

### 5. Ubicacion y horarios (~5%)
- Direccion (Av. Libertad 919, Vina del Mar)
- Horarios (L-J 09-19, V 09-18)
- No atienden sabados

### 6. Otros (~5%)
- Consultas administrativas (boletas, SII)
- Servicios adicionales (kine, masajes, presoterapia)
- Reembolsos y politicas de cancelacion
- Convenios con Isapres

## Analisis del Estilo de Comunicacion del Admin

### Fortalezas
1. **Tono calido y profesional**: Uso consistente de emojis amigables (😊☺️), saludos personalizados con nombre del paciente
2. **Respuestas completas**: Cuando dan informacion del tratamiento, es detallada y educativa
3. **Flexibilidad**: Acomodan cambios de horario sin problema, incluso hacen sobrecupos
4. **Empatia**: Ante cancelaciones por salud/emergencias, responden con comprension genuina
5. **Seguimiento proactivo**: Envian recordatorios dia antes con indicaciones claras
6. **Rapidez**: Mediana de 8 minutos, excelente para atencion por WhatsApp

### Debilidades y Falencias

#### 1. Respuestas cortadas
Muchas respuestas aparecen truncadas — el mensaje se corta a mitad de oracion. Esto da una impresion de descuido. Ejemplos: "Gracias por confiar en no", "Gracias por confia", "La sesion completa dura 1".

#### 2. Inconsistencia en el formato de precios
A veces dicen "$19.990", otras "19.000", otras no mencionan el precio hasta que lo preguntan explicitamente. Falta un pitch estandarizado.

#### 3. Falta de cierre comercial
Despues de dar informacion, muchas veces no se invita al paciente a agendar. Se pierde la oportunidad de conversion. El admin espera que el cliente tome la iniciativa.

#### 4. Conversaciones no-clinicas mezcladas
Se detectaron conversaciones con proveedores (agua, electricista), el contador (SII, boletas), y amigos (Renzo) en el mismo canal. Esto puede generar confusion y falta de profesionalismo.

#### 5. Mensajes informales/inapropiados ocasionales
Se detectaron mensajes como "que vergas JAJAJ", "Claro y las reglas las pone ella la patuda" — claramente conversaciones internas que no deberian ocurrir en el canal de atencion.

#### 6. Datos sensibles por WhatsApp
Se solicitan y reciben RUT, diagnosticos medicos y medicamentos por WhatsApp sin ningun protocolo de seguridad. Esto es un riesgo de privacidad.

#### 7. Falta de seguimiento post-sesion
No hay evidencia de seguimiento sistematico despues de la primera sesion. Los pacientes que no agendan plan no reciben un follow-up.

#### 8. Respuestas duplicadas
Frecuentemente se envian mensajes duplicados (el mismo texto 2 veces seguidas). Esto sugiere un problema tecnico o de proceso.

#### 9. Manejo de objeciones de precio debil
Cuando un paciente pregunta sobre precios y no agenda, no hay un proceso de re-engagement o manejo de objeciones. Simplemente "quedamos atentas".

#### 10. Tiempo de respuesta fuera de horario
Mensajes que llegan despues de las 19:00 o en fines de semana a veces no se responden hasta el dia siguiente, sin un mensaje automatico que informe del horario.

## Hallazgos Adicionales (segunda pasada — bloques completos)

### Mensajes admin-iniciados no capturados en Q&A
1. **Mensajes proactivos de venta post-evaluacion**: El admin envia mensajes detallados con planes y precios despues de la evaluacion presencial (ej: "segun lo conversado hoy, te dejo la informacion..."). Esto es una buena practica pero no se hace sistematicamente.
2. **Solicitud de resenas Google**: Se pide a pacientes que terminan plan que dejen resena en Google. Se envia link directo.
3. **Ofertas personalizadas**: Se crean ofertas especiales para pacientes recurrentes (ej: gift card de $20.000 para camara + drenaje).
4. **Envio de informes clinicos**: Se envian informes de presiones pre/post sesion y documentos para Isapre via WhatsApp.
5. **Campanas promocionales**: Se envian imagenes con promociones (ej: Full Recovery con drenaje linfatico) a contactos existentes.
6. **Contacto proactivo a referidos**: Cuando un paciente refiere a alguien, Daniela les escribe presentandose profesionalmente.

### Patrones de interaccion no detectados antes
1. **Clientes que viajan de lejos**: Se detectaron pacientes de Quintero, Con Con, La Ligua, Santiago. La distancia es un factor en cancelaciones.
2. **Pacientes adultos mayores acompanados**: Muchos vienen con familiares que son el contacto real por WhatsApp.
3. **Miedo a la camara**: Al menos 2 pacientes expresaron miedo a claustrofobia/ahogarse. El admin maneja bien estas objeciones.
4. **Audios frecuentes**: Muchos clientes (especialmente adultos mayores) se comunican por audio, no texto. El bot necesita manejar esto (transcripcion).
5. **Pacientes que pagan por mitad del plan**: El sistema de 2 cuotas es usado frecuentemente. Se envian datos de transferencia por WhatsApp.
6. **Confusiones con automatizacion**: Un paciente recibio un mensaje automatizado por error y el admin tuvo que disculparse por "pruebas de automatizacion".

### Servicios y precios descubiertos en segunda pasada
- **Full Recovery individual**: $39.990 (camara + presoterapia + drenaje)
- **Full Recovery 5 sesiones**: $179.990
- **Full Recovery 10 sesiones**: $299.990
- **Drenaje linfatico + presoterapia 10 sesiones**: $249.990
- **Ventosas**: $29.990 (1 hora)
- **Kinesiologia a domicilio**: $35.000/sesion (reembolsable por Isapre)
- **Gift card especial pacientes recurrentes**: $20.000 (camara + 30min drenaje)
- **Valor original plan 12 sesiones**: $199.990 (con dcto queda en $159.990)

### Datos operativos descubiertos
- **Datos bancarios**: INNOVAKINE SPA, RUT 78.215.314-5, Scotiabank CTA CTE 992415495
- **Google Maps**: https://maps.app.goo.gl/h4YHHEDUNvz4S4a37
- **Google Reviews**: https://g.page/r/CR-_mBAYeSENEBI/review
- **Referencia ubicacion**: "A unas cuadras del mall marina y de la playa"
- **Email**: INNOVAKINEVINA@GMAIL.COM
- **Cierre por imprevistos**: Usan mensaje estandar para avisar cancelacion del dia
- **Sobrecupos**: Se hacen sobrecupos hasta las 18:45-19:00 para pacientes que no pueden en horario regular

## Oportunidades de Mejora con el Bot

1. **Respuesta inmediata 24/7**: El bot puede responder consultas de informacion fuera de horario
2. **Cierre comercial consistente**: Siempre invitar a agendar despues de informar
3. **Estandarizacion**: Misma informacion de precios/planes siempre completa y correcta
4. **Derivacion inteligente**: Saber cuando pasar al admin (reagendamientos, consultas medicas complejas, reclamos)
5. **Seguimiento automatizado**: Follow-up post-evaluacion para pacientes que no agendaron plan
6. **Separacion de canales**: Conversaciones internas/proveedores no deberian pasar por el WhatsApp de atencion
7. **Transcripcion de audios**: Muchos clientes envian audios — el bot necesita poder procesarlos (ya implementado con Whisper)
8. **Envio de link Google Maps**: Automatizar envio de ubicacion con link de maps cuando un paciente es nuevo
9. **Solicitud automatica de resenas**: Al finalizar un plan, enviar automaticamente solicitud de resena Google
10. **Oferta post-evaluacion**: Enviar resumen de planes con precios automaticamente despues de la primera evaluacion
