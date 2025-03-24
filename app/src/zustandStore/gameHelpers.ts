// helpers/gameHelpers.ts
import { SPLITS } from '../config/constants';
import { tGame } from '../values/types';

/**
 * Go to the next shot. 
 * 
 * @param game The current game to be updated
 * @returns the new updated game
 */
export const goToNextShot = (game: tGame): tGame => {
  let updated = { ...game };

    // If its the first ball, go to last shot of current frame
    if(updated.selectedShot == 1){
        // unless current is a strike.
        if(updated.frames[updated.currentFrame].isStrike){
            updated.currentFrame += 1;
            updated.selectedShot = 1;
        }
        // go to second shot 
        else{
            updated.selectedShot = 2;
        }
    }
    else if(updated.selectedShot == 2){
        // if it's the tenth frame, go to third shot
        if(updated.currentFrame == 9){
            // TODO: restrict based on score.
            updated.selectedShot = 3;
        }
        else{
            updated.currentFrame = updated.currentFrame+1 > 9 ? updated.currentFrame: updated.currentFrame+1;
            updated.selectedShot = 1;
        }
    }
    // else go to first shot of next frame
    else{
        updated.currentFrame = updated.currentFrame+1 > 9 ? updated.currentFrame:updated.currentFrame+1;
        updated.selectedShot = 1;
    }

  return updated;
};

/**
 * 
 * @param game The current game to be updated
 * @returns the new updated game
 */
export const goToPrevShot = (game: tGame): tGame => {
  let updated = { ...game };

  // If its the first ball, go to last shot of last frame
  if(updated.selectedShot==1){
    // If last frame is a strike, show the first ball
    if (updated.frames[updated.currentFrame-1].isStrike){
        updated.currentFrame -= 1;
        updated.selectedShot = 1;
    }
    else{
        updated.currentFrame -= 1;
        updated.selectedShot = 2;
    }
  }
  // else go to first shot of current frame
  else{
      if (updated.selectedShot==3){
            updated.selectedShot = 2;
      }else{
            updated.selectedShot = 1;
      }
  }

  return updated;
};

export const changeToFrame = (game: tGame, num: number): tGame => {
  return {
    ...game,
    currentFrame: game.currentFrame + num,
    selectedShot: 1,
  };
};


export const setFirstShot = (game: tGame,pins: boolean[]): tGame => {
    let count = pins.filter(x => x==true).length
    let updated = { ...game };
  
    let currFrame = updated.frames[updated.currentFrame];

    currFrame.firstBallPins = pins;
    currFrame.roll1 = count;
    currFrame.isStrike = count == 10;
    currFrame.complete = currFrame.isStrike && updated.currentFrame!=9;
    currFrame.visible = !currFrame.isStrike;
    currFrame.isSplit = checkIsSplit(pins);
    currFrame.score = -1;
  
    return updated;
  };

  export const setSecondShot = (game: tGame,pins: boolean[]): tGame => {
    const firstBallPins = game.frames[game.currentFrame].firstBallPins
    const firstBallCount = firstBallPins.filter(x => x==true).length
    let count = (pins.filter(x => x==true).length-firstBallCount)
    count = count < 0 ? 0 : count
    let updated = { ...game };
  
    let currFrame = updated.frames[updated.currentFrame];

    currFrame.secondBallPins = pins;
    currFrame.roll2 = count;
    currFrame.isSpare = currFrame.roll1+count == 10;
    currFrame.complete = updated.currentFrame!=9;
    currFrame.visible = !currFrame.isSpare;
    currFrame.score = -1;
  
    return updated;
  };

  export const setTenthSecondShot = (game: tGame,pins: boolean[]): tGame => {
    let count = pins.filter(x => x==true).length
    let updated = { ...game };
  
    let currFrame = updated.frames[updated.currentFrame];

    currFrame.secondBallPins = pins;
    currFrame.roll2 = count;
    currFrame.visible = (count != 10);
    currFrame.score = -1;
  
    return updated;
  };

  export const setThirdShot = (game: tGame,pins: boolean[]): tGame => {
    let updated = { ...game };
  
    let currFrame = updated.frames[updated.currentFrame];

    const secondBallPins = currFrame.secondBallPins
    const secondBallCount = secondBallPins.filter(x => x==true).length
    
    let count = 0;
    // Treat it like a first ball.
    if(currFrame.isSpare || currFrame.roll2 == 10){
        count = pins.filter(x => x==true).length
    }
    else{
        count = (pins.filter(x => x==true).length-secondBallCount)
    }

    currFrame.thirdBallPins = pins;
    currFrame.roll3 = count;
    currFrame.visible = true;
    currFrame.score = -1;
    currFrame.complete = true;
  
    return updated;
  };



/**
 * 
 * @param pins the knocked down pins
 * @returns true if a split is detected.
 */
const checkIsSplit = (pins: boolean[]) =>{
    if (pins[0] === false) return false; // If the headpin (#1) is still standing, it's not a split

    // Convert standing pins into a sorted index string
    const standingPinIndices = pins
        .map((pin, index) => (!pin ? index : null))
        .filter(index => index !== null)
        .join("");

    return SPLITS.has(standingPinIndices);
};

const defaultValue = {

}
export default defaultValue;