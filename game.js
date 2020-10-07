let n=0;
let m=0;

let playBoard=document.getElementById("playBoard");
let playString="";
let currentBoard="";
let nextBoard="";
let arrayBoard=[[]];

let person={
    x:1,
    y:1,
    direction:"none"
};
let monster1={
    x:2,
    y:0,
    direction:"up"
};
let monster2={
    x:0,
    y:0,
    direction:"up"
};
let monster3={
    x:0,
    y:1,
    direction:"left"
}
let boxes=[];
let walls=[];

function putHeroes(n,m){
    monster1.y=n-2;
    monster2.y=n-2;
    monster2.x=Math.round(m/2)+1;
    monster3.x=m-2;

    let boxesAmount=Math.round((n*m)/36);
    for (let i=0;i<boxesAmount;i++){
        let curX=Math.round(1+Math.random()*(m-3));
        let curY=Math.round(1+Math.random()*(n-3));
        boxes[i]={
            "x":curX,
            "y":curY
        }
        
    }

    let wallVerX=Math.round(3+Math.random()*(Math.floor(m/2)-3));
    let wallVerY=Math.round(3+Math.random()*(Math.floor(n-6)));

    for(let w=1;w<wallVerY+1;w++){
        walls.push({
            "x":wallVerX,
            "y":w
        });
    }

    let wallHorX=Math.round(Math.ceil(m/2)+Math.random()*(m-3-Math.ceil(m/2)));
    let wallHorY=Math.round(3+Math.random()*(Math.floor(n-6)));
    for(let w=wallHorX;w<m-1;w++){
        walls.push({
            "x":w,
            "y":wallHorY
        });
    }
    
}

function createGame(){
    n=parseInt(document.getElementById("n").value);
    m=parseInt(document.getElementById("m").value);
    if (!n || !m || n<7 || m<7) return;
    playString="";
    
    putHeroes(n,m);

    for(let i=0;i<n;i++){
        for(let j=0;j<m;j++){

            if(j==0 ||j==m-1||i==0 || i==n-1) playString+="&#9632;";
            else if (i==person.y && j==person.x) playString+="P";
            else if ((i==monster1.y && j==monster1.x)||(i==monster2.y && j==monster2.x)||(i==monster3.y && j==monster3.x)) playString+="M";
            else {
                // playString+=" ";
                let flag=false;
                for (let w=0;w<walls.length;w++){
                    if(walls[w].x==j && walls[w].y==i){
                        playString+="&#9632;";
                        flag=true;
                        break;
                    };
                };
                if(flag==false){
                    for (let b=0;b<boxes.length;b++) {
                        if (boxes[b].x==j && boxes[b].y==i) {
                            playString+="X";
                            flag=true;
                            break;
                        };
                    };
                };
                
                if(flag==false) playString+=" ";
            }
        }
        playString+="\n";
    }
    playBoard.innerHTML=playString;
    currentBoard=playString;
    startGame();
}

let btnCreate=document.getElementById("createGame");
btnCreate.addEventListener("click", createGame);

let timerId=-1;


function startGame(){
    timerId=setInterval(renderGame, 1000);
    console.log(currentBoard.length);
}

function renderGame(){
    // if (monster1.direction=="up"){
    //     monster1.y+=1;
    // }
}