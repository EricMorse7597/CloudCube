import {
  Button,
  Center,
  Container,
  HStack,
  Heading,
  Image,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import Balancer from "react-wrap-balancer";

export default function Home() {
  const mockupImage = useColorModeValue(
    "assets/mockup-light.webp",
    "/assets/mockup-dark.webp"
  );
  return (
    <Container maxW="container.lg" py={12}>
      <VStack spacing={6}>
        <VStack>
          <Balancer>
            <Heading textAlign="center">Crystalcube</Heading>
          </Balancer>
          <Balancer>
            <Text align="center" fontSize="lg">
              Improve the efficiency of your CFOP cross or ZZ EO
            </Text>
          </Balancer>
        </VStack>
        <HStack spacing={4} justify="center">
          <RouterLink to="train/">
            <Button colorScheme="blue" size="md">Start Training</Button>
          </RouterLink>
          <RouterLink to="timer">
            <Button colorScheme="teal" size="md">Start Timing</Button>
          </RouterLink>
        </HStack>
        
        <Image
          src={mockupImage}
          fit="cover"
          w="100%"
          maxW="500px"
          draggable={false}
          filter="drop-shadow(0 0 10px rgb(212, 131, 242))"
        />
      </VStack>

    </Container>
  );
}
