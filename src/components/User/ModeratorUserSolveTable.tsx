import {
    useToast,
    TableContainer,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Flex,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    useDisclosure,
    Heading,
    Stack,
    ModalCloseButton,
    useColorModeValue
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { supabase } from "src/utils/SupabaseClient";
import emailjs from 'emailjs-com'; 

export default function UserSolveTable({ user_id }: { user_id: string }) {
    const [isLoading, setIsLoading] = useState(true);
    const [solves, setSolves] = useState<any[]>([]);
    const [selectedRow, setSelectedRow] = useState<number | null>(null);
    const [rowEntry, setRowEntry] = useState<any>();
    const toast = useToast();

    const { isOpen, onOpen, onClose } = useDisclosure()
    
    const fetchSolves = async () => {
            try {
                const { data, error } = await supabase
                    .from("solve")
                    .select("scramble, solve_time, created_at, event",)
                    .eq("user_id", user_id)
                    .order("created_at", { ascending: false });
                if (data) {
                    const formattedData = data.map((entry) => ({
                        ...entry,
                        created_at: new Date(entry.created_at).toLocaleString(),
                    }));
                    setSolves(formattedData);
                }
                if (error) throw error;
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to fetch solve data.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            } finally {
                setIsLoading(false)
            }
    };

    // Delete selected solve and send email
    const deleteSelected = async () => {
        try {
            // Delete the solve from Supabase
            const { error: deleteError } = await supabase
                .from("solve")
                .delete()
                .eq("user_id", user_id)
                .eq("scramble", rowEntry.scramble);

            if (deleteError) throw deleteError;

            // Fetch user email from Supabase
            const { data: userData, error: userError } = await supabase
                .from("profiles")
                .select("email")
                .eq("id", user_id)
                .single();

            if (userError || !userData) {
                toast({
                    title: "Error",
                    description: "User email not found.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
                return;
            }

            // sending the email using EmailJS
            emailjs
                .send("service_27az50e","template_ue3amim", {
                    user_name: userData.email,
                    scramble: rowEntry.scramble,
                    solve_time: rowEntry.solve_time,
                    email: userData.email
                }, "gTwa0_dWfYuWIhxcw")
                .then(
                    () => {
                        toast({
                            title: "Data Deleted",
                            description: "Solve deleted and user notified.",
                            status: "success",
                            duration: 5000,
                            isClosable: true,
                        });
                    },
                    (error) => {
                        if (error?.text) {
                            console.error("EmailJS error text:", error.text);
                        }
                        console.error("Error sending email:", error);
                        toast({
                            title: "Error",
                            description: "Failed to send email.",
                            status: "error",
                            duration: 5000,
                            isClosable: true,
                        });
                    }
                );

            await fetchSolves(); 
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete solve data.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    useEffect(() => {
        fetchSolves()
    }, [solves])

    return (
        isLoading ?
            (<p>Loading...</p>)
            :
            (<div>
                <TableContainer maxHeight="calc(100vh - 250px)" overflowY="auto">
                    <Table>
                        <Thead>
                            <Tr position={"sticky"} top={0} bg={useColorModeValue("#ffffff","#2D3748")} zIndex={1} boxShadow={"md"}>
                                <Th>Scramble</Th>
                                <Th>Solve Time (seconds)</Th>
                                <Th>Date Added</Th>
                                <Th>Puzzle Type</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {solves.map((entry, rowIndex) => (
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
                    <Button colorScheme="red" onClick={() => {
                        onOpen()
                    }}
                    isDisabled={selectedRow === null}>
                        Delete Solve
                    </Button>
                </Flex>
                <Modal isOpen={isOpen} onClose={onClose} size={"6xl"} >
                    <ModalOverlay />
                    <ModalContent m={"auto"} p={4} maxWidth="min(calc(100vw - 2rem), 1200px)" >
                        <ModalCloseButton />
                        <ModalBody>
                            <Stack mt={4} justify="center" gap={4}>
                                <Heading textAlign={"center"}>
                                    Are you sure?
                                </Heading>
                                <Button colorScheme="red" onClick={() => {
                                    deleteSelected();
                                    setRowEntry(null)
                                    setSelectedRow(null)
                                    onClose()
                                }}
                                isDisabled={selectedRow === null}>
                                    Yes
                                </Button>
                                <Button colorScheme="blue" onClick={() => {
                                    onClose()
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