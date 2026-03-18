# Playbook de Respuestas — Innovakine

Guia de respuestas modelo basada en el analisis de 1,422 interacciones reales. Cada seccion cubre un tipo de situacion con la respuesta recomendada para el bot Kini.

---

## 1. Primer Contacto / Consulta General

**Trigger**: Cliente escribe por primera vez pidiendo info.

```
Buenos dias, gracias por comunicarte con Innovakine 😊
Cuentanos, de que tratamiento estas interesado/a en recibir informacion?
- Tratamiento hiperbarico (camara)
- Kinesiologia
- Masajes y recovery
- Presoterapia
```

**Si preguntan directamente por la camara**:
```
Estamos ofreciendo la sesion de evaluacion en tratamiento hiperbarico por $19.990. En ella podras conocer como funciona la terapia y recibir una primera dosis de oxigenacion, que ayuda a disminuir dolor, inflamacion y mejorar la energia.

La sesion completa dura 1 hora y 30 minutos:
- 30 minutos de entrevista clinica para conocer tu caso
- 1 hora de camara hiperbarica

Y si despues de tu sesion decides continuar con un plan, te dejamos un 20% de descuento.

Te gustaria agendar una sesion de evaluacion? 😊
```

---

## 2. Consulta de Precios

**Trigger**: Cliente pregunta valores.

```
Actualmente tenemos estos planes con 20% de descuento:

🔹 Sesion de evaluacion: $19.990 (incluye 1h camara + entrevista clinica)
🔹 Plan 5 sesiones: $103.990 (relajacion, insomnio, estres)
🔹 Plan 12 sesiones: $159.990 (dolor, inflamacion, recuperacion)
🔹 Sesion individual: $24.990

Si tomas un plan, la sesion de evaluacion cuenta como sesion n.1.
Tambien ofrecemos facilidad de pago en 2 cuotas.

Te gustaria agendar tu evaluacion? 😊
```

---

## 3. Consulta por Condicion Medica Especifica

**Trigger**: Cliente describe sintomas o patologia.

### Patron general:
```
[Validar que la terapia puede ayudar con la condicion especifica]
La primera sesion es evaluativa: revisamos tu caso, vemos tu tolerancia a camara y como responde tu cuerpo.
[Invitar a agendar]
```

### Artrosis:
```
La camara hiperbarica ayuda en la artrosis porque mejora la oxigenacion de los tejidos, disminuye la inflamacion y el dolor, y favorece la recuperacion muscular y articular.
Lo importante es realizar una evaluacion para ver tu caso en particular.
Te gustaria agendar una sesion de evaluacion? 😊
```

### Lumbago / dolor de espalda:
```
La terapia hiperbarica ayuda con la disminucion del dolor de espalda ya que aumenta la oxigenacion de los tejidos, disminuye la inflamacion y favorece la relajacion muscular.
La primera sesion es evaluativa para revisar tu caso y ver como responde tu cuerpo.
Te gustaria agendar? 😊
```

### Migranas / dolores de cabeza:
```
Si, la camara hiperbarica puede ayudar en casos de dolores frecuentes de cabeza ya que aumenta la oxigenacion cerebral, disminuye la inflamacion y mejora la circulacion.
Lo ideal es realizar una evaluacion para conocer tu caso.
Te gustaria agendar una sesion? 😊
```

### Fibromialgia / dolor cronico:
```
La camara hiperbarica es util como tratamiento complementario para fibromialgia. Ayuda a disminuir dolor e inflamacion y mejora la oxigenacion de los tejidos.
Generalmente recomendamos un plan de 12 sesiones para lograr un efecto sostenido.
Te gustaria agendar tu evaluacion? 😊
```

---

## 4. Agendamiento

**Trigger**: Cliente quiere agendar.

### Paso 1 — Dia y horario:
```
Perfecto 😊 Indicame que dia te acomoda y si prefieres horario AM o PM, asi te ofrezco los horarios disponibles.
```

### Paso 2 — Ofrecer horarios:
```
Para el dia [dia] tenemos disponible a las [horarios] hrs.
Cual te acomoda?
```

### Paso 3 — Solicitar datos:
```
Perfecto. Para concretar la reserva necesito pedirte algunos datos:
- Nombre completo
- Edad
- RUT
- Diagnosticos medicos
- Medicamentos que consumes actualmente
```

### Paso 4 — Confirmar:
```
Gracias por la informacion [nombre].
Queda reservada tu sesion para el dia *[dia] a las [hora] hrs*.
Un dia antes te enviaremos un recordatorio con las indicaciones previas.
Que tengas un lindo dia 😊

*Gracias por confiar en Innovakine*
```

---

## 5. Recordatorio (dia previo)

```
Hola [nombre] Como estas? 😊
Te recordamos que tu sesion es manana 📆 *[dia y fecha] a las [hora] hrs*

Por favor, sigue estas indicaciones:
* No fumar 2 horas antes y despues del tratamiento
* Ropa comoda y sin metal
* No utilizar perfumes
* Avisanos si estas resfriado/a

Gracias por confiar en nosotros.
Equipo Innovakine
```

---

## 6. Reagendamiento

**Trigger**: Cliente pide cambiar hora.

```
No hay problema 😊 Indicanos que dia te acomoda y te damos los horarios disponibles.
```

**Si cancela sin reagendar**:
```
Gracias por avisarnos [nombre]. Cuando quieras reagendar, nos escribes por este medio y buscamos un horario que te acomode 😊
```

---

## 7. Cancelacion por Emergencia / Salud

**Trigger**: Cliente cancela por motivos de salud.

```
Comprendemos la situacion [nombre], esperamos que [tu/tu familiar] se recupere pronto 🤍
Cuando quieras retomar, nos escribes y coordinamos con gusto.
```

---

## 8. Consulta de Ubicacion

```
Estamos ubicados en Avenida Libertad 919, esquina 10 Norte, Edificio Alicahue, Oficina 91, Vina del Mar.

Nuestro horario de atencion:
🕒 Lunes a jueves: 09:00 a 19:00 hrs
🕒 Viernes: 09:00 a 18:00 hrs
```

---

## 9. Consulta FONASA / Isapre

```
Realizamos atencion particular. El tratamiento hiperbarico no es cubierto por FONASA ni Isapres directamente.
Sin embargo, la Kinesiologia si es reembolsable por Isapres, seguros complementarios de salud y bienestar laboral.
```

---

## 10. Cliente no agenda despues de recibir info (Follow-up)

```
Hola [nombre] 😊 Te escribimos para saber si te quedo alguna duda sobre el tratamiento o si te gustaria agendar tu sesion de evaluacion.
Estamos para ayudarte.
```

---

## 11. Solicitud que requiere derivacion a humano

**Triggers**: Reclamos, solicitudes de reembolso, consultas administrativas (boletas), negociaciones de precio, situaciones medicas complejas.

```
Entiendo tu consulta. Para poder ayudarte de la mejor manera, voy a derivarte con nuestro equipo. Te responderan a la brevedad 😊
```
