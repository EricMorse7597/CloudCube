import { useEffect, useState, useCallback } from "react";
import { randomScrambleForEvent } from "cubing/scramble";
import { supabase } from "src/utils/SupabaseClient";
import Timer from "src/components/Timer/Timer";
import {
    Card,
    Stack,
    useToast,
    Heading,
    HStack
} from "@chakra-ui/react";
import UserSolveTable from "src/components/User/UserSolveTable";
import { useAuth } from "src/utils/AuthContext";
import styled from "styled-components";

export default function TimerPage() {
    const [scramble, setScramble] = useState("");
    const [selectedValue, setSelectedValue] = useState("333");

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
                .eq("event", selectedValue)
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
            .eq("event", selectedValue)
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

    const calculateEventAverages = (event: string) => {
        if (event === "333") {
            return {
                averageOf3: calculateAverage(recentSolves, 3),
                averageOf5: calculateAverage(recentSolves, 5),
                averageOf12: calculateAverage(recentSolves, 12),
            };
        } else if (event === "222") {
            // Separate logic for "222" if needed, e.g., different calculation rules
            return {
                averageOf3: calculateAverage(recentSolves, 3),
                averageOf5: calculateAverage(recentSolves, 5),
                averageOf12: calculateAverage(recentSolves, 12),
            };
        }
        return { averageOf3: null, averageOf5: null, averageOf12: null };
    };

    const { averageOf3, averageOf5, averageOf12 } = calculateEventAverages(selectedValue);

    const getNewScramble = useCallback(async (): Promise<void> => {
        const newScramble = await randomScrambleForEvent(selectedValue);
        setScramble(newScramble.toString());
    }, [selectedValue]);

    useEffect(() => {
        getNewScramble();
    }, [getNewScramble]);

    useEffect(() => {
        if (session) {
            setTimeout(fetchSolves, 50);// Database was not updating in time
        }
    }, [scramble, session]);

    const generateNewScramble = () => {
        getNewScramble();
    };

    useEffect(() => {
        fetchRecentSolves();
    }, [session]);

    const AveragesWrapper = styled.div`
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        margin-top: 1rem;
        gap: 1rem;

        & > * {
            flex-grow: 1;
        }
    `;

    const averages = [
        {name: "Average of 3",
        value: averageOf3},
        {name: "Average of 5",
        value: averageOf5},
        {name: "Average of 12",
        value: averageOf12}
    ];

    return (
        <Stack justify="center" p="0 1rem" marginBottom="2rem" spacing={4} mt={4} maxWidth="1000px" width="100%" mx="auto">
            <Timer
                showDropDown={true}
                scramble={scramble}
                onTimerStop={generateNewScramble} 
                onValueChange={setSelectedValue}
            />
            {session && (
            <Heading as="h2" size="lg" textAlign="center">
                {selectedValue === "333" ? "3x3x3 Solves" : selectedValue === "222" ? "2x2x2 Solves" : ""}
            </Heading>
            )}

            {session && (
            <AveragesWrapper>
                {averages.map(({name, value}) => {

                    return (
                        <Card key={name} p="1rem" w="auto" textAlign="center">
                            <Heading size="md" fontWeight={200}>{name}: <b>{value? `${value}s` : '—'}</b></Heading>
                        </Card>
                    );
                })}
            </AveragesWrapper>
            )}

            <Card>
                {/* passing entries as solves */}
                {session && (
                    <UserSolveTable solves={entries} />
                )}
            </Card>
        </Stack>
    );
}
