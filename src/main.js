//External modules
const prompts = require('prompts');
const ytSearch = require( 'yt-search' );
const kleur = require('kleur');
const cliProgress = require('cli-progress');

//Own modules
const {Player} = require('./player.js');
const { search } = require('yt-search');


const player = new Player();

//Program body
async function main(){
    while(true){
        await menuScreen();
    }
    
}

main();
//End of program body

//Functions descriptions

async function menuScreen(){
    console.clear();
    const choice = await prompts({
        type : 'select',
        name : 'value',
        message : kleur.yellow('Main menu'),
        choices : [
            {title : '⏯️\tSong menu', value : 'song_menu', description : '' , disabled : (Object.keys(player.video).length === 0)},
            {title : '🔎\tSearch', value : 'search', description : '',disabled : false},
            {title : '🚪\tExit', value : 'exit', description : '',disabled : false}
            
        ],
        initial : 0,
        warn : kleur.red(' 🚨  You can\'t do this right now')
    });

    switch (choice.value) {
        case 'search':
            player.play(await searchScreen());
            break;
        
        case 'exit':
            console.clear();
            process.exit();
            break;
        
        case 'song_menu':
            await songScreen();
            break;

        default:
            break;
    }
}

async function searchScreen(){//returns a youtube video object
    console.clear();
    let search = await prompts({
        type: 'text',
        name: 'term',
        message: kleur.red('Search for a Youtube video')
    });

    console.clear();
    console.log(kleur.cyan('Waiting for Youtube\'s answer'));

    results = (await ytSearch(search.term)).videos.slice(0, 5);

    console.clear();
    let choices = await prompts({
        type: 'select',
        name: 'value',
        message: kleur.red('Select to play'),
        choices: results.map((video) => { return {title : video.title + ' by ' + kleur.blue(video.author.name), description : video.url} }),
        initial: 0
    });

    return results[choices.value];
}

async function songScreen(){
    const b1 = new cliProgress.SingleBar({
        format: 'CLI Progress |' + kleur.cyan('{bar}') + '| {percentage}% || {value}/{total} Chunks || Speed: {speed}',
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
        hideCursor: true
    });

    b1.start(200, 0, {
        speed: "N/A"
    });

    const choice = await prompts({
        type : 'select',
        name : 'value',
        message : kleur.yellow('Song menu'),
        choices : [
            {title : '⏯️\tPlay || Pause', value : 'song_menu', description : '' , disabled : (Object.keys(player.video).length === 0)},
            {title : '🚪\tBack', value : 'back', description : '',disabled : false}
            
        ],
        initial : 0,
        warn : kleur.red(' 🚨  You can\'t do this right now')
    });
}