import {
    Card,
    Flex,
} from "@chakra-ui/react";

import styled from "styled-components";
import { useBreakpointValue } from "@chakra-ui/react";

const InfoWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;

    > * {
        margin: 0 0.5rem;
    }

    img {
        margin-left: auto;
    }
`;

const TextWrapper = styled.div`
    display: flex;
    flex-direction: column;
`;

const Heading = styled.h1`
    font-size: 1.2rem;
    font-weight: bold;
    margin: 0;
`;

const Description = styled.p`
    font-size: 1rem;
    margin: 0;
`;

const Image = styled.img<{ shadowColor: string }>`
    width: 75px;
    aspect-ratio: 1 / 1;
    justify-content: center;
    filter: drop-shadow(5px 5px 1px ${props => props.shadowColor});
`;

export default function DefinitionCard({ rank, playerName, time, isUser }: { rank: string, playerName: string, time: string, isUser?: boolean }) {

    const minWidth = window.innerWidth / 3 > 400 ? "400px" : "50vw";

    return (
        <Card borderWidth={isUser ? "3px" : "0"} borderColor={"red.400"} w={{ base: "85%", md: "50%" }} style={{ minWidth: minWidth }}>
            <Flex
                gap={{ base: "3", md: "6" }}
                p={4}
                wrap={"nowrap"} // Prevent wrapping
                justify={"space-between"}
                align={"center"} // Vertically center items
                direction={"row"}
            >
                <p style={{ flex: 1, textAlign: "center" }}>{rank}</p>
                <p
                    style={{
                        flex: useBreakpointValue({ base: 2, md: 5 }),
                        textAlign: "center",
                        overflow: "scroll", // Hide overflowing text
                        whiteSpace: "nowrap", // Prevent text from wrapping
                        overflowX: "scroll", // Hide overflowing text
                    }}
                    title={playerName} // Show full name on hover
                >
                    {playerName}
                </p>
                <p style={{ flex: 1, textAlign: "center" }}>
                    {isNaN(parseFloat(time)) ? "Time" : parseFloat(time).toFixed(3)}
                </p>
            </Flex>
        </Card>
    );
}