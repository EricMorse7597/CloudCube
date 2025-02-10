import {
    Card,
    Stack,
    HStack,
    Heading,
    SimpleGrid,
} from "@chakra-ui/react";

const DefinitionsPage = () => {
    return (
        <>
            <HStack align="center" justify="center" spacing={4} mt={4}>
                <Heading textAlign="center" size="md">Definitions</Heading>
            </HStack>
            <Stack gap={4} p={4}>
                <SimpleGrid columns={{base: 1, md: 3}} spacing={4}>
                    <Card p="1.5rem" w="85%">
                        <Heading size="md">R</Heading>
                        <p>R</p>
                    </Card>
                    <Card p="1.5rem" w="85%">
                        <Heading size="md">R'</Heading>
                        <p>Definition 2</p>
                    </Card>
                    <Card p="1.5rem" w="85%">
                        <Heading size="md">L</Heading>
                        <p>Definition 3</p>
                    </Card>
                    <Card p="1.5rem" w="85%">
                        <Heading size="md">L'</Heading>
                        <p>Definition 3</p>
                    </Card>
                    <Card p="1.5rem" w="85%">
                        <Heading size="md">U</Heading>
                        <p>Definition 3</p>
                    </Card>
                </SimpleGrid>
            </Stack>
        </>
    );
}

export default DefinitionsPage;
