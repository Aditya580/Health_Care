import React, {useState, useEffect} from "react";

import {createStage, checkCollision} from "../gameHelper";
// Components
import Stage from "./Stage";
import Display from "./Display";
import StartButton from "./StartButton";
import Instructions from "./Instructions";
import InstructionButton from "./InstructionButton";
// Custom Hooks
import {useInterval} from "../hooks/useInterval";
import {usePlayer} from "../hooks/usePlayer";
import {useStage} from "../hooks/useStage";
import {useGameStatus} from "../hooks/useGameStatus";

// Styled Components
import {StyledTetris, StyledTetrisWrapper} from "./styles/StyledTetris";

function Tetris() {
    useEffect(() => {
        document.title = "Tetris - MindEase";
        return () => {
            document.title = "MindEase"; // reset when leaving
        };
    }, []);

    const [showInstructions, setShowInstructions] = useState(false);

    useEffect(() => {
        if (!localStorage.getItem("instructionsShown")) {
            setShowInstructions(true);
            localStorage.setItem("instructionsShown", "true");
        }
    }, []);
    const [dropTime, setDropTime] = useState(null);
    const [gameOver, setGameOver] = useState(false);
    // Changes for the restart button
    const [started, setStarted] = useState(false);

    const [player, updatePlayerPos, resetPlayer, playerRotate] = usePlayer();
    const [stage, setStage, rowsCleared] = useStage(player, resetPlayer);
    const [score, setScore, rows, setRows, level, setLevel] = useGameStatus(rowsCleared);

    const movePlayer = (dir) => {
        if (!checkCollision(player, stage, {x: dir, y: 0})) {
            updatePlayerPos({x: dir, y: 0, collided: false});
        }
    };

    const startGame = () => {
        // reset everything
        setStage(createStage());
        setDropTime(1000);
        resetPlayer();
        setGameOver(false);
        setScore(0);
        setRows(0);
        setLevel(0);
        setStarted(true); // changes for restart button
    };

    const drop = () => {
        // Increase level when player has cleared 10 rows
        if (rows >= (level + 1) * 10) {
            setLevel((prev) => prev + 1);
            // Also increase speed
            setDropTime(1000 / (level + 1) + 200);
        }
        if (!checkCollision(player, stage, {x: 0, y: 1})) {
            updatePlayerPos({x: 0, y: 1, collided: false});
        } else {
            // Game Over !!
            if (player.pos.y < 1) {
                console.log("Game Over!");
                setGameOver(true);
                setDropTime(null);
            }
            updatePlayerPos({x: 0, y: 0, collided: true});
        }
    };

    const keyUp = ({keyCode}) => {
        if (!gameOver) {
            if (keyCode === 40) {
                setDropTime(1000 / (level + 1) + 200);
            }
        }
    };

    const dropPlayer = () => {
        setDropTime(null);
        drop();
    };

    const move = ({keyCode}) => {
        if (!gameOver) {
            switch (keyCode) {
                case 37:
                    movePlayer(-1);
                    break;
                case 38:
                    playerRotate(stage, 1);
                    break;
                case 39:
                    movePlayer(1);
                    break;
                case 40:
                    dropPlayer();
                    break;

                default:
                    break;
            }
        }
    };

    useInterval(() => {
        drop();
    }, dropTime);

    return (
        <StyledTetrisWrapper role="button" tabIndex="0" onKeyDown={(e) => move(e)} onKeyUp={keyUp}>
            {showInstructions && <Instructions onClose={() => setShowInstructions(false)} />}
            <StyledTetris>
                <Stage stage={stage} />
                <aside>
                    {gameOver ? (
                        <Display gameOver={gameOver} text="Game Over" />
                    ) : (
                        <div>
                            <Display text={`Score: ${score}`} />
                            <Display text={`Rows: ${rows}`} />
                            <Display text={`Level: ${level}`} />
                        </div>
                    )}
                    {/* <StartButton callback={startGame} /> */}
                    {/* Changes for restart button */}
                    <StartButton callback={startGame} label={started ? "Restart" : "Start Game"} />
                    <InstructionButton onClick={() => setShowInstructions(true)} />
                </aside>
            </StyledTetris>
        </StyledTetrisWrapper>
    );
}

export default Tetris;
