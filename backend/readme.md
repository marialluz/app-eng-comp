# Compflow

O projeto CompFlow visa centralizar em uma única plataforma todos os dados relevantes para o aluno do curso de Engenharia de Computação da Universidade Federal do Rio Grande do Norte (UFRN).

Desta forma, a aplicação conta com funcionaliades como:

- Visualização da grade curricular
- Acompanhamento do histórico escolar
- Armazenamento de materiais das disciplinas cursadas
- Fórum de notícias para acompanhamento de temas relevantes.

**Projeto idealizado e criado pelos alunos de Engenharia de Computação da UFRN**
- Alice Maria Fonseca Victorino Freire
- Maria Eduarda Lima da Luz
- Mateus Cavalcanti Alves Teixeira Silva

## Histórias de Usuário

Histórias de usuário são descrições curtas e simples das funcionalidades ou requisitos que um sistema deve ter, do ponto de vista do usuário. Elas são usadas para guiar o desenvolvimento de software, ajudando a equipe a entender o que é necessário para atender às necessidades dos usuários.

Desse modo, a primeira versão do CompFlow foi guiada por meio de cinco histórias de usuários iniciais:

**Primeira História de Usuário**
> Como aluno, eu quero armazenar meus materiais de estudo em pastas organizadas
por disciplina, fornecidas pelo sistema.<br>
> **Critérios de aceitação**
> - O sistema permite fazer upload de arquivos de diferentes formatos.
> - O aluno pode organizar materiais em subpastas dentro de cada pasta de
disciplina.
> - O sistema exibe a lista de arquivos de cada disciplina.
> - O aluno pode renomear ou excluir arquivos e pastas.

**Segunda História de Usuário**
> Como aluno, eu quero visualizar a estrutura curricular completa do curso de
Engenharia de Computação e da ênfase em Computação, para planejar meu
percurso acadêmico.<br>
> **Critérios de aceitação**
> - O sistema exibe a estrutura curricular completa organizada por período.
> - O aluno pode visualizar disciplinas obrigatórias, eletivas e optativas.
> - A estrutura curricular mostra pré-requisitos de cada disciplina.

**Terceira História de Usuário**
> Como professor, eu quero fornecer informações claras e acessíveis acerca do
curso por meio da publicação de notícias atualizadas e recentes.<br>
> **Critérios de aceitação**
> - O professor pode criar e editar publicações de notícias sobre o curso.
> - O sistema exibe uma lista de notícias na página inicial, organizadas por data
de publicação.
> - Alunos podem visualizar as notícias diretamente pelo portal do curso.
> - O coordenador pode anexar links ou documentos relevantes às publicações.

**Quarta História de Usuário**
> Como aluno, eu quero compartilhar materiais de estudo com meus colegas.<br>
> **Critérios de aceitação**
> - O aluno pode selecionar um ou mais arquivos armazenados para
compartilhar.
> - O arquivo compartilhado fica disponível na pasta da mesma disciplina para o aluno que recebeu o compartilhamento

**Quinta História de Usuário**
> Como aluno, eu quero montar minha própria grade, organizada por período, de
acordo com as disciplinas que planejo cursar.<br>
> **Critérios de aceitação**
> - O aluno pode adicionar disciplinas aos períodos futuros de forma
customizável.
> - Disciplinas com pré-requisitos não podem ser adicionadas se os
pré-requisitos não estiverem completos.
> - O aluno pode salvar a estrutura personalizada e modificá-la posteriormente.

## Diagrama de atividades

O presente diagrama de atividades representa o fluxo funcional para a quinta história de
usuário, descrita anteriormente.

![Diagrama de atividade](./tutorials/diagrama.png)

## Rotas

A API do CompFlow conta com rotas que cobrem desde a autenticação via JWT até o funcionamento das histórias de usuário descritas.

### Rotas de usuário

| Nome | Método HTTP | URL | Permissao |
|------|-------------|-----|-----------|
| Criar Usuário | POST | /user/ | |
| Buscar Usuário | GET | /user/:id | |
| Atualizar Usuário | PATCH | /user/:id/ | |
| Excluir Usuário | DELETE | /user/:id/ | Ser o próprio usuário logado
| Ver Usuário Atual Logado | GET | /user/me/ | Ser o próprio usuário logado
| Listar Usuários | GET | /user/ | |

**Exemplo de Requisição para criação de usuário**
```
{
    "username": "mateus",
    "email": "mateus@email.com",
    "password":"oi123",
    "confirm_password": "oi123",
    "is_teacher": true,
    "is_student": false
    "entry_period": "2021.1"
}
```

### Rotas de autenticação

| Nome | Método HTTP | URL | Permissao |
|------|-------------|-----|-----------|
| Criar Token JWT | POST | /auth/token/ | |
| Atualizar Token JWT | POST | /auth/token/refresh/ | |

**Exemplo de Requisição para criação de token**
```
{
    "username": "alice",
    "password": "oi123"
}
```

**Exemplo de Requisição para atualização de token**
```
{
    "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTczMjgyMzg5NSwiaWF0IjoxNzMyNzM3NDk1LCJqdGkiOiJkMDQ4ZTUwMmVmNmQ0ZGY4OTk3MzFlMWZmYWVkMTEyZSIsInVzZXJfaWQiOjN9.LleQ-6KgYOJJbxPgNdHQ84pAW-WM4YMjRu5j3BveBto"
}
```

### Rotas para cadastro de disciplinas no sistema

| Nome | Método HTTP | URL | Permissao |
|------|-------------|-----|-----------|
| Criar disciplina | POST | /subject/ | Ser professor |
| Ver disciplina | GET | /subject/:code/ | |
| Atualizar disciplina | PATCH | /subject/:code/ | Ser professor |
| Excluir disciplina | DELETE | /subject/:code/ | Ser professor |
| Listar pré-requisitos de uma disciplina | GET | /subject/:id/prerequisites/ | |
| Listar pré-requisitos de forma recursiva (pré-requisitos de pré-requisitos e etc) | GET | /subject/:code/prerequisites/?deep=true | |

**Exemplo de Requisição para cadastro de disciplina**
```
{
    "code": "DCA3206",
    "name": " MATEMÁTICA DISCRETA",
    "period": "2",
    "prerequisites": ["ECT3101"]
}
```

### Rotas para criação de histórico escolar
| Nome | Método HTTP | URL | Permissao |
|------|-------------|-----|-----------|
| Criar histórico de uma disciplina | POST | /history/ | Ser aluno | |
| Ver histórico de uma disciplina | GET | /history/:id/ | Ser aluno e ser o criador do histórico | |
| Atualizar histórico de uma disciplina | PATCH | /history/:id/ | Ser aluno e ser o criador do histórico | |
| Excluir histórico de uma disciplina | DELETE | /history/:id/ | Ser aluno e ser o criador do histórico | |
| Listar histórico de todas as disciplinas | GET | /history/ |  Ser aluno | |

**Exemplo de Requisição para cadastro de histórico**
```
{
    "subject": "ECT3101",
    "average": "10",
    "attended_in_period": "1"
}
```

### Rotas para criação de diretório
| Nome | Método HTTP | URL | Permissao |
|------|-------------|-----|-----------|
| Criar diretório de uma disciplina | POST | /directory/ | Ser aluno |
| Excuir diretório de uma disciplina | DELETE | /directory/:id/ | Ser aluno e ser o criador do diretório |
| Ver o diretório | GET | /directory/:id/ | Ser aluno e ser o criador do diretório |
| Listar todos os diretórios do aluno | GET | /directory/ | Ser aluno |

**Exemplo de Requisição para criação de diretório**
```
{
    "subject": "ECT3101",
}
```

### Rotas para criação de arquivo de diretório
| Nome | Método HTTP | URL | Permissao |
|------|-------------|-----|-----------|
| Criar arquivo de diretório | POST | /directory/:directory_id/file/ | Ser aluno | 
| Ver arquivo | GET | /directory/:directory_id/file/:id/ | Ser aluno e ser o dono do diretório |
| Listar todos os arquivos do diretório | GET | /directory/:directory_id/file/ | Ser aluno e ser o dono do diretório |
| Compartilhar arquivo | POST | /directory/:directory_id/file/:file_id/share/ | Ser aluno e ser o dono do diretório |

**Exemplo de Requisição para criação de diretório (form-data)**
```
    file: arquivo
    name: nome do arquivo
```

**Exemplo de Requisição para compartilhar arquivo**
```
{
    "shared_to_user": 2
}
```

### Rotas para criação de postagem no sistema
| Nome | Método HTTP | URL | Permissao |
|------|-------------|-----|-----------|
| Criar uma nova postagem | POST | /post/ | Ser professor |
| Ver uma postagem | GET | /post/:id/ | |
| Atualizar uma postagem | PATCH | /post/:id/ | Ser professor e o criador da postagem |
| Excluir uma postagem | DELETE | /post/:id/ | Ser professor e o criador da postagem |

**Exemplo de Requisição para criação de postagem (form-data)**
```
    file: arquivo anexado
    text: texto da postagem
```

### Rotas para criação de planejamento de semestres futuros
| Nome | Método HTTP | URL | Permissao |
|------|-------------|-----|-----------|
| Criar um planejamento de grade | POST | /schedule/ | Ser aluno |
| Ver o planejamento | GET | /schedule/:id/ | Ser aluno e ser o criador do planejamento |
| Atualizar um planejamento | PATCH | /schedule/:id/ | Ser aluno e ser o criador do planejamento |
| Excluir um planejamento | DELETE | /schedule/:id/ | Ser aluno e ser o criador do planejamento |
| Listas todos os planejamentos | GET | /schedule/ | Ser aluno e ser o criador do planejamento |

**Exemplo de Requisição para criação de planejamento**
```
{
    "subjects": ["ECT3101", "ECT3102", "ECT3103"],
    "period": "2025.1"
}
```

___

Todas essas rotas podem ser utilizadas ao importar o [arquivo de configuração do postman](API.postman_collection.json) para um ambiente do software Postman.

## Como executar

A aplicação foi conteinerizada via Docker. Portanto, é necessário ter este software para a utilização deste software.

**Criar imagem da aplicação**
Para criar a imagem da aplicação basta, na raíz do projeto, executar o comando

```
$ docker build -t compflow .
```

**Executar a aplicação**
Após a criação da imagem, a aplicação pode ser executada com o comando abaixo
```
$ docker run -d -p 8000:8000 compflow
```

Após isso, a aplicação estará rodando em http://localhost:8000/