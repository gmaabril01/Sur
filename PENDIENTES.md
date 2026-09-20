# SUR Helado | Café: estado de la web y datos que faltan

## Ya incluido (datos confirmados)

- Nombre, dirección (Calle Pirandello, 8, Teatinos-Universidad, 29010 Málaga) y ubicación en Google Maps.
- Instagram @surheladocafe.
- Horario: martes a viernes 9:00–23:00 · sábado 11:00–24:00 · domingo 11:00–20:00 · lunes cerrado.
- Terraza.
- Carta completa copiada de los PDF (español; los nombres en inglés salen de la carta inglesa).
- 4 reseñas reales de Google y enlace a la ficha para dejar reseñas.
- 8 fotos reales del local y 3 fotos de producto recortadas de la propia carta (croffles, tostas, alfajor).
- Versión en inglés (botón ES / EN arriba).

## Falta (aparece marcado en la web con borde discontinuo)

1. **Teléfono.**
2. **WhatsApp / email** (si los usan con clientes; si no, se quita la tarjeta).
3. **Precios de tarrina y cucurucho**: no aparecen en la carta.
4. **Precio de los croffles recomendados** (Croffle Sur, Banana latte, Pistacho bomba,
   Rey del Lotus): la carta no les pone precio.
5. **Horario en festivos** y si cambia entre verano e invierno.
6. **Otros servicios**: para llevar, Wi-Fi, pago con tarjeta, reparto a domicilio, opciones sin
   lactosa, veganas, sin azúcar o sin gluten, acceso en silla de ruedas, mascotas en la terraza,
   tarjeta de fidelidad.
7. **Datos legales** del titular (nombre o razón social, NIF/CIF, domicilio, email) para el
   Aviso legal y la Política de privacidad.

## A confirmar con el negocio

- **Agua sin gas**: 1,20 € en la carta española y 2 € en la inglesa. En la web he puesto 1,20 €.
- **"Solo"** se traduce en su carta inglesa como "Double espresso". Lo he respetado.
- **Logo**: la web usa de momento un logotipo de texto "SUR" en verde. Conviene el logo original
  en SVG o PNG.
- **Fotos**: si alguna de las fotos se descargó de Google Maps o de Instagram y la hizo un
  cliente, hay que tener permiso para usarla. En la foto de la vitrina con la terraza se ven
  clientes: mejor tener su permiso o usar otra.
- **Fotos pequeñas**: tres fotos (perro con tarrinas, croffle con Lacasitos y detalle de la
  vitrina) miden solo 215×280 px y se ven algo borrosas en grande. Si existen los originales,
  se sustituyen sin tocar nada más.
- **Reseñas**: están copiadas tal cual; solo he corregido dos erratas ("bownie" → "brownie" y
  "sus ambiente" → "su ambiente").

## Para publicar

- Dominio (p. ej. surheladocafe.es) y hosting.
- Quitar `<meta name="robots" content="noindex, nofollow">` de index.html.
- Quitar `class="is-draft"` de `<body>` (desaparecen las marcas de pendiente y el aviso de borrador).
- Completar las líneas comentadas de `canonical` y `og:url` con el dominio.
