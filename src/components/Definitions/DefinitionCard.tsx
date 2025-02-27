import {
    Card,
    HStack,
    Image,
    Heading,
} from "@chakra-ui/react";

export default function DefinitionCard({ label, text, imgHref }: { label: string, text: string, imgHref: string | undefined }) {
    return (
        <Card p="1.5rem" w="85%">
            <HStack spacing={100}>
                <div>
                    <Heading size="md">{label}</Heading>
                    <p>{text}</p>
                </div>
                {imgHref ? (
                    <Image
                        ml="auto"
                        src={imgHref}
                        alt={label}
                        boxSize="75px"
                        objectFit="contain"
                    />
                ) : null}

            </HStack>
        </Card>
    );
}