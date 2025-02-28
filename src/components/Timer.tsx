import { useCallback, useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { randomScrambleForEvent } from "cubing/scramble";
import { Alg } from "cubing/alg";
import { get, set } from "lodash";
import {
    Card,
    Stack,
    HStack,
    Heading
} from "@chakra-ui/react";
import { space } from "@chakra-ui/system";
import { color } from "framer-motion";



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
    const [isHolding, setIsHolding] = useState(false);
    const [spaceDownTime, setSpaceDownTime] = useState(0);
    const [delayTime, setDelayTime] = useState(0);
    const [colorDelay, setColorDelay] = useState(false);

    useHotkeys('space', (event) => {
        if (event.type === 'keydown' && !isRunning && !spaceDownTime) {
            setIsHolding(true);
            setSpaceDownTime(Date.now());
        }
    });

    useHotkeys('space', (event) => {
        const holdDuration = Date.now() - spaceDownTime;
        setSpaceDownTime(0);
        if (event.type === 'keyup') {
            setIsHolding(false);
            if (holdDuration > 300) {
                setIsRunning((prevState) => {
                    if (!prevState) {
                        setTime(0); // Reset the timer when starting
                        getNewScramble();
                    }
                    return !prevState;
                });
            }
        }
    }, { keyup: true });

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

        if (isHolding) {
            setDelayTime(Date.now() - spaceDownTime);
        }

        setColorDelay(delayTime > 300);

        return () => clearInterval(timer);

    }, [isRunning, isHolding, delayTime]);

    return (
        <Stack align="center" justify="center" height="100h" spacing={4} mt={4}>
            <Scramble onNewScramble={setScramble} />
            <HStack spacing={4}>
                <Heading size="md">Timer</Heading>
            </HStack>
            <Card p="1.5rem" w="75%">
                <Stack spacing={4} align="center">
                    <h1>Scramble: {scramble}</h1>
                </Stack>
            </Card>

            <Card p="6.5rem" w="40%" textAlign="center">
                <Heading style={{ color: isHolding ? (colorDelay ? 'green' : 'yellow') : 'white' }} size="4xl">{time.toFixed(2)}s</Heading>
            </Card>
            <p>Press spacebar to start/stop the timer</p>
        </Stack>
    );

}

export default Timer;
