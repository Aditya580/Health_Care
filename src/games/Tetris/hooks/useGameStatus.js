import {useState, useEffect, useCallback} from "react";

export const useGameStatus = (rowsCleared) => {
    const [score, setScore] = useState(0);
    const [rows, setRows] = useState(0);
    const [level, setLevel] = useState(0);

    const linePoints = [40, 100, 300, 1200];

    const calcScore = useCallback(() => {
        if (rowsCleared > 0) {
            const pointsIndex = Math.min(rowsCleared, linePoints.length) - 1;
            setScore((prev) => prev + linePoints[pointsIndex] * (level + 1));
            setRows((prev) => prev + rowsCleared);
        }
    }, [level, linePoints, rowsCleared]);

    useEffect(() => {
        calcScore();
    }, [calcScore, rowsCleared, score]);

    return [score, setScore, rows, setRows, level, setLevel];
};
