# Projeto Landing Page

Desenvolvimento de um protótipo navegável em front-end para uma plataforma promocional de campanhas Compre & Ganhe, utilizado para apresentação, validação de fluxos e direcionamento da implementação pelos desenvolvedores, em substituição aos protótipos estáticos tradicionalmente produzidos no Figma.


## Sobre

- Landing page e área logada para participantes.
- Listagem de campanhas promocionais.
- Ranking de participantes por desempenho.
- Página de ganhadores e contemplados.
- Painel administrativo para acompanhar usuários, notas fiscais e indicadores.
- Troca de tema/marca via dados em `data/brands.json`.
- Dados simulados em JavaScript e persistência local com `localStorage`.

## Tecnologias

- HTML5
- CSS3
- JavaScript puro
- Dados mockados em arquivos `.js` e `.json`


## Stack de IA's

- ChatGPT para troca de mensagens e geração de prompts.
- Claude Code para criação de páginas e  features novas.
- Codex para alterações técnicas que não são do meu domínio.
- VS Code para interações manuais de menor complexidade.


## Estrutura

- `index.html`: página pública de promoções, descontinuada para ser substituída pela `area-logada.html`.
- `area-logada.html`: experiência principal do participante.
- `ranking.html`: ranking e notas fiscais.
- `winners.html`: resultados e ganhadores.
- `admin.html`: painel administrativo.
- `css/`: estilos globais e estilos por página.
- `js/`: scripts de autenticação, campanhas, ranking, admin e temas.
- `assets/`: imagens e logos.
- `data/brands.json`: configuração das marcas/temas.

## Como executar

- Clone o repositório.
- Abra o arquivo `area-logada.html` no navegador.
- Para melhor funcionamento com `fetch`, use um servidor local simples, como a extensão **Live Server** do VS Code.

## Observações

- O projeto não utiliza backend, apenas `localStorage` no navegador.
- A autenticação e os dados administrativos são simulados no navegador.
- Alterações feitas em notas, usuários e campanha ativa podem ser salvas no `localStorage`.
