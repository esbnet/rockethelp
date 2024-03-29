import { useState } from "react";
import auth from "@react-native-firebase/auth"

import { Heading, Icon, VStack, useTheme } from "native-base";
import { Envelope, Key } from 'phosphor-react-native'

import Logo from "../assets/logo_primary.svg"
import { Input } from '../components/Input'
import { Button } from '../components/Button'
import { Alert } from "react-native";

export function SignIn() {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { colors } = useTheme();

    function handleSignIn() {
        if (!email || !password) {
            return Alert.alert('Entrar', 'Email e senha devem ser informados.');
        }

        setIsLoading(true);

        auth()
            .signInWithEmailAndPassword(email, password)
            .catch((error) => {
                setIsLoading(false);

                // if (error.code === 'auth/invalid-email') {
                //     return Alert.alert('Entrar', 'E-mali inválido.');
                // }

                // if (error.code === 'auth/user-not-found') {
                //     return Alert.alert('Entrar', 'Usuário não cadastrado.');
                // }

                return Alert.alert('Entrar', 'E-mail ou senha inválidos.');
            })
            
    }

    return (
        <VStack flex={1} alignItems="center" bg={"gray.600"} px={8} pt={24}>
            <Logo />
            <Heading color={"gray.100"} fontSize="xl" mt={20} mb={6}>
                Acesse sua conta
            </Heading>

            <Input
                onChangeText={setEmail}
                placeholder="Email"
                mb={4}
                InputLeftElement={<Icon as={<Envelope color={colors.gray[300]} />} ml={4} />}
            />
            <Input
                onChangeText={setPassword}
                placeholder="Senha"
                InputLeftElement={<Icon as={<Key color={colors.gray[300]} />} ml={4} />}
                secureTextEntry
            />
            <Button
                title="Entrar"
                mt={8} w="full"
                onPress={handleSignIn}
                isLoading={isLoading}
            />
        </VStack>
    )
}