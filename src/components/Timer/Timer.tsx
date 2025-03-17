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
    VStack,
    Flex
} from "@chakra-ui/react";

export default function Timer({ scramble }: { scramble: string }) {
    const [isRunning, setIsRunning] = useState(false);
    const [time, setTime] = useState(0);
    const [isHolding, setIsHolding] = useState(false);
    const [spaceDownTime, setSpaceDownTime] = useState(0);
    const [delayTime, setDelayTime] = useState(0);
    const [colorDelay, setColorDelay] = useState(false);
    const [pushedTime, setPushedTime] = useState(0);
    const [recentSolves, setRecentSolves] = useState<number[]>([]); 

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

    async function fetchRecentSolves() {
        if (!session?.user?.id) return;

        let { data, error } = await supabase
            .from('solve')
            .select('solve_time')
            .eq('user_id', session.user.id)
            .order('id', { ascending: false }) // Get most recent solves first
            .limit(12);

        if (!error && data) {
            const lastThreeSolves = data.map(solve => solve.solve_time);
            setRecentSolves(lastThreeSolves);
        }
    }

    const calculateAverage = (solves: number[], count: number) => {
        if (solves.length >= count) {
            const latestSolves = solves.slice(0, count);
            return (latestSolves.reduce((a, b) => a + b, 0) / latestSolves.length).toFixed(2);
        }
        return null; 
    };

    const averageOf3 = calculateAverage(recentSolves, 3);
    const averageOf5 = calculateAverage(recentSolves, 5);
    const averageOf12 = calculateAverage(recentSolves, 12);

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

                fetchRecentSolves(); 
            } else {
                showFailure();
            }
        } catch (error) {
            showFailure();
        }
    }

    useEffect(() => {
        fetchRecentSolves();
    }, [session]);

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
        // Fetch recent solves on component mount
        fetchRecentSolves(); 

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

            <Flex align="flex-start" gap={10}>
                
                <Card id="timer" p="6.5rem" w="100%" textAlign="center" data-time={pushedTime} flexShrink={0}>
                    <Heading style={{ fontVariantNumeric: "tabular-nums", color: isHolding ? (colorDelay ? 'green' : 'yellow') : color }} size="4xl">
                        {time.toFixed(2)}s
                    </Heading>
                </Card>

        
                <VStack align="right" justify="center" spacing={5} minWidth="200px">
                    {averageOf3 && (
                        <Card p="1rem" w="auto" textAlign="center">
                            <Heading size="md">Average of 3: {averageOf3}s</Heading>
                        </Card>
                    )}
                    {averageOf5 && (
                        <Card p="1rem" w="auto" textAlign="center">
                            <Heading size="md">Average of 5: {averageOf5}s</Heading>
                        </Card>
                    )}
                    {averageOf12 && (
                        <Card p="1rem" w="auto" textAlign="center">
                            <Heading size="md">Average of 12: {averageOf12}s</Heading>
                        </Card>
                    )}
                </VStack>
            </Flex>
            <p>Press spacebar to start/stop the timer</p>
            <br />
        </Stack>
    );
}