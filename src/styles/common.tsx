import styled, { css } from "styled-components";
import {Button}  from "@chakra-ui/react";

type ButtonProps = {
  href?: string;
  text: string;
  color?: string;
  size?: string;
};


import { Link as RouterLink } from "react-router-dom";
export function NavButton({ href, text, color=undefined, size="md" }: ButtonProps): JSX.Element {
  if (href) {
    console.log("TESTING", text);
  }
  return (
    <Button
      as={href ? RouterLink : undefined}
      to={href?? ""}
      display={{ base: "none", md: "inline-flex" }}
      fontSize={size}
      fontWeight={600}
      margin="0 0.5em"
      size={size}
      colorScheme={color}
      bg={color? undefined: "none"}
    >
      {text}
    </Button>
  );
}
