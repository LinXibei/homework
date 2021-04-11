const fs = require('fs')
const path = require('path')
const folderPath = './assets'


const urlList = __dirname.split('/')
const parentFolderName = urlList[urlList.length - 1]
// En GrabRedPacketBird
const { subject, key } = nameToUpCase(parentFolderName)

// en_grab-red-packet-bird
function nameToUpCase(arr) {
  const subject = firstWordToUpcase(arr.split('_')[0])
  const remain = arr.split('_')[1].split('-')
  let key = ''
  for (let i = 0; i < remain.length; i++) {
    key += firstWordToUpcase(remain[i])
  }
  return { subject, key }
}

function firstWordToUpcase(word) {
  const first = word.substring(0, 1).toUpperCase()
  const otherW = word.substring(1)
  return first + otherW
}

const rObj = {
  "key": "startShow_anim",
  "type": "dragonBones",
  "path": "assets/animations/starShow_anim/开场_tex.png",
  "atlasPath": "assets/animations/starShow_anim/开场_tex.json",
  "skePath": "assets/animations/starShow_anim/开场_ske.json"
}
const fObj = {
  "key": "分母",
  "type": "bitmapFont",
  "path": "assets/fonts/分母_0.png",
  "atlasPath": "assets/fonts/分母.xml",
  "skePath": ""
}
const radioObj = {
  "key": "startMusic",
  "type": "audio",
  "filePath": "audios/sound/startMusic.wav",
  "nameList": "",
  "suffix": ".wav"
}
const imgObj = {
  "key": "GroupPro_fenzu_head_default",
  "type": "image",
  "path": "assets/image/defaultHead.png",
  "atlasPath": ""
}

const assetsPath = './assets'

// 遍历audios文件获取对应的音频文件
// const assetsList = getAudioPath(assetsPath)
function getAudioPath(audioPath) {
  fs.readdirSync(audioPath).forEach(fileName => {
    fs.stat(path.resolve(audioPath, fileName), (err, stats) => {
      // console.log(3, fileName)
      if (stats.isFile()) {
        console.log(333, audioPath, fileName)
        writeTxt(path.resolve(audioPath, fileName))
      } else {
        getAudioPath(path.join(audioPath, fileName))
      }
    })
  })
}

function writeTxt(filePath, fileName) {
  
}
getAudioPath(assetsPath)