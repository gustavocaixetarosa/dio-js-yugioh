const state = {
    score:{
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById('score_points')
    },
    cardsSprite:{
        avatar: document.getElementById('card-image'),
        name: document.getElementById('card-name'),
        type: document.getElementById('card-type'),
    },
    fieldCards:{
        player: document.getElementById('player-field-card'),
        computer: document.getElementById('computer-field-card'),
    },
    playerSides: {
        player: "player-cards",
        playerBox: document.querySelector('#player-cards'),
        computer: "computer-cards",
        computerBox: document.querySelector('#computer-cards')
    },
    actions:{
        button: document.getElementById('next-duel')
    }
};

const pathImages = './src/assets/icons/';

const cardData = [
    {
        id: 0,
        name: 'Blue eyes white dragon',
        type: 'Paper',
        img: `${pathImages}dragon.png`,
        winOf: [1],
        loseOF: [2]
    },
    {
        id: 1,
        name: 'Dark magician',
        type: 'Rock',
        img: `${pathImages}magician.png`,
        winOf: [2],
        loseOF: [0]
    },
    {
        id: 2,
        name: 'Exodia',
        type: 'Scissors',
        img: `${pathImages}exodia.png`,
        winOf: [0],
        loseOF: [1]
    } 
]

async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
}

async function createCardImage(idCard, fieldSide){
    const cardImage = document.createElement('img');
    cardImage.setAttribute('height', '100px');
    cardImage.setAttribute('src', './src/assets/icons/card-back.png');
    cardImage.setAttribute('data-id', idCard)
    cardImage.classList.add('card');


    if(fieldSide === state.playerSides.player){
        cardImage.addEventListener('mouseover', () => {
            drawSelectedCard(idCard);
            console.log(idCard)
        })
        
        cardImage.addEventListener('click', ()=>{
            setCardsField(cardImage.getAttribute('data-id'));
        })

        
    }

    return cardImage;

}

async function drawButton(mensagem){
    state.actions.button.innerText = mensagem;
    state.actions.button.style.display = "block";

}

async function checkDuelResults(playerCardId, computerCardId){
    let duelResults = "Empate";
    let playerCard = cardData[playerCardId]

    if(playerCard.winOf.includes(computerCardId)){
        duelResults = "Ganhou";
        await playAudio('win');
        state.score.playerScore++;
    }

    if(playerCard.loseOF.includes(computerCardId)){
        duelResults = "Perdeu";
        await playAudio('lose');
        state.score.computerScore++;
    }

    return duelResults;

}

async function removaAllCardsImage(){
    let cards = state.playerSides.computerBox;
    let imgElements = cards.querySelectorAll('img');
    imgElements.forEach((img) => img.remove());
    
    cards = state.playerSides.playerBox;
    imgElements = cards.querySelectorAll('img');
    imgElements.forEach((img) => img.remove());
    
}

async function updateScore(){
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
}

async function cleanLeftContainer() {
    state.cardsSprite.name.innerText = '';
    state.cardsSprite.type.innerText = '';
    state.cardsSprite.avatar.src = '';
}

async function setCardsField(cardId){
    await removaAllCardsImage();

    let computedCardId = await getRandomCardId();
    state.fieldCards.player.style.display = 'block';
    state.fieldCards.computer.style.display = 'block';

    await cleanLeftContainer();

    state.fieldCards.player.setAttribute('src', cardData[cardId].img);
    state.fieldCards.computer.setAttribute('src', cardData[computedCardId].img);


    let duelResults = await checkDuelResults(cardId, computedCardId);

    await updateScore();
    await drawButton(duelResults);
}

async function drawSelectedCard(index){
    console.log(cardData[index])
    state.cardsSprite.avatar.src = cardData[index].img;
    state.cardsSprite.name.innerText = cardData[index].name;
    state.cardsSprite.type.innerText = 'Atribute : ' + cardData[index].type;
}

async function drawCards(cardNumbers, fieldSide){
    for(let i = 0; i < cardNumbers; i++){
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard
            ,fieldSide
        );

        document.getElementById(fieldSide).appendChild(cardImage);
    }
}

async function playAudio(status){
    const audio = new Audio(`./src/assets/audios/${status}.wav`);
    audio.volume = 0.5;
    audio.play();
}

async function resetDuel(){
    state.cardsSprite.avatar.src = '';
    state.actions.button.style.display = 'none';

    state.fieldCards.player.style.display = 'none';
    state.fieldCards.computer.style.display = 'none';

    init();

}

function init(){
    drawCards(5, state.playerSides.player);
    drawCards(5, state.playerSides.computer)

    const bgm = document.getElementById('bgm');
    bgm.volume = 0.5;
    bgm.play();
}

init();