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

const Highlighted = styled.span<{ highlightColor: string }>`
    background-color: ${props => props.highlightColor};
`;

const Image = styled.img<{ shadowColor: string }>`
    width: 75px;
    aspect-ratio: 1 / 1;
    justify-content: center;
    user-select: none;
    pointer-events: none;
    filter: drop-shadow(5px 5px 1px ${props => props.shadowColor});
`;

const highlightSubstring = (text: string, subString: string): JSX.Element => {

    // filter out empty parameters or cases where substring is not present
    if ( !text || !subString|| !text.toUpperCase().includes(subString.toUpperCase())) return <>{text}</>;

    const index: number = text.toUpperCase().indexOf(subString.toUpperCase());

    const before:string = text.substring(0, index);
    const match:string = text.substring(index, index + subString.length);
    const after:JSX.Element = highlightSubstring(text.substring(index + subString.length), subString);

    return (
        <>
            {before}
            <Highlighted highlightColor={useColorModeValue("#90cdf4", "#2b6cb0")}>
                {match}
            </Highlighted>
            {after}
        </>
    );
}

type DefinitionCardProps = {
    label: string;
    text: string;
    imgHref: string | undefined;
    subStringHighlight?: string;
}

export default function DefinitionCard({ label, text, imgHref, subStringHighlight }: DefinitionCardProps) {

    let jsxLabel: JSX.Element = highlightSubstring(label, subStringHighlight || "");
    let jsxText: JSX.Element = highlightSubstring(text, subStringHighlight || "");

    return (
        <Card 
            p="1rem" 
            justify={"center"} 
            flexGrow={1}
            flexBasis="400px"
            width="100%"
            maxWidth="600px"
        >
            <InfoWrapper >
                <TextWrapper>
                    <Heading>{jsxLabel}</Heading>
                    <Description>{jsxText}</Description>
                </TextWrapper>

                {imgHref && (
                    <Image
                        src={imgHref}
                        alt={label}
                        shadowColor={useColorModeValue("#A0AEC0", "#1A202C")}
                    />
                )}

            </InfoWrapper>
        </Card>
    );
}