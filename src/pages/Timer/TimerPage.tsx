import { useEffect, useState, useCallback } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { randomScrambleForEvent } from "cubing/scramble";
import { supabase } from "src/utils/SupabaseClient";
import { useAuth } from "src/utils/AuthContext";
import Timer from "src/components/Timer/Timer";
import {
    useColorModeValue,
    Card,
    Stack,
    HStack,
    Heading,
    useToast
} from "@chakra-ui/react";
import UserSolveTable from "src/components/User/UserSolveTable";

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

export default function TimerPage({ session }: { session: any }) {
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState<string | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [time, setTime] = useState(0);
    const [scramble, setScramble] = useState("");
    const [isHolding, setIsHolding] = useState(false);
    const [spaceDownTime, setSpaceDownTime] = useState(0);
    const [delayTime, setDelayTime] = useState(0);
    const [colorDelay, setColorDelay] = useState(false);

    const [entries, setEntries] = useState<any[]>([]);
    const { logout } = useAuth();
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

    const fetchSolves = async () => {
        try {
            const { data, error } = await supabase
                .from("solve")
                .select("scramble, solve_time, created_at")
                .eq("user_id", session.user.id)
                .order("created_at", { ascending: false });
            if (data) {
                const formattedData = data.map((entry) => ({
                    ...entry,
                    created_at: new Date(entry.created_at).toLocaleString(),
                }));
                setEntries(formattedData); // Update entries state
            }
            if (error) throw error;
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to fetch solve data.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    async function getProfile() {
        setLoading(true);
        const { user } = session;
        const { data, error } = await supabase.from('profiles').select('username, avatar_url').eq('id', user.id).single();
        if (error) {
            alert('Error fetching user profile data: ' + error.message);
            return;
        }
        if (data) {
            setUsername(data.username);
        }
        setLoading(false);
    }

    const getNewScramble = useCallback(async (): Promise<void> => {
        const newScramble = await randomScrambleForEvent("333");
        setScramble(newScramble.toString());
    }, []);

    // Update solves in the database
    async function updateSolves() {
        try {
            setLoading(true);
            if (scramble && time > 0) {
                const { error } = await supabase.from('solve').insert({
                    user_id: session.user?.id as string,
                    scramble: scramble,
                    solve_time: time,
                });
                if (error) throw error;
                showSuccess();

                // Fetch solves and update the entries state after adding the new solve
                await fetchSolves();
            } else {
                showFailure();
            }
        } catch (error) {
            showFailure();
        } finally {
            setLoading(false);
        }
    }

    // Start/Stop timer on spacebar press
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
            getNewScramble(); // generate a new scramble when user stops
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
            setDelayTime(Date.now() - spaceDownTime);
            setColorDelay(delayTime > 300);
        } else {
            setDelayTime(0);
        }
    }, [isHolding, delayTime]);

    // Fetch user profile and solves
    useEffect(() => {
        if (session) {
            getProfile();
            fetchSolves(); // Fetch solves on session change
        }
    }, [session]);

    const color = useColorModeValue("black", "white");

    return (
        <Stack justify="center" marginBottom="2rem" spacing={4} mt={4}>
            <Timer
                scramble={scramble}
            />
            {/* <Scramble onNewScramble={setScramble} />
            <HStack spacing={4}>
                <Heading size="md">Timer</Heading>
            </HStack>
            <Card p="1.5rem" w="75%">
                <Stack spacing={4} align="center">
                    <h1>Scramble: {scramble}</h1>
                </Stack>
            </Card>

            <Card p="6.5rem" w="40%" textAlign="center">
                <Heading style={{ color: isHolding ? (colorDelay ? 'green' : 'yellow') : color }} size="4xl">{time.toFixed(2)}s</Heading>
            </Card>
            <p>Press spacebar to start/stop the timer</p>
            <br /> */}
            <Card ml={"15%"} mr={"15%"} >
                {/* passing entries as solves */}
                <UserSolveTable solves={entries} />
            </Card>
        </Stack>
    );
}