import { Stack, HStack, Image } from "@chakra-ui/react";
import styled from "styled-components";
import LeaderboardCard from "src/components/Leaderboard/LeaderboardCard";
import { useEffect, useState } from "react";
import { supabase } from "src/utils/SupabaseClient";
import { Divider } from "src/styles/common";
import { useAuth } from "src/utils/AuthContext";

const Heading = styled.h1`
    font-size: 1.4rem;
    font-weight: bold;
    margin: 0;
`;

export default function LeaderboardPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [scramble, setScramble] = useState("");
    const awardImage = "assets/award.svg";
    const { session } = useAuth();

    useEffect(() => {
        const fetchScramle = async () => {
            setIsLoading(true);

            const { data, error } = await supabase
                .from("leaderboards")
                .select();

            console.log(data);
            console.log(error);

            // if (!error) {
            //     setScramble(data.scramble);
            // } else {
            //     console.error(error);
            // }

            setIsLoading(false);
        }

        fetchScramle();
        document.title = "Leaderboard";
    }, []);

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
                    <LeaderboardCard rank={"Rank"} playerName="Player's Name" time={"Solve Time"} />
                    <Divider />
                    <LeaderboardCard rank={"1"} playerName="aidkvndfj" time={"23.2"} />
                    <LeaderboardCard rank={"1"} playerName="aidkvndfj" time={"23.2"} />
                    <LeaderboardCard rank={"1"} playerName="aidkvndfj" time={"23.2"} />
                    <LeaderboardCard rank={"1"} playerName="aidkvndfj" time={"23.2"} />
                    <LeaderboardCard rank={"1"} playerName="aidkvndfj" time={"23.2"} />
                    <LeaderboardCard rank={"1"} playerName="aidkvndfj" time={"23.2"} />
                    <LeaderboardCard rank={"1"} playerName="aidkvndfj" time={"23.2"} />
                    <LeaderboardCard rank={"1"} playerName="aidkvndfj" time={"23.2"} />
                    <LeaderboardCard rank={"1"} playerName="aidkvndfj" time={"23.2"} />
                    <LeaderboardCard rank={"1"} playerName="aidkvndfj" time={"23.2"} />
                    <LeaderboardCard rank={"1"} playerName="aidkvndfj" time={"23.2"} />
                </Stack>

            </div >)
    );
}