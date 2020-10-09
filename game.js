let n=0;
let m=0;

let playBoard=document.getElementById("playBoard");
let playString="";
let arrayBoard=[];

let person={
    x:1,
    y:1,
    direction:"down",
    bomb:0,
    step:0
};
let monsters=[
    {
        x:2,
        y:0,
        direction:"up"
    },
    {
        x:0,
        y:0,
        direction:"up"
    },
    {
        x:0,
        y:3,
        direction:"left"
    }
];

let bombs=[];

function putHeroes(n,m){
    monsters[0].y=n-2;
    monsters[1].y=n-2;
    monsters[1].x=Math.round(m/2)+1;
    monsters[2].x=m-2;

    monsters.forEach(element => {
        arrayBoard[element.y][element.x]="M";
    });

    arrayBoard[person.y][person.x]="P";
    bombs=[];

    let boxesAmount=Math.round((n*m)/36);
    for (let i=0;i<boxesAmount;i++){
        let curX=Math.round(2+Math.random()*(m-4));
        let curY=Math.round(2+Math.random()*(n-4));
        arrayBoard[curY][curX]="&equiv;";//box 
    }

    let wallVerX=Math.round(3+Math.random()*(Math.floor(m/2)-3));
    let wallVerY=Math.round(3+Math.random()*(Math.floor(n-6)));
    for(let w=1;w<wallVerY+1;w++){
        arrayBoard[w][wallVerX]="&#9632;"//wall
    }

    let wallHorX=Math.round(Math.ceil(m/2)+Math.random()*(m-3-Math.ceil(m/2)));
    let wallHorY=Math.round(3+Math.random()*(Math.floor(n-6)));
    for(let w=wallHorX;w<m-1;w++){
        arrayBoard[wallHorY][w]="&#9632;"//wall
    }
}

function createGame(){
    n=parseInt(document.getElementById("n").value);
    m=parseInt(document.getElementById("m").value);
    if (!n || !m || n<7 || m<7) {
        playBoard.innerHTML="Too small field! Each side must be larger than 7";
        return;
    }
    for(let i=0;i<n;i++){
        arrayBoard[i]=[];
        for(let j=0;j<m;j++){
            if(j==0 || j==m-1 || i==0 || i==n-1) arrayBoard[i][j]="&#9632;"; //wall
            else  arrayBoard[i][j]="&emsp;"; //space
        };
       
    };
    putHeroes(n,m);
    drawPicture();
    startGame();
}

function drawPicture(){
    playString="";
    for(let i=0;i<n;i++){
        for(let j=0;j<m;j++){
           playString+= arrayBoard[i][j]; 
        }
        playString+="\n";
    }
    playBoard.innerHTML=playString;
}

let btnCreate=document.getElementById("createGame");
btnCreate.addEventListener("click", createGame);

let timerId=-1;
let stopButton=document.getElementById("stop");
stopButton.addEventListener("click", ()=>clearInterval(timerId));


function startGame(){
    document.addEventListener('keydown',function (event){
        if (event.code=='KeyW') person.direction="up";
        if (event.code=='KeyA') person.direction="left";
        if (event.code=='KeyS') person.direction="down";
        if (event.code=='KeyD') person.direction="right";
        if (event.code=='KeyB') person.bomb=1;
        if (event.code == 'KeyW' || event.code =='KeyA' || event.code =='KeyS' || event.code =='KeyD') person.step=1;
    });
    timerId=setInterval(renderGame, 500);
    
}

function renderGame(){
    
    let nextX="";
    let nextY="";

    bombs.forEach(element => {
        if(element && element.lifetime==0) {
            arrayBoard[element.y][element.x]="&emsp;";

            for (let i=1;i<4;i++){
                let x=element.x;
                let y=element.y;
                if (y+i<n && arrayBoard[y+i][x] && arrayBoard[y+i][x]!="&#9632;") arrayBoard[y+i][x]="&emsp;";
                if (x+i<m && arrayBoard[y][x+i] && arrayBoard[y][x+i]!="&#9632;" ) arrayBoard[y][x+i]="&emsp;";
                if (x-i>0 && arrayBoard[y][x-i] && arrayBoard[y][x-i]!="&#9632;") arrayBoard[y][x-i]="&emsp;";
                if (y-i>0 && arrayBoard[y-i][x] && arrayBoard[y-i][x]!="&#9632;" ) arrayBoard[y-i][x]="&emsp;";
                };
            element=null;
        }
        if (element){

            arrayBoard[element.y][element.x]="B";
            if (element.lifetime<4){
            
                for (let i=1;i<4;i++){
                let x=element.x;
                let y=element.y;
                if (y+i<n && arrayBoard[y+i][x] && arrayBoard[y+i][x]!="&#9632;") arrayBoard[y+i][x]="F";
                if (x+i<m && arrayBoard[y][x+i] && arrayBoard[y][x+i]!="&#9632;" ) arrayBoard[y][x+i]="F";
                if (x-i>0 && arrayBoard[y][x-i] && arrayBoard[y][x-i]!="&#9632;") arrayBoard[y][x-i]="F";
                if (y-i>0 && arrayBoard[y-i][x] && arrayBoard[y-i][x]!="&#9632;" ) arrayBoard[y-i][x]="F";
                };
                
            };
            element.cutLife(); 
        }
    });

    //monsters movement
    monsters.forEach(element => {
       
            nextX=element.x;
            nextY=element.y;
            
            if (element.direction=="left") nextX--;
            else if (element.direction=="right") nextX++;
            else if (element.direction=="up") nextY--;
            else if (element.direction=="down") nextY++;
            else console.log("monster error");

            if (arrayBoard[nextY][nextX]=="&#9632;" || arrayBoard[nextY][nextX]=="&equiv;") {
                if (element.direction=="left") element.direction="right";
                else if (element.direction=="right") element.direction="left";
                else if (element.direction=="up") element.direction="down";
                else if (element.direction=="down") element.direction="up";
            }
            else {
                if (arrayBoard[element.y][element.x]=="F") {
                    arrayBoard[element.y][element.x]="X";
                    monsters.splice(monsters.indexOf(element),1);
                    console.log("Bomb!");
                }
                else{
                    arrayBoard[element.y][element.x]="&emsp;"
                    element.x=nextX;
                    element.y=nextY;
                    arrayBoard[nextY][nextX]="M";
                }
                
            }
        
       
    });
    //person movement
    nextX=person.x;
    nextY=person.y;
    if (arrayBoard[person.y][person.x]=="M" && person.step==0) deadGame();
    if (arrayBoard[person.y][person.x]=="F" && person.step==0) deadGame();

    if (person.bomb==0 && person.step==0) arrayBoard[person.y][person.x]=="P";
    else{
        if (person.bomb==1){
            bombs.push({
                x:person.x,
                y:person.y,
                lifetime:9,
                cutLife: function(){this.lifetime--}
            });
            arrayBoard[person.y][person.x]="B";
        }
        else {
            //direction
            if (person.direction=="left") nextX--;
            else if (person.direction=="right") nextX++;
            else if (person.direction=="up") nextY--;
            else if (person.direction=="down") nextY++;
            //checks
            if (arrayBoard[nextY][nextX]=="&#9632;" || arrayBoard[nextY][nextX]=="&equiv;") person.step=0;//walls and boxes
            else if (arrayBoard[nextY][nextX]=="M" && person.step==1) deadGame();
            else if (arrayBoard[nextY][nextX]=="F" && person.step==1) deadGame();
            else if (arrayBoard[nextY][nextX]=="&emsp;" && person.step==1){ //step
                arrayBoard[person.y][person.x]="&emsp;"
                person.x=nextX;
                person.y=nextY;
                arrayBoard[nextY][nextX]="P";
            }
        };
    }
    //start points of person
    person.direction="none";
    person.bomb=0;
    person.step=0;
 
//render
    drawPicture();

}

function deadGame(){
    clearInterval(timerId);
    alert("Персонаж погиб!");
}