## Ayrton Teshima
**Globo.com: coding challenge**

====================
#### Considerações Gerais
Você deverá usar este repositório como o repo principal do projeto, i.e., todos os seus commits devem estar registrados aqui, pois queremos ver como você trabalha.

**Registre tudo**: testes que forem executados, ideias que gostaria de implementar se tivesse mais tempo (explique como você as resolveria, se houvesse tempo), decisões que forem tomadas e seus porquês, arquiteturas que forem testadas e os motivos de terem sido modificadas ou abandonadas. Crie um arquivo COMMENTS.md ou HISTORY.md no repositório para registrar essas reflexões e decisões.

=====================
#### O Desafio: Live Search

Desenvolva um componente de Live Search baseado na imagem abaixo (o visual não precisa ser exatamente igual). Você pode escolher as tecnologias que quiser (mas não vale usar plugins prontos de Live Search). Avaliaremos tanto a parte client-side como a de backend.

![Live Search](exemplo.png?raw=true)

O componente deve exibir os dados correspondentes à busca feita pelo usuário, de acordo com a especificação exemplificada neste [JSON](exemplo.json).

============================
#### Requisitos
1. O live search deve ser atualizado conforme o usuário digita o termo de busca no campo de texto;
2. A busca deve ignorar a diferença entre letras maiúsculas/minúsculas (case insensitive) e acentos;
3. Caso algum item da seção "highlights" no JSON de resultado seja compatível com a busca do usuário através da chave "queries", o mesmo deve ser exibido como no exemplo "Pop & Arte" acima, com a logo, e clicável para sua URL;
4. Caso algum termo da seção "suggestions" seja compatível com a busca, o mesmo deve aparecer como "Sugestões de busca", com um link para ```http://g1.globo.com/busca/?q=<TERMO PESQUISADO>```;
5. De preferência não use nenhum framework (javascript);
6. As teclas (↓, ↑) devem navegar pelos links de sugestão e autocompletar o texto já digitado;
7. O JSON de resultado deve ser servido por um servidor, preferencialmente escrito em python, ruby ou node;
8. A página deve ser responsiva;
9. *(Opcional, bônus)* Diferenciar os caracteres que deram match no resultado do live search aplicando **negrito**.
10. *(Opcional, bônus)* Ao navegar pelos links de sugestão usando ↓, ↑, deve retornar imagens relacionadas à sugestão no body; 
11. *(Opcional, bônus)* As teclas (→, ←) preenchem ou removem, respectivamente, o termo com o termo sugerido. Por exemplo: Digitou fla e usuário apertou →, então preenche com flamengo. Se após completar com flamengo, o usuário apertar ←, volta para o termo fla.


O projeto deve estar "pronto para produção" em termos de:

1. Formatação e estruturação do código;
2. Performance (client e server);
3. Segurança.

Envie as instruções necessárias para rodar o projeto localmente, incluindo todas as dependências. Devemos ser capazes de executar o seu código em uma VM ou máquina limpa com os seguintes comandos, ou algo similar:

```
git clone seu-repositorio
cd seu-repositorio
make setup
make run
```

===============================================
#### O que será avaliado na sua solução?

1. As funcionalidades listadas anteriormente devem estar presentes na sua solução.
2. Seu código será observado por uma equipe de desenvolvedores que avaliarão a simplicidade e clareza da solução, a arquitetura, documentação, estilo de código, testes automatizados, o design da interface e a implementação do código.

=============
#### Dicas

- Use ferramentas e bibliotecas open source, mas documente as decisões e os porquês;
- Automatize o que for possível;
- Em caso de dúvidas, pergunte.