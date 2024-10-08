
# FastAPI Backend

Este é um repositório básico de backend utilizando [FastAPI](https://fastapi.tiangolo.com/), um framework moderno, rápido (alto desempenho) para construir APIs com Python 3.7+ baseado em **type hints**.

## Pré-requisitos

Antes de começar, certifique-se de ter instalado as seguintes ferramentas:

- [Python 3.7+](https://www.python.org/downloads/)
- [pip](https://pip.pypa.io/en/stable/)

### Verifique a versão do Python

Para verificar se o Python está instalado corretamente e qual versão está rodando, execute:

```bash
python --version
```

## Instalação

1. Clone este repositório:

   ```bash
   git clone https://github.com/seu-usuario/seu-repositorio.git
   cd seu-repositorio
   ```

2. Crie e ative um ambiente virtual (opcional, mas recomendado):

   ```bash
   python -m venv venv
   source venv/bin/activate  # No Windows: venv\Scripts\activate
   ```

3. Instale as dependências do projeto:

   ```bash
   pip install "fastapi[standard]"
   ```

   Isso instalará o **FastAPI**, o servidor **Uvicorn** e outras dependências padrões, como `aiofiles`, `python-dotenv`, e outras.

## Como rodar a aplicação

Rode o servidor localmente:

```bash
fastapi dev ./app/main.py
```

- Acesse a aplicação no navegador em: `http://127.0.0.1:8000`

### Documentação Interativa

O FastAPI gera automaticamente uma documentação interativa para a API. Você pode acessá-la nos seguintes endpoints:

- **Swagger UI**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **Redoc**: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

## Estrutura do Projeto

A estrutura básica do projeto é organizada da seguinte forma:

```bash
backend/
├── app/
│   ├── main.py              # Ponto de entrada da aplicação
│   ├── routers/             # Rotas da API (organize aqui seus endpoints)
│   │   └── items.py         # Exemplo de rotas para itens
│   └── models/              # Modelos Pydantic para validação de dados
│       └── __init__.py
├── requirements.txt         # Arquivo de dependências
└── README.md                # Documentação do repositório
```

### Arquivo `main.py`

No arquivo `app/main.py`, você pode definir as rotas principais da sua API. Um exemplo básico de rota:

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI!"}
```

Você também pode importar outras rotas de submódulos, como:

```python
from app.routers import items

app.include_router(items.router)
```

## Criando novas rotas

Para modularizar suas rotas, você pode criar arquivos dentro da pasta `routers/`. Um exemplo de rota para `items`:

```python
from fastapi import APIRouter

router = APIRouter()

@router.get("/items/{item_id}")
def read_item(item_id: int, q: str = None):
    return {"item_id": item_id, "q": q}
```




