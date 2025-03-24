import { useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { supabase } from "src/utils/SupabaseClient";
import { useAuth } from "src/utils/AuthContext";
import { TwistyTimer } from "src/components/TwistyTimer";
import {
    useColorModeValue,
    Card,
    Stack,
    HStack,
    Heading,
    useToast,
    Button,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    FormControl,
    FormLabel,
    Switch,
    VStack,
} from "@chakra-ui/react";
import { Stackmat, Packet } from 'stackmat';
import DropDown from "../DropDown";
import styled from "styled-components";

const ScrambleWrapper = styled.div`
        display:grid;
        place-items:center;
        gap:1rem;
        grid-template-columns:1fr auto 1fr;
        & > :first-child {
        margin-right: auto;
        }

    `

    const Scramble = styled.h1`
        grid-column-start: 2;
    `

type TimerProps = {
    scramble: string;
    showDropDown?: boolean;
    onValueChange: (value: string) => void;
    onTimerStop?: () => void;
}

export default function Timer({ scramble, showDropDown=false, onValueChange, onTimerStop = () => {}}: TimerProps) {
    const [isRunning, setIsRunning] = useState(false);
    const [time, setTime] = useState(0);
    const [isHolding, setIsHolding] = useState(false);
    const [spaceDownTime, setSpaceDownTime] = useState(0);
    const [colorDelay, setColorDelay] = useState(false);
    const [selectedValue, setSelectedValue] = useState("333");
    const [pushedTime, setPushedTime] = useState(0);
    const [isConnected, setIsConnected] = useState(false);
    const [stackMatUsed, setStackMatUsed] = useState(false);
    const { session } = useAuth();
    const toast = useToast();

    useEffect(() => {
        const stackMat = new Stackmat();

        const handleTimerConnected = () => {
            setIsConnected(true);
        };

        const handleTimerDisconnected = () => {
            setIsConnected(false);
        };

        const handleStarted = () => {
            setIsRunning(true);
            setIsHolding(false);
        };

        const handleStopped = (packet: Packet) => {
            const newTime = packet.timeInMilliseconds / 1000;
            setTime(newTime);

            if (scramble && newTime > 0 && session !== null) {
                updateSolves(newTime);
            }
            onTimerStop();
            setIsRunning(false);
            setStackMatUsed(false);
        };

        const handleReady = () => {
            setColorDelay(false);
            setIsHolding(true);
        };

        const handleReset = () => {
            setTime(0);
        };

        const handleUnready = () => {
            setIsHolding(false);
        };

        const handleStarting = () => {
            setColorDelay(true);
            setStackMatUsed(true);
        };

        const handlePacketReceived = (packet: Packet) => {
            if (packet.status === ' ') {
                const newTime = packet.timeInMilliseconds / 1000;
                setTime(newTime);
            }
        };

        stackMat.on('timerConnected', handleTimerConnected);
        stackMat.on('timerDisconnected', handleTimerDisconnected);
        stackMat.on('started', handleStarted);
        stackMat.on('stopped', handleStopped);
        stackMat.on('ready', handleReady);
        stackMat.on('reset', handleReset);
        stackMat.on('unready', handleUnready);
        stackMat.on('starting', handleStarting);
        stackMat.on('packetReceived', handlePacketReceived);

        stackMat.start();

        return () => {
            stackMat.off('timerConnected');
            stackMat.off('timerDisconnected');
            stackMat.off('started');
            stackMat.off('stopped');
            stackMat.off('ready');
            stackMat.off('reset');
            stackMat.off('unready');
            stackMat.off('starting');
            stackMat.off('packetReceived');
        };
    }, [session, scramble, onTimerStop]);

    const showSuccess = () => {
        toast({
            title: 'Success!',
            description: 'Added solve time successfully.',
            duration: 5000,
            isClosable: true,
            status: "success",
            position: "bottom"
        });
    };

    const showFailure = () => {
        toast({
            title: 'Error',
            description: 'Failed to add solve time',
            duration: 5000,
            isClosable: true,
            status: "error",
            position: "bottom"
        });
    };

    async function updateSolves(newTime: number|null = null) {
        if (newTime === null) {
            newTime = time;
        }

        try {
            if (scramble && newTime > 0) {
                const { error } = await supabase.from('solve').insert({
                    user_id: session?.user?.id as string,
                    scramble: scramble,
                    solve_time: newTime,
                    event: selectedValue
                });
                if (error) {
                    throw error;
                }
                showSuccess();
                setPushedTime(newTime);

                
            } else {
                showFailure();
            }
        } catch (error) {
            showFailure();
        }
    }

    useHotkeys('space', (event) => { // KEYDOWN
        event.preventDefault();

        if (event.repeat) return;

        if (!isRunning) {
            // Only start if the timer is not already running
            setSpaceDownTime(Date.now());
            setIsHolding(true);
        } else {
            // If it's running, stop and update solves
            if (scramble && time > 0 && session != null) {
                updateSolves(); // Insert new solve after stopping timer
            }
            setIsRunning(false);
            onTimerStop();
        }
    });

    useHotkeys('space', (event) => { // KEYUP
        event.preventDefault();

        if (event.repeat) return;

        if (isHolding) {
            setIsHolding(false);
            const holdDuration = Date.now() - spaceDownTime;
            if (holdDuration > 300) {
                setIsRunning(true);
            }
        }
    }, { keyup: true });

    // Timer logic
    useEffect(() => {
        if (isRunning && !stackMatUsed) {
            const startTime = Date.now();
            const interval = setInterval(() => {
                setTime((Date.now() - startTime) / 1000);
            }, 10);

            return () => {
                clearInterval(interval);
            };
        }
    }, [isRunning]);

    // Update delay and color on hold
    useEffect(() => {
        if (isHolding) {
            const delayInterval = setInterval(() => {
                if (Date.now() - spaceDownTime > 300) {
                    setColorDelay(true);
                }
            }, 10);

            return () => {
                clearInterval(delayInterval);
            };
        } else {
            setColorDelay(false);
        }
    }, [isHolding]);

    const color = useColorModeValue("black", "white");
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [isChecked, setChecked] = useState(false);



    return (
        <Stack align="center" >
            <HStack spacing={4}>
                <Heading size="md">Timer</Heading>
            </HStack>
            <Card p="1.5rem" w="75%">
                <ScrambleWrapper>
                    {showDropDown && <DropDown onValueChange={(value) => {
                        setSelectedValue(value);
                        onValueChange(value);
                    }} />}
                    <Scramble>Scramble: {scramble}</Scramble>
                    <Button
                    height={"38px"}
                    width={"157px"}
                    variant={"outline"}
                    colorScheme={"green"} 
                    onClick={onOpen}
                    ml={10}
                    >
                    Show    
                    </Button>
                </ScrambleWrapper>
            </Card>

            <Card id="timer" p="6.5rem" w="40%" textAlign="center" data-time={pushedTime}>
                <Heading style={{ fontVariantNumeric: "tabular-nums", color: isHolding ? (colorDelay ? 'green' : 'yellow') : color }} size="4xl">{time.toFixed(2)}s</Heading>
            </Card>
            <p>Press spacebar {isConnected? "or Stackmat": ""} to start/stop the timer</p>
            <br />
            <Modal isOpen={isOpen} onClose={onClose} >
            <ModalOverlay />
            <ModalContent 
            maxW={"50rem"} 
            maxH={"50rem"} 
            //textAlign={"center"} 
            // justifyContent={"center"} 
            alignItems={"center"} 
            p={4}
            >
                Scramble: {scramble}
                <Card p="1.5rem" w="75%">
                    <TwistyTimer
                        puzzle={selectedValue === "333" ? "3x3x3" : "2x2x2"}
                        key={isChecked ? "PG3D" : "2D"}
                        alg={scramble}
                        visualization={isChecked ? "PG3D" : "2D"}
                        background="none"
                        controlPanel="none"
                        viewerLink="twizzle"
                        cameraDistance={6}
                        />
                </Card>
                <FormControl p={"0.5rem"} as={VStack}>
                <FormLabel mb={0}>2D/3D</FormLabel>
                <Switch 
                id="is3D"
                size={"md"}
                ml={"-2.5"}
                onChange={(e) => { 
                    const checked = e.target.checked;
                    setChecked(checked); 
                    console.log(checked); 
                }}/>
                </FormControl>
            </ModalContent>
        </Modal>
        </Stack>
        

    );
}