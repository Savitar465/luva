# Luvasi- Ice Cream Shop Management System

Sistema de gestión para heladería construido con Next.js y Supabase.

## Configuración

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar Supabase

1. Crea un proyecto en [Supabase](https://supabase.com)
2. Ejecuta el siguiente SQL en el SQL Editor de Supabase:

```sql
-- 1. Tabla de productos (sabores + toppings + presentaciones)
CREATE TABLE productos (
    id              SERIAL PRIMARY KEY,
    nombre          VARCHAR(100) NOT NULL,
    tipo            VARCHAR(30) NOT NULL,
    precio_unitario NUMERIC(10,2) NOT NULL DEFAULT 0,
    imagen_url      VARCHAR(255),
    activo          BOOLEAN DEFAULT TRUE,
    creado_en       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (nombre, tipo)
);

-- 2. Tabla de formas de pago
CREATE TABLE formas_pago (
    id     SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL
);

INSERT INTO formas_pago (nombre) VALUES
    ('Efectivo'),
    ('Yape/QR'),
    ('Tarjeta'),
    ('Otro');

-- 3. Tabla de pedidos
CREATE TABLE pedidos (
    id               SERIAL PRIMARY KEY,
    total            NUMERIC(12,2) NOT NULL DEFAULT 0,
    forma_pago_id    INTEGER NOT NULL REFERENCES formas_pago(id),
    vendedor_pin     VARCHAR(10),
    creado_en        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado           VARCHAR(20) DEFAULT 'completado'
        CHECK (estado IN ('en_proceso', 'completado', 'anulado'))
);

-- 4. Detalle de pedidos
CREATE TABLE detalle_pedidos (
    id          SERIAL PRIMARY KEY,
    pedido_id   INTEGER NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
    producto_id INTEGER NOT NULL REFERENCES productos(id),
    cantidad    INTEGER NOT NULL DEFAULT 1 CHECK (cantidad > 0),
    precio_unit NUMERIC(10,2) NOT NULL,
    subtotal    NUMERIC(12,2) GENERATED ALWAYS AS (cantidad * precio_unit) STORED,
    nota        VARCHAR(100)
);

CREATE INDEX idx_pedidos_creado_en     ON pedidos (creado_en DESC);
CREATE INDEX idx_detalle_pedido_id     ON detalle_pedidos (pedido_id);
CREATE INDEX idx_productos_tipo_nombre ON productos (tipo, nombre);

CREATE VIEW ventas_diarias AS
SELECT
    DATE(creado_en) AS fecha,
    COUNT(*) AS num_ventas,
    SUM(total) AS total_ventas,
    AVG(total) AS ticket_promedio
FROM pedidos
WHERE estado = 'completado'
GROUP BY DATE(creado_en)
ORDER BY fecha DESC;
```

3. Agrega productos de ejemplo:

```sql
-- Presentaciones
INSERT INTO productos (nombre, tipo, precio_unitario) VALUES
    ('Cono Simple', 'presentacion', 3.00),
    ('Vaso Pequeño', 'presentacion', 3.50),
    ('1/4 kg', 'presentacion', 7.00),
    ('1/2 kg', 'presentacion', 12.00),
    ('1 kg', 'presentacion', 20.00);

-- Sabores
INSERT INTO productos (nombre, tipo, precio_unitario) VALUES
    ('Chocolate', 'sabor', 0.00),
    ('Vainilla', 'sabor', 0.00),
    ('Fresa', 'sabor', 0.00),
    ('Menta', 'sabor', 0.00),
    ('Limón', 'sabor', 0.00);

-- Toppings
INSERT INTO productos (nombre, tipo, precio_unitario) VALUES
    ('Chispas de chocolate', 'topping', 0.50),
    ('Salsa de fresa', 'topping', 0.75),
    ('Crema batida', 'topping', 1.00);
```

### 3. Variables de entorno

Copia el archivo `.env.local` y actualiza con tus credenciales de Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=tu-url-de-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-de-supabase
```

Puedes encontrar estas credenciales en: Settings > API > Project URL y anon/public key

### 4. Ejecutar el proyecto

```bash
npm run dev
```

Visita [http://localhost:3000/pedido](http://localhost:3000/pedido)

## Estructura del Proyecto

```
├── app/
│   ├── pedido/
│   │   ├── page.tsx          # Página principal de pedidos
│   │   ├── icons.tsx         # Componentes SVG
│   │   ├── types.ts          # Tipos TypeScript
│   │   └── data.ts           # Utilidades y mapeo de iconos
│   └── ...
├── lib/
│   ├── supabase/
│   │   ├── client.ts         # Cliente de Supabase
│   │   └── types.ts          # Tipos generados de la DB
│   └── services/
│       └── productos.ts      # Servicios para productos
└── ...
```

## Características

- ✅ Selección de presentaciones desde Supabase
- ✅ Gestión de productos (sabores, toppings, presentaciones)
- ✅ Sistema de pedidos
- 🚧 Selección de sabores (próximamente)
- 🚧 Gestión de toppings (próximamente)
- 🚧 Procesamiento de pagos (próximamente)
