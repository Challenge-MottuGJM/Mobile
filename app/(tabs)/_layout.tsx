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
                name="integrantes"
                options={{
                    title: 'Integrantes',
                    tabBarIcon: ({ color }) => <Ionicons size={28} name="people" color={color} />,
                }}
            />
        </Tabs>
    );
}
