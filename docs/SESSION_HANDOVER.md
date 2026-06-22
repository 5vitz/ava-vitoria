# 📍 Protocolo de Passagem de Bastão (Handover) — AVA Sem Limites

Este documento é a nossa âncora de persistência para as sessões de planejamento e codificação. Ele deve ser atualizado ao final de cada sessão e lido no início da próxima.

---

## 1. Onde Paramos (Estado Atual)

*   **Ajuste de Responsividade e Enquadramento do Hero ✅:**
    *   Limitada a altura máxima do contêiner `.hero` a no máximo `70vh` para garantir que o vídeo e os controles do player caibam inteiros e fiquem 100% visíveis na tela de notebooks com resolução `1366x768` (sem necessidade de scroll).
    *   Definida a propriedade `object-fit: contain` no elemento de vídeo, preservando a proporção nativa `1:1` com duas tarjas pretas verticais nas laterais e impedindo cortes no topo ou na base da animação.
    *   **Controles Centralizados:** A barra de controle do player foi centralizada horizontalmente na base da caixa (`left: 50%` e `transform: translateX(-50%)`), garantindo simetria perfeita e acessibilidade tanto no desktop quanto no mobile.
*   **Script de Deploy em 1 Clique ✅:** 
    *   Criado o script [/scripts/deploy.sh](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/scripts/deploy.sh) para automatizar o `git add`, `git commit` e `git push origin main`.
    *   Criado o lançador visual executável `/home/artz/Área de trabalho/AVA_Deploy.desktop` na sua Área de Trabalho com o logo da AVA para rodar o deploy sem abrir o terminal.
*   **Hero Video Atualizado ✅:** 
    *   Vídeo do skatista original (32,9 MB) otimizado com `ffmpeg` para `1080x1080` (3,04 MB) preservando o áudio original com qualidade total.
    *   Substituída a antiga animação de congelamento por um player de reprodução única (sem loop).
    *   Inseridos **controles customizados premium** (Play/Pause, Stop, Mute e Volume Slider) com fundo cinza escuro translúcido (`rgba(15, 15, 15, 0.6)`) e desfoque de fundo (`backdrop-filter: blur(8px)`).
    *   Configurado volume inicial em **20% unmuted** (o player tenta autoplay desmutado, ficando pausado se bloqueado pelo navegador para interação do usuário).
*   **Banco de Dados local running ✅:** Container Docker `ava-postgres` reiniciado e rodando na porta `5432`.
*   **Beachwear (Bikini001):** Concluímos o script de processamento de imagem em Python ([apply_bikini_logo.py](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/apply_bikini_logo.py)), que realiza o recorte de fundo (via IA local `rembg`), crop no busto/torso da modelo, e aplica a mesclagem da marca "ava" em 4 variantes de cor (Branco, Preto, Verde e Amarelo), além da imagem de vitrine corpo inteiro com o fundo original da praia.

---

## 2. Matriz de Produtos e Modelos (15 Peças)

Mapeamento da vitrine de 5 linhas com 3 colunas cada, cruzando os designs apresentados no PDF [COLECÇÃO 2026 AVA.pdf](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/public/COLEC%CC%A7A%CC%83O%202026%20AVA.pdf) com gênero e quantidade de imagens base (4 ângulos por modelo):

| Linha | Categoria de Produto | Design de Referência (PDF) | Gênero do Modelo | Imagens por Modelo | Total de Imagens |
| :--- | :--- | :--- | :--- | :---: | :---: |
| **Linha 1** | **Camisa Masculina 01**<br>**Camisa Masculina 02**<br>**Camisa Masculina 03** | "Sem Limites" (Branca/Chumbo)<br>"No Game / No Drama" (Marrom)<br>"Vix City / Ava Crew" (Branca) | Masculino | 4 ângulos | 12 |
| **Linha 2** | **Camisa Baby Look 01**<br>**Camisa Baby Look 02**<br>**Camisa Baby Look 03** | "Sem Limites" (Rosa)<br>"Fiz com Amor / O que faz sentido" (Branca)<br>"Avanowers / Brasil" (Amarela/Marrom) | Feminino | 4 ângulos | 12 |
| **Linha 3** | **Boné Aba Reta 01**<br>**Boné Aba Reta 02**<br>**Boné Aba Reta 03** | "Sem Limites"<br>"Swell Dealer / Surf"<br>"Altinha Addict" | Unissex | 4 ângulos | 12 |
| **Linha 4** | **Biquíni 01**<br>**Biquíni 02**<br>**Biquíni 03** | Bikini001 (Tanga / Cortininha)<br>Bikini002 (Asa Delta)<br>Bikini003 (Esportivo / Conceitual) | Feminino | 4 ângulos | 12 |
| **Linha 5** | **Sunga 01**<br>**Sunga 02**<br>**Sunga 03** | Sunga001 (Anatômica Clássica)<br>Sunga002 (Lateral Larga)<br>Sunga003 (Lateral Estreita) | Masculine | 4 ângulos | 12 |
| **Total** | **15 Peças** | **—** | **—** | **—** | **60 imagens** |

---

## 3. Prompts do FLUX.2 Pro/Max para Bikini001

Prompts em inglês otimizados na sessão anterior para a geração da modelo com pele bronzeada e cabelos pretos longos, em pose de mãos na cintura (para evitar oclusão de braços nas costuras):

### 1. Frente (Front View)
> `A high-fashion summer editorial photo of a beautiful athletic Brazilian female model with sun-kissed tanned skin and long straight black hair, wearing a minimalist blank matte-white string bikini (tanga style). She has a slight friendly smile, standing straight, hands placed firmly on her waist with elbows bent outwards away from her torso. Shot on location at a beautiful tropical beach, calm blue sea in the background, bright golden hour sunlight. Photorealistic skin texture, 35mm lens, premium swimwear campaign style.`

### 2. Costas (Back View)
> `A high-fashion summer editorial photo from behind, showing a beautiful athletic Brazilian female model with sun-kissed tanned skin and long straight black hair, wearing a minimalist blank matte-white string bikini (tanga style). Back view, standing straight, hands on her waist with elbows bent outwards. Beautiful tropical beach and blue ocean in the background, bright sunny day, soft shadows. Sharp focus on the fabric texture of the white bikini, highly detailed.`

### 3. De Cima para Baixo (High-Angle)
> `A high-angle photo looking down from a high perspective at a beautiful athletic Brazilian female model with sun-kissed tanned skin and long straight black hair, wearing a minimalist blank matte-white string bikini (tanga style). She is standing on the golden sand of a beach, looking up with a slight smile, hands on her waist with elbows bent outwards. Golden textured wet sand under her feet. Soft sunlight from the side, detailed fabric textures, realistic skin and sand details.`

### 4. De Baixo para Cima (Low-Angle)
> `A dramatic low-angle shot looking up at a beautiful athletic Brazilian female model with sun-kissed tanned skin and long straight black hair, wearing a minimalist blank white string bikini (tanga style). Imposing pose, standing tall, hands on her waist with elbows bent outwards. The camera is low, looking up towards the clear blue sky. Bright tropical sunlight casting crisp shadows, highly detailed fabric and skin texture.`

---

## 4. Próximos Passos Imediatos

1.  Gerar as imagens de base do **Bikini001** no FLUX (usando a mesma semente/seed para consistência da modelo).
2.  Atualizar o script de automação [apply_bikini_logo.py](file:///home/artz/Documentos/Antigravity/Ava-Vitoria/scripts/deploy.sh) para utilizar as novas imagens geradas.
3.  Definir a modelagem e os prompts para as camisas, bonés e sungas (restantes 14 modelos).
