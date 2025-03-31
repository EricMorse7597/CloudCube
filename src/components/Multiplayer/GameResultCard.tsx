import {
    Card,
    Flex,
} from "@chakra-ui/react";

import styled from "styled-components";

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

export default function GameResultCard({ playerName, time, isUser }: { playerName: string, time: string, isUser?: boolean }) {

    const minWidth = window.innerWidth / 3 > 400 ? "400px" : "50vw";

    return (
        <Card borderWidth={isUser ? "3px" : "0"} borderColor={"red.400"} w={"30%"} style={{ minWidth: minWidth }}>
            <Flex
                gap={6}
                p={4}
                wrap={"wrap"}
                justify={"space-around"}
                align={"stretch"}
            >
                <p>{playerName}</p>
                <p>{isNaN(parseFloat(time)) ? time : parseFloat(time).toFixed(3)}</p>
            </Flex>
        </Card >
    );
}