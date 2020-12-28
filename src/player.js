//External modules
const ytdl = require('ytdl-core');
const Speaker = require('speaker');
const prism = require('prism-media');

const speaker = new Speaker({
    sampleRate: 48000,
})

let YTDL;

let demuxer = new prism.opus.WebmDemuxer();
let decoder = new prism.opus.Decoder({ frameSize: 960, channels: 2, rate: 48000,  });




class Player{
    constructor(){
        this.storage = [];
        this.PAUSED = false;
        this.video = {};
        this.PCMSize = 0;
        this.played = 0;

        demuxer.on('data',(data) => {
            decoder.write(data);
        });
    
        decoder.on('data', (data) => {
            this.storage.push(data);
            this.PCMSize += data.length;
        });

        setInterval(() => {
            if(speaker.writableLength <= 3*1024 && this.storage.length > 0 && !this.PAUSED){
                speaker.write(this.storage[0]);
                this.played += this.storage[0].length;
                this.storage.shift();
            }
        },10);


    }
    
    pause_switch(){
        this.PAUSED = !this.PAUSED;
    }

    async play(video_data){
        // resets data;
        if(typeof YTDL === 'object'){
            YTDL.destroy();
        }

        this.PAUSED = false;
        this.storage = [];
        this.PCMSize = 0;
        this.played = 0;

        this.video = video_data;
        YTDL = ytdl(video_data.url,{ quality: 'highestaudio'})
            .on('data',(data)=>{
                demuxer.write(data);
            })
        
        

    }
}

module.exports = {
    Player : Player
}