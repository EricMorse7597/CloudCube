import { useEffect, useState, useCallback } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { randomScrambleForEvent } from "cubing/scramble";
import { supabase } from "src/utils/SupabaseClient";
import { useAuth } from "src/utils/AuthContext";
import {
    useColorModeValue,
    Card,
    Stack,
    HStack,
    Heading,
    useToast,
} from "@chakra-ui/react";

export default function Timer({ scramble }: { scramble: string }) {
    const [isRunning, setIsRunning] = useState(false);
    const [time, setTime] = useState(0);
    const [isHolding, setIsHolding] = useState(false);
    const [spaceDownTime, setSpaceDownTime] = useState(0);
    const [delayTime, setDelayTime] = useState(0);
    const [colorDelay, setColorDelay] = useState(false);
    const [pushedTime, setPushedTime] = useState(0);

    const { session } = useAuth();
    const toast = useToast();

    const showSuccess = () => {
        toast({
            title: 'Success!',
            description: 'Added solve time successfully.',
            duration: 5000,
            isClosable: true,
            status: "success",
            position: "bottom"
        });
    };

    const showFailure = () => {
        toast({
            title: 'Error',
            description: 'Failed to add solve time',
            duration: 5000,
            isClosable: true,
            status: "error",
            position: "bottom"
        });
    };

    async function updateSolves() {
        try {
            if (scramble && time > 0) {
                const { error } = await supabase.from('solve').insert({
                    user_id: session.user?.id as string,
                    scramble: scramble,
                    solve_time: time,
                });
                if (error) throw error;
                showSuccess();
                setPushedTime(time);

                
            } else {
                showFailure();
            }
        } catch (error) {
            showFailure();
        }
    }

    useHotkeys('space', (event) => { // KEYDOWN
        event.preventDefault();

        if (event.repeat) return;

        if (!isRunning) {
            // Only start if the timer is not already running
            setSpaceDownTime(Date.now());
            setIsHolding(true);
        } else {
            // If it's running, stop and update solves
            if (scramble && time > 0 && session != null) {
                updateSolves(); // Insert new solve after stopping timer
            }
            setIsRunning(false);
        }
    });

    useHotkeys('space', (event) => { // KEYUP
        event.preventDefault();

        if (event.repeat) return;

        if (isHolding) {
            setIsHolding(false);
            const holdDuration = Date.now() - spaceDownTime;
            if (holdDuration > 300) {
                setIsRunning(true);
            }
        }
    }, { keyup: true });

    // Timer logic
    useEffect(() => {
        if (isRunning) {
            const startTime = Date.now();
            const interval = setInterval(() => {
                setTime((Date.now() - startTime) / 1000);
            }, 10);

            return () => {
                clearInterval(interval);
            };
        }
    }, [isRunning]);

    // Update delay and color on hold
    useEffect(() => {
        if (isHolding) {
            const delayInterval = setInterval(() => {
                if (Date.now() - spaceDownTime > 300) {
                    setColorDelay(true);
                }
            }, 10);

            return () => {
                clearInterval(delayInterval);
            };
        } else {
            setColorDelay(false);
        }
    }, [isHolding]);

    const color = useColorModeValue("black", "white");

    return (
        <Stack align="center" >
            <HStack spacing={4}>
                <Heading size="md">Timer</Heading>
            </HStack>
            <Card p="1.5rem" w="75%">
                <Stack spacing={4} align="center">
                    <h1>Scramble: {scramble}</h1>
                </Stack>
            </Card>

            <Card id="timer" p="6.5rem" w="40%" textAlign="center" data-time={pushedTime}>
                <Heading style={{ fontVariantNumeric: "tabular-nums", color: isHolding ? (colorDelay ? 'green' : 'yellow') : color }} size="4xl">{time.toFixed(2)}s</Heading>
            </Card>
            <p>Press spacebar to start/stop the timer</p>
            <br />
        </Stack>
    );
}