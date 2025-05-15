import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
    return (
        <Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Inicio',
                    tabBarIcon: ({ color }) => <Ionicons size={28} name="home" color={color} />,
                }}
            />
            <Tabs.Screen
                name="denuncia"
                options={{
                    title: 'Denuncia',
                    tabBarIcon: ({ color }) => <Ionicons size={28} name="alert-circle" color={color} />,
                }}
            />
            <Tabs.Screen
                name="apoio"
                options={{
                    title: 'Apoio',
                    tabBarIcon: ({ color }) => <Ionicons size={28} name="heart" color={color} />,
                }}
            />
            <Tabs.Screen
                name="dados"
                options={{
                    title: 'Dados',
                    tabBarIcon: ({ color }) => <Ionicons size={28} name="analytics" color={color} />,
                }}
            />

            <Tabs.Screen
                name="info"
                options={{
                    title: 'Informações',
                    tabBarIcon: ({ color }) => <Ionicons size={28} name="information-circle" color={color} />,
                }}
            />

            <Tabs.Screen
                name="integrantes"
                options={{
                    title: 'Integrantes',
                    tabBarIcon: ({ color }) => <Ionicons size={28} name="people" color={color} />,
                }}
            />
        </Tabs>
    );
}
