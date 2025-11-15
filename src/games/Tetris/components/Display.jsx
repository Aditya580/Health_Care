import React from 'react'
import { StyledDisplay } from './styles/styledDisplay'
function Display({gameOver, text}) {
  return (
    <StyledDisplay gameOver={gameOver}>{text}</StyledDisplay>
  )
}

export default Display