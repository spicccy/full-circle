import RoomState from './../roomState';

describe('transition test', () => {
  it('successfully runs all test transitions', () => {
    const state = new RoomState();
    expect(state.debugTransition()).toEqual('Lobby State');
    expect(state.debugTransition()).toEqual('Reveal State');
    expect(state.debugTransition()).toEqual('Draw State');
    expect(state.debugTransition()).toEqual('End State');
    expect(state.debugTransition()).toEqual('Guess State');
    expect(state.debugTransition()).toEqual('Lobby State');
  });
});
