import 'styled-components/macro';

import { Colour } from '@full-circle/shared/lib/canvas';
import { Box, Heading, Paragraph } from 'grommet';
import React, { FunctionComponent } from 'react';
import { Navbar } from 'src/components/Navbar';

import { LinkButton } from '../../components/Link/LinkButton';

const Instructions: FunctionComponent = () => {
  return (
    <Box background="dark-1" flex>
      <Navbar />
      <Box flex align="center">
        <Box flex width="large">
          <Heading level={2}>About</Heading>
          <Paragraph fill>
            Full Circle is a drawing and guessing game that'll put your artistic
            interpretation skills to the test. It's quick and easy to join a
            game with your friends whether you're hanging out in the same room
            or want to play online.
          </Paragraph>
          <Paragraph fill>
            Each game is super casual and only takes a few minutes so its easy
            to jump on and play a few rounds: though we expect you to stay
            around for 'just one more game'.
          </Paragraph>
          <Heading level={3}>Creating a Game</Heading>
          <Paragraph fill>
            To play a game of Full Circle you'll need at least 3 people with
            internet connected devices (the game works well on smartphones) as
            well as one extra screen to act as the 'curator screen'. We
            recommend the curator screen be a large display like a laptop or TV
            that everyone can see. If you're not all in the same room together,
            get in a voice-chat lobby and setup a livestream of the curator
            screen.
          </Paragraph>
          <Paragraph fill>
            If you just want to get started,{' '}
            <LinkButton
              css={{
                fontWeight: 'bold',
                '&:hover': {
                  color: Colour.ORANGE,
                },
              }}
              href="/create"
            >
              click here
            </LinkButton>{' '}
            to create your first lobby and invite your friends.
          </Paragraph>
          <Heading level={2}>Gameplay</Heading>
          <Heading level={3}>Drawing round</Heading>
          <Paragraph fill>
            Each game begins with each player receiving a prompt to draw. Be
            careful (or don't) since someone will be trying to guess what the
            heck your prompt was. Don't take too long though: each round has a
            short timer to keep the game flowing so you'll need to be creative
            in how you choose to draw.
          </Paragraph>

          <Heading level={3}>Guessing round</Heading>
          <Paragraph fill>
            Once the drawing round is over, you'll receive a picture that
            someone else drew in the round that just finished. Whatever you type
            here will be sent to another player in the next drawing round as
            their prompt.
          </Paragraph>
          <Paragraph fill>
            Drawing rounds and guessing rounds will continue in this manner. If
            you've ever played Chinese Whispers you can imagine that as the
            chain of drawings and guesses develops, you'll probably evolve some
            'creative' pictures and prompts that aren't quite what was
            originally suggested.
          </Paragraph>

          <Heading level={3}>Reveal phase</Heading>
          <Paragraph fill>
            When all the chains are complete, you'll get to see exactly how each
            chain of guesses and drawings unfolded. Each player can display the
            chain that they started on the shared curator screen. This is your
            chance to vote on particularly good (or boneheaded) drawings and see
            how exactly your 'obviously its a cat' drawing became a drawing of
            Batman.
          </Paragraph>

          <Heading level={2}>Scoring</Heading>
          <Paragraph fill>
            We think that Full Circle is fun enough to play without a scoring
            system. However for those competitive spirits there is a system
            that'll have you sweating to draw a 'spork' as accurately as
            possible.
          </Paragraph>
          <Paragraph fill>
            The scoring system rewards both good drawers and guessers. So if
            you're looking at a picture of an 'apple' and guess correctly, both
            you and the drawer will get one point.
          </Paragraph>
        </Box>
        <LinkButton
          css={{
            fontWeight: 'bold',
            '&:hover': { color: Colour.ORANGE },
          }}
          margin="large"
          href="/create"
        >
          Get Started
        </LinkButton>
      </Box>
    </Box>
  );
};

export { Instructions };
