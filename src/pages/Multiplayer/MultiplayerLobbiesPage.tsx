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
import LeaderboardCard from "src/components/Leaderboard/LeaderboardCard";
import Timer from "src/components/Timer/Timer";
import { useEffect, useState } from "react";
import { supabase } from "src/utils/SupabaseClient";
import { Divider } from "src/styles/common";
import { useAuth } from "src/utils/AuthContext";
import { solve } from "src/lib/search";
import { format } from "path";
import { useHotkeys } from "react-hotkeys-hook";

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
                <Stack>
                    <Heading>Create</Heading>
                </Stack>
                <Stack>
                    <Heading>Join</Heading>
                </Stack>
                <Stack>
                    <Heading>History</Heading>
                </Stack>
            </Stack>
        </div>
    )
}
