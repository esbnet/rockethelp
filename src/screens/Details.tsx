import { VStack, Text } from 'native-base';
import { useRoute } from "@react-navigation/native"

import { Header } from '../components/Header';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

type RouteParams = {
    orderId: string
}

export function Details() {
    const route = useRoute();

    const { orderId } = route.params as RouteParams;

    return (
        <VStack flex={1} p={6} bg="gray.700">
            <Header title='Solicitação' />
            <Text color="white">{orderId}</Text>

            <Button title='Gravar' mt={5} />

        </VStack>
    );
}