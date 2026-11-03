const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch(), p=await b.newPage();
 p.on('pageerror',e=>console.log('ERR',p.url(),e.stack.split('\n').slice(0,3).join(' | ')));
 const B='http://localhost:8766';
 for (const u of ['/','/manefjord/','/de/manefjord/','/nordjylland/','/en/nordjylland/','/hosts/','/lodgify/','/impressum/','/datenschutz/','/de/datenschutz/','/t-glamping/','/de/t-glamping/mj/','/#manefjord']) { await p.goto(B+u); await p.waitForTimeout(250); }
 await p.goto(B+'/'); await p.click('a.card-link[href="/manefjord/"]'); await p.waitForTimeout(200); await p.click('[data-lang="de"]'); await p.waitForTimeout(200); await p.click('[data-lang="en"]'); await p.waitForTimeout(200);
 await p.click('.crumbs a >> nth=0'); await p.waitForTimeout(200); await p.click('a.rlink[href$="/nordjylland/"] >> nth=0'); await p.waitForTimeout(200); await p.click('[data-lang="de"]'); await p.waitForTimeout(200);
 await b.close();})();
