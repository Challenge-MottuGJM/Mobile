import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: "#ff5f96",
                tabBarInactiveTintColor: "#ffffff",
                tabBarStyle: {
                    backgroundColor: "black",
                    borderTopColor: "#ff5f96",
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Inicio',
                    tabBarIcon: ({ color }) => (
                        <Ionicons size={28} name="home" color={color} />
                    ),
                }}
            />

             <Tabs.Screen
                name="cadastro"
                options={{
                    title: 'Cadastro',
                    tabBarIcon: ({ color }) => (
                        <Ionicons size={28} name="people" color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="devs"
                options={{
                    title: 'Devs',
                    tabBarIcon: ({ color }) => (
                        <Ionicons size={28} name="people" color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
