const js = require("@eslint/js");
const tseslint = require("@typescript-eslint/eslint-plugin");
const tsparser = require("@typescript-eslint/parser");
const prettier = require("eslint-config-prettier");
const importPlugin = require("eslint-plugin-import");

module.exports = [
  // Applique les règles de base du plugin @eslint/js
  js.configs.recommended,
  {
    files: ["**/*.ts"],
    languageOptions: {
      // Utilise le parser TypeScript
      parser: tsparser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
        sourceType: "module",
      },
      // Déclare les variables globales utilisées dans un environnement Node.js + Jest
      globals: {
        process: "readonly",
        __dirname: "readonly",
        console: "readonly",
        describe: "readonly",
        it: "readonly",
        expect: "readonly",
        fetch: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
      import: importPlugin,
    },
    // Configuration pour le résolveur TypeScript
    settings: {
      "import/resolver": {
        typescript: {
          project: "./tsconfig.json",
        },
      },
    },
    rules: {
      // Inhérent aux règles recommandées du plugin TypeScript
      ...tseslint.configs.recommended.rules,
      // Inhérent aux règles de Prettier pour éviter les conflits de formatage
      ...prettier.rules,
        
      /*
      * Règles de nommage
      */
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "interface",
          format: ["PascalCase"],
          custom: {
            regex: "^I[A-Z]",
            match: true,
          },
        },
        {
          selector: "typeAlias",
          format: ["PascalCase"],
        },
        {
          selector: "class",
          format: ["PascalCase"],
        },
        {
          selector: "enum",
          format: ["PascalCase"],
        },
        {
          selector: "variable",
          format: ["camelCase", "UPPER_CASE"],
        },
        {
          selector: "function",
          format: ["camelCase"],
        }
      ],
            
      /*
      * Règles de bonnes pratiques et de sécurité
      */
      "eqeqeq": ["error", "always"],                                // Oblige l'utilisation de === et !==
      "no-eval": "error",                                           // Interdit l'utilisation d'eval()
      "no-implied-eval": "error",                                   // Interdit les appels à setTimeout/setInterval avec des chaînes
      "no-extend-native": "error",                                  // Interdit l'extension des objets natifs
      "no-shadow": "error",                                         // Empêche le masquage de variables déclarées dans une portée externe
      "func-names": "error",                                        // Oblige l'utilisation de fonctions nommées
      "no-new-func": "error",                                       // Interdit l'utilisation du constructeur Function
      "@typescript-eslint/no-unused-vars": [                        // Vérifie les variables et arguments inutilisés  
        "error",
        {
          "vars": "all",                                          // Vérifie toutes les variables inutilisées
          "args": "all",                                          // Vérifie tous les arguments de fonction inutilisés
          "caughtErrors": "none",                                 // Ne bloque pas le build si une erreur capturée n'est pas utilisée
          "argsIgnorePattern": "^req$|^res$|^data$|^userId$"      // On ignore les éléments obligatoires mais souvent inutilisés
        }
      ],

      
      /*
      * Règles concernant les importations (nécessitent eslint-plugin-import)
      */
      "import/no-unresolved": "error",       // Vérifie que les modules importés peuvent être résolus
      "import/named": "error",               // Vérifie que les imports nommés correspondent aux exports
      "import/default": "error",             // Vérifie la validité des imports par défaut
      "import/no-duplicates": "error",       // Empêche les importations en double
          
      /*
      * Règles propres à Typescript
      */  
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];
