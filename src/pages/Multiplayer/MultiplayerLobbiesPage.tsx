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
    useDisclosure,
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Input,
    Select,
    Flex,
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
import { e } from "cubing/dist/types/KState-8f0d81ea";
import { randomScrambleForEvent } from "cubing/scramble";
import { useNavigate } from "react-router-dom";

const Heading = styled.h1`
    font-size: 1.4rem;
    font-weight: bold;
    margin: 0;
`;

const multiplayerImage = "assets/multiplayer_logo.svg";

export default function MultiplayerLobbiesPage() {
    const [searchedUser, setSearchedUser] = useState("")
    const [puzzleType, setPuzzleType] = useState("333")
    const [isUsernameInvalid, setIsUsernameInvalid] = useState(false)
    const [isUserNotFound, setIsUserNotFound] = useState(false)

    const [createdLobbies, setCreatedLobbies] = useState<any>([])
    const [receivedLobbies, setReceivedLobbies] = useState<any>([])
    const [historicLobbies, setHistoricLobbies] = useState<any>([])


    const { session } = useAuth();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const navigate = useNavigate();

    const searchUser = async (username: String) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('username', username)
                .single()
            if (data) {
                setSearchedUser(data.username)
                return true
            }
            return false
        } catch (error) {
            console.log("Error searching user!")
        }
        return false
    }

    const translateUsername = async (username: String) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('id')
                .eq('username', username)
                .single()
            if (data) {
                console.log(username + "s id is " + data?.id)
                return data.id
            }
        } catch (error) {
            console.log("Error finding user!")
        }
        return null;
    }

    // this function will fetch all active lobbies a player has been invited to
    const fetchLobbies = async () => {
        if (!session?.user?.id) return;

        try {
            const { data, error } = await supabase
                .from('racing_sessions')
                .select("*")
                .or(`sender_id.eq.${session.user.id},receiver_id.eq.${session.user.id}`)
            if (error) throw error;
            if (data) {
                setCreatedLobbies(data.filter(d => d.sender_id === session.user.id && d.status === 'active'))
                setReceivedLobbies(data.filter(d => d.receiver_id === session.user.id && d.status === 'active'))
                setHistoricLobbies(data.filter(d => d.status === 'completed'))
                console.log("created: " + createdLobbies)
            }
        } catch (error) {
            console.error("Error fetching lobbies", error)
        }
    }

    const genScramble = async (puzzleType: string) => {
        const newScramble = await randomScrambleForEvent(puzzleType);
        return newScramble.toString()
    }

    useEffect(() => {
        const invite_channel = supabase
            .channel('public:racing_invites')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'racing_sessions',
                filter: 'sender_id=eq.${session.user.id}'
            }, payload => {
                console.log("new update from sender column")
            })
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'racing_sessions',
                filter: 'receiver_id=eq.${session.user.id}'
            }, payload => {
                console.log("new update from receiver column")
            })
            .subscribe()
        //
        // this ensures channels are unsubscribed from on page change
        window.addEventListener('beforeunload', async () => {
            await supabase.removeAllChannels()
        })

        fetchLobbies()
    }, [session])

    const createLobby = async () => {
        try {
            //if no user was entered
            if (!searchedUser.trim()) {
                setIsUsernameInvalid(true)
                setIsUserNotFound(true)
                return;
            }
            setIsUsernameInvalid(false)

            // look for user in db
            const userExists = await searchUser(searchedUser)
            if (!userExists) {
                setIsUserNotFound(true)
                return
            }
            setIsUserNotFound(false)

            const receiver_id = await translateUsername(searchedUser)
            console.log("translatedID is " + receiver_id)

            const scramble = await genScramble(puzzleType)
            //proceed to lobby creation

            const { data, error } = await supabase
                .from('racing_sessions')
                .insert({
                    sender_id: session?.user?.id,
                    receiver_id: receiver_id,
                    sender_username: session?.user?.user_metadata?.username,
                    receiver_username: searchedUser,
                    status: 'active',
                    event: puzzleType,
                    scramble: scramble
                })
            if (error) {
                throw error;
            }

            await fetchLobbies()
            onClose()
        } catch (error) {
            console.log("error creating session!")
        }
    }

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
                        <Button
                            onClick={onOpen}
                            colorScheme="green"
                        >
                            <AddIcon />
                        </Button>
                    </HStack>
                    <LobbySelectorCard name="Invitee" type="Type" date="Creation Date" />

                    {createdLobbies.map((lobby: any, i: number) => (
                        <LobbySelectorCard
                            key={lobby.id || i}
                            name={lobby.receiver_username}
                            type={lobby.event}
                            date={new Date(lobby.created_at).toLocaleDateString()}
                            onClick={() => { navigate(`/multiplayer/${lobby.id}`) }}
                        />
                    ))}
                </Stack>
                <Stack m={4} spacing={4} w={"60vw"} >
                    <Heading>Join</Heading>
                    <LobbySelectorCard name="Inviter" type="Type" date="Creation Date" />

                    {receivedLobbies.map((lobby: any, i: number) => (
                        <LobbySelectorCard
                            key={lobby.id || i}
                            name={lobby.sender_username}
                            type={lobby.event}
                            date={new Date(lobby.created_at).toLocaleDateString()}
                            onClick={() => { navigate(`/multiplayer/${lobby.id}`) }}
                        />
                    ))}
                </Stack>
                <Stack m={4} spacing={4} w={"60vw"} >
                    <Heading>History</Heading>
                    <LobbySelectorCard name="Opponent" type="Type" date="Creation Date" />

                    {historicLobbies.map((lobby: any, i: number) => (
                        <LobbySelectorCard
                            key={lobby.id || i}
                            name={
                                session?.user?.id === lobby.sender_id
                                    ? lobby.receiver_username
                                    : lobby.sender_username
                            }
                            type={lobby.event}
                            date={new Date(lobby.created_at).toLocaleDateString()}
                            onClick={() => { navigate(`/multiplayer/${lobby.id}`) }}
                        />
                    ))}
                </Stack>
            </Stack>

            <Modal isOpen={isOpen} onClose={onClose} >
                <ModalOverlay />
                <ModalContent
                    maxW={"50rem"}
                    maxH={"50rem"}
                    alignItems={"center"}
                    p={4}
                >
                    <ModalBody>
                        <Stack spacing={4}>
                            <FormControl isRequired isInvalid={isUsernameInvalid || isUserNotFound}>
                                <FormLabel>Username</FormLabel>
                                <Input
                                    placeholder="Enter username"
                                    value={searchedUser}
                                    onChange={(e) => setSearchedUser(e.target.value)}
                                />
                                {isUsernameInvalid && <FormErrorMessage>Username is required.</FormErrorMessage>}
                                {isUserNotFound && <FormErrorMessage>User not found.</FormErrorMessage>}
                            </FormControl>

                            <FormControl isRequired>
                                <FormLabel>Event</FormLabel>
                                <Select
                                    value={puzzleType}
                                    onChange={(e) => setPuzzleType(e.target.value)}
                                >
                                    <option value="333">3x3</option>
                                    <option value="222">2x2</option>
                                </Select>
                            </FormControl>

                            <Flex justify="center">
                                <Button colorScheme="green" mt={2} onClick={createLobby}>
                                    Create Lobby
                                </Button>
                            </Flex>
                        </Stack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </div >
    )
}
