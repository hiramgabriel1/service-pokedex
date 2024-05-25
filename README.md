## Project Requirements

Before running the project, ensure your system meets the following requirements:

- Node.js 22.0.0
- MongoDB Atlas
- Internet access

## Installation

Follow these steps to install and configure the project:

1. Clone the repository: `git clone https://github.com/itsrusty/service-pokedex.git`
2. Enter the project directory: `cd service-pokedex`
3. Install dependencies: `pnpm install`
4. Create .env file in root directory with: URI = mongodb+srv://rusty3031:dRAvaIJ5ahEHQHH6@pokedex.rsrttpi.mongodb.net/ && PORT = 5000


## Project Structure

```
└── 📁service-pokedex
    └── .env
    └── .env.example
    └── .gitignore
    └── README.md
    └── nodemon.json
    └── package.json
    └── pnpm-lock.yaml
    └── 📁public
        └── pokemon.pdf
    └── 📁src
        └── 📁config
            └── connection.db.ts
            └── swagger.ts
            └── swagger.yaml
        └── 📁controllers
            └── pokemon.controller.ts
            └── pokemon.pdf.ts
        └── 📁data
            └── creator.pdf.ts
        └── 📁interfaces
            └── pokemon.interface.ts
        └── 📁models
            └── pokemon.model.ts
        └── 📁routes
            └── pokemon.routes.ts
        └── server.ts
        └── 📁utils
            └── pokemon.info.ts
    └── tsconfig.json
```

## Usage

To test in dev mode:

```bash

# instalar dependencias
pnpm install

# iniciar proyecto
pnpm run dev

```

## Documentation Swagger
```bash
 http://localhost:5000/api-docs/
```
