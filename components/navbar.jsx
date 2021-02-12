import {
  Box,
  Text,
  Flex,
  Image,
  Heading,
  IconButton,
  Link,
  useColorMode,
  Stack,
  ButtonGroup,
  HStack,
  Button,
} from "@chakra-ui/react";
import { CloseIcon, MoonIcon, SunIcon, HamburgerIcon } from "@chakra-ui/icons";
import { useState, useEffect, Suspense } from "react";

import { Link as ReachLink } from "next/link";
import { signOut, useSession } from "next-auth/client";

function Navbar(props) {
  const [isOpenMenu, setIsOpen] = useState(false);

  useEffect(() => {
    console.log("is Open status:", isOpenMenu);
  }, [isOpenMenu]);

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      w="100%"
      /* mb={8} */
      p={4}
      borderBottom="1px"
      borderColor="gray.200"
      {...props}
    >
      <NavTitle />
      <Box
        display={{ base: isOpenMenu ? "block" : "none", md: "block" }}
        flexBasis={{ base: "100%", md: "auto" }}
      >
        <Stack
          spacing={8}
          align="center"
          justify={["center", "space-between", "flex-end"]}
          direction={["column", "row", "row", "row"]}
          pt={[4, 4, 0, 0]}
        >
          <NavItem to="/">Home</NavItem>
          <NavItem to="/about">About</NavItem>
          <NavItem to="/login">LogIn</NavItem>
          <NavItem to="/signup">SignUp</NavItem>
        </Stack>
      </Box>
      <ButtonGroup>
        <SignOutButton />
        <MenuToggle toggle={setIsOpen} isOpen={isOpenMenu} />
        <ThemeToggleButton />
      </ButtonGroup>
    </Flex>
  );
}

const SignOutButton = () => {
  const [session] = useSession();
  if (!session) return <Box/>;

  return (
    <Button onClick={signOut}>
      <Text fontWeight="bold">Sign Out</Text>
    </Button>
  );
};

function NavItem({ children, isLast, to = "/", ...rest }) {
  return (
    <Link as={ReachLink} href={to}>
      <Text display="block" {...rest}>
        {children}
      </Text>
    </Link>
  );
}

const NavTitle = (props) => {
  return (
    <Box boxSize="40px" {...props}>
      <Image boxSize="40px" src="/images/FoxInTheBox40p.png" />
    </Box>
  );
};

const MenuToggle = ({ toggle, isOpen }) => {
  return (
    <Box display={{ base: "block", md: "none" }}>
      <IconButton
        icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
        onClick={() => toggle(!isOpen)}
      />
    </Box>
  );
};

function ThemeToggleButton() {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box>
      <IconButton
        icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
        onClick={toggleColorMode}
      />
    </Box>
  );
}

export default Navbar;
