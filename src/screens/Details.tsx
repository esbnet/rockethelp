import { useEffect, useState } from 'react';
import { VStack, HStack, Text, useTheme, ScrollView, Box } from 'native-base';
import { useNavigation, useRoute } from "@react-navigation/native";

import firestore from '@react-native-firebase/firestore';

import { OrderFirestoreDTO } from '../DTO/OrderFirestoreDTO';

import { CircleWavyCheck, Hourglass, DesktopTower, ClipboardText } from 'phosphor-react-native';

import { Header } from '../components/Header';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { OrderProps } from '../components/Order';
import { Loading } from '../components/Loading';
import { Alert } from 'react-native';
import { CardDatails } from '../components/CardDatails';


import { dateFormat } from '../utils/firestoreDateFormat';
import { CustonAlert } from '../components/CustonAlert';

type RouteParams = {
    orderId: string
}

type OrderDatails = OrderProps & {
    description: string;
    solution: string;
    closed: string;
}

type AlertProps = {
    status: "success" | "info" | "error" | "warning",
    title: string
}

export function Details() {
    const [solution, setSolution] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [order, setOrder] = useState<OrderDatails>({} as OrderDatails)

    const navigarion = useNavigation()
    const { colors } = useTheme();
    const route = useRoute();

    

    const { orderId } = route.params as RouteParams;

    function handleOrderClose() {
        if (!solution) {
            return Alert.alert('Solução', 'É necessário informar a solução para encerrar. ')
        }

        firestore()
            .collection<OrderFirestoreDTO>('orders')
            .doc(orderId)
            .update({
                status: 'closed',
                solution,
                closed_at: firestore.FieldValue.serverTimestamp()
            })
            .then(() => {
                CustonAlert('Solução', 'Socilitação resolvida e encerrada.');
                // Alert.alert('Solução', 'Socilitação resolvida e encerrada.');
                navigarion.goBack();
            })
            .catch(err => {
                console.error("solução : " + err.message);
                Alert.alert('Solução', 'Não foi possível encerrar a solictação.');
            });
    }

    useEffect(() => {
        firestore()
            .collection<OrderFirestoreDTO>('orders')
            .doc(orderId)
            .get()
            .then((doc) => {
                const { patrimony, description, status, create_at, closed_at, solution } = doc.data();

                const closed = closed_at ? dateFormat(closed_at) : null;

                setOrder({
                    id: doc.id,
                    patrimony,
                    description,
                    status,
                    solution,
                    when: dateFormat(create_at),
                    closed
                });

                setIsLoading(false);
            });
    }, []);

    if (isLoading) {
        return <Loading />
    }

    return (
        <VStack flex={1} pb={2} bg="gray.700">
            <Box px={6} bg="gray.600">
                <Header title='Solicitação' />
            </Box>

            <HStack bg="gray.500" justifyContent="center" p={4}>
                {
                    order.status === "closed"
                        ? <CircleWavyCheck size={22} color={colors.green[300]} />
                        : <Hourglass size={22} color={colors.secondary[700]} />
                }
                <Text
                    fontSize="sm"
                    color={order.status === 'closed'
                        ? colors.green[300]
                        : colors.secondary[700]}
                    ml={2}
                    textTransform="uppercase"
                >
                    {order.status === "closed" ? 'finalizado' : 'em andamento'}
                </Text>
            </HStack>

            <ScrollView mx={1}>
                <CardDatails
                    title='equipamento'
                    description={`Patrimônio :  ${order.patrimony}`}
                    icon={DesktopTower}
                />

                <CardDatails
                    title='problema'
                    description={order.description}
                    icon={ClipboardText}
                    footer={`Registrado em ${order.when}`}
                />
                <CardDatails
                    title='solução'
                    icon={CircleWavyCheck}
                    footer={order.closed && `Encerrado em ${order.closed}`}
                >
                    <Input
                        placeholder='Descrição da solução'
                        onChangeText={setSolution}
                        textAlignVertical='top'
                        multiline={true}
                        h={24}
                        value={order.solution}
                        isDisabled={!!order.solution}
                    />
                </CardDatails>
            </ScrollView>
            {
                order.status === 'open' &&
                <Button
                    title='Registrar Solução'
                    mt={5}
                    onPress={handleOrderClose}
                />
            }
        </VStack>
    );
}