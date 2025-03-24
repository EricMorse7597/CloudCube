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
import { useParams } from "react-router-dom";

export default function TimerPage() {
    const [isRunning, setIsRunning] = useState(false);
    const [scramble, setScramble] = useState("");
    const [isHolding, setIsHolding] = useState(false);
    const [spaceDownTime, setSpaceDownTime] = useState(0);
    const [selectedValue, setSelectedValue] = useState("333");

    const [entries, setEntries] = useState<any[]>([]);
    const toast = useToast();

    const { session } = useAuth();

    const getNewScramble = useCallback(async (): Promise<void> => {
        const newScramble = await randomScrambleForEvent(selectedValue);
        setScramble(newScramble.toString());
    }, [selectedValue]);

    useEffect(() => {
        getNewScramble();
    }, [getNewScramble]);

    const gameID = useParams<{ id: string }>().id;

    return (
        <Stack justify="center" marginBottom="2rem" spacing={4} mt={4}>
            <Heading>Game: {gameID}</Heading>
            <Timer
                scramble={scramble}
                onValueChange={(value: string) => console.log(value)}
            />
        </Stack>
    );
}
