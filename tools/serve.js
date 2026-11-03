const http=require('http'),fs=require('fs'),path=require('path');const PUB=path.resolve(__dirname,'../public');
const M={'.html':'text/html; charset=utf-8','.webp':'image/webp','.woff2':'font/woff2','.xml':'application/xml','.txt':'text/plain'};
http.createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);let f=path.join(PUB,p);
 if(fs.existsSync(f)&&fs.statSync(f).isDirectory()){ if(!p.endsWith('/')){r.writeHead(301,{Location:p+'/'});return r.end();} f=path.join(f,'index.html');}
 if(!fs.existsSync(f)){r.writeHead(404);return r.end('404');}
 r.writeHead(200,{'Content-Type':M[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(r);}).listen(8766);
