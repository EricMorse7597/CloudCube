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
import DropDown from "src/components/DropDown";

export default function TimerPage({ session }: { session: any }) {
    const [isRunning, setIsRunning] = useState(false);
    const [scramble, setScramble] = useState("");
    const [isHolding, setIsHolding] = useState(false);
    const [spaceDownTime, setSpaceDownTime] = useState(0);

    const [entries, setEntries] = useState<any[]>([]);
    const toast = useToast();

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

    return (
        <Stack justify="center" marginBottom="2rem" spacing={4} mt={4}>
            <Timer
                showDropDown={true}
                scramble={scramble}
            />

            <Card ml={"15%"} mr={"15%"} >
                {/* passing entries as solves */}
                {session && (
                    <UserSolveTable solves={entries} />
                )}
            </Card>
        </Stack>
    );
}