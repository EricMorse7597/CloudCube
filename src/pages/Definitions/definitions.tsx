import {
  Box,
  Container,
  Flex,
  Input,
  Heading,
  HStack,
  Stack
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Divider } from "src/styles/common";

import DefinitionCard from "src/components/Definitions/DefinitionCard";

import DEFINITION_ITEMS, { DefinitionItem, category } from "src/components/Definitions/definitionItems";

const Move: Array<DefinitionItem> = [];
const Method: Array<DefinitionItem> = [];
const Algorithm: Array<DefinitionItem> = [];
const Term: Array<DefinitionItem> = [];
const Competition: Array<DefinitionItem> = [];

const sortItems = () => {
  DEFINITION_ITEMS.map((item: DefinitionItem) => {
    switch (item.category) {
      case category.Move:
        Move.push(item);
        break;
      case category.Method:
        Method.push(item);
        break;
      case category.Algorithm:
        Algorithm.push(item);
        break;
      case category.Term:
        Term.push(item);
        break;
      case category.Competition:
        Competition.push(item);
        break;
    }
  });
};

sortItems();

const DefinitionsPage = () => {
  const [searchBox, setSearch] = useState("");

  useEffect(() => {
    document.title = "Definitions | CloudCube";
  }, []);

  return (
    <div>
      <Container
        p={4}>
        <Input
          key={"search"}
          placeholder="Search"
          onChange={(e) => setSearch(e.target.value)} />
      </Container>

      <Stack align={"center"} justify={"center"}>

        <Divider />
        <Heading textAlign={"center"}>Moves</Heading>
        <Flex
          gap={6}
          p={4}
          wrap={"wrap"}
          justify={"center"}
          align={"stretch"}
        >

          {Move.map((item: DefinitionItem) => {
            if (item.label.toUpperCase().includes(searchBox.toUpperCase())) {
              return <DefinitionCard key={item.label.replace(" ", "_")} label={item.label} text={item.text} imgHref={item.imgHref} />
            }
          })}

        </Flex >

        <Divider />
        <Heading textAlign={"center"}>Speedcubing Methods & Techniques</Heading>
        <Flex
          gap={6}
          p={4}
          wrap={"wrap"}
          justify={"center"}
          align={"stretch"}
        >
          {Method.map((item: DefinitionItem) => {
            if (item.label.toUpperCase().includes(searchBox.toUpperCase())) {
              return <DefinitionCard key={item.label.replace(" ", "_")} label={item.label} text={item.text} imgHref={item.imgHref} />
            }
          })}
        </Flex >

        <Divider />
        <Heading textAlign={"center"}>Common Algorithms & Concepts</Heading>
        <Flex
          gap={6}
          p={4}
          wrap={"wrap"}
          justify={"center"}
          align={"stretch"}
        >
          {Algorithm.map((item: DefinitionItem) => {
            if (item.label.toUpperCase().includes(searchBox.toUpperCase())) {
              return <DefinitionCard key={item.label.replace(" ", "_")} label={item.label} text={item.text} imgHref={item.imgHref} />
            }
          })
          }
        </Flex >

        <Divider />
        <Heading textAlign={"center"}>Cubing Terms & Techniques</Heading>
        <Flex
          gap={6}
          p={4}
          wrap={"wrap"}
          justify={"center"}
          align={"stretch"}
        >
          {Term.map((item: DefinitionItem) => {
            if (item.label.toUpperCase().includes(searchBox.toUpperCase())) {
              return <DefinitionCard key={item.label.replace(" ", "_")} label={item.label} text={item.text} imgHref={item.imgHref} />
            }
          })
          }
        </Flex >

        <Divider />
        <Heading textAlign={"center"}>Timing & Competition Terms</Heading>
        <Flex
          gap={6}
          p={4}
          wrap={"wrap"}
          justify={"center"}
          align={"stretch"}
        >
          {Competition.map((item: DefinitionItem) => {
            if (item.label.toUpperCase().includes(searchBox.toUpperCase())) {
              return <DefinitionCard key={item.label.replace(" ", "_")} label={item.label} text={item.text} imgHref={item.imgHref} />
            }
          })
          }
        </Flex >

      </Stack>
    </div >
  );
};

export default DefinitionsPage;
