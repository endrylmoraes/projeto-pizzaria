# 🍕 ToPizza 🍕

## Conteúdo
* [Sobre a aplicação](#sobre-a-aplicação)
* [Tecnologias](#hammer_and_wrench-tecnologias)
* [Iniciando a Aplicação](#car-Iniciando-a-aplicação)
* [Licença](#balance_scale-licença)

## Sobre a aplicação
Aplicação completa para pizzaria desenvolvida em 3 camadas, durante o curso [Projeto Completo NodeJS, React, React Native, TypeScript](https://www.udemy.com/course/dev-fullstack/), do prof. Matheus Fraga.<br />
1. __Back-end__: Desenvolvido em Node.JS com Typescript, utilizando Prisma com banco de dados PostgreSQL.
2. __Front-end__: Permite cadastrar produtos, categorias e fechar mesas. Desenvolvido em React com Next, Typescript e SASS.
3. __Mobile__: Permite lançar o consumo das mesas. Desenvolvido em React Native com Expo e Typescript.

## :hammer_and_wrench: Tecnologias
* Back-end
  * __Node.js__ com Typescript
  * __Prisma ORM__ para acessar o banco de dados
  * Autenticação __JWT__
  * __Multer__ para upload de imagens
* Front-end
  * __React__ com __Next__ e Typescript
  * __Nookies__ para armazenar cookies
  * __SASS__ para estilização
* Mobile
  * __React Native__ com Expo e Typescript
  * __AsyncStorage__ para armazenamento de chaves/valores

## :car: Iniciando a aplicação
Baixe o repositório com git clone e entre na pasta do projeto.
```bash
$ git clone https://github.com/endrylmoraes/projeto-pizzaria
```

### __Back-end__
Na raíz da pasta backend, crie um arquivo chamado .env<br/>
Informe a URL do banco de dados na variável __DATABASE_URL__.<br/>
Informe a palavra secreta na variável __JWT_SECRET__<br/>
```bash
# Instale as dependências
$ yarn

# Para iniciar a aplicação na porta 3333
$ yarn dev
```
### __Front-end__
  Na pasta web, informe o IP da aplicação back-end no arquivo _src/services/api.ts_<br/>
```bash
# Instale as dependências
$ yarn

# Para iniciar a aplicação na porta 3000
$ yarn dev
```
### __Mobile__
  Na pasta web, informe o IP da aplicação back-end no arquivo _src/services/api.ts_<br/>
```bash
# Instale as dependências
$ yarn

# Para iniciar a aplicação
$ expo start
```

## :balance_scale: Licença
Este projeto está licenciado sob a [licença MIT](LICENSE).
