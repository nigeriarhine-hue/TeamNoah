// Renders frames with the animation retimed to the user's voiceover (piecewise real->scene time map).
const {chromium}=require('playwright');const fs=require('fs');
const A=[[0,0],[3.0,1.75],[5.75,2.6],[6.6,3.55],[10.75,6.58],[11.5,6.95],[12.5,8.45],[13.8,9.1],[15.0,10.0]];
const map=r=>{if(r>=A[A.length-1][0])return 10;for(let i=1;i<A.length;i++)if(r<=A[i][0]){const[a,b]=A[i-1],[c,d]=A[i];return b+(d-b)*(r-a)/(c-a);}};
(async()=>{
  const dir=__dirname,TOT=17.6,FPS=30,out=dir+'/frames_vo';fs.mkdirSync(out,{recursive:true});
  const b=await chromium.launch();const pg=await b.newPage({viewport:{width:1080,height:1920}});
  await pg.goto('file://'+dir+'/scene.html');await pg.evaluate(()=>document.fonts.ready);await pg.waitForTimeout(500);
  const N=Math.round(TOT*FPS);let last=null;
  for(let i=0;i<N;i++){const s=map(i/FPS);const f=`${out}/f${String(i).padStart(4,'0')}.jpg`;
    if(s===10&&last){fs.copyFileSync(last,f);continue;}
    await pg.evaluate(t=>window.render(t),s);await pg.screenshot({path:f,type:'jpeg',quality:95});last=f;}
  await b.close();
})();
