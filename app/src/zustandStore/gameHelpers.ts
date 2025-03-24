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

    // If its the first ball, go to next shot of current frame
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

// Calculate and return the total score that will go into the frame provided.
export const calculateTotalScore = (game: tGame) => {
    let updated = { ...game };
    let frames = updated.frames
    let totalScore = 0;
    for (var i = 0; i < 10; i++){
      let frame = { ...updated.frames[i] };
      let firstThrowScore = frame.roll1;
      let secondThrowScore = frame.roll2;

      // The 9th frame will always depend solely on the tenth frame.
      if(i==8){
        // BONUS: Use the first two rolls of the tenth frame.
        if (frame.isStrike){
          totalScore += 10
          let bonus = frames[9].roll1;
          bonus += frames[9].roll2;
          totalScore += bonus;
        }
        // BONUS: Use the first roll of the tenth frame
        else if(frame.isSpare){
          totalScore += firstThrowScore + secondThrowScore
          totalScore += frames[9].roll1;
        }
        // Score is just total plus current frame. NO BONUS
        else totalScore += firstThrowScore + secondThrowScore
      }
      // Tenth frame will only depend on itself. NO BONUS
      else if (i==9){
        totalScore += frames[9].roll1;
        totalScore += frames[9].roll2;
        totalScore += frames[9].roll3;
      }
      // Case when current shot is a strike
      else if(frame.isStrike){
        totalScore +=10;
        // BONUS: If next shot is strike, take the first ball from two frames ahead
        if (frames[i+1].isStrike){
          totalScore += 10; 
          totalScore += frames[i+2].roll1;
        }
        // BONUS: Next frame is not a strike but current is
        else {
          let nextRoll1 = frames[i+1].roll1;
          let nextRoll2 = frames[i+1].roll2;
          totalScore += (nextRoll1 + nextRoll2);
        }
      }
      // BONUS: Current frame is a spare
      else if (frame.isSpare){
        let nextRoll1 = frames[i+1].roll1;
        totalScore += nextRoll1 + firstThrowScore + secondThrowScore;
      }
      // Current frame is an open, just use current frame scores only. No bonus
      else{
        totalScore += firstThrowScore + secondThrowScore;
      }
      // update the frame score.
      frame.score = totalScore;
      frames[i] = frame;
    }
    updated.frames = frames
    return updated
  }

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