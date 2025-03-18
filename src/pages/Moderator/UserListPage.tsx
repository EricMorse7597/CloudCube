import {
    useColorModeValue,
    Card,
    Stack,
    HStack,
    Heading,
    useToast,
    Image,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Center
} from "@chakra-ui/react";
import styled from "styled-components";
import UserList from "src/components/Moderator/UserList";
import { useEffect, useState } from "react";
import { useAuth } from "src/utils/AuthContext";

export default function UserListPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [isMod, setIsMod] = useState(true);

    const { session } = useAuth();

    useEffect(() => {
        if (session) {
            
            setIsLoading(false)
        }
    }, [session])

    return (
        isLoading ?
            (<p>Loading...</p>)
            :
            isMod ? (
                <div>
                    <Stack justify="center" marginBottom="2rem" spacing={4} mt={4}>
                        <Card ml={"15%"} mr={"15%"} >
                            <UserList/>
                        </Card>
                    </Stack>
                </div >)
                :
                (<Heading padding={16} textAlign={"center"}>You are not a mod!</Heading>)
            
    );
}