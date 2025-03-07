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
import { useEffect, useState } from "react";
import { supabase } from "src/utils/SupabaseClient";
import { Divider } from "src/styles/common";
import { useAuth } from "src/utils/AuthContext";
import { solve } from "src/lib/search";
import Timer from "src/components/Timer/Timer";

const Heading = styled.h1`
    font-size: 1.4rem;
    font-weight: bold;
    margin: 0;
`;

const awardImage = "assets/award.svg";

export default function LeaderboardPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [scramble, setScramble] = useState("");
    const [solveTimes, setSolveTimes] = useState<any[]>([])
    const { session } = useAuth();
    const { isOpen, onOpen, onClose } = useDisclosure()


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
        setIsLoading(false);
    }

    const fetchSolves = async () => {
        setIsLoading(true);
        console.log("scramble!" + scramble);

        if (!scramble.toString()) return;

        const { data, error } = await supabase
            .from("solve")
            .select("user_id, solve_time")
            .eq("scramble", scramble.toString())
            .order("solve_time", { ascending: true })


        if (data) {
            const formattedData = data.map((solve, index) => ({ rank: index + 1, name: solve.user_id, time: solve.solve_time }));
            setSolveTimes(formattedData);
        }

        setIsLoading(false);
    }

    useEffect(() => {
        fetchScramble();
        document.title = "Leaderboard";
    }, []);

    useEffect(() => {
        fetchSolves();
    }, [scramble]);

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
                    <Card
                        gap={6}
                        p={4}
                    >Scramble: {scramble}</Card>

                    <Button
                        display={{ base: "none", md: "inline-flex" }}
                        fontSize={"md"}
                        fontWeight={600}
                        margin="0 0.5em"
                        size={"md"}
                        colorScheme={"teal"}
                    >
                        Solve!
                    </Button>


                    <Button onClick={onOpen}>Open Modal</Button>


                    <Divider />

                    <LeaderboardCard rank={"Rank"} playerName="Player's Name" time={"Solve Time"} />
                    {solveTimes.length > 0 ?
                        solveTimes.map(solve => (
                            <LeaderboardCard key={solve.rank} rank={solve.rank} playerName={solve.name} time={solve.time} />
                        ))
                        :
                        <p>No one has solved this weeks scramble!</p>}
                </Stack>


                <Modal isOpen={isOpen} onClose={onClose} size={"6xl"}>
                    <ModalOverlay />
                    <ModalContent p={4}>

                        <Timer scramble={scramble} />

                        <ModalFooter>
                            <Button colorScheme='blue' mr={3} onClick={onClose}>
                                Close
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </div >)
    );
}