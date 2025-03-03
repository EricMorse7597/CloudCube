import { useEffect, useState } from "react";
import { useAuth } from "src/utils/AuthContext";
import {
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