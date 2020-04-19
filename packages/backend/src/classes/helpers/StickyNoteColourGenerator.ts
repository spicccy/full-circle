import { objectValues } from '@full-circle/shared/lib/helpers';
import { StickyNoteColour } from '@full-circle/shared/lib/roomState';
import { shuffle } from 'lodash-es';

class RoomCodeGenerator {
  private usedColours = new Set<StickyNoteColour>();

  getColour = (): StickyNoteColour => {
    const allColours = objectValues(StickyNoteColour);
    const remainingColors = allColours.filter(
      (colour) =>
        !this.usedColours.has(colour) && colour !== StickyNoteColour.GRAY
    );

    if (remainingColors.length === 0) {
      return StickyNoteColour.GRAY;
    }

    const chosenColour = shuffle(remainingColors)[0];
    this.usedColours.add(chosenColour);

    return chosenColour;
  };

  releaseColour = (colour: StickyNoteColour) => {
    this.usedColours.delete(colour);
  };
}

export default new RoomCodeGenerator();
