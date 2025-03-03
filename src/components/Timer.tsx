import { useCallback, useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { randomScrambleForEvent } from "cubing/scramble";
import { supabase } from "src/utils/SupabaseClient";
import { useAuth } from "src/utils/AuthContext";
import {
    Card,
    Stack,
    HStack,
    Heading,
    useToast
} from "@chakra-ui/react";
import UserSolveTable from "./User/UserSolveTable";

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
export default function Timer({ session }: { session: any }) {
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState<string | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [time, setTime] = useState(0);
    const [scramble, setScramble] = useState("");
    const [isHolding, setIsHolding] = useState(false);
    const [spaceDownTime, setSpaceDownTime] = useState(0);
    const [delayTime, setDelayTime] = useState(0);
    const [colorDelay, setColorDelay] = useState(false);

    const { logout } = useAuth();
    const toast = useToast()

    const showSuccess = () => {
        toast({
            title: 'Success!',
            description: 'Added solve time successfully.',
            duration: 5000,
            isClosable: true,
            status: "success",
            position: "bottom"
        })
    }

    const showFailure = () => {
        toast({
            title: 'Error',
            description: 'Failed to add solve time',
            duration: 5000,
            isClosable: true,
            status: "error",
            position: "bottom"
        })
    }

    async function getProfile() {
        setLoading(true)
        const { user } = session
        const { data, error } = await supabase.from('profiles').select('username, avatar_url').eq('id', user.id).single();
        // add error checking
        if (error) {
            alert('Error fetching user profile data: ' + error.message);
            return;
        }
        if (data) {
            setUsername(data.username);
        }
        setLoading(false)
    }

    const getNewScramble = useCallback(async (): Promise<void> => {
        const newScramble = await randomScrambleForEvent("333");
        setScramble(newScramble.toString());
    }, []);

    async function updateSolves() {
        try {
            console.log("Attempting to insert solve with data:", { user_id: session.user?.id, scramble, solve_time: time });
            setLoading(true)
            const { error } = await supabase.from('solve').insert({
                user_id: session.user?.id as string,
                scramble: scramble,
                solve_time: time,
            })
            if (error) throw error
            //alert('Solve time added!')
            showSuccess()
        } catch (error) {
            // alert('Error adding solve time' + error)
            showFailure()
        } finally {
            setLoading(false)
        }
    }

    useHotkeys('space', (event) => { // KEYDOWN
        event.preventDefault();

        if (event.repeat) return;

        if (isRunning) {
            console.log("STOP");
            setIsRunning(false);

            if (session != null) {
                updateSolves();
            }
        } else {
            setSpaceDownTime(Date.now());
            setIsHolding(true);
        }

    });

    useHotkeys('space', (event) => { // KEYUP
        event.preventDefault();

        if (event.repeat) return;

        if (isHolding) {
            setIsHolding(false);
            if (delayTime > 300) {
                console.log("START");
                setIsRunning(true);
            }
        }
    }, { keyup: true });

    useEffect(() => {
        console.log(isRunning);

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


    useEffect(() => {
        if (isHolding) {
            setDelayTime(Date.now() - spaceDownTime);
            setColorDelay(delayTime > 300);
        } else {
            setDelayTime(0);
        }
    }, [isHolding, delayTime]);

    useEffect(() => {
        if (session) getProfile()
    }, [session]);


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
            <br></br>
            <Card>
                <UserSolveTable />
            </Card>
        </Stack>
    );
}