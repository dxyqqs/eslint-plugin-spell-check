/**
 * @fileoverview en-us wording spell check
 * @author Cloud
 */
"use strict";
/**
 * todo: 调研异步函数的执行
 */
const cspell = require('cspell')


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
            let done = false;
            let errors = [];
            (async ()=>{
              try {
                const {text,items} = await spell.checkText(context.getFilename(),{})
                errors = items.filter(({isError})=>isError)
              } catch (error) {}
              done = true
            })();

            require('deasync').loopWhile(() => !done)

            if(errors.length>0){
              console.warn(errors)
              context.report({
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
    }
  },
  processors: {
    "json": {
      preprocess: function (text, filename) {
        return ['']
      },
      postprocess: function (messages, filename) {
        return [].concat(...messages);
      }
    }
  }
}