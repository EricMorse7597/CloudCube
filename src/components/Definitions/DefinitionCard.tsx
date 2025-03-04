import {
    Card,
    useColorModeValue,
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

export default function DefinitionCard({ label, text, imgHref }: { label: string, text: string, imgHref: string | undefined }) {

    const minWidth = window.innerWidth /3 > 400 ? "400px" : "50vw";


    return (
        <Card p="1rem" w="30%" justify={"center"} style={{ minWidth: minWidth }}>
            <InfoWrapper >
                <TextWrapper>
                    <Heading>{label}</Heading>
                    <Description>{text}</Description>
                </TextWrapper>

                {imgHref && (
                    <Image
                        src={imgHref}
                        alt={label}
                        shadowColor={useColorModeValue("#A0AEC0","#1A202C")}
                    />
                )}

            </InfoWrapper>
        </Card>
    );
}