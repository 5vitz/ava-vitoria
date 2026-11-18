import { NextResponse } from "next/server";

export async function GET() {
  const content = `# AVA Sem Limites (AVA Vitória)
> Marca autoral de streetwear de luxo inspirada na cultura urbana e nos cenários de Vitória/ES.
> Operação em Modelo Híbrido: Print on Demand (PoD) Silk HD + Estoque Físico Exclusivo.

## Identidade & Pilares
- **Atitude**: Presença marcante, rebeldia urbana e expressão autêntica.
- **Valorização**: Reconhecimento do talento local, do grafite e do material autoral.
- **Amizade**: Conexão real e engajamento comunitário fiel.

## Arquitetura Visual
- Estética da Subtração (Benchmark Balenciaga)
- Vitrine vertical em proporção 9:16
- Cards em Off-White Marfim (#FEFCF5) com linhas finas divisórias de 1px
- Grid de 3 colunas com modo de inspeção ativa e cobertura dos 8 vizinhos

## Canais de Distribuição Oficiais
- Loja Própria Oficial: https://www.ava-vitoria.com.br / https://www.avasemlimites.com.br
- Instagram Shopping & Meta Commerce Catalog
- Mercado Livre, Amazon Brasil, Shopee, SHEIN, TikTok Shop, Dafiti e Reserva

## Governança & Arquitetura Agêntica
- Sistema operacional gerido por 8 Departamentos e 19 Agentes de IA coordenados pelo Maestro Lincoln.
`;

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400"
    }
  });
}
