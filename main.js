var currentIndex = 0
var audio = new Audio()
var clock
var musicList=[]


getMusicList(function (list) {
  musicList=list
  generateList(list)
  loadMusic(list[currentIndex])
})

audio.onplay=function(){
  clock=setInterval(()=>{
    var playMin = Math.floor(this.currentTime / 60) + ''
    var playSec = Math.floor(this.currentTime) % 60 + ''
    playMin = playMin.length === 2 ? playMin : '0' + playMin
    playSec = playSec.length === 2 ? playSec : '0' + playSec
  
    var totalMin = Math.floor(this.duration / 60) + ''
    var totalSec = Math.floor(this.duration) % 60 + ''
    totalMin = totalMin.length === 2 ? totalMin : '0' + totalMin
    totalSec = totalSec.length === 2 ? totalSec : '0' + totalSec
    $('.bar>.bar-progress').style.width = (this.currentTime / this.duration) * 100 + '%'
    $('.play-time>:nth-child(1)').innerText = playMin + ':' + playSec
    $('.play-time>:nth-child(2)').innerText = totalMin + ':' + totalSec
  },1000)
  isPlaying()
}

audio.onpause=function(){
  clearInterval(clock)
}

audio.onended=function(){
  currentIndex=(++currentIndex)%musicList.length
  setTimeout(() => {
    loadMusic(musicList[currentIndex])
    audio.play()   
  }, 3000);

}

$('.control .play').onclick=function(){
  if(audio.paused){
    audio.play()  
    this.querySelector('.play-btn').classList.remove('active')
    this.querySelector('.pause-btn').classList.add('active')
  }else{
    audio.pause()
    this.querySelector('.pause-btn').classList.remove('active')
    this.querySelector('.play-btn').classList.add('active')
  }
}

$('.control .pre').onclick=function(){
  document.querySelectorAll('.play-list>ul>li')[currentIndex].classList.remove('active')
  currentIndex=(musicList.length+(--currentIndex))%musicList.length
  document.querySelectorAll('.play-list>ul>li')[currentIndex].classList.add('active')
  loadMusic(musicList[currentIndex])
  audio.play()
}

$('.control .next').onclick=function(){
  document.querySelectorAll('.play-list>ul>li')[currentIndex].classList.remove('active')
  currentIndex=(++currentIndex)%musicList.length
  document.querySelectorAll('.play-list>ul>li')[currentIndex].classList.add('active')
  loadMusic(musicList[currentIndex])
  audio.play()
}

$('.progress .bar').onclick=function(e){
var percent=e.offsetX/parseInt(getComputedStyle(this).width)
audio.currentTime=audio.duration*percent
}

$('.play-list>ul').addEventListener('click',function(e){
  var fatherNode
  var index
  if(e.target.nodeName.toLowerCase()==='li'){
    fatherNode=e.target
  }else{
    fatherNode=e.target.parentNode
    while(fatherNode.nodeName.toLowerCase()!=='li'){
      fatherNode=fatherNode.parentNode
    }
  }
  index=fatherNode.getAttribute('data-index')
  for(var key in fatherNode.parentNode.children){
    if(fatherNode.parentNode.children[key].className==='active'){
       fatherNode.parentNode.children[key].classList.remove('active')
   }
}
  fatherNode.classList.add('active') 
  currentIndex=index
  loadMusic(musicList[currentIndex])
  audio.play()
},false)


function $(selector) {
  return document.querySelector(selector)
}

function getMusicList(callback) {
  var xhr = new XMLHttpRequest()
  xhr.open('GET', 'https://jenvyxu.github.io/web-music/song.json', true)
  xhr.onload = function () {
    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
      callback(JSON.parse(xhr.responseText))
    } else {
      console.log('获取数据失败')
    }
  }
  xhr.send()
  xhr.onerror = function () {
    console.log('网络异常')
  }
}

function loadMusic(musicObj) {
  $('.bar-title>.title>:nth-child(1)').innerText = musicObj.title
  $('.bar-title>.title>:nth-child(2)').innerText = '-' + musicObj.author
  $('.singer-pic>img').setAttribute('src',musicObj.cover)
  $('.progress>img').setAttribute('src',musicObj.cover)
  audio.src = musicObj.src
}

function generateList(list){
  var songList=document.createDocumentFragment()
  list.forEach((song,index)=>{
    var tpl=`
    <img src="${song.cover}" alt="" width="36px" height="36px">
    <div class="song-message">
      <div class="title-wrapper"><span class="title">${song.title}</div>
      <div class="auther-wrapper"><span class="author">${song.author}</span><span class="time">${song.duration}</span></div>
    </div>`
    var songLi=document.createElement('li')
    if(index===currentIndex){
      songLi.classList.add('active')
    }
    songLi.setAttribute('data-index',index)
    songLi.innerHTML=tpl
    songList.appendChild(songLi)
  })
  $('.play-list>ul').appendChild(songList)
  $('.play-list>p span').innerText=list.length
}

function isPlaying(){
  if(audio.paused){
    $('.play-btn').classList.add('active')
    $('.pause-btn').classList.remove('active')
  }else{
    $('.pause-btn').classList.add('active')
    $('.play-btn').classList.remove('active')
  }
}

// audio.ontimeupdate = function () {
//   console.log(this.currentTime)
//   var playMin = Math.floor(this.currentTime / 60) + ''
//   var playSec = Math.floor(this.currentTime) % 60 + ''
//   playMin = playMin.length === 2 ? playMin : '0' + playMin
//   playSec = playSec.length === 2 ? playSec : '0' + playSec

//   var totalMin = Math.floor(this.duration / 60) + ''
//   var totalSec = Math.floor(this.duration) % 60 + ''
//   totalMin = totalMin.length === 2 ? totalMin : '0' + totalMin
//   totalSec = totalSec.length === 2 ? totalSec : '0' + totalSec
//   $('.bar>.bar-progress').style.width = (this.currentTime / this.duration) * 100 + '%'
//   $('.play-time>:nth-child(1)').innerText = playMin + ':' + playSec
//   $('.play-time>:nth-child(2)').innerText = totalMin + ':' + totalSec
// }
