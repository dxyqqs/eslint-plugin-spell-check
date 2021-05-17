/**
 * @fileoverview en-us wording spell check
 * @author Cloud
 */
"use strict";

const csl = require('cspell-lib')

const makeSynchronous = require('make-synchronous');

function locationCompute(baseLoc,index,offset=2){
  const startLine = baseLoc.start.line
  const startColumn = baseLoc.start.column-(startLine===1?offset:0)
  const endLine = baseLoc.end.line
  return {
    start:{
      line:startLine,
      column:startColumn+index+1
    },
    end:{
      line:endLine,
      column:startColumn+index+2
    }
  }
}

const syncCheckText = makeSynchronous(async function(path,config){
  let error =null
  let data = null
	try {
    data = await require('cspell').checkText(context.getFilename(),{})
  } catch (err) {
    error=err
  }
	return {
    error,
    data
  }
})

let textNode = {}

module.exports = {
  configs: {
    recommended: {
      plugins: ['spell-check'],
      rules: {
        'spell-check/punctuation': 2,
        'spell-check/duplicate': 1,
        'spell-check/wording': 2,
      },
    },
  },
  rules: {
    "punctuation": {
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
          Property(node) {
            const {value:{value,type,loc}} = node
            if(type!=="Literal") return null
            let index = value.indexOf('’')
            if(index>-1){
              context.report({
                message:'不能使用非英文符号',
                loc:locationCompute(loc,index)
              })
            }
          }
        }
      }
    },
    "duplicate": {
      meta: {
        docs: {
          description: "en-us spell check for duplicate wording",
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
          Property(node) {
            const {value:{value,type,loc}} = node
            if(type!=="Literal") return null
            if(!textNode[value]) textNode[value] = []
            const cache = textNode[value]
            const isInCache = cache.find(item=>{
              return item.start.line=== loc.start.line&& 
              item.start.column===loc.start.column && 
              item.end.line===loc.end.line && 
              item.end.column===loc.end.column
            })
            if(!isInCache) cache.push(loc)
            if(cache.length>1){
              cache.forEach(loc => {
                if(loc.report) return
                loc.report = true
                context.report({
                  message:`重复的文本`,
                  loc:{
                    start:{line:loc.start.line,column:loc.start.column+1},
                    end:{line:loc.end.line,column:loc.end.column-1}
                  }
                })
              })
            }
          }
        }
      }
    },
    "wording": {
      meta: {
        docs: {
          description: "en-us spell check for wording",
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
          Program() {
            const {data,error} = syncCheckText(context.getFilename())
            if(error) return
            const splitRegexp = /(?<!\r)(?=\r?\n)/
            const contentArray = data.text.split(splitRegexp).reduce((p,c)=>{
              const from = (p[p.length-1]||[])[1]||0
              const to = c.length+from
              p.push([from,to])
              return p
            },[])
            if(contentArray && contentArray.length>0 && data.items && data.items.length>0){
              const errors = data.items.filter(({isError})=>isError)
              if(errors.length>0){
                let i = errors.length-1
                while(i>=0){
                  const currentErr = errors[i]
                  const posIndex = contentArray.findIndex(([from,to])=>currentErr.startPos>=from && currentErr.startPos<to)
                  context.report({
                    message:`unknow wording: >> ${currentErr.text} <<`,
                    loc:{
                      start:{
                        line:posIndex,
                        column:currentErr.startPos-contentArray[posIndex][0]
                      },
                      end:{
                        line:posIndex,
                        column:currentErr.endPos-contentArray[posIndex][0]
                      }
                    }
                  })
                  console.warn(errInfo)
                  i--
                }
                
              }
            }
          }
        }
      }
    }
  },
  processors: {
    "json": {
      preprocess: function (text, filename) {
        try {
          JSON.parse(text)
          return [`_=${text}`]
        } catch (error) {
          return ['']
        }
      },
      postprocess: function (messages, filename) {
        textNode = {}
        return [].concat(...messages);
      }
    }
  }
}
