javascript:(
  function(d,s){
    s = d.createElement('script');
    s.src = 'https://chuniviewer.net/js/getMusicScore.js?'+Date.now();
    d.getElementsByTagName('head')[0].appendChild(s);
  }
)(document);

(function(){

var CHUNITHM_NET_URL = "https://chunithm-net.com/mobile/";
var CHUNIVIEWER_NET_URL = "https://chuniviewer.net/";
var CHUNITHM_NET_HOST = "chunithm-net.com";
var CHUNITHMNET_LOGIN = "https://chunithm-net.com/mobile/";
var CHUNITHM_NET_GENRE_URL = "https://chunithm-net.com/mobile/MusicGenre.html";

var VERSION = 120;

var INTERVAL = 3000;

var onError = function(e){
  setTimeout(function() {throw new Error(e);}, 10);
  alert("エラーが発生しました\n再度ログインして下さい。");
  document.location = CHUNITHMNET_LOGIN;
}

var _ajax = function(url, type, payload) {
  return new Promise(function(resolve, reject) {
    $.ajax({
      type: type,
      url: url,
      data: payload
    }).done(function(data, textStatus, jqXHR) {
      resolve(data);
    }).fail(function (jqXHR, textStatus, errorThrown){
      console.log(jqXHR, textStatus, errorThrown);
      reject("Error occured in ajax connection." + jqXHR.responseText);
    });
  })
}


var showOverLay = function(){
    var overlay = $("<div>").addClass("chuniviewer_overlay").attr("style","color:black;font-size: 20px;padding-top: 200px;width: 100%; height:100%; text-align: left; position: fixed; top: 0; z-index: 100;background: rgba(0,0,0,0.7);"); 
    var textarea = $("<div>").attr("style","padding:5px;background-color: #FFD54F;width:40%;height:20%;margin:0 auto;")
    var musicNameDiv = $("<div>").addClass("chuniviewer_musicName");
    var animediv = $("<div>").addClass("chuniviewer_animation");
    textarea.append(musicNameDiv);
    textarea.append(animediv);
    overlay.append(textarea);
    $("body").append(overlay);
    overlay.show();

    $(".chuniviewer_musicName").text("準備中");
    var i = 0
     loadingAnime = [
       "loading.", 
       "loading..",
       "loading...",
       "loading....",
       "loading.....",
       "loading......",
       "loading.......",
     ]
    setInterval(function() {
        $(".chuniviewer_animation").text(loadingAnime[i % loadingAnime.length]); 
      i++
    },200)
}


function hideOverLay(){
    $(".chuniviewer_overlay").hide();
}


var getDifficultyId = function(difficultyName) {
  if(difficultyName == 'master') {
    return 3
  }else if(difficultyName == 'expert') {
    return 2
  }else if(difficultyName == 'advanced') {
    return 1
  }else if(difficultyName == 'basic') {
    return 0
  }
}


var postMusicData = function(data) {
  console.log(data);
  var musicListJson = JSON.stringify(data);
  data = {musicdata: musicListJson};

  _ajax('https://chuniviewer.net/UpdateMusicData.php', type='post', payload=data).then(function (res){
    // console.log(res);
  });
}


var getMusicData = function() {
  return new Promise(function(resolve, reject) {
    var i = 0
    // level
    musicData = {}
    levelArray = [1,2,3,4,5,6,7,8,9,10,11,12,13,14]
    levelArray.reduce(function(promise, level) {
      return promise.then(function() {
        return new Promise(function(resolve, reject) {
          console.log(level);
          _ajax("https://chunithm-net.com/mobile/MusicLevel.html", type="post", {selected:level, changeSelect:"changeSelect"}).then(function(data) {
            doc = $($.parseHTML(data));
            var b = 0
            doc.find(".box01, .w420").slice(3).map(function(j, e) {
              console.log(j,e)
              var targetList = $(e).find(".music_title").map(function(k, e) {
                difficulty = getDifficultyId($(e).parent()[0].classList[2].match(/(master|basic|advanced|expert)/)[0]);
                onClickAttr = e.getAttribute("onclick")
                musicId = onClickAttr.match(/((\w+)_(\d+|\w+))/g)[1].split("_")[1]
                console.log(e.innerText, musicId, level+b, difficulty)
                if(typeof(musicData[musicId]) == 'undefined'){
                  musicData[musicId] = {
                    difficulty:{
                      [difficulty]: {
                        level:level+b,
                        diff: difficulty
                      }
                    },
                    name: e.innerText,
                    id: musicId
                  }
                }else{
                  musicData[musicId].difficulty[difficulty] = {level: level+b, diff: difficulty}
                }

              })
              b+=0.5
            })
            resolve()
          });
        })
      })
    }, Promise.resolve()).then(function() {
      console.log(musicData)
      postMusicData(musicData)
      resolve();
    })
  })
}



var postPlayerScore = function(data) {
  var payload = JSON.stringify(data);
  var form = document.createElement('form');

  // if(navigator.userAgent.search("Chrome") == -1)
  //   form.setAttribute('target', '_blank');
  document.body.appendChild(form);
  var input2 = document.createElement('input');
  input2.setAttribute('type', 'hidden');
  input2.setAttribute('name', 'scoredata');
  input2.setAttribute('value', payload);
  form.appendChild(input2);
        
  var payload = JSON.stringify(data);
  var input = document.createElement('input');
  form.setAttribute('action', 'https://chuniviewer.net/updatescore');
  form.setAttribute('method', 'post');
  form.submit();
}

var parsePlayerInfoHtml = function(html) {

  //console.log(html)
  doc = $.parseHTML(html);

  userName = $(doc).find(".ml_10")[0].innerText
  playCount = $(doc).find(".user_data_play")[0].innerText.match(/\d+/)[0]
  playerRating = $(doc).find(".player_rating")[0].innerText.match(/RATING : (\d*\.\d*)/)[1] * 100
  highestRating = $(doc).find(".player_rating")[0].innerText.match(/MAX (\d*\.\d*)/)[1] * 100
  trophyName = $(doc).find(".player_honor_text")[0].innerText
  level = $(doc).find(".player_lv")[0].innerText.match(/\d+/)[0]
  reincarnationNum = 0
  point = 0 
  total_point = 0

  userInfo =  {
    userName: userName,
    playCount: playCount,
    playerRating: playerRating,
    highestRating: highestRating,
    trophyName: trophyName,
    level: level,
    reincarnationNum: reincarnationNum,
    point: point,
    totalPoint: total_point,
  }
  return userInfo;
}


var getPlayerData = function() {
  console.log("get player infomation...");
  return _ajax("https://chunithm-net.com/mobile/UserInfoDetail.html").then(function(data) {
    console.log("ok");
    playerData = parsePlayerInfoHtml(data);
    playerObj = {
      userInfo: playerData
    }
    return playerObj;
  }).catch(function (e){
    onError("Error while retrieving player data." + e);
    return Promise.reject();
  });
}

var parseMusicDetailHtml = function(html) {
  //console.log(html)
  doc = $.parseHTML(html);
  mb = $(doc).find(".music_box");

  scoreData = {}

  mb.each(function(i, box) {
    //console.log(box)
    difficulty = getDifficultyId(box.className.match(/(master|basic|advanced|expert)/)[0]);
    rank = $(box).find("img[src^='common/images/icon_rank']")[0].src.match(/.*rank_(\d+).png/)[1]
    score = $(box).find(".text_b")[0].innerText.replace(/,/g,"")
    playcount = $(box).find(".block_icon_text")[0].innerText.match(/\d+/)[0]
    success = $(box).find("img[src='common/images/icon_clear.png']")[0] != undefined
    alljustice = $(box).find("img[src='common/images/icon_alljustice.png']")[0] != undefined
    fullcombo = $(box).find("img[src='common/images/icon_fullcombo.png']")[0] != undefined
    fullchain = $(box).find("img[src='common/images/icon_fullchain2.png']")[0] != undefined ? 1 : 0
    fullchain = $(box).find("img[src='common/images/icon_fullchain.png']")[0] != undefined ? 2 : fullchain
    updatedate = $(box).find(".musicdata_detail_date")[0].innerText

    $.extend(scoreData, {
      [difficulty]: {
        difficulty: difficulty,
        rank: rank,
        score: score,
        playcount: playcount,
        success: success,
        alljustice: alljustice,
        fullcombo: fullcombo,
        fullchain: fullchain,
        updateDate: updatedate,
      }
    })
  })
  return scoreData;
}


var parseMusicBox = function(box) {
  if (typeof($(box).find(".text_b")[0]) == 'undefined')
    return {}
  difficulty = getDifficultyId(box.className.match(/(master|basic|advanced|expert)/)[0]);
  rank = $(box).find("img[src^='common/images/icon_rank']")[0].src.match(/.*rank_(\d+).png/)[1]
  score = $(box).find(".text_b")[0].innerText.replace(/,/g,"")
  playcount = 1
  //playcount = $(box).find(".block_icon_text")[0].innerText.match(/\d+/)[0]
  success = $(box).find("img[src='common/images/icon_clear.png']")[0] != undefined
  alljustice = $(box).find("img[src='common/images/icon_alljustice.png']")[0] != undefined
  fullcombo = $(box).find("img[src='common/images/icon_fullcombo.png']")[0] != undefined
  fullchain = $(box).find("img[src='common/images/icon_fullchain2.png']")[0] != undefined ? 1 : 0
  fullchain = $(box).find("img[src='common/images/icon_fullchain.png']")[0] != undefined ? 2 : fullchain
  updatedate = ""

  obj = {
      difficulty: difficulty,
      rank: rank,
      score: score,
      playcount: playcount,
      success: success,
      alljustice: alljustice,
      fullcombo: fullcombo,
      fullchain: fullchain,
      updateDate: updatedate,
  }
  return obj
  //updatedate = $(box).find(".musicdata_detail_date")[0].innerText
}

var parseMusicList = function(data) {
  doc = $.parseHTML(data);
  mb = $(doc).find(".musiclist_box")
  var musicdata = []
  mb.each(function(i, e) {
    onClickAttr = $(e).find('.music_title')[0].getAttribute("onclick")
    attr = onClickAttr.match(/((\w+)_(\d+|\w+))/g)
    data = {}
    attr.map(function(e) {
      p = e.split("_");
      $.extend(data, {[p[0]]:p[1]})
    })
    var musicId = data.musicId
    var obj = parseMusicBox(e)
    musicdata[musicId] = obj
  })
  return musicdata
}


var getPlayerAllScore = function() {
  // 楽曲一覧
  var musicDetail = []
  var masterMusicData = []

  return Promise.resolve().then(function() {
    return new Promise(function(resolve, reject) {
      $(".chuniviewer_musicName").text("スコア取得中:[MASTER]"); 
      setTimeout(function() { 
        _ajax(CHUNITHM_NET_GENRE_URL, "post", {genre:99, level:"master", music_genre:"music_genre"}).then(function(data) {
          masterMusicData = parseMusicList(data)
          resolve()
        })
      }, INTERVAL);
    })
  }).then(function() {
    return new Promise(function(resolve, reject) {
      $(".chuniviewer_musicName").text("スコア取得中:[EXPERT]"); 
      setTimeout(function() { 
        _ajax(CHUNITHM_NET_GENRE_URL, "post", {genre:99, level:"expert", music_genre:"music_genre"}).then(function(data) {
          expertMusicData = parseMusicList(data)
          resolve()
        })
      }, INTERVAL);
    })
  }).then(function() {
    return new Promise(function(resolve, reject) {
      $(".chuniviewer_musicName").text("スコア取得中:[ADVANCED]"); 
      setTimeout(function() { 
        _ajax(CHUNITHM_NET_GENRE_URL, "post", {genre:99, level:"advanced", music_genre:"music_genre"}).then(function(data) {
          advancedMusicData = parseMusicList(data)
          resolve()
        })
      }, INTERVAL);
    })
  }).then(function() {
    return new Promise(function(resolve, reject) {
      $(".chuniviewer_musicName").text("スコア取得中:[BASIC]"); 
      setTimeout(function() {
        _ajax(CHUNITHM_NET_GENRE_URL, "post", {genre:99, level:"basic", music_genre:"music_genre"}).then(function(data) {
          basicMusicData = parseMusicList(data)
          resolve()
        })
      }, INTERVAL);
    })
  }).then(function() {
    for(var musicId in masterMusicData) {
      musicDataObj = {
        music_id: musicId,
        scoreData : {
          0: basicMusicData[musicId],
          1: advancedMusicData[musicId],
          2: expertMusicData[musicId],
          3: masterMusicData[musicId]
        }
      }
      musicDetail.push(musicDataObj)
    }
    return musicDetail
  }).then(function(data) {
    return data;
  })
}

var checkNewMusic = function() {
  return _ajax(CHUNITHM_NET_GENRE_URL, "post", {genre:99, level:"master", music_genre:"music_genre"}).then(function(musicData) {
    musicData = parseMusicList(musicData)
    idList = Object.keys(musicData).map(function(i){return Number(i);});
    // console.log("ids,", idList);
    payload = {
      idList: JSON.stringify(idList)
    };
    return _ajax("https://chuniviewer.net/NeedsMusicDataUpdate", type="post", payload)
  }).then(function(musicUpdated) {
    return musicUpdated.updated;
  }).catch(function(e) {
    onError("Error while checking new music." + e);
    return Promise.reject();
  })
}


var checkScriptVersion = function() {
  return _ajax("https://chuniviewer.net/GetScriptVersion.php").then(function(data) {
    if(VERSION != data.version){
      if(confirm("Chuniviewer スコア取得用ブックマークレット Ver "+VERSION/100+"\n古いブックマークレットです。最新版に変更して下さい。\n現在のバージョン:"+VERSION/100+" 最新版"+data['version']/100+"\nChuniviewerトップに移動しますか")) {
        document.location = CHUNIVIEWER_NET_URL;
      }else{
        return Promise.reject();
      }
    }
    if(window.location.hostname != CHUNITHM_NET_HOST) {
      if(confirm("Chuniviewer スコア取得用ブックマークレット Ver "+VERSION/100+"\nCHUNITHM-NETで実行して下さい.CHUNITHM-NETへ移動しますか.")) {
        document.location = CHUNITHM_NET_URL;
      }
      return Promise.reject();
    }
    if(confirm("Chuniviewer スコア取得用ブックマークレット Ver "+VERSION/100+"\n スコアを取得します.(Chuniviewerへのログインが必要です)")) {
      return Promise.resolve();
    }else{
      return Promise.reject();
    }
  });
}

var chuniviewerUpdateScore = function() {
  var data = {}
  checkScriptVersion().
  then(function() {
    showOverLay()
    return checkNewMusic();
  }).then(function(musicUpdated) {
    console.log("updated", musicUpdated);
    if(musicUpdated)
      return getMusicData();
    else
      return Promise.resolve();
  }).then(function() {
    $(".chuniviewer_musicName").text("プレイヤー情報取得中"); 
    return getPlayerData();
  }).then(function(playerInfo) {
    data['playerInfo'] = playerInfo
    return getPlayerAllScore()
  }).then(function(musicDetail) {
    data['musicDetail'] = musicDetail
    console.log(data);
    hideOverLay()
    return postPlayerScore(data)
  }).catch(function(e) {
    console.log("failed")
    hideOverLay();
    onError(e)
  })
}

chuniviewerUpdateScore()

})();