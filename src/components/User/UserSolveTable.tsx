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

export default function UserSolveTable() {
    const [fetching, setFetching] = useState(true);
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

    const fetchSolves = async() => {
        setFetching(true)
        try {
            console.log('user_id: ' + session.user.id)
            const { data, error } = await supabase
            .from('solve')
            .select('scramble, solve_time, created_at')
            .eq('user_id', session.user.id)
            .order('created_at', {ascending: false})
            if (data) {
                const formattedData = data.map(entry => ({
                    ...entry,
                    created_at: new Date(entry.created_at).toLocaleString() 
                }));
                setEntries(formattedData);
            }
            if (error) throw error
        } catch (error) {
            showFailure()
        }
        
    }

    useEffect(() => {
        if (!session) {
            setFetching(false)
            return;
        }
        fetchSolves()
    }, [session])

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
                    {entries.map((entry, rowIndex) => (
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