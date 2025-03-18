import {
    useToast,
    TableContainer,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Modal,
    useDisclosure,
    ModalOverlay,
    ModalContent,
    ModalBody,
    Flex,
    Button,
    ModalCloseButton,
    Heading,
    Stack
} from "@chakra-ui/react";
import styled from "styled-components";

import { supabase } from "src/utils/SupabaseClient";
import { useAuth } from "src/utils/AuthContext";
import { useEffect, useState } from "react";
import UserSolveTable from "../User/UserSolveTable";
import UserSolveTable2 from "../User/ModeratorUserSolveTable";

export default function UserList() {
    const [users, setUsers] = useState<any[]>([]);
    const [selectedUser, setSelectedUser] = useState<any>();
    const [selectedRow, setSelectedRow] = useState<number | null>(null);
    const [rowEntry, setRowEntry] = useState<any>();

    const { session } = useAuth();
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { isOpen: isConfirmOpen, onOpen: onConfirmOpen, onClose: onConfirmClose } = useDisclosure();

    const toast = useToast();

    interface UserData {
        id: string,
        username: string,
        created_at: string
    }

    // This functon gets a list of all users.
    const fetchUsers = async () => {
        console.log("component getting session");
        console.log("session logged as mod")
        try {
            const { data, error } = await supabase
            .from("profiles_with_created_at")
            .select("*")
            .order("username", { ascending: true });
            if (data) {
                setUsers(data)
            }
            if (error) throw error
        } catch (error) {
            console.log("Error fetching users: " + error)
        }
    }

    const banSelected = async () => {
        try {
            const { error } = await supabase
                .from("solve")
                .delete()
                .eq("user_id", rowEntry.id)
    
            if (error) {
                throw error
            }
    
            console.log("User deleted:", rowEntry)
            toast({
                title: "Data Deleted",
                description: `User ${rowEntry.username} has had their solves deleted`,
                status: "success",
                duration: 5000,
                isClosable: true,
            });
    
        } catch (error) {
            console.error("Error deleting user data:", error)
            toast({
                title: "Error",
                description: "Failed to delete user data.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    }

    useEffect(() => {
        if (session) {
            fetchUsers()
        }
    }, [session])

    return (
        (<div> 
            <Heading textAlign={"center"} padding={"4"}>All Users</Heading>
            <TableContainer maxHeight="600px" overflowY="auto">
                <Table>
                    <Thead>
                        <Tr>
                            <Th>User ID</Th>
                            <Th>Username</Th>
                            <Th>Join Date</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {users.map((entry, rowIndex) => (
                            <Tr cursor="pointer"
                            bg={
                                selectedRow === rowIndex ? "purple" : "transparent"
                            }
                            _hover={{
                                background: "purple"
                            }}
                            onClick={() => {
                                setSelectedRow(rowIndex)
                                setRowEntry(entry)
                                console.log("selected", entry)
                            }}
                            onDoubleClick={() => {
                                onOpen()
                                setSelectedUser(entry)
                            }} key={rowIndex}>
                                {Object.values(entry).map((value, colIndex) => (
                                    <Td key={colIndex}>{String(value)}</Td>
                                ))}
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
            <Flex mt={4} justify="center" gap={4}>
                <Button colorScheme="blue" onClick={() => {
                    onOpen()
                    setSelectedUser(rowEntry)
                }}
                isDisabled={selectedRow === null}>
                    View Solves
                </Button>
                <Button colorScheme="red" onClick={() => {
                    onConfirmOpen()
                }}
                isDisabled={selectedRow === null}>
                    Delete All Solves
                </Button>
            </Flex>
            <Modal isOpen={isOpen} onClose={onClose} size={"6xl"} >
                <ModalOverlay />
                    
                <ModalContent p={4}>
                    <ModalCloseButton />
                    <ModalBody>
                        {selectedUser ? (
                            <div style={{textAlign: "center"}}>
                                <p><strong>User ID:</strong> {selectedUser.id}</p>
                                <p><strong>Username:</strong> {selectedUser.username}</p>
                                <p><strong>Join Date:</strong> {new Date(selectedUser.created_at).toLocaleDateString()}</p>
                                <UserSolveTable2 user_id={selectedUser.id}/>
                            </div>
                        ) : (
                            <p>No user selected.</p>
                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>
            <Modal isOpen={isConfirmOpen} onClose={onConfirmClose} size={"6xl"} >
                <ModalOverlay />
                <ModalContent p={4}>
                    <ModalCloseButton />
                    <ModalBody>
                        <Stack mt={4} justify="center" gap={4}>
                            <Heading textAlign={"center"}>
                                Are you sure?
                            </Heading>
                            <Button colorScheme="red" onClick={() => {
                                console.log("selected", rowEntry)
                                banSelected();
                                setRowEntry(null)
                                setSelectedRow(null)
                                onConfirmClose()
                            }}
                            isDisabled={selectedRow === null}>
                                Yes
                            </Button>
                            <Button colorScheme="blue" onClick={() => {
                                onConfirmClose()
                            }}
                            isDisabled={selectedRow === null}>
                                No
                            </Button>
                        </Stack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </div>)
    );
}

function toast(arg0: { title: string; description: string; status: string; duration: number; isClosable: boolean; }) {
    throw new Error("Function not implemented.");
}
