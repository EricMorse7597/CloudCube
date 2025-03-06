import { Stack, HStack, Image } from "@chakra-ui/react";
import styled from "styled-components";
import LeaderboardCard from "src/components/Leaderboard/LeaderboardCard";

import { Divider } from "src/styles/common";

const Heading = styled.h1`
    font-size: 1.4rem;
    font-weight: bold;
    margin: 0;
`;

export default function LeaderboardPage() {
    const awardImage = "assets/award.svg";

    return (
        <div>
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

        </div >
    );
}