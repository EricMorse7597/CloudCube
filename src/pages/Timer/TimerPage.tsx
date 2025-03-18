import { useEffect, useState, useCallback } from "react";
import { randomScrambleForEvent } from "cubing/scramble";
import { supabase } from "src/utils/SupabaseClient";
import Timer from "src/components/Timer/Timer";
import {
    Card,
    Stack,
    useToast
} from "@chakra-ui/react";
import UserSolveTable from "src/components/User/UserSolveTable";

export default function TimerPage({ session }: { session: any }) {
    const [scramble, setScramble] = useState("");
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

    useEffect(() => {
        getNewScramble();
    }, [getNewScramble]);

    useEffect(() => {
        if (session) {
            fetchSolves();
        }
    }, [scramble, session]);

    const generateNewScramble = () => {
        getNewScramble();
    };

    return (
        <Stack justify="center" marginBottom="2rem" spacing={4} mt={4}>
            <Timer
                scramble={scramble}
                onTimerStop={generateNewScramble} 
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
