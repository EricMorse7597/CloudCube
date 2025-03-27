import { Container, Heading, Link, Text, VStack } from "@chakra-ui/react";



export default function AboutPage() {
  return (
    <Container maxW="container.sm">
      <VStack align="left">
        <Heading size="lg" my={8} textAlign="center">
          About Cloud Cube
        </Heading>
        <Text>Cloud Cube is a fork of <Link href="https://github.com/ericx20/crystalcube" textDecoration="underline">crystalcube</Link> Created by Eric Xu.
        </Text>
      </VStack>
    </Container>
  );
}
