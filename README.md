
## Project Requirements

Before running the project, ensure your system meets the following requirements:

- Node.js 20.10+
- MongoDB Community Server Download 7.0.4+ or MongoDB Atlas
- Backend Installation:
  - The Bestiary Frontend relies on the Bestiary Backend for seamless functionality.
  - Follow the instructions in the Backend Repository to set up and configure the backend before initiating the frontend.
- Internet access

## Installation

Follow these steps to install and configure the project:

1. Clone the repository: `git clone https://github.com/OwenBueno/pokedex-bestiarius.git`
2. Enter the project directory: `cd pokedex-bestiarius`
3. Install dependencies: `npm install`
4. Modify the file with the IP and port of the backend: `src/globalVariables.tsx`

## Project Structure

```
└── 📁pokedex-service
    └── .env.example
    └── .gitignore
    └── nodemon.json
    └── package.json
    └── pnpm-lock.yaml
    └── README.md
    └── 📁src
        └── 📁config
            └── connection.db.ts
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
        └── 📁validators
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
