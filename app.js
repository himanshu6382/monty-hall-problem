//global variables
var totalGames = 0;
var gamesWon = 0;
var gameDoors; //this will hold the winning door and host selected door.
var gameStage = 1; //=1, when start of game, where game selects door; =2, when host shows a loosing door and asks gamer for final choice; =3, when game ends 

//simulator
document.getElementById('simulator-form').addEventListener('submit', function(e) {
    gameStage = 1;
    gamesWon = 0;
    totalGames = 0;
    let gamesToPlay = e.target.gameCount.value;
    let alwaysStay = e.target.stage2Choice[0].checked;
    for (gameIter=1; gameIter<=gamesToPlay; gameIter++) {
        gameStage = 1; //initiage game stage for every iteration
        let inputDoor = Math.floor(Math.random()*3)+1; //simulator picks first door at random
        gameStage1(inputDoor);
        if (alwaysStay) {
            gameResult = determineResult(inputDoor); //gamer plays with the original choice
            //console.log(`game no. ${gameIter}, Door Selected: ${inputDoor}, Winning Door: ${gameDoors.winningDoor}`);
            //console.log(`Game Result: ${gameResult}`); //uncomment these two lines to check individual simulationr results
        } else {
            let switchedDoor = thirdDoorSelector(inputDoor, gameDoors.hostDoor); //gamer switches to the door he has not chosen, and is still unopened
            gameResult = determineResult(switchedDoor);  
            //console.log(`game no. ${gameIter}, Door Selected: ${switchedDoor}, Winning Door: ${gameDoors.winningDoor}`);
            //console.log(`Game Result: ${gameResult}`); 
        }
        
    }
    resetUi(); //reset door buttons and images, in case simulation is run in between a game initiated by the user
    gameResultConsoleUi('simulation'); //send message to console that a simulation was run
    ScoreboardUi(); //print the simulation score
    totalGames = 0;
    gamesWon = 0;
    $('#simulation-inputs-modal').modal('hide');
    e.preventDefault();
});

//game elements if user wants to play
//register door selection
document.getElementById('door-div').addEventListener('click', function (e) {
    let clickedElement = e.target.classList;
    for (var i = 1; i <= 3; i++) { //loop to determine if, and which door was clicked.
        if (clickedElement.contains(`door-${i}`)) {
            let doorSelected = i;
            if (gameStage === 1) {
                gameStage1(doorSelected); //function to determine the winning door and assign a door to a host
                initiateStage2UI(doorSelected); // update console with stage 2 instructions
                //console.log(gameDoors); //uncomment this if you want to see the winning dor in the console
            } else if (gameStage === 2) {
                if (!clickedElement.contains('host-selected')) { //if statement required to ignore clicks on door selected by host
                    gameResult = determineResult(doorSelected, gameDoors);
                    ScoreboardUi(); //order important. this function makes all the door selector buttons grey, gameResultDoorDivUI indicates win/loss color
                    gameResultDoorDivUi(gameResult, doorSelected);
                    gameResultConsoleUi(gameResult);
                    
                }
            }
        }
    }
});

//register restart
document.getElementById('console').addEventListener('click', function (e) {
    if (e.target.id === 'restart') {
        gameStage = 1;
        ScoreboardUi(); //order important. this function makes the door selector buttons grey, resetUI makes it blue again
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
    return message;
}

//UI Functions
function initiateStage2UI(doorSelected) {
    let doorRemaining = thirdDoorSelector(doorSelected, gameDoors.hostDoor);
    $('#stage2-modal').modal('show');
    const modalBody = document.querySelector('.stage2-message');
    //modal to give stage 2 instructions
    modalBody.innerHTML = `
    <p>You Selected Door ${doorSelected}</p>
    <p>The host knows what is behind each door</p>
    </p>The host shows you that Door ${gameDoors.hostDoor} has a lemon behind </p>
    <p>You have to choose...</p>
    <p>Stay with the door you chose?</p>
    <p>Or switch to Door ${doorRemaining}?</p>
    <p>Choose wisely...</p>`
    //update door selector buttons with messages, classes and image
    document.querySelector(`input.door-${doorSelected}`).value = `Door ${doorSelected} - Stay with me!`;
    document.querySelector(`input.door-${doorRemaining}`).value = `Door ${doorRemaining} - Switch to me!`;
    document.querySelector(`input.door-${gameDoors.hostDoor}`).value = `Door ${gameDoors.hostDoor} - Lemon Here`;
    document.querySelector(`input.door-${gameDoors.hostDoor}`).classList.add("btn-secondary", "host-selected"); //host-selected class gets used to ignore clicks on this element in 2nd stage
    document.querySelector(`input.door-${gameDoors.hostDoor}`).classList.remove("btn-primary");
    document.getElementById('console').innerHTML = `
    <h3 class="text-center">Console</h3>
    <p>You Selected Door ${doorSelected}</p>
    <p>The host, who knows what's behind each door, shows you that Door ${gameDoors.hostDoor} has a lemon behind </p>
    <p>You have to choose...</p>
    <p>Stay with the door you chose? Or switch to Door ${doorRemaining}?</p>
    <p>Choose wisely...</p>`;
    //code to insert lemon image in host selected door
    let hostSelectedDoorElement = document.querySelector(`img.door-${gameDoors.hostDoor}`);
    hostSelectedDoorElement.src = `images/lemon-1.jpg`;
    hostSelectedDoorElement.classList.add('lemon-treasure', 'host-selected');//host-selected class gets used to ignore clicks on this element in 2nd stage. lemon-treasure gets used for styling
}

function gameResultConsoleUi(result) {
    if (result === 'win') {
        message = 'Congrats! You win!!!'
    } else if (result === 'loss') {
        message = 'Aww. You Lose.'
    } else if (result === 'simulation') {
        message = 'You ran a simulation'
    }
    //console includes correct message and a restart button
    document.getElementById('console').innerHTML = `
    <h1>${message}</h1>
    <input type="submit" id="restart" value="Restart" class="btn-block btn btn-primary" id="restart"
            data-bs-toggle="modal" data-bs-target="#game-start-modal">`;
}

//update right messages, image and classes to door selector buttons
function gameResultDoorDivUi(result, doorSelected) {
    let doorRemaining = thirdDoorSelector(doorSelected, gameDoors.hostDoor);
    if (result === 'win') {
        doorSelectedMessage = 'Time to Party!!!';
        doorSelectedClass = 'btn-success';
        doorRemainingMessage = 'I will miss you.';
        doorRemainingClass = 'btn-primary';
        doorSelectedImage = `images/petrol-1.jpg`;
        doorRemainingImage = `images/wooden-door-1.jpg`;
    } else {
        doorSelectedMessage = 'I go well with tequila';
        doorSelectedClass = 'btn-danger';
        doorRemainingMessage = 'Not your lucky day';
        doorRemainingClass = 'btn-primary';
        doorSelectedImage = `images/lemon-1.jpg`;
        doorRemainingImage = `images/wooden-door-1.jpg`;
    }
    
    document.querySelector(`input.door-${doorSelected}`).value = doorSelectedMessage;
    document.querySelector(`input.door-${doorSelected}`).classList.remove('btn-primary', 'btn-secondary');
    document.querySelector(`input.door-${doorSelected}`).classList.add(doorSelectedClass);
    document.querySelector(`input.door-${doorRemaining}`).value = doorRemainingMessage;
    document.querySelector(`input.door-${doorRemaining}`).classList.remove('btn-primary');
    document.querySelector(`input.door-${doorRemaining}`).classList.add(doorRemainingClass);
    let selectedDoorElement = document.querySelector(`img.door-${doorSelected}`);
    let remainingDoorElement = document.querySelector(`img.door-${doorRemaining}`);
    selectedDoorElement.src = doorSelectedImage;
    selectedDoorElement.classList.add('lemon-treasure');
    remainingDoorElement.src = doorRemainingImage;
}

function ScoreboardUi() {
    totalGames === 0 ? winRatio = 0 : winRatio = gamesWon/totalGames; //ternary required to ignore NAN when total games is 0 at the start
    let doorButtons = document.querySelectorAll(`input.door-btn`);
    doorButtons.forEach(elem => {
        elem.classList.remove('btn-success', 'btn-danger', 'btn-primary', 'host-selected');
        elem.classList.add('btn-secondary');
    });

    document.getElementById('score-body').innerHTML = `
    <h3 class="text-center">Score</h3>
    <h5>Total Games Played: ${totalGames}</h5>
    <h5>Games Won: ${gamesWon}</h5>
    <h5>Win Ratio: ${(winRatio*100).toFixed(2)}%</h5>
    <hr>
    <input type="submit" id="simulation" value="Run Simulation" class="btn-block btn btn-primary"
            data-bs-toggle="modal" data-bs-target="#simulation-inputs-modal">`;
}

//reset UI upon restart
function resetUi() {
    document.getElementById('console').innerHTML = `
            <h3 class="text-center">Console</h3>
            <p>There are 3 doors</p>
            <p>There is a treasure behind one of them, and lemons behind other two</p>
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

