import os
from fpdf import FPDF

class AVA_PDF(FPDF):
    def header(self):
        # Top Header line
        self.set_text_color(160, 160, 160)
        self.set_font('Helvetica', 'I', 8)
        self.cell(0, 10, 'AVA SEM LIMITES  |  GUIA DE INTEGRACAO COM INSTAGRAM', 0, 1, 'L')
        # Add a subtle border line under header
        self.set_draw_color(220, 220, 220)
        self.line(10, 18, 200, 18)
        self.ln(10)

    def footer(self):
        # Position at 1.5 cm from bottom
        self.set_y(-15)
        # Helvetica italic 8
        self.set_font('Helvetica', 'I', 8)
        self.set_text_color(160, 160, 160)
        # Page number
        self.cell(0, 10, f'Pagina {self.page_no()}', 0, 0, 'C')

def create_instagram_shopping_pdf():
    pdf = AVA_PDF()
    pdf.set_margins(15, 20, 15)
    pdf.add_page()
    
    # Helper for latin-1 translation
    def t(txt):
        return txt.encode('latin-1', 'replace').decode('latin-1')

    # TITLE
    pdf.set_font('Helvetica', 'B', 18)
    pdf.set_text_color(255, 77, 28) # AVA Orange #FF4D1C
    pdf.cell(0, 10, t('Passo a Passo: Habilitar Sacolinha do Instagram'), 0, 1, 'L')
    
    pdf.set_font('Helvetica', '', 11)
    pdf.set_text_color(100, 100, 100)
    pdf.cell(0, 6, t('Projeto AVA Sem Limites  -  Guia de Providencias Comerciais e Tecnicas'), 0, 1, 'L')
    pdf.ln(5)

    # INTRODUCTION BOX
    pdf.set_fill_color(248, 248, 248)
    pdf.set_draw_color(255, 77, 28)
    pdf.set_line_width(0.5)
    
    intro_text = t(
        'Este documento serve como guia pratico para a reuniao com o cliente. Ele descreve '
        'detalhadamente todas as etapas comerciais e as configuracoes tecnicas necessarias '
        'para ativar o recurso de marcacao de produtos (Sacolinha) e fazer com que a aba '
        'Loja apareca no perfil oficial do Instagram da AVA Sem Limites.'
    )
    pdf.rect(15, pdf.get_y(), 180, 24, 'FD')
    pdf.set_xy(18, pdf.get_y() + 2)
    pdf.set_font('Helvetica', '', 9.5)
    pdf.set_text_color(50, 50, 50)
    pdf.multi_cell(174, 5, intro_text)
    pdf.ln(8)

    # SECTION 1
    pdf.set_font('Helvetica', 'B', 13)
    pdf.set_text_color(13, 3, 6) # Dark color
    pdf.cell(0, 8, t('Etapa 1: Requisitos da Conta Comercial'), 0, 1, 'L')
    
    pdf.set_font('Helvetica', '', 10)
    pdf.set_text_color(60, 60, 60)
    
    requirements = [
        ('1. Converter a Conta do Instagram:', 'O perfil oficial do Instagram da AVA Sem Limites deve ser uma Conta Comercial (Profissional). A conversao e gratuita nas configuracoes de conta do aplicativo.'),
        ('2. Criar Pagina do Facebook:', 'O Instagram comercial deve estar obrigatoriamente conectado a uma Pagina do Facebook da marca. Ambas as contas devem ser vinculadas no mesmo painel.'),
        ('3. Centralizar no Meta Business Manager:', 'A Pagina do Facebook e a conta do Instagram devem estar sob a mesma conta do Gerenciador de Negocios da Meta (Meta Business Manager), gerenciado pela agencia/lojista.')
    ]
    
    for title, desc in requirements:
        pdf.set_x(15)
        pdf.set_font('Helvetica', 'B', 10)
        pdf.cell(10, 6, t('-'), 0, 0)
        pdf.cell(60, 6, t(title), 0, 0)
        pdf.set_font('Helvetica', '', 10)
        pdf.multi_cell(110, 6, t(desc))
        pdf.ln(2)
    
    pdf.ln(3)

    # SECTION 2
    pdf.set_font('Helvetica', 'B', 13)
    pdf.set_text_color(13, 3, 6)
    pdf.cell(0, 8, t('Etapa 2: Verificacao do Dominio (Seguranca do Site)'), 0, 1, 'L')
    
    pdf.set_font('Helvetica', '', 10)
    pdf.set_text_color(60, 60, 60)
    
    domain_text = t(
        'A Meta exige que o lojista comprove que e o proprietario legitimo do site para evitar '
        'fraudes. Devemos verificar o dominio oficial da marca no Gerenciador de Negocios da Meta.'
    )
    pdf.multi_cell(0, 5, domain_text)
    pdf.ln(2)

    methods = [
        ('Metodo 1 (Recomendado): Meta Tag HTML', 'Adicionar um codigo de meta tag HTML fornecido pela Meta no cabecalho (<head>) do nosso site. Nos (IAs) cuidamos disso instantaneamente no arquivo layout.tsx do Next.js assim que o cliente fornecer a tag.'),
        ('Metodo 2: Entrada DNS TXT', 'O cliente (ou o suporte da hospedagem do dominio) adiciona uma entrada TXT de verificacao na tabela DNS do registro de dominio (ex: no Registro.br ou GoDaddy).'),
        ('Metodo 3: Upload de Arquivo HTML', 'Carregar um pequeno arquivo HTML fornecido pela Meta na pasta public/ do nosso site para servir no caminho raiz (/metasound.html).')
    ]

    for title, desc in methods:
        pdf.set_x(15)
        pdf.set_font('Helvetica', 'B', 10)
        pdf.cell(10, 6, t('-'), 0, 0)
        pdf.cell(75, 6, t(title), 0, 0)
        pdf.set_font('Helvetica', '', 10)
        pdf.multi_cell(95, 6, t(desc))
        pdf.ln(2)
        
    pdf.ln(3)

    # SECTION 3
    pdf.set_font('Helvetica', 'B', 13)
    pdf.set_text_color(13, 3, 6)
    pdf.cell(0, 8, t('Etapa 3: Sincronizacao do Catalogo de Produtos'), 0, 1, 'L')
    
    pdf.set_font('Helvetica', '', 10)
    pdf.set_text_color(60, 60, 60)
    
    catalog_intro = t(
        'Para carregar todos os biquinis, moletons, sungas e acessorios no catalogo do Instagram de '
        'forma automatica, configuramos uma sincronizacao em segundo plano.'
    )
    pdf.multi_cell(0, 5, catalog_intro)
    pdf.ln(2)

    steps = [
        ('1. Criar Catalogo no Commerce Manager:', 'Acesse o Gerenciador de Comercio (Commerce Manager) da Meta e clique em "Adicionar Catalogo" -> "Produtos Fisicos".'),
        ('2. Configurar Lista de Dados (Data Feed):', 'Selecione "Carregar Informacoes de Produtos" -> "Usar Lista de Dados" -> "Carregamento Agendado (Scheduled Feed)".'),
        ('3. Inserir a URL do nosso Catalogo XML:', 'Forneca a URL oficial que desenvolvemos no site:\nURL: https://www.avasemlimites.com.br/api/catalog/meta\nEste link serve os produtos do banco PostgreSQL em tempo real.'),
        ('4. Definir Frequencia de Atualizacao:', 'Configure o agendamento para atualizacao "Diaria" ou "De Hora em Hora" para que novos estoques e precos fiquem sempre sincronizados.')
    ]

    for title, desc in steps:
        pdf.set_x(15)
        pdf.set_font('Helvetica', 'B', 10)
        pdf.cell(10, 6, t('-'), 0, 0)
        pdf.cell(70, 6, t(title), 0, 0)
        pdf.set_font('Helvetica', '', 10)
        pdf.multi_cell(100, 6, t(desc))
        pdf.ln(2)

    pdf.add_page() # Move remaining sections to next page for clean print layout

    # SECTION 4
    pdf.set_font('Helvetica', 'B', 13)
    pdf.set_text_color(13, 3, 6)
    pdf.cell(0, 8, t('Etapa 4: Enviar para Analise do Instagram'), 0, 1, 'L')
    
    pdf.set_font('Helvetica', '', 10)
    pdf.set_text_color(60, 60, 60)
    
    review_text = t(
        'Com as contas integradas, o dominio verificado e o catalogo sincronizado, o cliente '
        'deve solicitar a aprovacao da sacolinha diretamente pelo celular:'
    )
    pdf.multi_cell(0, 5, review_text)
    pdf.ln(2)

    review_steps = [
        'Abra o aplicativo do Instagram comercial da marca no celular.',
        'Va em "Configuracoes" -> "Criador de Conteudo/Empresa" -> "Configurar Compras no Instagram".',
        'Siga as instrucoes na tela, selecione o Dominio Verificado e o Catalogo de Produtos.',
        'Envie a conta para analise comercial da equipe do Instagram.'
    ]

    for idx, r_step in enumerate(review_steps, 1):
        pdf.set_x(15)
        pdf.cell(10, 6, t(f'{idx}.'), 0, 0)
        pdf.multi_cell(170, 6, t(r_step))
        pdf.ln(1)
        
    pdf.ln(4)

    # CALLOUT BOX (ALERT)
    pdf.set_fill_color(255, 247, 242)
    pdf.set_draw_color(255, 179, 153)
    pdf.rect(15, pdf.get_y(), 180, 20, 'FD')
    pdf.set_xy(18, pdf.get_y() + 2)
    pdf.set_font('Helvetica', 'B', 9.5)
    pdf.set_text_color(255, 77, 28)
    pdf.cell(0, 5, t('INFORMACAO IMPORTANTE SOBRE A APROVACAO:'), 0, 1, 'L')
    pdf.set_x(18)
    pdf.set_font('Helvetica', '', 9.5)
    pdf.set_text_color(50, 50, 50)
    pdf.cell(0, 5, t('O processo de analise comercial e feito de forma automatica/manual pela Meta e leva de 2 a 7 dias uteis.'), 0, 1, 'L')
    pdf.ln(8)

    # SECTION 5
    pdf.set_font('Helvetica', 'B', 13)
    pdf.set_text_color(13, 3, 6)
    pdf.cell(0, 8, t('Etapa 5: Comecar a Vender (Marcando Produtos)'), 0, 1, 'L')
    
    pdf.set_font('Helvetica', '', 10)
    pdf.set_text_color(60, 60, 60)
    
    finish_text = t(
        'Assim que a Meta liberar a conta comercial (voce recebera uma notificacao no Instagram):\n'
        '1. A aba "Loja" surgira no perfil do Instagram da AVA Sem Limites.\n'
        '2. Ao postar uma nova foto no feed, video no Reels ou publicar um Story, voce tera a opcao '
        '"Marcar Produtos" ao lado da opcao de marcar pessoas.\n'
        '3. Basta clicar na imagem sobre o produto, digitar o nome dele, seleciona-lo e publicar.'
    )
    pdf.multi_cell(0, 6, finish_text)
    
    # Save the PDF in the root directory
    output_path = os.path.join('/home/artz/Documentos/Antigravity/Ava-Vitoria', 'Sacolinha do Instagram.pdf')
    pdf.output(output_path)
    print(f'PDF generated successfully at: {output_path}')

if __name__ == '__main__':
    create_instagram_shopping_pdf()
