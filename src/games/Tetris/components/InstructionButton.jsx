import styled from "styled-components";

const Button = styled.button`
  background: #700070;
  width: content-fit;
  padding: 10px;
  border: none;
  border-radius: 8px;
  color: white;
  font-family: "Pixel", monospace;
  cursor: pointer;

  &:hover {
    background: #ec06ecff;
  }
`;
function InstructionButton({onClick}) {
    return <>
    <Button onClick={onClick}>
        I
    </Button>
    </>;
}

export default InstructionButton;
