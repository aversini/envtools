'use strict';const fs=require('fs-extra'),path=require('path'),common=require('../../common');function setPrompt(a,b){const c=path.join(common.RUNTIME_DIR,'envtools-prompt');if(!(a.toggleOptions[common.ENVTOOLS.CFG_CUSTOM_PROMPT]===common.ON))fs.remove(c,b);else if(a.toggleOptions.custom)fs.writeFile(c,a.toggleOptions.custom,b);else return b()}function getPrompt(){const a=path.join(common.RUNTIME_DIR,'envtools-prompt');let b;try{b=fs.readFileSync(a,'utf8')}catch(a){}return!!b&&b}exports.setPrompt=setPrompt,exports.getPrompt=getPrompt;