# 🦴 O Esqueleto da AVA Vitória (Banco de Dados & Persistência)

Esta camada define a estrutura de dados relacional, a stack de tecnologia e a lógica de concorrência para garantir transações de estoque seguras.

---

## 1. Stack de Tecnologia Escolhida

Conforme documentado no [ADR-001: Escolha da Stack de Desenvolvimento](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/docs/estrutura/Esqueleto/ADR-001-escolha-da-stack.md), o projeto será desenvolvido utilizando:
*   **Framework Fullstack:** Next.js (React App Router, TypeScript)
*   **Banco de Dados:** PostgreSQL
*   **ORM / Query Builder:** Prisma ou Kysely (para queries tipadas)

---

## 2. Modelagem Física do Banco de Dados (DDL SQL)

Esta é a definição física das tabelas no PostgreSQL. A tabela `site_settings` é a base para a customização dinâmica da **Camada 1 (Alma)**.

```sql
-- 1. Configurações Dinâmicas do Design System (Customização do Admin)
CREATE TABLE site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    config_key VARCHAR(100) UNIQUE NOT NULL, -- ex: 'design_system'
    config_value JSONB NOT NULL,            -- Armazena cores, fontes, efeitos em formato JSON
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Produtos
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,      -- URL amigável para SEO (ex: 'moletom-oversized-preto')
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Imagens de Produtos (Suporte a carrossel 9:16)
CREATE TABLE product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    image_url VARCHAR(512) NOT NULL,
    display_order INT DEFAULT 0             -- Garante a ordenação correta das fotos
);

-- 4. Variantes de Estoque (Grade física por tamanho e cor)
CREATE TABLE stock_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    size VARCHAR(50) NOT NULL,              -- ex: 'P', 'M', 'G', 'GG'
    color VARCHAR(100) NOT NULL,            -- ex: 'Vinho', 'Preto'
    quantity INT NOT NULL DEFAULT 0,
    CONSTRAINT unique_product_variant UNIQUE (product_id, size, color)
);

-- 5. Pedidos (Checkout)
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, paid, failed, shipped
    total_amount DECIMAL(10, 2) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    payment_id VARCHAR(255) UNIQUE,         -- ID retornado pelo Gateway de Pagamento
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Itens do Pedido
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES stock_variants(id) ON DELETE RESTRICT,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL
);

-- Índices Recomendados para Otimização de Leitura
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_stock_variants_product ON stock_variants(product_id);
```

---

## 3. Lógica de Segurança Transacional (Prevenção de Overselling)

No Next.js (utilizando Prisma em Server Actions), a compra deve ser executada dentro de uma transação sequencial para garantir que a leitura e a escrita do estoque sejam atômicas.

### Exemplo de Código da Transação (Prisma Client)
```typescript
import { prisma } from "@/lib/db";

async function processCheckout(variantId: string, requestedQty: number, customerData: any) {
  return await prisma.$transaction(async (tx) => {
    // 1. Bloqueia a linha de estoque para escrita (Pessimistic Locking no PostgreSQL)
    const variant = await tx.$queryRaw<any[]>`
      SELECT quantity FROM stock_variants 
      WHERE id = ${variantId}::uuid 
      FOR UPDATE
    `;

    if (!variant || variant.length === 0) {
      throw new Error("Variante não encontrada");
    }

    const currentQty = variant[0].quantity;

    // 2. Valida se o estoque é suficiente
    if (currentQty < requestedQty) {
      throw new Error("Estoque insuficiente para a variante selecionada");
    }

    // 3. Decrementa o estoque físico
    await tx.$executeRaw`
      UPDATE stock_variants 
      SET quantity = quantity - ${requestedQty} 
      WHERE id = ${variantId}::uuid
    `;

    // 4. Cria o Pedido (Order)
    const order = await tx.orders.create({
      data: {
        customer_email: customerData.email,
        customer_name: customerData.name,
        total_amount: customerData.total,
        status: "pending",
      }
    });

    // 5. Cria o Item do Pedido (OrderItem)
    await tx.orderItems.create({
      data: {
        order_id: order.id,
        variant_id: variantId,
        quantity: requestedQty,
        unit_price: customerData.price,
      }
    });

    return order;
  });
}
```

---

## 4. Integração Dinâmica da Camada 1 (Alma)

A tabela `site_settings` armazenará a chave `'design_system'` com os tokens visuais.

### Payload JSON de Exemplo em `site_settings.config_value`:
```json
{
  "theme": "dark",
  "colors": {
    "bg": "#1F080F",
    "accent": "#D4AF37",
    "text_primary": "#FFFFFF",
    "text_secondary": "#A0A0A0",
    "border": "rgba(255, 255, 255, 0.1)"
  },
  "fonts": {
    "title_family": "Outfit",
    "body_family": "Plus Jakarta Sans",
    "title_weight": "700",
    "body_weight": "300"
  },
  "effects": {
    "border_width": "1px",
    "backdrop_blur": "12px"
  }
}
```

### Injeção em Tempo de Execução (Next.js Root Layout)
No arquivo `/app/layout.tsx`, buscaremos esses dados do banco de dados (que possui cache em memória para evitar hits repetitivos) e injetaremos dinamicamente em variáveis CSS globais no cabeçalho do documento, permitindo atualização imediata no painel administrativo.
