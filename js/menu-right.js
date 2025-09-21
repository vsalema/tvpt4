const qs = sel => document.querySelector(sel);
const libs = {

};
class PlayerManager {
  constructor(containerId) {
    this.container = qs('#'+containerId);
    this.instance = null;
  }
  async play(playerName, url) {
    this.cleanup();
    await Promise.all(libs[playerName].map(r=>loadResource(r,playerName)));
    this.container.innerHTML='';
    const type = url.includes('.m3u8')?'application/vnd.apple.mpegurl':'video/mp4';
    switch(playerName) {
      case 'jw': this.container.innerHTML = `<div id="jw-player"></div>`;
        this.instance = jwplayer("jw-player").setup({file:url,type,autostart:true,width:"100%",height:"100%",
          key:"cLGMn8T20tGvW+0eXPhq4NNmLB57TrscPjd1IyJF84o="}); break;
      case '': this.container.innerHTML = ``;
        this.instance = videojs("",{autoplay:true}); this.instance.src({src:url,type}); break;
      case 'plyr': this.container.innerHTML = ``;
        const el = qs(""); this.instance = new Plyr(el,{autoplay:true});
        if (Hls.isSupported() && type==='') {
          const hls = new Hls(); hls.loadSource(url); hls.attachMedia(el);
          hls.on(Hls.Events.MANIFEST_PARSED,()=>el.play());
        } else {el.src=url;el.play();} break;
      case '': this.container.innerHTML = ``;
        
const video = qs(''); const player = new shaka.Player(video);
        const ui = new shaka.ui.Overlay(player,this.container,video);
        this.instance = {player,ui}; player.load(url).catch(console.error); break;
      case '': this.container.innerHTML = ``;
        this.instance = new Clappr.Player({source:url,mimeType:type,autoPlay:true,
          parentId:"",width:"",height:""}); break;
    }
  }
 
  cleanup() {
    if (!this.instance) return;
    try {
      if (this.instance === jwplayer("")) this.instance.remove();
      else if (this.instance.dispose) this.instance.dispose();
      else if (this.instance.destroy) this.instance.destroy();
      else if (this.instance.player && this.instance.ui) {this.instance.ui.destroy();this.instance.player.destroy();}
    } catch(e){}
    this.container.innerHTML='';
    this.instance=null;
    document.querySelectorAll(`[]`).forEach(el=>el.remove());
  }
}
  const renderChannels = (channels, programs) => {
  const container = qs(''); container.innerHTML=''; const groups={};
  channels.forEach(ch=>{if(!groups[ch.group])groups[ch.group]=[];groups[ch.group].push(ch);});
  Object.entries(groups).forEach(([group,chans])=>{
const g=document.createElement('div'); g.className='group';
    const gt=document.createElement('div'); gt.className='group-title';
    gt.innerHTML=`<span>${group}</span><span class="count">${chans.length}</span>`;
    const c=document.createElement('div'); c.className='channels';
    chans.forEach(ch=>{
      const cd=document.createElement('div'); cd.className='channel'; cd.onclick=()=>{qs('').value=ch.url;saveState();playVideo();};
      cd.innerHTML=`${ch.logo?`<img src="${ch.logo}">`:''}{ch.title}</div>
        ${programs[ch.id]?`<div class="epg">${programs[ch.id]}</div>`:''}</div>`;
      c.appendChild(cd);
    });
    g.appendChild(gt);g.appendChild(c);container.appendChild(g);
  gt.onclick=()=>{c.style.display=c.style.display==='block'?'none':'block';};
  });
};      



const player = new PlayerManager("player-container");
const playVideo = () => {if(qs("#video-url").value.trim())player.play(qs("#playerSelect").value,qs("#video-url").value.trim());};
const saveState = () => {
  localStorage.setItem('videoURL',qs("#video-url").value.trim());
  localStorage.setItem('m3uURL',qs("#m3u-url").value.trim());
  localStorage.setItem('player',qs("#playerSelect").value);
};

["#menu-left-toggle", "#menu-right-toggle"].forEach(sel=>{
  qs(sel).onclick=()=>{
    const t=sel.includes('left')?qs("#menu-left"):qs("#menu-right");
    const o=qs("#overlay");
    t.classList.toggle("visible");
    o.style.display = (qs("#menu-left").classList.contains("visible")||qs("#menu-right").classList.contains("visible"))?"block":"none";
  };
});