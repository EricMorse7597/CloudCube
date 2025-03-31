import { useEffect, useState, useCallback } from "react";
import { randomScrambleForEvent } from "cubing/scramble";
import { supabase } from "src/utils/SupabaseClient";
import Timer from "src/components/Timer/Timer";
import {
    Card,
    Stack,
    useToast,
    HStack,
    Image,
} from "@chakra-ui/react";
import { Divider } from "src/styles/common";
import styled from "styled-components";
import { useAuth } from "src/utils/AuthContext";
import { useParams } from "react-router-dom";

import GameResultCard from "src/components/Multiplayer/GameResultCard";

const multiplayerImage = "/assets/multiplayer_logo.svg";

const Heading = styled.h1`
    font-size: 1.4rem;
    font-weight: bold;
    margin: 0;
`;


const Scramble = styled.h1`
        grid-column-start: 2;
    `

const ScrambleWrapper = styled.div`
display:grid;
place-items:center;
gap:1rem;
grid-template-columns:1fr auto 1fr;
& > :first-child {
margin-right: auto;
}

`


// used to fetch the username of a given UID
const fetchUsername = async (userID: string) => {
    const { data } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", userID).single();
    return data?.username || "Unknown";
}

export default function TimerPage() {
    const [scramble, setScramble] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [solved, setSolved] = useState(false);
    const [solveTimes, setSolveTimes] = useState<any[]>([])

    const [seed, setSeed] = useState(1);

    const toast = useToast();
    const { session } = useAuth();

    const gameID = useParams<{ id: string }>().id;

    useEffect(() => {
        const solves_channel = supabase
            .channel('public:solve')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'solve',
                filter: `racing_session=eq.${gameID}`
            }, payload => {
                console.log("new update for game session")
                fetchSolves()
                hideTimer()
                checkComplete()
            })
            .subscribe()
        //
        // this ensures channels are unsubscribed from on page change
        window.addEventListener('beforeunload', async () => {
            await supabase.removeAllChannels()
        })
        console.log("session: " + session + " gameID: " + gameID);
        if (session && gameID) {
            fetchScramble();
            fetchSolves();
        }
    }, [session]);

    const checkComplete = async () => {
        if (!gameID) return;
        const { data, error } = await supabase
            .from('solve')
            .select('*')
            .eq('racing_session', gameID)
        console.log(data)
        if (data != null && data.length >= 2) {
            console.log("session complete");
            await completeSession();
        }
    }

    const completeSession = async () => {
        if (!gameID) return;
        const { data, error } = await supabase
            .from('racing_sessions')
            .update({status: 'completed'})
            .eq('id', parseInt(gameID))
            .select()
        console.log(data)
    }

    const fetchScramble = async () => {
        if (!gameID) return;
        setIsLoading(true);

        const { data, error } = await supabase
            .from("racing_sessions")
            .select("scramble")
            .eq("id", gameID)
            .single();

        if (data) {
            setScramble(data.scramble);
        } else {
            toast({
                title: 'Error!',
                description: 'Error fetching scramble for this session',
                duration: 5000,
                isClosable: true,
                status: "error",
                position: "bottom"
            });
            console.error(error);
        }

        setIsLoading(false);
    }

    const hideTimer = async () => {
        if (gameID) { // check if user has already solved this weeks scramble
            const { data, error } = await supabase
                .from("solve")
                .select("user_id, solve_time")
                .eq("racing_session", parseInt(gameID))
                .order("solve_time", { ascending: true })
            data?.find((solve) => {
                if (solve.user_id === session.user.id) {
                    setSolved(true);
                }
            })
        }
    }

    // Fetch the solves for the session
    const fetchSolves = async () => {
        if (!gameID) return;
        setIsLoading(true);

        const { data, error } = await supabase
            .from("solve")
            .select("user_id, solve_time")
            .eq("racing_session", parseInt(gameID))
            .order("solve_time", { ascending: true })

        if (data) {

            const formattedData = await Promise.all(data.map(async (solve, index) => ({
                rank: index + 1,
                name: await fetchUsername(solve.user_id),
                time: solve.solve_time
            })));

            setSolveTimes(formattedData);
        } else {
            toast({
                title: 'Error!',
                description: 'Error fetching solves for this session',
                duration: 5000,
                isClosable: true,
                status: "error",
                position: "bottom"
            });
            console.error(error);
        }

        setIsLoading(false);
    }

    return (
        isLoading ?
            (<p>Loading...</p>)
            :
            (<Stack justify="center" marginBottom="2rem" spacing={4} mt={4}>
                <Stack align={"center"} >
                    <HStack align={"center"} justify={"center"} spacing={4} ml={4} mr={4}>
                        <Image
                            src={multiplayerImage}
                            alt="gamepad"
                            width="3rem"
                            height="3rem"
                        />
                        <Heading>Multiplayer</Heading>
                        <Image
                            src={multiplayerImage}
                            alt="gamepad"
                            width="3rem"
                            height="3rem"
                        />
                    </HStack >

                    <Heading  >Game: {gameID}</Heading>
                </Stack>

                <Divider />

                {solved ?
                    (<Stack align={"center"} ><Card p="1.5rem" w="75%" justify={"center"}><ScrambleWrapper><Scramble>scramble: {scramble}</Scramble></ScrambleWrapper></Card></Stack>)
                    :
                    (<Timer
                        scramble={scramble}
                        onValueChange={(value: string) => console.log(value)}
                        lobbyID={gameID}
                    />)}

                <Stack align="center" marginBottom="2rem" spacing={4} mt={4}>
                    <GameResultCard playerName={"Playername"} time={"Solve Time"} />
                    {solveTimes.length > 0 ?
                        solveTimes.map(solve => (
                            <GameResultCard key={solve.name + "-time"} playerName={solve.name} time={solve.time} isUser={session && solve.name === session.user.user_metadata.username} />
                        ))
                        :
                        <p>No in the lobby has submitted a solve!</p>}
                </Stack>
            </Stack >
            )
    );
}
