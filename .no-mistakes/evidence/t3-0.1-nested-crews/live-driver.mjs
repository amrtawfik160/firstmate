import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
const root=process.cwd(), lab=root+'/.t3-validation', helper=root+'/bin/fm-t3-mcp.mjs';
const project=JSON.parse(fs.readFileSync(lab+'/project.json')).projectId;
const selection=JSON.stringify({instanceId:'codex',model:'gpt-6.2-sol',options:[]});
const results={};
function call(verb,args=[]){const cmd=['bin/fm-t3-mcp.mjs',verb,...args,'--token-file',lab+'/token'];try {const output=execFileSync('node',cmd,{encoding:'utf8',stdio:['ignore','pipe','pipe'],timeout:30000});return JSON.parse(output);}catch(e){return {error:String(e),stdout:e.stdout?.toString(),stderr:e.stderr?.toString(),exit:e.status};}}
results.status=call('status');
results.parent=call('launch',['--project',project,'--title','Synthetic captain','--model-selection',selection]);
console.log('parent',JSON.stringify(results.parent));
const parent=results.parent.threadId;
for(const [name,args] of [['linked',['--delegated-from',parent]],['unreadable',['--delegated-from','mcp:absent-synthetic-parent']],['plain',[]]]){
const title=execFileSync('bash',['-c','. bin/backends/t3code.sh; fm_backend_t3code_thread_title "$1" "$2"','title',name==='linked'?'ws/synthetic':'','fm-'+name],{encoding:'utf8'});
results[name]=call('launch',['--project',project,'--title',title,'--model-selection',selection,'--worktree',lab+'/task','--branch','task',...args]);
if(results[name].threadId) results[name+'Read']=call('read',['--thread',results[name].threadId]);
console.log(name,JSON.stringify(results[name]),JSON.stringify(results[name+'Read']));
}
fs.writeFileSync(lab+'/results.json',JSON.stringify(results,null,2));
