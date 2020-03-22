import RoomState from '../roomState';

describe('Room State test', () => {
  it('Can set state to lobby state', () => {
    const state = new RoomState();
    state.setLobbyState();
    expect(state.debugTransition()).toEqual('Lobby State');
  });

  it('Can set state to reveal state', () => {
    const state = new RoomState();
    state.setRevealState();
    expect(state.debugTransition()).toEqual('Reveal State');
  });

  it('Can set state to draw state', () => {
    const state = new RoomState();
    state.setDrawState();
    expect(state.debugTransition()).toEqual('Draw State');
  });

  it('Can set state to end state', () => {
    const state = new RoomState();
    state.setEndState();
    expect(state.debugTransition()).toEqual('End State');
  });

  it('Can set state to guess state', () => {
    const state = new RoomState();
    state.setGuessState();
    expect(state.debugTransition()).toEqual('Guess State');
  });

  it('successfully runs all test transitions', () => {
    const state = new RoomState();
    expect(state.debugTransition()).toEqual('Lobby State');
    expect(state.debugTransition()).toEqual('Reveal State');
    expect(state.debugTransition()).toEqual('Draw State');
    expect(state.debugTransition()).toEqual('End State');
    expect(state.debugTransition()).toEqual('Guess State');
    expect(state.debugTransition()).toEqual('Lobby State');
  });

  it('Can set curator Id', () => {
    const state = new RoomState();
    state.setCurator('something');

    expect(state.getNumPlayers()).toEqual(1);
    expect(state.getCurator()).toEqual('something');
  });

  it('Can add new Player', () => {
    const state = new RoomState();
    const data = {
      id: 'something',
      username: 'notsomething',
    };
    state.addPlayer(data);
    const result = state.getPlayer('something');

    expect(result).toEqual(data);
    expect(state.getNumPlayers()).toEqual(1);
  });
});
