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
import { supabase } from "src/utils/SupabaseClient";

export default function UserListPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [isMod, setIsMod] = useState(false);

    const { session } = useAuth();

    const modCheck = async () => {
        try {
            const { data, error } = await supabase
            .from("profiles")
            .select("role")
            .eq('id', session.user.id)
            .single()
            if (error) throw error
            else if (data?.role === "Mod") {
                setIsMod(true)
            }
        } catch (error) {
            console.log("Error fetching users: " + error)
        }
    }

    useEffect(() => {
        if (session) {
            modCheck()
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