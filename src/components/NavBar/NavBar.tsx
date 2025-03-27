import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  HStack,
  Stack,
  Collapse,
  Icon,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
  Image,
  Badge,
  Container,
} from "@chakra-ui/react";
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import { supabase } from "src/utils/SupabaseClient";

import { NavButton } from "src/styles/common";

import { ColorModeSwitcher } from "./ColorModeSwitcher";
import { Link as RouterLink } from "react-router-dom";
import NAV_ITEMS, { NavItem } from "./navItems";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext";
import { useState, useEffect } from "react";

export default function NavBar() {
  const { isOpen, onToggle, onClose } = useDisclosure();
  const navigate = useNavigate();
  const { userName, isAuthenticated, logout, session } = useAuth();
  const linkColor = useColorModeValue("gray.600", "gray.200");
  const linkHoverColor = useColorModeValue("gray.800", "white");
  const buttonColor = useColorModeValue("#EDF2F7", "#2C313D");
  const popoverContentBgColor = useColorModeValue("white", "gray.800");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const bucketUrl = "https://mxvnbjoezxeubbcwdnqh.supabase.co/storage/v1/object/public/avatars";
  const fullAvatarUrl = avatarUrl ? `${bucketUrl}/${avatarUrl}` : undefined;

  const [isMod, setIsMod] = useState(false);

  const modCheck = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq('id', session.user.id)
        .single()

      if (error) {
        throw error
      }
      else if (data?.role === "Mod") {
        setIsMod(true)
      }
    } catch (error) {
      console.log("Error fetching users: " + error)
    }
  }

  useEffect(() => {
    if (!session?.user) return;

    const fetchAvatar = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("id", session.user.id)
        .single();

      if (!error) setAvatarUrl(data?.avatar_url || null);
    };

    fetchAvatar();
    modCheck();


  }, [session?.user?.id]);

  return (
    <Box
      position="fixed"
      w="100%"
      h={14}
      zIndex={3}
      bg={useColorModeValue("#FFFFFF99", "#1A202C99")}
      color={useColorModeValue("gray.600", "white")}
      backdropFilter="blur(5px)"
      borderBottom={1}
      borderStyle="solid"
      borderColor={useColorModeValue("gray.200", "gray.900")}
    >
      <Container maxW="container.lg" p={0}>
        <Flex py={{ base: 2 }} px={{ base: 4 }}>
          <Flex flex={{ base: 1, md: "auto" }} ml={-2} display={{ base: "flex", md: "none" }}>
            <IconButton
              onClick={onToggle}
              icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
              variant="ghost"
              aria-label="Toggle Navigation"
            />
          </Flex>
          <Flex flex={{ base: 2 }} justify={{ base: "center", md: "start" }}>
            <HStack>
              <Image
                src={useColorModeValue("/assets/Cloud_Cube_Logo_Black.svg", "/assets/Cloud_Cube_Logo_White.svg")}
                boxSize="30px"
                objectFit="contain"
                onClick={() => navigate("/")}
                cursor="pointer"
                draggable={false}
              />
              <Text
                textAlign={useBreakpointValue({ base: "center", md: "left" })}
                fontFamily="heading"
                fontSize="lg"
                color={useColorModeValue("gray.800", "white")}
                fontWeight="semibold"
                as={RouterLink}
                to="/"
              >
                Cloud Cube
              </Text>
              <Flex display={{ base: "none", sm: "flex" }}>
                <VersionBadge />
              </Flex>
            </HStack>
            <Flex display={{ base: "none", md: "flex" }} ml={10}>
              <DesktopNav isMod={isMod} />
            </Flex>
          </Flex>

          <Stack flex={{ base: 1, md: 0 }} justify="flex-end" direction="row" spacing={6} mr={-2}>
            <ColorModeSwitcher />

            {/* User Section things or Login/Sign-Up (not signed in) */}
            <Flex align="center">
              {isAuthenticated && userName ? (
                <><Popover trigger="hover" placement="bottom-start">
                  <PopoverTrigger>
                    <Button
                      fontWeight={500}
                      color={linkColor}
                      bg="none"
                      onClick={() => navigate("/profile")}
                      _hover={{
                        textDecoration: "none",
                        color: linkHoverColor,
                        bg: buttonColor,
                        boxShadow: "10px 0 0 0 " + buttonColor,
                      }}
                    >
                      {userName}
                      <Flex justify="center">
                        {fullAvatarUrl ? (
                          <Image
                            boxSize="31px" // Ensure it's a square
                            borderRadius="full" // Makes it circular
                            src={fullAvatarUrl}
                            alt="User Avatar"
                            fallbackSrc="/assets/default.png"
                            _hover={{
                              textDecoration: "none",
                            }}
                            ml={10}
                          />
                        ) : (
                          <Image
                            boxSize="32px" // Ensure it's a square
                            borderRadius="full" // Makes it circular
                            src="/assets/default.png"
                            alt="Default Avatar"
                            ml={10}
                          />
                        )}
                      </Flex>
                    </Button>

                  </PopoverTrigger>
                  <PopoverContent
                    border={0}
                    boxShadow="xl"
                    bg={popoverContentBgColor}
                    p={4}
                    rounded="xl"
                    minW="sm"
                  >
                    <Stack>
                      <DesktopSubNav
                        label="Dashboard"
                        href="/profile" />
                      <DesktopSubNav
                        label="Logout"
                        href=""
                        onClick={async () => {
                          await logout();
                          window.location.assign("/login");
                        }} />
                    </Stack>
                  </PopoverContent>
                </Popover></>
              ) : (
                <Flex>
                  <NavButton href="/login" text="Sign In" color="blue" size="sm" isMobile={false} />
                  <NavButton href="/register" text="Sign Up" color="teal" size="sm" isMobile={false}/>
                </Flex>
              )}
            </Flex>
          </Stack>
        </Flex>

        <Collapse in={isOpen} animateOpacity>
          <MobileNav
            isMod={isMod}
            avatarUrl={avatarUrl}
            userName={userName}
            isAuthenticated={isAuthenticated}
            logout={logout}
            onClose={onClose}
          />
        </Collapse>
      </Container>
    </Box>
  );
}

const DesktopNav = ({ isMod }: { isMod: boolean }) => {
  const linkColor = useColorModeValue("gray.600", "gray.200");
  const linkHoverColor = useColorModeValue("gray.800", "white");
  const popoverContentBgColor = useColorModeValue("white", "gray.800");
  const buttonColor = useColorModeValue("#EDF2F7", "#2C313D");

  return (
    <Stack direction="row" spacing={4}>
      {NAV_ITEMS.map((navItem) => (
        (navItem.label === "Mod Page" && isMod) || navItem.label != "Mod Page" ? (
          <Box key={navItem.label}>
            <Popover trigger="hover" placement="bottom-start">
              <PopoverTrigger>
                <Button
                  as={navItem.href ? RouterLink : undefined}
                  to={navItem.href ?? ""}
                  fontWeight={500}
                  color={linkColor}
                  bg="none"
                  _hover={{
                    textDecoration: "none",
                    color: linkHoverColor,
                    bg: buttonColor,
                  }}
                >
                  {navItem.label}
                </Button>
              </PopoverTrigger>

              {navItem.children && (
                <PopoverContent
                  border={0}
                  boxShadow="xl"
                  bg={popoverContentBgColor}
                  p={4}
                  rounded="xl"
                  minW="sm"
                >
                  <Stack>
                    {navItem.children.map((child) => (
                      <DesktopSubNav key={child.label} {...child} />
                    ))}
                  </Stack>
                </PopoverContent>
              )}
            </Popover>
          </Box>
        ) : null
      ))}
    </Stack>
  );
};


const DesktopSubNav = ({ label, href, subLabel, onClick }: NavItem & { onClick?: () => void }) => {
  return (
    <Link
      as={href ? RouterLink : undefined}
      to={href ?? ""}
      role="group"
      display="block"
      p={2}
      rounded="md"
      _hover={{ bg: useColorModeValue("cyan.50", "gray.900") }}
      onClick={onClick}
    >
      <Stack direction="row" align="center">
        <Box>
          <Text
            transition="all .3s ease"
            _groupHover={{ color: "cyan.500" }}
            fontWeight={500}
          >
            {label}
          </Text>
          <Text fontSize="sm">{subLabel}</Text>
        </Box>
        <Flex
          transition="all .3s ease"
          transform="translateX(-10px)"
          opacity={0}
          _groupHover={{ opacity: "100%", transform: "translateX(0)" }}
          justify="flex-end"
          align="center"
          flex={1}
        >
          <Icon color="cyan.500" w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </Link>
  );
};

interface MobileNavProps {
  onClose: () => void;
}
const MobileNav = ({
  isMod,
  avatarUrl,
  userName,
  isAuthenticated,
  logout,
  onClose,
}: {
  isMod: boolean;
  avatarUrl: string | null;
  userName: string | null;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  onClose: () => void;
  
}) => {
  const navigate = useNavigate();
  const bucketUrl = "https://mxvnbjoezxeubbcwdnqh.supabase.co/storage/v1/object/public/avatars";
  const fullAvatarUrl = avatarUrl ? `${bucketUrl}/${avatarUrl}` : "/assets/default.png";

  return (
    <Stack bg={useColorModeValue("white", "gray.800")} p={4} display={{ md: "none" }}>
      {isAuthenticated && userName ? (
        <HStack onClick={() => navigate("/profile")} cursor="pointer" mb={4}>
          <Image boxSize="40px" borderRadius="full" src={fullAvatarUrl} />
          <Text fontWeight="bold">{userName}</Text>
        </HStack>
      ) : (
        <Flex justify="center" mb={4} >
          <NavButton href="/login" text="Sign In" color="blue" size="sm" isMobile={true}  onClick={onClose}/>
          <NavButton href="/register" text="Sign Up" color="teal" size="sm" isMobile={true}  onClick={onClose}/>
        </Flex>
      )}

      {/* Navigation Items */}
      {NAV_ITEMS.map(
        (navItem) =>
          (navItem.label === "Mod Page" && isMod) || navItem.label !== "Mod Page" ? (
            <MobileNavItem key={navItem.label} {...navItem} onClose={onClose} />
          ) : null
      )}

      {isAuthenticated && (
        <Button
          w="full"
          mt={4}
          colorScheme="red"
          onClick={async () => {
            await logout();
            setTimeout(() => {
              window.location.assign("/login"); // Ensures a full page reload
            }, 100);
          }}
        >
          Logout
        </Button>
      )}
    </Stack>
  );
};

type MobileNavItemProps = NavItem & MobileNavProps;
const MobileNavItem = ({
  label,
  children,
  href,
  onClose,
}: MobileNavItemProps) => {
  const { isOpen, onToggle } = useDisclosure();
  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        as={children ? undefined : RouterLink}
        to={href ?? ""}
        onClick={children ? undefined : onClose}
        justify="space-between"
        align="center"
        cursor="pointer"
        _hover={{
          textDecoration: "none",
        }}
      >
        <Text
          fontWeight={600}
          color={useColorModeValue("gray.600", "gray.200")}
        >
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition="all .25s ease-in-out"
            transform={isOpen ? "rotate(180deg)" : ""}
            w={6}
            h={6}
          />
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: "0!important" }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle="solid"
          borderColor={useColorModeValue("gray.200", "gray.700")}
          align="start"
        >
          {children &&
            children.map((child) => (
              <Link
                as={child.href ? RouterLink : undefined}
                key={child.label}
                py={2}
                to={child.href ?? ""}
                onClick={onClose}
              >
                {child.label}
              </Link>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

const VersionBadge = () => <Badge textTransform="none">v{APP_VERSION}</Badge>;