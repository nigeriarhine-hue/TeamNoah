const {chromium}=require('playwright');const fs=require('fs');
(async()=>{
  const dir=__dirname; const [mode]=process.argv.slice(2);
  const b=await chromium.launch();const pg=await b.newPage({viewport:{width:1080,height:1920},deviceScaleFactor:1});
  await pg.goto('file://'+dir+'/scene.html');await pg.evaluate(()=>document.fonts.ready);await pg.waitForTimeout(500);
  const times = mode==='preview' ? [0.3,1.0,2.3,3.4,4.3,5.6,6.4,7.3,8.5,9.9] : [...Array(300).keys()].map(i=>i/30);
  const out = mode==='preview' ? dir+'/preview' : dir+'/frames'; fs.mkdirSync(out,{recursive:true});
  for(let i=0;i<times.length;i++){await pg.evaluate(t=>window.render(t),times[i]);
    await pg.screenshot({path:`${out}/${mode==='preview'?'p_'+times[i]:'f'+String(i).padStart(4,'0')}.${mode==='preview'?'png':'jpg'}`,...(mode==='preview'?{}:{type:'jpeg',quality:95})});}
  await b.close();
})();
