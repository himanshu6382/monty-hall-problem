//initiate variables
var gameState, doorRemaining, doorSelected, hostSelected, doorSelectedMessage, doorRemainingMessage;
const consoleBody = document.getElementById('console');

//on game-start modal close, start game
$('#game-start-modal').on('hidden.bs.modal', function () {
    const gameBodyClassArray = document.querySelector(".hide");
    gameBodyClassArray.classList.remove("hide");
    const instructions = document.querySelector(".start-body");
    instructions.classList.add("hide");
    //initiate variables
    gameState = 1; //1=start of game, 2 = 2nd stage
    winningDoor = Math.floor(Math.random() * 3) + 1;
    doorRemaining = 0;
    console.log("winning door is: ", winningDoor);
    doorSelected = 0; //0=door not selected, 1, 2, 3 = respective door selected
    hostSelected = 0; //0=door not selected, 1, 2, 3 = respective door selected by host
    const consoleBody = document.getElementById('console');
    doorSelectedMessage = '';
    doorRemainingMessage = '';
    //initiate game UI
    consoleBody.innerHTML = `
    <h3 class="text-center">Console</h3>
    <p>Pick a Door</p>`;
    document.querySelector(`input.door-1`).value = `Door 1 - Pick me`;
    document.querySelector(`input.door-2`).value = `Door 2 - Pick me`;
    document.querySelector(`input.door-3`).value = `Door 3 - Pick me`;
});

//event listener for click in door area
document.getElementById('door-div').addEventListener("click", function (e) {
    var clickedElement = e.target.classList;
    //determine which door was clicked
    for (var i = 1; i <= 3; i++) {
        if (clickedElement.contains(`door-${i}`)) {
            doorSelected = i;
        }
    }
    // proceed with game only if door was clicked
    if (doorSelected != 0) {
        if (gameState === 1) {
            //code for the first stage of the game
            gameState = 2; //advance game state to the next stage
            //code to assign the door to host
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
            doorRemaining = thirdDoorSelector(doorSelected, hostSelected);
            initiateStage2();
        } else if (gameState === 2) {
            doorRemaining = thirdDoorSelector(doorSelected, hostSelected);
            if (doorSelected === winningDoor) {
                //winning modal
                console.log("you won");
                gameResult("win");               
            } else if (doorSelected !== winningDoor && doorSelected !== hostSelected) {
                //losing modal
                console.log("you lost");
                gameResult("loss");
            }
        }
    }
});

function initiateStage2(eventData) {
    $('#stage2-modal').modal('show');
    const modalBody = document.querySelector('.stage2-message');
    modalBody.innerHTML = `
    <p>You Selected Door ${doorSelected}</p>
    </p>The host shows you that Door ${hostSelected} has a lemon behind </p>
    <p>You have to choose...</p>
    <p>Stay with the door you chose?</p>
    <p>Or switch to Door ${doorRemaining}?</p>
    <p>Choose wisely...</p>`
    document.querySelector(`input.door-${doorSelected}`).value = `Door ${doorSelected} - Stay with me!`;
    document.querySelector(`input.door-${doorRemaining}`).value = `Door ${doorRemaining} - Switch to me!`;
    document.querySelector(`input.door-${hostSelected}`).value = `Door ${hostSelected} - Lemon Here`;
    consoleBody.innerHTML = `
    <h3 class="text-center">Console</h3>
    <p>You Selected Door ${doorSelected}</p>
    </p>The host shows you that Door ${hostSelected} has a lemon behind </p>
    <p>You have to choose...</p>
    <p>Stay with the door you chose? Or switch to Door ${doorRemaining}?</p>
    <p>Choose wisely...</p>`;
    doorSelected = 0;
}

function gameResult(result) {
    console.log(`door selected finally is: ${doorSelected}`);
    console.log(`door remaining finally is: ${doorRemaining}`);
    if (result === 'win') {
        message = 'Congrats! You Win!!!'
        doorSelectedMessage = 'Time to Party!!!';
        doorRemainingMessage = 'I will miss you.';
    } else {
        message = 'Aww, You Lose';
        doorSelectedMessage = 'I go well with tequila';
        doorRemainingMessage = 'Not your lucky day';
    }
    consoleBody.innerHTML = `
    <h1>${message}</h1>
    <input type="submit" id="restart" value="Replay the Game" class="btn-block btn btn-primary"
            data-bs-toggle="modal" data-bs-target="#game-start-modal">`;
    document.querySelector(`input.door-${doorSelected}`).value = doorSelectedMessage;
    document.querySelector(`input.door-${doorRemaining}`).value = doorRemainingMessage;
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