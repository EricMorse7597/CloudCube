import { useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { randomScrambleForEvent } from "cubing/scramble";
import { Alg } from "cubing/alg";
import { get, set } from "lodash";
import { supabase } from "src/utils/SupabaseClient";
import { useAuth } from "src/utils/AuthContext";
import {
    Card,
    Stack,
    HStack,
    Heading,
    useToast,
    TableContainer,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td
} from "@chakra-ui/react";

export default function UserSolveTable({ solves }: { solves: any[] }) {
    const [entries, setEntries] = useState<any[]>([])


    const { session } = useAuth();

    const toast = useToast();

    const showSuccess = () => {
        toast({
            title: 'Success!',
            description: 'Retrieved your solve times',
            duration: 5000,
            isClosable: true,
            status: "success",
            position: "bottom"
        })
    }

    const showFailure = () => {
        toast({
            title: 'Error',
            description: 'Failed to retrieve solves',
            duration: 5000,
            isClosable: true,
            status: "error",
            position: "bottom"
        })
    }

    useEffect(() => {
        console.log("Updated entries:", entries);
    }, [entries]);
    
    return (
        <TableContainer maxHeight="600px" overflowY="auto">
            <Table>
                <Thead>
                    <Tr>
                        <Th>Scramble</Th>
                        <Th>Solve Time (seconds)</Th>
                        <Th>Date Added</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {solves.map((entry, rowIndex) => (
                        <Tr key={rowIndex}>
                            {Object.values(entry).map((value, colIndex) => (
                                <Td key={colIndex}>{String(value)}</Td>
                            ))}
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </TableContainer>
    );
}