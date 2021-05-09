/**
 * @fileoverview en-us wording spell check
 * @author Cloud
 */
"use strict";

module.exports = {
  configs: {
    recommended: {
      plugins: ['spell-check'],
      rules: {
        'spell-check/wording': 'error',
      },
    },
  },
  rules: {
    "wording": {
      meta: {
        docs: {
          description: "en-us spell check",
          category: "Fill me in",
          recommended: false
        },
        fixable: null, // or "code" or "whitespace"
        schema: [
          // fill in your schema
        ]
      },
      create: function (context) {
        return {
          Program(node) {
            console.warn(node)
            context.report({
              node,
              message: 'test',
              loc: {
                start: {
                  line:1,
                  column:0
                },
                end:{
                  line:1,
                  column:1
                }
              }
            })
          }
        }
      }
    }
  },
  processors: {
    "json": {
      preprocess: function (text, filename) {
        console.log(text)
        return ['']
      },
      postprocess: function (messages, filename) {
        return [].concat(...messages);
      }
    }
  }
}