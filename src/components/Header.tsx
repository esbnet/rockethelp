import { useNavigation } from '@react-navigation/native';
import { Heading, HStack, IconButton, StyledProps, useTheme } from 'native-base';
import { CaretLeft } from 'phosphor-react-native';

type Props = StyledProps & {
    title: string
}

export function Header({ title, ...rest }: Props) {
    const { colors } = useTheme();

    const navigarion = useNavigation();

    function handleGoBack() {
        navigarion.goBack();
    }

    return (
        <HStack
            w={"full"}
            justifyContent="space-between"
            alignItems="center"
            bg="gray.600"
            pb={6}
            pt={6}
            mt={4}
            {...rest}
        >
            <IconButton
                icon={<CaretLeft color={colors.gray[200]} size={24} />}
                onPress={handleGoBack}

            />

            <Heading
                color={"gray.100"}
                textAlign="center"
                fontSize={24}
                flex={1}
                pl={-6}
                mr={10} 
            >
                {title}
            </Heading>
        </HStack>
    );
}