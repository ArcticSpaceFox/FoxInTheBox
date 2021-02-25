import {
  Box,
  Text,
  Flex,
  Image,
  IconButton,
  Link,
  useColorMode,
  Stack,
  ButtonGroup,
  Button,
} from "@chakra-ui/react";
import { CloseIcon, MoonIcon, SunIcon, HamburgerIcon } from "@chakra-ui/icons";
import { useState } from "react";

import { Link as ReachLink } from "next/link";
import { signOut, signIn, useSession } from "next-auth/client";

function Navbar(props) {
  const [isOpenMenu, setIsOpen] = useState(false);

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
          <NavItem to="/home">Home</NavItem>
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

  return (
    <Button onClick={session ? signOut : signIn}>
      <Text fontWeight="bold">Sign {session ? "Out" : "In"}</Text>
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
