module.exports = {
  "root": true,
  "ignorePatterns": [
    "projects/**/*",
    "**/mock-api/**/*",
    "**/@fuse/**/*",
    ".eslintrc.js"
  ],
  "overrides": [
    {
        "files": [
            "**/decorators/*.ts"
        ],
        "plugins": [
            "filename-rules"
        ],
        "rules": {
            "filename-rules/match": [
                2,
                {
                    ".ts": /^[a-z]+(\-[a-z]+)?\.decorator\.[a-z]{1,4}$/
                }
            ]
        }
    },
    {
        "files": [
            "**/constants/*.ts"
        ],
        "plugins": [
            "filename-rules"
        ],
        "rules": {
            "filename-rules/match": [
                2,
                {
                    ".ts": /^[a-z]+(\-[a-z]+)?\.const\.[a-z]{1,4}$/
                }
            ]
        }
    },
    {
        "files": [
            "**/prototypes/*.ts"
        ],
        "plugins": [
            "filename-rules"
        ],
        "rules": {
            "filename-rules/match": [
                2,
                {
                    ".ts": /^[a-z]+(\-[a-z]+)?\.proto\.[a-z]{1,4}$/
                }
            ]
        }
    },
    {
        "files": [
            "**/types/*.ts"
        ],
        "plugins": [
            "filename-rules"
        ],
        "rules": {
            "filename-rules/match": [
                2,
                {
                    ".ts": /^[a-z]+(\-[a-z]+)?\.d\.[a-z]{1,4}$/
                }
            ]
        }
    },
    {
        "files": [
            "**/models/*.ts"
        ],
        "plugins": [
            "filename-rules"
        ],
        "rules": {
            "filename-rules/match": [
                2,
                {
                    ".ts": /^[a-z]+(\-[a-z]+)?\.types\.[a-z]{1,4}$/
                }
            ]
        }
    },
    {
      "files": [
        "*.ts"
      ],
      "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@angular-eslint/recommended",
        "plugin:@angular-eslint/template/process-inline-templates"
      ],
      "rules": {
        "@angular-eslint/directive-selector": [
          "error",
          {
            "type": "attribute",
            "prefix": "",
            "style": "camelCase"
          }
        ],
        "@angular-eslint/component-selector": [
          "error",
          {
            "type": "element",
            "prefix": "",
            "style": "kebab-case"
          }
        ]
      }
    },
    {
      "files": [
        "*.html"
      ],
      "extends": [
        "plugin:@angular-eslint/template/recommended",
        "plugin:@angular-eslint/template/accessibility"
      ],
      "rules": {}
    }
  ]
}
