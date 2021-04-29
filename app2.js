//global variables
var totalGames = 0;
var gameStage = 1;
var gamesWon = 0;
var gameDoors;

//game start modal
$('#game-start-modal').on('hidden.bs.modal', function () {
    const gameBodyClassArray = document.querySelector(".hide");
    gameBodyClassArray.classList.remove("hide");
    const instructions = document.querySelector(".start-body");
    instructions.classList.add("hide");
});

//register door selection
document.getElementById('door-div').addEventListener('click', function (e) {
    let clickedElement = e.target.classList;
    for (var i = 1; i <= 3; i++) {
        if (clickedElement.contains(`door-${i}`)) {
            let doorSelected = i;
            if (gameStage === 1) {
                gameStage1(doorSelected); //function to determine the winning door and assign a door to a host
                initiateStage2UI(doorSelected); // update console with stage 2 instructions
                console.log(gameDoors);
            } else if (gameStage === 2) {
                console.log(clickedElement);
                if (!clickedElement.contains('host-selected')) {
                    gameResult = determineResult(doorSelected, gameDoors);
                    gameResultUi(gameResult, doorSelected);
                }
            }
        }
    }
});

//register restart
document.getElementById('console').addEventListener('click', function (e) {
    if (e.target.id === 'restart') {
        gameStage = 1;
        resetUi();
    };

})

//game functions
function gameStage1(doorInput) {
    gameStage = 2;
    let winningDoor = Math.floor(Math.random() * 3) + 1;
    let hostDoor = assignHostDoor(doorInput, winningDoor);
    gameDoors = {
        winningDoor: winningDoor,
        hostDoor: hostDoor
    };
}

function assignHostDoor(doorSelected, winningDoor) {
    if (doorSelected === winningDoor) {
        const hostRandomSelector = Math.floor(Math.random() * 2);
        switch (doorSelected) {
            case 1:
                hostSelected = 2 * hostRandomSelector;
                if (hostSelected === 0) hostSelected = 3;
                break;
            case 2:
                hostSelected = 3 * hostRandomSelector;
                if (hostSelected === 0) hostSelected = 1;
                break;
            case 3:
                hostSelected = 1 * hostRandomSelector;
                if (hostSelected === 0) hostSelected = 2;
        }
    } else {
        hostSelected = thirdDoorSelector(doorSelected, winningDoor);
    }
    return hostSelected;
}

function thirdDoorSelector(door1, door2) {
    let door3 = 0;
    switch (door1 + door2) {
        case 3:
            door3 = 3;
            break;
        case 4:
            door3 = 2;
            break;
        case 5:
            door3 = 1;
    }
    return door3;
}

function determineResult(doorSelected) {
    doorSelected === gameDoors.winningDoor ? message = 'win' : message = 'loss';
    gameStage = 3;
    totalGames += 1;
    if (message === 'win') gamesWon += 1;
    winRatio = gamesWon / totalGames;
    return message;
}

//UI Functions
function initiateStage2UI(doorSelected) {
    let doorRemaining = thirdDoorSelector(doorSelected, gameDoors.hostDoor);
    $('#stage2-modal').modal('show');
    const modalBody = document.querySelector('.stage2-message');
    modalBody.innerHTML = `
    <p>You Selected Door ${doorSelected}</p>
    </p>The host shows you that Door ${gameDoors.hostDoor} has a lemon behind </p>
    <p>You have to choose...</p>
    <p>Stay with the door you chose?</p>
    <p>Or switch to Door ${doorRemaining}?</p>
    <p>Choose wisely...</p>`
    document.querySelector(`input.door-${doorSelected}`).value = `Door ${doorSelected} - Stay with me!`;
    document.querySelector(`input.door-${doorRemaining}`).value = `Door ${doorRemaining} - Switch to me!`;
    document.querySelector(`input.door-${gameDoors.hostDoor}`).value = `Door ${gameDoors.hostDoor} - Lemon Here`;
    document.querySelector(`input.door-${gameDoors.hostDoor}`).classList.add("btn-secondary", "host-selected");
    document.querySelector(`input.door-${gameDoors.hostDoor}`).classList.remove("btn-primary");
    document.getElementById('console').innerHTML = `
    <h3 class="text-center">Console</h3>
    <p>You Selected Door ${doorSelected}</p>
    </p>The host shows you that Door ${gameDoors.hostDoor} has a lemon behind </p>
    <p>You have to choose...</p>
    <p>Stay with the door you chose? Or switch to Door ${doorRemaining}?</p>
    <p>Choose wisely...</p>`;
    //code to insert lemon image in host selected door
    let hostSelectedDoorElement = document.querySelector(`img.door-${gameDoors.hostDoor}`);
    hostSelectedDoorElement.src = `images/lemon-1.jpg`;
    hostSelectedDoorElement.classList.add('lemon-treasure', 'host-selected');
}

function gameResultUi(result, doorSelected) {
    let doorRemaining = thirdDoorSelector(doorSelected, gameDoors.hostDoor);
    if (result === 'win') {
        message = 'Congrats! You Win!!!'
        doorSelectedMessage = 'Time to Party!!!';
        doorSelectedClass = 'btn-success';
        doorRemainingMessage = 'I will miss you.';
        doorRemainingClass = 'btn-primary';
        doorSelectedImage = `images/petrol-1.jpg`;
        doorRemainingImage = `images/wooden-door-1.jpg`;
    } else {
        message = 'Aww, You Lose';
        doorSelectedMessage = 'I go well with tequila';
        doorSelectedClass = 'btn-danger';
        doorRemainingMessage = 'Not your lucky day';
        doorRemainingClass = 'btn-primary';
        doorSelectedImage = `images/lemon-1.jpg`;
        doorRemainingImage = `images/wooden-door-1.jpg`;
    }
    document.getElementById('console').innerHTML = `
    <h1>${message}</h1>
    <input type="submit" id="restart" value="Replay the Game" class="btn-block btn btn-primary" id="restart"
            data-bs-toggle="modal" data-bs-target="#game-start-modal">`;
    document.querySelector(`input.door-${doorSelected}`).value = doorSelectedMessage;
    document.querySelector(`input.door-${doorSelected}`).classList.remove('btn-primary');
    document.querySelector(`input.door-${doorSelected}`).classList.add(doorSelectedClass);
    document.querySelector(`input.door-${doorRemaining}`).value = doorRemainingMessage;
    document.querySelector(`input.door-${doorRemaining}`).classList.remove('btn-primary');
    document.querySelector(`input.door-${doorRemaining}`).classList.add(doorRemainingClass);
    let selectedDoorElement = document.querySelector(`img.door-${doorSelected}`);
    let remainingDoorElement = document.querySelector(`img.door-${doorRemaining}`);
    selectedDoorElement.src = doorSelectedImage;
    selectedDoorElement.classList.add('lemon-treasure');
    remainingDoorElement.src = doorRemainingImage;
    //Scoreboard UI
    document.getElementById('score-body').innerHTML = `
    <h3 class="text-center">Score</h3>
    <h5>Total Games Played: ${totalGames}</h5>
    <h5>Games Won: ${gamesWon}</h5>
    <h5>Win Ratio: ${winRatio.toFixed(2)}</h5>`;
}

//reset UI upon restart
function resetUi() {
    document.getElementById('console').innerHTML = `
            <h3 class="text-center">Console</h3>
            <p>Pick a Door</p>`;
    let doorButtons = document.querySelectorAll(`input.door-btn`);
    let i = 0;
    doorButtons.forEach(elem => {
        i += 1;
        elem.value = `Door ${i} - Pick me`;
        elem.classList.remove('btn-success', 'btn-danger', 'btn-primary', 'btn-secondary', 'host-selected');
        elem.classList.add('btn-primary');
    });
    let doorsImages = document.querySelectorAll(`img.door-image`);
    doorsImages.forEach(elem => {
        elem.src = 'images/wooden-door-1.jpg';
        elem.classList.remove('lemon-treasure');
    });
}
