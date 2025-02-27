import { useCallback, useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { randomScrambleForEvent } from "cubing/scramble";
import { Alg } from "cubing/alg";
import { get, set } from "lodash";
import { supabase } from "src/utils/SupabaseClient";
import { useAuth } from "src/utils/AuthContext";
import {
    Card,
    Stack,
    HStack,
    Heading
} from "@chakra-ui/react";

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
    const { logout } = useAuth();
    const [successMessage, setSuccessMessage] = useState("");

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

    useEffect(() => {
        if (session != null) getProfile()
    }, [session != null]);

    async function updateSolves() {
        try {
            setLoading(true)

            console.log('uuid: ' + session.user?.id as string)
            const { error } = await supabase.from('solve').insert({
                user_id: session.user?.id as string,
                scramble: scramble,
                solve_time: time,
            })
            if (error) throw error
            alert('Solve time added!')
        } catch (error) {
            alert('Error adding solve time' + error)
        } finally {
            setLoading(false)
        }
    }

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
            if (session != null)
            {
                updateSolves();
            }
            clearInterval(timer);
        }
        return () => clearInterval(timer);
    }, [isRunning]);

    return (
        <Stack align="center" justify="center" height="100h" spacing={4} mt={4}>
            <Scramble onNewScramble={setScramble}/>
            <HStack spacing={4}>
                <Heading size="md">Timer</Heading>
            </HStack>
            <Card p="1.5rem" w="75%">
                <Stack spacing={4} align="center">
                    <h1>Scramble: {scramble}</h1>
                </Stack>
            </Card>

            <Card p="6.5rem" w="40%" textAlign="center">
                <Heading size="4xl">{time.toFixed(2)}s</Heading>
            </Card>
            <p>Press spacebar to start/stop the timer</p>
        </Stack>
    );

}

// fd77bfd2-15e7-4028-8ca4-e8169c5cb3da

// fd77bfd2-15e7-4028-8ca4-e8169c5cb3da