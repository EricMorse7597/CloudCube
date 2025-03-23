import {
    Stack,
    HStack,
    Image,
    Card,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure
} from "@chakra-ui/react";
import styled from "styled-components";
import LobbySelectorCard from "src/components/Multiplayer/LobbySelectorCard";
import Timer from "src/components/Timer/Timer";
import { useEffect, useState } from "react";
import { supabase } from "src/utils/SupabaseClient";
import { Divider } from "src/styles/common";
import { useAuth } from "src/utils/AuthContext";
import { solve } from "src/lib/search";
import { format } from "path";
import { useHotkeys } from "react-hotkeys-hook";
import { time } from "console";
import { AddIcon } from "@chakra-ui/icons";

const Heading = styled.h1`
    font-size: 1.4rem;
    font-weight: bold;
    margin: 0;
`;

const multiplayerImage = "assets/multiplayer_logo.svg";
export default function MultiplayerLobbiesPage() {
    return (
        <div>
            <HStack align={"center"} justify={"center"} spacing={4} m={4}>
                <Image
                    src={multiplayerImage}
                    alt="gamepad"
                    width="3rem"
                    height="3rem"
                />
                <Heading>Multiplayer</Heading>
                <Image
                    src={multiplayerImage}
                    alt="gamepad"
                    width="3rem"
                    height="3rem"
                />
            </HStack>
            <Stack spacing={4} align={"center"}>
                <Stack m={4} spacing={4} w={"60vw"} >
                    <HStack>
                        <Heading>Create</Heading>
                        <Button colorScheme="green"><AddIcon /></Button>
                    </HStack>
                    <LobbySelectorCard name="Invitee" type="Type" date="Creation Date" />
                </Stack>
                <Stack m={4} spacing={4} w={"60vw"} >
                    <Heading>Join</Heading>
                    <LobbySelectorCard name="Inviter" type="Type" date="Creation Date" />
                </Stack>
                <Stack m={4} spacing={4} w={"60vw"} >
                    <Heading>History</Heading>
                    <LobbySelectorCard name="Opponent" type="Type" date="Creation Date" />
                </Stack>
            </Stack>
        </div>
    )
}
