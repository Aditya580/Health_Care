import styled from "styled-components";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Box = styled.div`
  background: #0c0c1d;
  border: 2px solid #00f0ff;
  padding: 2rem;
  border-radius: 12px;
  width: 400px;
  text-align: center;
  color: #fff;

`;

const Title = styled.h2`
  margin-bottom: 1rem;
  color: #ff00ff;
  font-size: 2rem;
  font-family: "Pixel", monospace;
  letter-spacing: 2px;
`;

const Text = styled.p`
  margin: 0.5rem 0;
  font-size: 1rem;
  font-family: "Pixel", monospace;
  letter-spacing: 2px;
`;

const Button = styled.button`
  margin-top: 1.5rem;
  padding: 0.8rem 1.5rem;
  background: #ff00ff;
  border: none;
  border-radius: 8px;
  color: white;
  font-family: "Pixel", monospace;
  letter-spacing: 1px;
  cursor: pointer;


  &:hover {
    background: #ec06ecff;
  }
`;

function Instructions({ onClose }) {
  return (
    <Overlay>
      <Box>
        <Title>How to Play</Title>
        <Text>↑ Rotate Tetromino</Text>
        <Text>↓ Drop Faster</Text>
        <Text>← Move Left</Text>
        <Text>→ Move Right</Text>
        <Button onClick={onClose}>Got it!</Button>
      </Box>
    </Overlay>
  );
}

export default Instructions;
