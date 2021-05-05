# Monty Hall Problem

Monty Hall Problem is a probability puzzle. Read about it [here](https://en.wikipedia.org/wiki/Monty_Hall_problem). The puzzle is as follows:

> Suppose you're on a game show, and you're given the choice of three doors: Behind one door is a car; behind the others, goats. 
> You pick a door, say No. 1. 
> The host, who knows what's behind the doors, opens another door, say No. 3, which has a goat. 
> He then says to you, "Do you want to pick door No. 2? Or do you want to go with door No. 1?" 
> What do you do?

## Program
The js app simulates the above game:
1. There are three doors to pick from. One has a treasure, the others have lemons (don't ask why I went with these options. Initially, instead of treasure I had gas/petrol can)
2. You choose any door you want.
3. The host, who knows which is the winning door, will show you one of the remaining doors that has lemons.
4. Now you have to choose whether you will stay with your initial choice, or switch to the remaining door - which is unopened.

When Marilyn vos Savant, a high IQ autor/lecturer, suggested the player must always switch, it created a fair bit of controversy.

Now you can see if this is indeed the correct choice.

There is also a simulator included so you can see probabilistic values of both choices.

Have fun!

I made this to practice Javascript. If you have any suggestions about the code, would love to hear them.

## Algorithim

### User game
1. Winning door randomly selected
2. app.js waits for a click event. Checks the class of the clicked element to determine which door was clicked
3. Assigns one of the remaining doors to the host. Has to ensure that the assigned door has a lemon.
4. app.js waits for another click. Now also has to ignore clicks on host assigned door.
5. Checks if the door clicked is the winning door. Updates score.

### Simulated game
1. Takes user input for number of simulations to run
2. Takes user input on whether the 2nd stage choice should be to "always switch" or "always stay with" the door selected.
3. Winning door selected at random.
4. First choice door selected at random.
5. Assigns one of the remaining doors to the host. Has to ensure that the assigned door has a lemon.
6. Based on step 2, assigns final user door.
7. Checks if the door clicked is winning door. Updates counter for score.
8. Repeats the game for the number of simulations to be run. Updates the final score on the UI 

## WHAT I LEARNT:
1. DOM element selection - especially ignoring and picking clicks and using them as user inputs. A little more complex than taking input values from form fields 
2. DOM manipulation. Changing colors and values of buttons through classes, images, innterHTML content.
3. Appreciating the effort requried for clean up - like reseting colors at the start of a game, score content, modal behaviour, etc.
4. I also used practiced git while coding this. Was good to understand branching, commiting, merging etc.
5. Also realized how messy even this small code became so quickly in terms of html elements, styling elements, variables being passed around etc.