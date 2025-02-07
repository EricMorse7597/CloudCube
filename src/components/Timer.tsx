import { useCallback, useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { randomScrambleForEvent } from "cubing/scramble";
import { Alg } from "cubing/alg";
import { get, set } from "lodash";



function Scramble({ onNewScramble }: { onNewScramble: (scramble: string) => void }) {
    const getNewScramble = useCallback(async (): Promise<void> => {
        const scramble = await randomScrambleForEvent("333");
        onNewScramble(scramble.toString());
    }, [onNewScramble]);

    useEffect(() => {
        getNewScramble();
    }, [getNewScramble]);

    return null;
}



// This is a simple timer component that starts and stops when the spacebar is pressed
function Timer() {
    const [isRunning, setIsRunning] = useState(false);
    const [time, setTime] = useState(0);
    const [scramble, setScramble] = useState("");

    useHotkeys('space', () => {
        setIsRunning(prevState => {
            if (!prevState) {
                setTime(0); // Reset the timer when stopping
                getNewScramble();
            }
            return !prevState;
        });
    });

    const getNewScramble = useCallback(async (): Promise<void> => {
        const newScramble = await randomScrambleForEvent("333");
        setScramble(newScramble.toString());
    }, []);

    useEffect(() => {
        let timer: NodeJS.Timeout | undefined;
        if (isRunning) {
            timer = setInterval(() => {
                setTime(prevTime => prevTime + .01);
            }, 10);
        } else if (!isRunning && time !== 0) {
            clearInterval(timer);
        }
        return () => clearInterval(timer);
    }, [isRunning]);

    return (
        <div>
            <Scramble onNewScramble={setScramble}/>
            <h2>Scramble: {scramble}</h2>
            <h1>{time.toFixed(2)}s</h1>
            <p>Press spacebar to start/stop the timer</p>
        </div>
    );

}

export default Timer;
