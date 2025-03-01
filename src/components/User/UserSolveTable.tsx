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
    useToast
} from "@chakra-ui/react";

export default function UserSolveTable() {
    const [fetching, setFetching] = useState(true);
    const [solves, setSolves] = useState([])

    const { session } = useAuth();

    const fetchSolves = async() => {
        setFetching(true)
        try {
            console.log('user_id: ' + session.user.id)
            const { data, error } = await supabase.from('solve').select('scramble, solve_time').eq('user_id', session.user.id)
            console.log('data: ' + data)
            if (error) throw error
        } catch (error) {
            console.log('error: ' + error)
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
        <div></div>
    );
}