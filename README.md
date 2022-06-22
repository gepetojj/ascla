# ascla

> Website oficial da Academia Santanense de Ciências, Letras e Artes.

## Sumário

-   [ascla](#ascla)
    -   [Sumário](#sumário)
    -   [Objetivo](#objetivo)
    -   [Tecnologias](#tecnologias)
    -   [Contato](#contato)
    -   [Licença e Créditos](#licença-e-créditos)
    -   [Documentação](#documentação)
        -   [Editor](#editor)
            -   [Menu](#menu)
                -   [Desfazer e Refazer](#desfazer-e-refazer)
                -   [Títulos e parágrafo](#títulos-e-parágrafo)
                -   [Negrito, sublinhado e itálico](#negrito-sublinhado-e-itálico)
                -   [Link](#link)
                -   [Alinhamento do texto](#alinhamento-do-texto)
                -   [Limpar formatação](#limpar-formatação)
            -   [Comandos](#comandos)
                -   [Títulos](#títulos)
                -   [Negrito e itálico](#negrito-e-itálico)
                -   [Citações (exclusiva)](#citações-exclusiva)
                -   [Listas desordenadas (exclusiva)](#listas-desordenadas-exclusiva)
                -   [Listas ordenadas (exclusiva)](#listas-ordenadas-exclusiva)

## Objetivo

Construir um website responsivo e ágil para a divulgação do trabalho da Academia Santanense de Ciências, Letras e Artes. Dentre as funcionalidades do site, é possível encontrar sistemas de gerenciamento de acadêmicos, patronos, notícias e postagens no blog.

## Tecnologias

Como framework fullstack, o Next.js entra como o escolhido, juntamente com o React.js que proporciona a parte frontend. Os métodos de _data-fetching_ do Next estão muito presentes neste website, e entre eles podemos citar estes em uso: _getServerSideProps_, _getStaticProps_ e _getStaticPaths_, além de _client-side fetching_. Para o css, escolhemos o Tailwind como utilitário, facilitando a construção dos estilos.

A API é construída também usando Next.js, o que permite manter todo o projeto em um só _workspace_. Para o banco de dados, optamos por NoSQL com o Firestore do Firebase. O armazenamento de imagens é feito pelo Storage, também do Firebase. As imagens do website são otimizadas pelo ImageKit. A fonte Montserrat e suas variações são hospedadas localmente para melhorar o desempenho.

## Contato

A ASCLA pode ser contatada a partir dos seguintes meios:

-   [Instagram](https://www.instagram.com/asclasi)
-   [Email do presidente](mailto:maltafneto@gmail.com)
-   [Email do administrador](mailto:srjneto@gmail.com)
-   Telefone - (82) 90000-0000
-   Fisicamente na sede da academia de segundas a sextas-feiras.

## Licença e Créditos

O projeto está protegido pela licença Apache 2.0, e todas suas definições se aplicam a este software. A fonte Montserrat e suas variações estão licensiadas usando a Licensa Aberta de Fontes, permitindo seu uso em produtos e projetos, comerciais ou não.

## Documentação

Este tópico é destinado para a documentação de usabilidade do website, contendo os passos para realizar a manutenção de dados, assim como usar as funções disponíveis.

### Editor

-   Encontrado em: edição e criação do Blog; edição e criação das Notícias; edição e criação dos Patronos; edição e criação dos Acadêmicos.
-   Dificuldade: Básico - fácil; Avançado - difícil

Este tópico ensina como utilizar o editor de texto, que pode ser encontrado nas páginas de administração. As funções do editor podem ser executadas tanto pelo menu (ícones que ficam acima da área do texto), ou por comandos que podem ser inseridos na área do texto. Existem funcionalidades que atualmente só podem ser executadas usando comandos.

#### Menu

Abaixo está a explicação de como utilizar todas as funções do menu do editor.

##### Desfazer e Refazer

![Imagem de exemplo](https://i.imgur.com/ROosbjT.png)

Seguindo a imagem acima, o primeiro ícone representa a função _desfazer_, e quando clicada desfaz a última alteração feita na área do texto.

O segundo ícone representa a função _refazer_, que quando clicada refaz uma alteração desfeita na área do texto.

##### Títulos e parágrafo

![Imagem de exemplo](https://i.imgur.com/I2WLSeX.png)

**Detalhe: estes títulos não têm relação com o título da postagem/notícia, são apenas marcações do texto, para dar destaque.**

Os títulos são divididos em 6 tipos, diferenciados por seu grau de importância. Ou seja, o H1 (do inglês _Heading_, título em português), é mais importante que o H2 - que por sua vez é mais importante que o H3, e assim por diante.

Todos os títulos deixam o texto com margens acima e abaixo, e em negrito, exceto o H5 e H6, que apenas deixam o texto menor que um parágrafo. É recomendado que se use a hierarquia de parágrafos quando um texto apresentar tópicos.

A função parágrafo formata o texto selecionado para um parágrafo comum. Note que não há função que altera diretamente o tamanho da fonte no editor - escolha proposital para manter consistência na estilização do website e ampliar a acessibilidade. Ao invés disso, o tamanho do texto é definido por sua importância, como já foi detalhado acima.

##### Negrito, sublinhado e itálico

![Imagem de exemplo](https://i.imgur.com/tpweYm5.png)

Os ícones, seguindo a imagem, representam respectivamente: negrito, sublinhado e itálico. Estas funções certamente são bem conhecidas e seu uso é simples, basta selecionar o texto e clicar no ícone, assim como as outras funções.

##### Link

![Imagem de exemplo](https://i.imgur.com/sgKYafe.png)

**Detalhe: apenas links que possuem o protocolo _https_ podem ser inseridos, para garantir a segurança do usuário. Links para o próprio website também são possíveis.**

Ao clicar no ícone da imagem, outro menu aparecerá na tela. A partir dele, você é capaz de atribuir ao texto selecionado um link, que ao clicado será aberto em outra aba do navegador.

![Imagem de exemplo](https://i.imgur.com/yQxIUBl.png)

Como mostrado na imagem, basta colocar o link na caixa de texto correspondente e clicar em "Adicionar". Quando um link for escrito na caixa de texto "Link:", o botão "Remover" aparecerá. Ao ser clicado, removerá um link do texto selecionado.

##### Alinhamento do texto

![Imagem de exemplo](https://i.imgur.com/3NVUKrt.png)

Seguindo a imagem acima, as funções são, respectivamente: alinhar à esquerda, centralizar, alinhar à direita e justificar. Quando uma dessas funções for clicada, fazem exatamente o que sujerem, mas lembre-se que ela é executada apenas no texto selecionado. Se não houver texto selecionado, a função vai ser executada na linha onde seu mouse estiver ou na última que esteve.

##### Limpar formatação

![Imagem de exemplo](https://i.imgur.com/HvB2uVL.png)

A última função do menu é chamada de limpar formatação. Esta função irá tirar qualquer formatação feita no texto selecionado, é boa quando houverem várias formatações feitas em um mesmo texto, economizando tempo para retirar todas.

#### Comandos

O editor permite que você coloque comandos na área do texto para agilizar o processo de formatação. Estes comandos devem ser feitos da maneira correta para que efeitos sejam notados.

##### Títulos

Já vimos anteriormente que o editor permite que tipos diferentes de título sejam aplicados ao seu texto. Agora veremos como aplicar os diferentes tipos de texto sem ter que clicar nos ícones.

O comando de títulos é simples: basta escrever "#" (hashtag) na quantidade igual ao tipo de título (1, 2, 3, 4, 5 ou 6); apertar o espaço e finalmente escrever o texto desejado.

Depois de colocar as hashtags desejadas, verá que após apertar o espaço, o editor automaticamente adicionará o tipo de título escolhido, e seu texto será formatado mais rapidamente.

##### Negrito e itálico

Para formatar um texto em negrito ou itálico, basta seguir os passos listados a seguir.

-   Negrito: Digite dois "\*" (asterísco); digite seu texto sem pular parágrafos; digite outros dois asteríscos, cercando o texto desejado; se feito corretamente, seu editor automaticamente transformará o texto em negrito.
-   Itálico: Regras semelhantes ao negrito, muda apenas a quantidade de asteríscos, que agora é apenas um.

##### Citações (exclusiva)

Para adicionar citações ao editor, basta adicionar seu comando seguindo estes passos: escrever ">" (sinal de maior que); apertar o espaço e escrever o texto desejado.

Assim como nos títulos e em todos os comandos, verá que após escrever o sinal de maior que e apertar espaço, o editor automaticamente adicionará uma citação.

##### Listas desordenadas (exclusiva)

Você pode adicionar a formatação de listas em seu texto, usando o comando descrito a seguir: escrever um "-" (sinal de menos); apertar o espaço e digitar o texto desejado. Novos pontos podem ser criados, basta digitar um texto no primeiro ponto e apertar "Enter" - caso você aperte "Enter" sem ter texto, o editor irá remover o ponto.

Note que você pode criar hierarquias, basta criar uma lista, e após o primeiro ponto aperte "TAB".

##### Listas ordenadas (exclusiva)

Assim como as listas desordenadas, basta seguir estes passos: escrever um número (ordem) seguido de um "." (ponto final); apertar espaço e digitar seu texto.

O editor automaticamente irá adicionar sua lista com ordem. As regras adicionais das listas desordenadas também se aplicam a esta.
