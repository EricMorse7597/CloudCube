import { useEffect, useState, useCallback } from "react";
import { randomScrambleForEvent } from "cubing/scramble";
import { supabase } from "src/utils/SupabaseClient";
import Timer from "src/components/Timer/Timer";
import {
    Card,
    Stack,
    useToast,
    Heading,
    HStack,
    Image,
} from "@chakra-ui/react";
import UserSolveTable from "src/components/User/UserSolveTable";
import { useAuth } from "src/utils/AuthContext";
import { useParams } from "react-router-dom";

import GameResultCard from "src/components/Multiplayer/GameResultCard";

const multiplayerImage = "assets/multiplayer_logo.svg";

export default function TimerPage() {
    const [scramble, setScramble] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [solved, setSolved] = useState(false);

    const toast = useToast();
    const { session } = useAuth();

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
            .from("racing_sessions")
            .select("solve_times")
            .eq("id", gameID)
            .single();

        if (data) {
            console.log(data);
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
                <HStack align={"center"} justify={"center"} spacing={4} m={4}>
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

                <Heading >Game: {gameID}</Heading>
                <Timer
                    scramble={scramble}
                    onValueChange={(value: string) => console.log(value)}
                />
                <Stack align="center" marginBottom="2rem" spacing={4} mt={4}>
                    <GameResultCard playerName={"Playername"} time={"Solve Time"} />
                </Stack>
            </Stack >
            )
    );
}
