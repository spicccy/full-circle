import 'styled-components/macro';

import { Colour } from '@full-circle/shared/lib/canvas';
import React from 'react';
import styled, { css, keyframes } from 'styled-components';

const fadeIn = keyframes`
  0% {
    transform: translateX(-100%);
    opacity: 0.2;
  }
  50% {
    opacity: 1.0;
  }
  100% {
    transform: translateX(100%);
    opacity: 0.2;
  }
`;

const Animator = styled('svg')<{ duration: string; delay: string }>`
  ${(props) => css`
    animation-name: ${fadeIn};
    animation-duration: ${props.duration};
    animation-timing-function: ease-in-out;
    animation-delay: ${props.delay};
    color: ${Colour.BLUE};
  `}
`;

const Icon: React.FC<{ duration: string }> = ({ duration }) => {
  return (
    <Animator
      css={{ opacity: 0 }}
      duration={duration}
      delay="0s"
      xmlns="http://www.w3.org/2000/svg"
      x="0"
      y="0"
      enableBackground="new 0 0 410 410"
      version="1.1"
      viewBox="0 0 410 410"
      xmlSpace="preserve"
    >
      <g>
        <path
          fill="#FFDA44"
          d="M75 232.5c13.326 0 25.294 5.797 33.534 15.002H170V117.5H70l-30 70H0v30h30v30H0v.002h41.466C49.706 238.297 61.674 232.5 75 232.5zm14.782-85H155v40H72.639l17.143-40z"
        ></path>
        <path fill="#FF9811" d="M170 247.5H200V247.502H170z"></path>
        <path
          fill="#FF9811"
          d="M320 187.5l-50-70H170v100h30v30h30v-30h30v30h-30v.002h71.466c8.24-9.205 20.208-15.002 33.534-15.002s25.294 5.797 33.534 15.002H410v-.002h-20l-10-30h30v-10l-90-20zm-135 0v-40h69.561l28.571 40H185z"
        ></path>
        <path
          fill="#ACABB1"
          d="M0 247.502V277.5h30c0-11.527 4.339-22.037 11.466-29.998H0z"
        ></path>
        <path
          fill="#ACABB1"
          d="M170 247.502h-61.466C115.661 255.463 120 265.973 120 277.5h80v-29.998h-30z"
        ></path>
        <path
          fill="#ACABB1"
          d="M230 247.502V277.5h60c0-11.527 4.339-22.037 11.466-29.998H230z"
        ></path>
        <path
          fill="#ACABB1"
          d="M380 277.5h30v-29.998h-41.466C375.661 255.463 380 265.973 380 277.5z"
        ></path>
        <path
          fill="#616064"
          d="M52.5 277.5c0-12.427 10.073-22.5 22.5-22.5v-22.5c-13.326 0-25.294 5.797-33.534 15.002C34.339 255.463 30 265.973 30 277.5c0 24.853 20.147 45 45 45V300c-12.427 0-22.5-10.073-22.5-22.5z"
        ></path>
        <path
          fill="#565659"
          d="M75 232.5V255c12.427 0 22.5 10.073 22.5 22.5S87.427 300 75 300v22.5c24.852 0 45-20.147 45-45 0-11.527-4.339-22.037-11.466-29.998C100.294 238.297 88.326 232.5 75 232.5z"
        ></path>
        <path
          fill="#CDCDD0"
          d="M52.5 277.5c0 12.427 10.073 22.5 22.5 22.5v-45c-12.427 0-22.5 10.073-22.5 22.5z"
        ></path>
        <path
          fill="#ACABB1"
          d="M75 300c12.427 0 22.5-10.073 22.5-22.5S87.427 255 75 255v45z"
        ></path>
        <path
          fill="#616064"
          d="M312.5 277.5c0-12.427 10.073-22.5 22.5-22.5v-22.5c-13.326 0-25.294 5.797-33.534 15.002C294.339 255.463 290 265.973 290 277.5c0 24.853 20.147 45 45 45V300c-12.427 0-22.5-10.073-22.5-22.5z"
        ></path>
        <path
          fill="#565659"
          d="M335 232.5V255c12.427 0 22.5 10.073 22.5 22.5S347.427 300 335 300v22.5c24.852 0 45-20.147 45-45 0-11.527-4.339-22.037-11.466-29.998-8.24-9.205-20.208-15.002-33.534-15.002z"
        ></path>
        <path
          fill="#CDCDD0"
          d="M312.5 277.5c0 12.427 10.073 22.5 22.5 22.5v-45c-12.427 0-22.5 10.073-22.5 22.5z"
        ></path>
        <path
          fill="#ACABB1"
          d="M335 300c12.427 0 22.5-10.073 22.5-22.5S347.427 255 335 255v45z"
        ></path>
        <path
          fill="#FFF"
          d="M155 147.5L89.782 147.5 72.639 187.5 155 187.5z"
        ></path>
        <path
          fill="#FFF"
          d="M185 147.5L185 187.5 283.133 187.5 254.561 147.5z"
        ></path>
        <path fill="#FF5023" d="M0 217.5H30V247.5H0z"></path>
        <path
          fill="#FF5023"
          d="M390 247.5L410 247.5 410 217.5 380 217.5z"
        ></path>
        <path
          fill="#565659"
          d="M210 117.5L210 87.5 130 87.5 130 117.5 170 117.5z"
        ></path>
        <path fill="#565659" d="M170 217.5H200V247.5H170z"></path>
        <path
          fill="#565659"
          d="M230 247.5L200 247.5 200 247.502 200 277.5 230 277.5 230 247.502z"
        ></path>
        <path fill="#565659" d="M230 217.5H260V247.5H230z"></path>
      </g>
    </Animator>
  );
};

export default Icon;
