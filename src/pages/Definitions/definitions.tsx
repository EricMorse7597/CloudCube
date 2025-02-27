import {
  Box,
  Container,
  Flex,
  Input,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

import DefinitionCard from "src/components/Definitions/DefinitionCard";

import DEFINITION_ITEMS, { DefinitionItem } from "src/components/Definitions/definitionItems";

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
      <Flex
        gap={6}
        p={4}
        wrap={"wrap"}
        justify={"center"}
        align={"stretch"}
      >
        {DEFINITION_ITEMS.map((item: DefinitionItem) => {
          if (item.label.includes(searchBox.toUpperCase()) || item.label.includes(searchBox.toLowerCase())) {
            return <DefinitionCard key={item.label.replace(" ", "_")} label={item.label} text={item.text} imgHref={item.imgHref} />
          }
        })}
      </Flex >
    </div >
  );
};

export default DefinitionsPage;
