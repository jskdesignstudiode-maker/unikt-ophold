const { chromium } = require('playwright');
(async()=>{
 const b=await chromium.launch(), p=await b.newPage({viewport:{width:1280,height:900}});
 const errs=[]; p.on('pageerror',e=>errs.push(String(e))); p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
 p.on('response',r=>{if(r.status()>=400)errs.push(r.status()+' '+r.url())});
 const B='http://localhost:8766', st=async(l)=>console.log(l, p.url().replace(B,''), '|', await p.title(), '| h1:', await p.evaluate(()=>{const v=[...document.querySelectorAll('main > *, .view')].find(x=>!x.hidden&&x.offsetParent);const h=document.querySelector('h1');return h?h.textContent.slice(0,50):''}));
 await p.goto(B+'/'); await st('home');
 // card to stay
 await p.click('a.card-link[href="/manefjord/"]'); await p.waitForTimeout(300); await st('stay');
 await p.goBack(); await p.waitForTimeout(300); await st('back');
 await p.goForward(); await p.waitForTimeout(200);
 await p.click('[data-lang="de"]'); await p.waitForTimeout(300); await st('de');
 // breadcrumb home link
 await p.click('.crumbs a >> nth=0'); await p.waitForTimeout(300); await st('crumb-home');
 // region guide from home
 await p.click('a.rlink[href$="/nordjylland/"] >> nth=0'); await p.waitForTimeout(300); await st('region');
 await p.click('[data-lang="en"]'); await p.waitForTimeout(300); await st('en region');
 // direct loads
 for (const u of ['/de/t-glamping/mj/','/en/hosts/','/lodgify/','/#manefjord','/#nordjylland']) { await p.goto(B+u); await p.waitForTimeout(300); await st(u); }
 // header link from subpage to section
 await p.goto(B+'/manefjord/'); await p.click('header a[href$="#regioner"] >> nth=0'); await p.waitForTimeout(500); await st('nav regioner'); console.log('scrollY', await p.evaluate(()=>scrollY), 'hash', await p.evaluate(()=>location.hash));
 // filter then card links
 await p.goto(B+'/'); await p.click('[data-type="glamping"] >> nth=0').catch(()=>{}); console.log('card href', await p.evaluate(()=>[...document.querySelectorAll('.card-link')].map(a=>a.getAttribute('href'))));
 console.log('errors', errs);
 await b.close();
})();
