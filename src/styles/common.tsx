import styled, { css } from "styled-components";
import {Button}  from "@chakra-ui/react";



export const Header1 = styled.h1`
    font-size: 2rem;
    font-weight: bold;
    margin: 0rem 2rem 2rem 2rem;
    padding: 0;
    text-align: center;

`
export const Header2 = styled.h2`
    font-size: 1.2rem;
    font-weight: bold;
    margin: 0rem 2rem 1rem 2rem;
    padding: 0;
    text-align: center;
`

export const Divider = styled.hr`
    border:none;
    border-bottom: 1px solid #4A5568;
    margin-bottom: 2rem;
`

export const FormLabel = styled.label`
    font-size: "1rem";
    font-weight: "bold";
`

export const FormSection = styled.div`
    margin: 1rem 0;
`


type ButtonProps = {
  href?: string;
  text: string;
  color?: string;
  size?: string;
  isMobile?: boolean,
};


import { Link as RouterLink } from "react-router-dom";
export function NavButton({ href, text, color = undefined, size = "md", isMobile = false}: ButtonProps): JSX.Element {
  return (
    <Button
      as={href ? RouterLink : undefined}
      to={href?? ""}
      display={isMobile ? { base: "inline-flex", md: "none" } : { base: "none", md: "inline-flex" }}
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
