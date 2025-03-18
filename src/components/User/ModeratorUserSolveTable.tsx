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
    ModalHeader
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { supabase } from "src/utils/SupabaseClient";

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

    const deleteSelected = async () => {
        try {
            const error = await supabase
                .from('solve')
                .delete()
                .eq('user_id', user_id)
                .eq('scramble', rowEntry.scramble)

            if (error) {
                throw error
            }

            console.log("Solve deleted:", rowEntry)
            setRowEntry(null)
            setSelectedRow(null)
            toast({
                title: "Data Deleted",
                description: `User ${rowEntry.username} has had their solves deleted`,
                status: "success",
                duration: 5000,
                isClosable: true,
            });
    
        } catch (error) {
            console.error("Error deleting solve data:", error)
            toast({
                title: "Error",
                description: "Failed to delete solve data.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    }

    useEffect(() => {
        fetchSolves()
    }, [solves])



    return (
        isLoading ?
            (<p>Loading...</p>)
            :
            (<div>
                <TableContainer maxHeight="600px" overflowY="auto">
                    <Table>
                        <Thead>
                            <Tr>
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
                                    console.log("entry", entry)
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
                    <ModalContent p={4}>
                        <ModalCloseButton />
                        <ModalBody>
                            <Stack mt={4} justify="center" gap={4}>
                                <Heading textAlign={"center"}>
                                    Are you sure?
                                </Heading>
                                <Button colorScheme="red" onClick={() => {
                                    deleteSelected();
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