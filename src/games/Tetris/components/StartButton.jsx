import {StyledStartButton} from "./styles/StyledStartButton";

function StartButton({callback, label}) {
    return <StyledStartButton onClick={callback}>{label}</StyledStartButton>;
}

export default StartButton;
