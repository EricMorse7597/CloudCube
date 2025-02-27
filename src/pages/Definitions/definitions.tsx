import {
  Card,
  Stack,
  HStack,
  Heading,
  SimpleGrid,
  Image,
} from "@chakra-ui/react";

import DefinitionCard from "src/components/Definitions/DefinitionCard";

import DEFINITION_ITEMS, { DefinitionItem } from "src/components/Definitions/definitionItems";

const DefinitionsPage = () => {
  return (
    <div>
      {DEFINITION_ITEMS.map((item: DefinitionItem) => (
        <DefinitionCard label={item.label} text={item.text} imgHref={item.imgHref} />
      ))}
    </div>
  );
};

export default DefinitionsPage;


/**
 * 
    <>
      <HStack align="center" justify="center" spacing={4} mt={4}>
        <Heading textAlign="center" size="md">
          Definitions
        </Heading>
      </HStack>
      <Stack gap={10} p={4} align="center" justify="center">
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={40}>
          <Card p="3.5rem" w="100%">
            <Heading size="md">CFOP</Heading>
            <p>Cross, F2L, OLL, PLL</p>
          </Card>
          <Card p="3.5rem" w="100%">
            <Heading size="md">ZZ</Heading>
            <p>EOLine, F2L, LL</p>
          </Card>
        </SimpleGrid>
      </Stack>
      <Stack gap={10} p={4} align="center">
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
          <Card p="1.5rem" w="85%">
            <HStack spacing={100}>
              <div>
                <Heading size="md">R</Heading>
                <p>Right face clockwise</p>
              </div>
              <Image
                ml="auto"
                src="/assets/r.png"
                alt="R"
                boxSize="75px"
                objectFit="contain"
              />
            </HStack>
          </Card>
          <Card p="1.5rem" w="85%">
            <HStack spacing={100}>
              <div>
                <Heading size="md">R'</Heading>
                <p>Right face counter clockwise</p>
              </div>
              <Image
                ml="auto"
                src="/assets/rprime.png"
                alt="R"
                boxSize="75px"
                objectFit="contain"
              />
            </HStack>
          </Card>
          <Card p="1.5rem" w="85%">
            <HStack spacing={100}>
              <div>
                <Heading size="md">L</Heading>
                <p>Left face clockwise</p>
              </div>
              <Image
                ml="auto"
                src="/assets/l.png"
                alt="L"
                boxSize="75px"
                objectFit="contain"
              />
            </HStack>
          </Card>
          <Card p="1.5rem" w="85%">
            <HStack spacing={100}>
              <div>
                <Heading size="md">L'</Heading>
                <p>Left face counterclockwise</p>
              </div>
              <Image
                ml="auto"
                src="/assets/lprime.png"
                alt="L'"
                boxSize="75px"
                objectFit="contain"
              />
            </HStack>
          </Card>
          <Card p="1.5rem" w="85%">
            <HStack spacing={100}>
              <div>
                <Heading size="md">U</Heading>
                <p>Up face clockwise</p>
              </div>
              <Image
                ml="auto"
                src="/assets/u.png"
                alt="U"
                boxSize="75px"
                objectFit="contain"
              />
            </HStack>
          </Card>
          <Card p="1.5rem" w="85%">
            <HStack spacing={100}>
              <div>
                <Heading size="md">U'</Heading>
                <p>Up face counterclockwise</p>
              </div>
              <Image
                ml="auto"
                src="/assets/uprime.png"
                alt="U'"
                boxSize="75px"
                objectFit="contain"
              />
            </HStack>
          </Card>
          <Card p="1.5rem" w="85%">
            <HStack spacing={100}>
              <div>
                <Heading size="md">D</Heading>
                <p>Down face clockwise</p>
              </div>
              <Image
                ml="auto"
                src="/assets/d.png"
                alt="D"
                boxSize="75px"
                objectFit="contain"
              />
            </HStack>
          </Card>
          <Card p="1.5rem" w="85%">
            <HStack spacing={100}>
              <div>
                <Heading size="md">D'</Heading>
                <p>Down face counterclockwise</p>
              </div>
              <Image
                ml="auto"
                src="/assets/dprime.png"
                alt="D'"
                boxSize="75px"
                objectFit="contain"
              />
            </HStack>
          </Card>
          <Card p="1.5rem" w="85%">
            <HStack spacing={100}>
              <div>
                <Heading size="md">F</Heading>
                <p>Front face clockwise</p>
              </div>
              <Image
                ml="auto"
                src="/assets/f.png"
                alt="F"
                boxSize="75px"
                objectFit="contain"
              />
            </HStack>
          </Card>
          <Card p="1.5rem" w="85%">
            <HStack spacing={100}>
              <div>
                <Heading size="md">F'</Heading>
                <p>Front face counterclockwise</p>
              </div>
              <Image
                ml="auto"
                src="/assets/fprime.png"
                alt="F'"
                boxSize="75px"
                objectFit="contain"
              />
            </HStack>
          </Card>
          <Card p="1.5rem" w="85%">
            <HStack spacing={100}>
              <div>
                <Heading size="md">B</Heading>
                <p>Back face clockwise</p>
              </div>
              <Image
                ml="auto"
                src="/assets/b.png"
                alt="B"
                boxSize="75px"
                objectFit="contain"
              />
            </HStack>
          </Card>
          <Card p="1.5rem" w="85%">
            <HStack spacing={100}>
              <div>
                <Heading size="md">B'</Heading>
                <p>Back face counterclockwise</p>
              </div>
              <Image
                ml="auto"
                src="/assets/bprime.png"
                alt="B'"
                boxSize="75px"
                objectFit="contain"
              />
            </HStack>
          </Card>
        </SimpleGrid>
      </Stack>
    </>
 */