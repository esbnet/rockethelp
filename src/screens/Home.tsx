import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import {
    VStack, HStack, IconButton, useTheme, Text,
    Heading, FlatList, Center
} from 'native-base'
import { useNavigation } from '@react-navigation/native';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import { SignOut, ChatTeardropText } from 'phosphor-react-native'
import Logo from '../assets/logo_secondary.svg'

import { Filter } from '../components/Filter';
import { Button } from '../components/Button';
import { Order, OrderProps } from '../components/Order';

import { dateFormat } from '../utils/firestoreDateFormat'
import { Loading } from '../components/Loading';


export function Home() {
    const [isLoading, setIsLoading] = useState(true);
    const [statusSelected, setStatusSelected] = useState<'open' | 'closed'>('closed');
    const [orders, setOrders] = useState<OrderProps[]>([])


    const { colors } = useTheme();
    const navigarion = useNavigation();

    function handleNewOrder() {
        navigarion.navigate('new');
    }

    function handleEditOrder(orderId: string) {
        navigarion.navigate('details', { orderId });
    }

    function handleLogout() {
        auth()
            .signOut()
            .catch(((error) => {
                console.log(error)
                return Alert.alert('Sair', 'Não foi possível sair')
            }));
    }

    useEffect(() => {
        setIsLoading(true);

        const subscriber = firestore()
            .collection('orders')
            .where('status', '==', statusSelected)
            .onSnapshot(snapshot => {
                const data = snapshot.docs.map(doc => {
                    const { patrimony, description, status, create_at } = doc.data();
                    return {
                        id: doc.id,
                        patrimony,
                        description,
                        status,
                        when: dateFormat(create_at)
                    }
                });
                setOrders(data);
                setIsLoading(false);
            });

        return subscriber;

    }, [statusSelected]);

    return (
        <VStack flex={1} pb={6} bg="gray.700" alignItems={"center"}>
            <HStack
                w="full"
                justifyContent={"space-between"}
                alignItems={"center"}
                bg="gray.600"
                pt={12}
                pb={5}
                px={8}
            >
                <Logo />
                <IconButton
                    icon={<SignOut size={26} color={colors.gray[300]} />}
                    onPress={() => { handleLogout() }}
                />
            </HStack>

            <VStack flex={1} px={8}>
                <HStack w="full" mt={6} mb={4} justifyContent={"space-between"} alignItems="center">
                    <Heading color="gray.100">
                        Solicitações
                    </Heading>
                    <Text color="gray.200" textAlign="right">
                        {orders.length}
                    </Text>
                </HStack>
                <HStack space={3} mb={8}>
                    <Filter
                        type='open'
                        title='em andamento'
                        onPress={() => setStatusSelected('open')}
                        isActive={statusSelected === 'open'}
                    />
                    <Filter
                        type='closed'
                        title='finalizado'
                        onPress={() => setStatusSelected('closed')}
                        isActive={statusSelected === 'closed'}
                    />
                </HStack>

                {isLoading
                    ? <Loading />
                    : (<FlatList
                        data={orders}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => <Order data={item} onPress={() => handleEditOrder(item.id)} />}
                        contentContainerStyle={{ paddingBottom: 100 }}
                        ListEmptyComponent={() => (
                            <Center>
                                <ChatTeardropText color={colors.gray[300]} size={40} />
                                <Text color={"gray.300"} fontSize="xl" mt={6} textAlign="center">
                                    Você não possui {'\n'}
                                    solicitação {statusSelected === 'open' ? 'em aberto.' : 'finaliza.'}
                                </Text>
                            </Center>
                        )}
                    />)
                }

                <Button title='Nova solicitação' onPress={handleNewOrder} />
            </VStack>
        </VStack>
    )
}
