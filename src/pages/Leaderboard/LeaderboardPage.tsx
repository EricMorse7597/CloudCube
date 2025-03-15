import {
    Stack,
    HStack,
    Image,
    Card,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure
} from "@chakra-ui/react";
import styled from "styled-components";
import LeaderboardCard from "src/components/Leaderboard/LeaderboardCard";
import Timer from "src/components/Timer/Timer";
import { useEffect, useState } from "react";
import { supabase } from "src/utils/SupabaseClient";
import { Divider } from "src/styles/common";
import { useAuth } from "src/utils/AuthContext";
import { solve } from "src/lib/search";
import { format } from "path";
import { useHotkeys } from "react-hotkeys-hook";

const Heading = styled.h1`
    font-size: 1.4rem;
    font-weight: bold;
    margin: 0;
`;

const awardImage = "assets/award.svg";

export function blurScramble() {
    document.getElementById("scramble")?.blur();
}

// used to fetch the username of a given UID
const fetchUsername = async (userID: string) => {
    const { data } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", userID).single();
    return data?.username || "Unknown";
}

export default function LeaderboardPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [scramble, setScramble] = useState("");
    const [solveTimes, setSolveTimes] = useState<any[]>([])
    const [userSolved, setUserSolved] = useState(false);
    const [solved, setSolved] = useState(false);
    const [userSolveTime, setUserSolvetime] = useState<number>(0);

    const { isOpen, onOpen, onClose } = useDisclosure()
    const { session } = useAuth();

    const fetchScramble = async () => {
        setIsLoading(true);

        const { data, error } = await supabase
            .from("leaderboards")
            .select("scramble")
            .order("created_at", { ascending: false })
            .limit(1).single();

        if (!error) {
            setScramble(data.scramble);
        } else {
            console.error(error);
        }
    }


    // Fetch the solves for the scramble
    const fetchSolves = async () => {

        if (!scramble.toString()) return;

        const { data, error } = await supabase
            .from("solve")
            .select("user_id, solve_time")
            .eq("scramble", scramble.toString())
            .order("solve_time", { ascending: true })


        if (data) {

            if (session) { // check if user has already solved this weeks scramble
                data.find((solve) => {
                    if (solve.user_id === session.user.id) {
                        setUserSolved(true);
                        blurScramble();
                    }
                })
            }

            const formattedData = await Promise.all(data.map(async (solve, index) => ({
                rank: index + 1,
                name: await fetchUsername(solve.user_id),
                time: solve.solve_time
            })));


            setSolveTimes(formattedData);
        }

        setIsLoading(false);
    }
    // Fetch the solves for the scramble
    const fetchUserSolve = async () => {

        if (!scramble.toString()) return;

        const { data, error } = await supabase
            .from("solve")
            .select("solve_time")
            .eq("scramble", scramble.toString())
            .eq("user_id", session.user.id)
            .order("solve_time")


        if (data) {
            setUserSolvetime(parseFloat(data[0].solve_time));
        }
    }


    useHotkeys('space', (event) => {
        event.preventDefault();
        if (event.repeat) return;
        const time = parseFloat(document.getElementById("timer")?.getAttribute("data-time") || "0");

        if (time > 0) {
            setSolved(true);
            onClose();
        }
    }, { keyup: true });

    useEffect(() => {
        fetchScramble();
        document.title = "Cloud Cube | Leaderboard";
    }, []);

    useEffect(() => {
        if (session) fetchUserSolve();
        fetchSolves();
    }, [scramble, userSolved, solved]);

    return (
        isLoading ?
            (<p>Loading...</p>)
            :
            (<div>

                <HStack align={"center"} justify={"center"} spacing={4} m={4}>
                    <Image
                        src={awardImage}
                        alt="award"
                        width="3rem"
                        height="3rem"
                    />
                    <Heading>Leaderboard</Heading>
                    <Image
                        src={awardImage}
                        alt="award"
                        width="3rem"
                        height="3rem"
                    />
                </HStack>

                <Stack align={"center"} m={4}>
                    {session && (
                        <Stack align={"center"}>
                            <Card
                                gap={6}
                                p={4}
                                filter={!userSolved ? "blur(5px)" : "none"}
                            >
                                <p key="scramble"
                                >Scramble: {scramble}</p>

                            </Card>

                            {userSolved ? <p>You have already solved this weeks scramble!</p>
                                :
                                <Button
                                    display={{ base: "none", md: "inline-flex" }}
                                    fontSize={"md"}
                                    fontWeight={600}
                                    margin="0 0.5em"
                                    size={"md"}
                                    colorScheme={"teal"}
                                    onClick={onOpen}
                                >
                                    Solve!
                                </Button>
                            }
                        </Stack>)}

                    <Divider />

                    {session && userSolveTime > 0 && (
                        <LeaderboardCard rank={(solveTimes.findIndex((solve) => { return solve.name === session.user.user_metadata.username }) + 1).toString()} playerName={session.user.user_metadata.username} time={userSolveTime.toString()} isUser={true} />
                    )}

                    <Divider />

                    <LeaderboardCard rank={"Rank"} playerName="Player's Name" time={"Solve Time"} />
                    {solveTimes.length > 0 ?
                        solveTimes.map(solve => (
                            <LeaderboardCard key={solve.rank} rank={solve.rank} playerName={solve.name} time={solve.time} isUser={session && solve.name === session.user.user_metadata.username} />
                        ))
                        :
                        <p>No one has solved this weeks scramble!</p>}
                </Stack>


                <Modal isOpen={isOpen} onClose={() => { }} size={"6xl"} >
                    <ModalOverlay />
                    <ModalContent p={4}>

                        <Timer scramble={scramble} />

                    </ModalContent>
                </Modal>
            </div >)
    );
}