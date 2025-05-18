import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
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
                name="lista"
                options={{
                    title: 'Lista',
                    tabBarIcon: ({ color }) => (
                        <Ionicons size={28} name="list" color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="integrantes"
                options={{
                    title: 'Devs',
                    tabBarIcon: ({ color }) => (
                        <Ionicons size={28} name="desktop" color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
