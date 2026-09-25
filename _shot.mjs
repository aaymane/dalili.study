import { chromium } from 'playwright';
const OUT='/sessions/happy-great-wright/mnt/outputs/shots';
const pages=[
 ['home','https://dalili.study/'],
 ['simulateur','https://dalili.study/simulateur'],
 ['comparer','https://dalili.study/comparer'],
 ['calendrier','https://dalili.study/calendrier'],
 ['villes','https://dalili.study/villes'],
 ['ville-nantes','https://dalili.study/villes/nantes'],
 ['universites','https://dalili.study/universites'],
 ['blog','https://dalili.study/blog'],
 ['faq-visa','https://dalili.study/faq/visa-etudiant-france'],
 ['pays-maroc','https://dalili.study/pays/etudier-en-france-depuis-le-maroc'],
 ['stats','https://dalili.study/stats'],
 ['apropos','https://dalili.study/a-propos'],
];
const b=await chromium.launch();
const ctx=await b.newContext({viewport:{width:1600,height:1000},deviceScaleFactor:2});
for(const [name,url] of pages){
  const p=await ctx.newPage();
  try{
    await p.goto(url,{waitUntil:'networkidle',timeout:45000});
    await p.waitForTimeout(3500);
    await p.screenshot({path:`${OUT}/${name}.png`});
    console.log('OK',name);
  }catch(e){console.log('FAIL',name,e.message.slice(0,80));}
  await p.close();
}
// mobile
const m=await b.newContext({viewport:{width:430,height:932},deviceScaleFactor:3,isMobile:true,hasTouch:true});
for(const [name,url] of [['m-home','https://dalili.study/'],['m-simulateur','https://dalili.study/simulateur']]){
  const p=await m.newPage();
  try{await p.goto(url,{waitUntil:'networkidle',timeout:45000});await p.waitForTimeout(3000);
  await p.screenshot({path:`${OUT}/${name}.png`});console.log('OK',name);}catch(e){console.log('FAIL',name);}
  await p.close();
}
await b.close();
