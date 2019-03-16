
function gameOver(){
        var audio = document.getElementById("Audio");
        audio.src = "assets/sound/gameover.wav";
        audio.loop = false;
        audio.load();
        audio.playbackRate = 0.5;
        audio.play();
        console.log(audio)
}

function startGame(){
    var audio = document.getElementById("Audio");
        audio.src = "assets/sound/bgm.wav";
        audio.loop = true;
        audio.load();
        audio.playbackRate = 1;
        audio.play();
}

function walking(){
    var sfx = document.getElementById("SFX");
    if (sfx.src != "assets/sound/walk.wav") {
        sfx.src = "assets/sound/walk.wav";
        sfx.load();
    }
    sfx.loop = true;
    sfx.play();
}

function stopWalking(){
    var sfx = document.getElementById("SFX");
    if (sfx.src != "assets/sound/silent.wav") {
        sfx.src = "assets/sound/silent.wav";
        sfx.load();
    }
    sfx.loop = true;
    sfx.play();
}
