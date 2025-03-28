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

    const toast = useToast();
    const { session } = useAuth();

    console.log("session: " + session);

    const gameID = useParams<{ id: string }>().id;

    useEffect(() => {
        fetchScramble();
        fetchSolves();
    }, []);

    const fetchScramble = async () => {
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

    // Fetch the solves for the session
    const fetchSolves = async () => {

        if (!scramble.toString()) return;

        const { data, error } = await supabase
            .from("solve")
            .select("user_id, solve_time")
            .eq("racing_session", gameID)
            .order("solve_time", { ascending: true })

        if (data) {
            if (session) { // check if user has already solved this weeks scramble
                data.find((solve) => {
                    if (solve.user_id === session.user.id) {
                        setSolved(true);
                    }
                })
            }

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
                            <GameResultCard playerName={solve.name} time={solve.time} isUser={session && solve.name === session.user.user_metadata.username} />
                        ))
                        :
                        <p>No in the lobby has submitted a solve!</p>}
                </Stack>
            </Stack >
            )
    );
}
