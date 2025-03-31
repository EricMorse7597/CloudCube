import {
  Container,
  Flex,
  Input,
  Heading,
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

const containsSubstring = (str: string, substr: string): boolean => {
  return str.toUpperCase().includes(substr.toUpperCase());
}

const DefinitionsPage = () => {
  const [searchBox, setSearch] = useState("");

  useEffect(() => {
    document.title = "Definitions | CloudCube";
  }, []);

  return (
    <>
      <Container
        p={4}>
        <Input
          key={"search"}
          placeholder="Search"
          onChange={(e) => setSearch(e.target.value)} />
      </Container>

      <Stack align={"center"} justify={"center"}>
        {Object.values(category).map((cat: category) => {

          /* gets all definitions for each category that also contains the text string in the title or description */
          const filteredDefinitions = DEFINITION_ITEMS.filter(
            (item: DefinitionItem) =>
              item.category === cat &&
              (containsSubstring(item.label, searchBox) || containsSubstring(item.text, searchBox))
          );
          
          return (!filteredDefinitions.length)? <></> : (
            <>
              <Divider />
              <Heading textAlign={"center"}>{cat}</Heading>
              <Flex
                gap={6}
                p={4}
                wrap={"wrap"}
                justify={"center"}
                align={"stretch"}
              >
                {filteredDefinitions.map((item: DefinitionItem) => {
                  return <DefinitionCard key={item.label.replace(" ", "_")} label={item.label} text={item.text} imgHref={item.imgHref} subStringHighlight={searchBox} />
                })}
              </Flex>
            </>
          );

        })}
      </Stack>
    </ >
  );
};

export default DefinitionsPage;
