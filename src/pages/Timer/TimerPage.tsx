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
    useToast,
    VStack
} from "@chakra-ui/react";
import UserSolveTable from "src/components/User/UserSolveTable";

export default function TimerPage() {
    const [isRunning, setIsRunning] = useState(false);
    const [scramble, setScramble] = useState("");
    const [isHolding, setIsHolding] = useState(false);
    const [spaceDownTime, setSpaceDownTime] = useState(0);

    const [entries, setEntries] = useState<any[]>([]);
    const toast = useToast();

    const { session } = useAuth();

    const [recentSolves, setRecentSolves] = useState<number[]>([]);

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
                fetchRecentSolves();
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


    async function fetchRecentSolves() {
        if (!session?.user?.id) return;

        let { data, error } = await supabase
            .from('solve')
            .select('solve_time')
            .eq('user_id', session.user.id)
            .order('id', { ascending: false }) 
            .limit(12);

        if (!error && data) {
            const previousSolves = data.map(solve => solve.solve_time);
            setRecentSolves(previousSolves);
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

    const getNewScramble = useCallback(async (): Promise<void> => {
        const newScramble = await randomScrambleForEvent("333");
        setScramble(newScramble.toString());
    }, []);

    useHotkeys('space', (event) => { // KEYDOWN
        event.preventDefault();

        if (event.repeat) return;

        if (!isRunning) {
            // Only start if the timer is not already running
            setSpaceDownTime(Date.now());
            setIsHolding(true);
        } else {
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

    useEffect(() => {
        getNewScramble();
    }, []);

    useEffect(() => {
        if (session) {
            fetchSolves();
        }
    }, [scramble, session]);

    useEffect(() => {
        fetchRecentSolves();
    }, [session]);

    return (
        <Stack justify="center" marginBottom="2rem" spacing={4} mt={4}>
            
            <Timer scramble={scramble} />

            <HStack align="center" justify="center" spacing={5}>
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
            </HStack>
            
            <Card ml={"15%"} mr={"15%"} >
                {/* passing entries as solves */}
                {session && (
                    <UserSolveTable solves={entries} />
                )}
            </Card>
        </Stack>
    );
}