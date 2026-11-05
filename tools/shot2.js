const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch(), p=await b.newPage({viewport:{width:1200,height:900}});
 await p.goto('http://localhost:8766/bornholm/'); await p.waitForTimeout(400);
 const el=await p.$('#view-region .crit a.rlink[href*="partner-ads"]'); await el.scrollIntoViewIfNeeded(); await p.screenshot({path:'/tmp/claude-0/-home-claude/64bce81e-b09c-5076-8576-29117f7435bc/scratchpad/pack.png'});
 await b.close();})();
