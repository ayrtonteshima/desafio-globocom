## Ayrton Teshima
**Globo.com: coding challenge**

Projeto desenvolvido com HapiJS no backend para gerenciar as rotas e desenvolver a API.

No frontend foi utilizado arquitetura Redux com VanillaJS/Plain javascript e Ecmascript 6. Para CSS utilizei SASS e Para o HTML foi utilizado Jade.

Automatizei os builds com webpack.

No teste de backend utilizei o frisby com jasmine para fazer as requisições na API e testar o retorno. No front foi utilizado Jasmine.

Utilizei lint para validar meu código.
### Rodar o projeto
- git clone git@github.com:SelecaoGlobocom/ayrton-teshima.git
- cd ayrton-teshima
- npm install
- npm start

### Rodar testes
- npm test

Obs: Para rodar os testes, deixe a aplicação rodando (npm start)

##### Rode os testes separados
- npm run test:backend
- npm run test:frontend

### Funcionalidades implementadas
- Live search atualizado conforme usuário digita
- Busca é case insensitive e ignora acentos
- Retorna hightlights com imagens quando o termo buscado combina com as queries e aponta para o link correto
- As teclas (↓, ↑) navegam pelo autocomplete e completam a palavra no input (funcionalidade implementada apenas as suggestions. Agora digitando isso, acho que teria que implementar nos hightlights também)
- Mouse over também completam a palavra no input quando passada sobre suggestions e permite que ele termine de navegar usando as setas
- JSON servido por um servidor escrito em node
- Página responsiva
- Diferencia caracteres que deram match com o termo buscado aplicando negrito
- As teclas  (→, ←) preenchem ou removem o primeiro termo de suggestions quando o usuário começa a digitar e já apresenta resultado

### Planejamento da arquitetura
![Redux](telas_desafio_globo.com.png?raw=true "Optional Title")
